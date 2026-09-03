/**
 * Drag & Drop Manager for RhyRhy English
 * Supports both Desktop HTML5 Drag & Drop and Mobile Touch drag gestures.
 * Dragging any sentence reveals the bottom storage dock where it can be dropped.
 */
class DragDropManager {
  constructor(options = {}) {
    this.lessonId = options.lessonId;
    this.storageDock = typeof options.storageDock === 'string'
      ? document.querySelector(options.storageDock)
      : options.storageDock;
    this.dropZone = typeof options.dropZone === 'string'
      ? document.querySelector(options.dropZone)
      : options.dropZone;
    this.onSave = options.onSave || (() => { });

    this.activeDragData = null;
    this.touchGhost = null;
    this.touchStartTimer = null;
    this.isDraggingTouch = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  init() {
    if (!this.storageDock) {
      console.warn('DragDropManager: storageDock element not found');
      return;
    }

    this._bindDockEvents();
  }

  /**
   * Bind drag and touch listeners to a sentence card element
   * @param {HTMLElement} element
   * @param {object} sentenceData { id, en, kr, timestamp }
   */
  makeDraggable(element, sentenceData) {
    if (!element) return;

    // Desktop HTML5 drag attributes
    element.setAttribute('draggable', 'true');

    // Desktop drag events
    element.addEventListener('dragstart', (e) => {
      this.activeDragData = sentenceData;
      element.classList.add('is-dragging');

      // Transfer json payload
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', sentenceData.en);
        e.dataTransfer.setData('application/json', JSON.stringify(sentenceData));
      }

      this.showStorageDock();
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('is-dragging');
      this.hideStorageDock();
      this.activeDragData = null;
    });

    // Mobile touch drag events
    element.addEventListener('touchstart', (e) => {
      // Don't drag if tapping interactive buttons inside
      if (e.target.closest('button') || e.target.closest('a')) return;

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.activeDragData = sentenceData;

      // Small threshold timer to distinguish scroll from drag
      this.touchStartTimer = setTimeout(() => {
        this._startTouchDrag(element, touch, sentenceData);
      }, 200);
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);

      // If user moved significantly before timer fired, they are scrolling
      if (!this.isDraggingTouch && (deltaX > 10 || deltaY > 10)) {
        clearTimeout(this.touchStartTimer);
      }

      if (this.isDraggingTouch) {
        e.preventDefault(); // Prevent page scroll during active sentence drag
        this._updateTouchGhost(touch.clientX, touch.clientY);
        this._checkTouchHover(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
      clearTimeout(this.touchStartTimer);
      if (this.isDraggingTouch) {
        const touch = e.changedTouches[0];
        this._endTouchDrag(touch.clientX, touch.clientY, sentenceData);
      }
    });

    element.addEventListener('touchcancel', () => {
      clearTimeout(this.touchStartTimer);
      this._cancelTouchDrag();
    });
  }

  showStorageDock() {
    if (this.storageDock) {
      this.storageDock.classList.add('visible');
      this.storageDock.setAttribute('aria-hidden', 'false');
    }
  }

  hideStorageDock() {
    if (this.storageDock) {
      this.storageDock.classList.remove('visible', 'hover-active');
      this.storageDock.setAttribute('aria-hidden', 'true');
    }
  }

  _bindDockEvents() {
    const target = this.dropZone || this.storageDock;
    if (!target) return;

    // Desktop Drag & Drop events
    target.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      this.storageDock.classList.add('hover-active');
    });

    target.addEventListener('dragleave', (e) => {
      // Check if genuinely leaving the dock bounds
      const rect = target.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX >= rect.right ||
        e.clientY < rect.top ||
        e.clientY >= rect.bottom
      ) {
        this.storageDock.classList.remove('hover-active');
      }
    });

    target.addEventListener('drop', (e) => {
      e.preventDefault();
      this.storageDock.classList.remove('hover-active');

      let data = this.activeDragData;
      if (!data && e.dataTransfer) {
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (raw) data = JSON.parse(raw);
        } catch (_) { }
      }

      if (data) {
        this.saveSentenceData(data);
      }
      this.hideStorageDock();
    });
  }

  _startTouchDrag(sourceEl, touch, data) {
    this.isDraggingTouch = true;
    sourceEl.classList.add('is-touch-dragging');

    // Create a smooth floating ghost element
    this.touchGhost = document.createElement('div');
    this.touchGhost.className = 'touch-drag-ghost';
    this.touchGhost.innerHTML = `
      <div class="ghost-badge">Saving...</div>
      <div class="ghost-en">${data.en}</div>
    `;
    document.body.appendChild(this.touchGhost);
    this._updateTouchGhost(touch.clientX, touch.clientY);

    // Provide haptic feedback if supported
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (_) { }
    }

    this.showStorageDock();
  }

  _updateTouchGhost(x, y) {
    if (!this.touchGhost) return;
    this.touchGhost.style.left = `${x}px`;
    this.touchGhost.style.top = `${y - 40}px`;
  }

  _checkTouchHover(x, y) {
    if (!this.storageDock) return;
    const rect = this.storageDock.getBoundingClientRect();
    const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isOver) {
      this.storageDock.classList.add('hover-active');
    } else {
      this.storageDock.classList.remove('hover-active');
    }
  }

  _endTouchDrag(x, y, data) {
    if (this.touchGhost) {
      this.touchGhost.remove();
      this.touchGhost = null;
    }
    this.isDraggingTouch = false;

    // Remove touching styles
    document.querySelectorAll('.is-touch-dragging').forEach(el => el.classList.remove('is-touch-dragging'));

    if (this.storageDock) {
      const rect = this.storageDock.getBoundingClientRect();
      const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (isOver && data) {
        this.saveSentenceData(data);
      }
    }

    this.hideStorageDock();
  }

  _cancelTouchDrag() {
    if (this.touchGhost) {
      this.touchGhost.remove();
      this.touchGhost = null;
    }
    this.isDraggingTouch = false;
    document.querySelectorAll('.is-touch-dragging').forEach(el => el.classList.remove('is-touch-dragging'));
    this.hideStorageDock();
  }

  /**
   * Saves sentence to localStorage and shows feedback
   * @param {object} sentenceData
   */
  saveSentenceData(sentenceData) {
    if (!sentenceData || !this.lessonId) return;

    const isNew = Storage.saveSentence(this.lessonId, sentenceData);
    this.showSaveFeedback(sentenceData, isNew);
    this.onSave(sentenceData, isNew);
  }

  showSaveFeedback(sentenceData, isNew) {
    // Pulse animation on the dock icon
    const dockIcon = this.storageDock.querySelector('.storage-dock-icon');
    if (dockIcon) {
      dockIcon.classList.add('pulse-pop');
      setTimeout(() => dockIcon.classList.remove('pulse-pop'), 600);
    }

    // Floating toast feedback
    const toast = document.createElement('div');
    toast.className = 'save-toast-notification animate-slide-up';
    toast.innerHTML = isNew
      ? `
        <div class="toast-icon success">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="toast-content">
          <div class="toast-title">Saved to Sentence Bank!</div>
          <div class="toast-sentence">"${sentenceData.en}"</div>
        </div>
      `
      : `
        <div class="toast-icon info">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="toast-content">
          <div class="toast-title">Already Saved</div>
          <div class="toast-sentence">This sentence is already in your bank.</div>
        </div>
      `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DragDropManager;
}

