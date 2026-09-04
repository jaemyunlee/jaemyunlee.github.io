/**
 * Celebration & Lottie Manager for RhyRhy English
 * Displays celebratory animations using lottie-web with high-performance Canvas fallback.
 */
class CelebrationManager {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('celebration-overlay');
    this.lottiePath = options.lottiePath || '../../assets/lottie/celebration.json';
    this.animInstance = null;
  }

  init() {
    if (!this.container) {
      this.container = document.getElementById('celebration-overlay');
    }
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'celebration-overlay';
      this.container.className = 'celebration-overlay';
      document.body.appendChild(this.container);
    }

    // Always ensure modal markup and event handlers exist inside the container
    if (!this.container.querySelector('.celebration-modal')) {
      this.container.setAttribute('aria-hidden', 'true');
      this.container.innerHTML = `
        <div class="celebration-backdrop"></div>
        <div class="celebration-modal animate-pop-in">
          <div class="lottie-animation-box" id="lottie-animation-box"></div>
          <h2 class="celebration-title" id="celebration-title">Lesson Completed! 🎉</h2>
          <p class="celebration-message" id="celebration-message">
            Amazing job studying today! Your sentence has been shared, and this lesson is now officially recorded in your Learning History.
          </p>
          <div class="celebration-actions">
            <button type="button" class="btn btn-primary" id="btn-close-celebration">
              계속 학습하기
            </button>
          </div>
        </div>
      `;

      const closeBtn = this.container.querySelector('#btn-close-celebration');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const cb = this.currentOnAction;
          this.hide();
          if (typeof cb === 'function') {
            cb();
          }
        });
      }

      const backdrop = this.container.querySelector('.celebration-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => this.hide());
      }
    }
  }

  /**
   * Trigger celebration with custom title and message
   * @param {object} opts
   */
  celebrate(opts = {}) {
    this.init();

    this.currentOnAction = opts.onAction || null;

    const titleEl = this.container.querySelector('#celebration-title');
    const msgEl = this.container.querySelector('#celebration-message');
    const actionBtn = this.container.querySelector('#btn-close-celebration');
    const lottieBox = this.container.querySelector('#lottie-animation-box');

    if (titleEl && opts.title) titleEl.textContent = opts.title;
    if (msgEl && opts.message) msgEl.textContent = opts.message;
    if (actionBtn && opts.actionLabel) actionBtn.textContent = opts.actionLabel;

    this.container.classList.add('active');
    this.container.setAttribute('aria-hidden', 'false');

    // Haptic feedback
    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 150]); } catch (_) { }
    }

    // Try loading with lottie-web
    let lottieLoaded = false;
    if (window.lottie && lottieBox) {
      try {
        if (this.animInstance) {
          this.animInstance.destroy();
        }
        lottieBox.innerHTML = '';
        this.animInstance = window.lottie.loadAnimation({
          container: lottieBox,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: this.lottiePath
        });
        lottieLoaded = true;
      } catch (e) {
        console.warn('Lottie load failed, using canvas fallback', e);
      }
    }

    // Also trigger vibrant canvas confetti burst
    this._launchConfettiParticles();

    // Escape key dismissal
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.hide();
    };
    document.addEventListener('keydown', this._escHandler);
  }

  hide() {
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
    if (this.container) {
      this.container.classList.remove('active');
      this.container.setAttribute('aria-hidden', 'true');
      if (this.animInstance) {
        this.animInstance.destroy();
        this.animInstance = null;
      }
    }
  }

  _launchConfettiParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#38BDF8', '#8B5CF6'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        if (frame > 40) p.opacity -= 0.015;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 160) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animate);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CelebrationManager;
}

