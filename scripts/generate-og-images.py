#!/usr/bin/env python3

"""
RhyRhy English - High-Resolution Open Graph (OG) Image Generator (Issue #6)

Generates 1200x630 viral curiosity preview cards for each individual quiz question.
Saved to: assets/img/og/lesson-XX-qYY.png
"""

import os
import re
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OG_DIR = os.path.join(ROOT_DIR, 'assets', 'img', 'og')
os.makedirs(OG_DIR, exist_ok=True)

# Curated curiosity headline mapping for each quiz question
CURATED_HEADLINES = {
    ('lesson-01', 1): ('"우연히 ~하다"', '원어민은 일상에서 어떻게 말할까요?'),
    ('lesson-01', 2): ('"당연히, 명백하게"', '영어 대화에서 자연스럽게 쓰는 표현은?'),
    ('lesson-01', 3): ('"하늘석(맨 꼭대기 좌석)"을', '영어로 뭐라고 할까요?'),
    ('lesson-01', 4): ('"시야(뷰)가 꽤 괜찮아요"', '원어민 실생활 표현은?'),
    ('lesson-01', 5): ('"시야 방해석(제한석)"을', '공연장 예매할 때 뭐라고 부를까요?'),
    ('lesson-01', 6): ('"가격이 꽤 괜찮네!"', '원어민이 가장 즐겨쓰는 단어는?'),
    ('lesson-01', 7): ('"적어도 내가 알기로는"', '영어로 자연스럽게 말하면?'),
    ('lesson-01', 8): ('"그 노래를 좋아하기 시작했어"', '영어로 뭐라고 할까요?'),
    ('lesson-01', 9): ('"다리에 깁스를 하고 있어"', '영어로 뭐라고 할까요?'),
    ('lesson-01', 10): ('"절대 갈 수 있는 방법이 없었죠"', '원어민 빈출 강조 표현은?'),
    ('lesson-01', 11): ('"알고 보니 ~였어요"', '일상에서 가장 많이 쓰는 구동사는?'),
    ('lesson-01', 12): ('"콘서트 끝나고 하룻밤 자고 오다"', '영어로 뭐라고 할까요?'),
    ('lesson-01', 13): ('"신경 쓰지 않았으면 좋겠어요"', '영어로 어떻게 말할까요?'),
    ('lesson-01', 14): ('"언제 공식 판매가 시작되었나요?"', '원어민 판매 시작 표현은?'),
    ('lesson-01', 15): ('"그 노래가 몇 년도에 나왔지?"', '출시/발매되다는 영어로?'),
    ('lesson-01', 16): ('"대략 그 가격대쯤이었어"', '대략을 나타내는 자연스러운 표현은?'),
    ('lesson-01', 17): ('"들을수록 점점 마음에 들어요"', '시간이 갈수록 좋아진다는 영어로?'),
    ('lesson-01', 18): ('"일요일까지 제출해야 해"', '마감/기한을 뜻하는 단어는?'),
    ('lesson-01', 19): ('"신곡이 발매되었을 때였어요"', '원어민 발음 퀴즈! 영어로?'),
    ('lesson-01', 20): ('"가능성이 매우 희박해요"', '희박하다는 영어로 뭐라고 할까요?'),
    ('lesson-01', 21): ('"결국 최고의 자리를 얻게 되었어요"', '결국 ~한 결과가 되다는?'),
    ('lesson-02', 1): ('"여기 땅(부지)에는 아무것도 없었죠"', '땅/부지는 영어로?'),
    ('lesson-02', 2): ('"어떻게든/간신히 ~해내다"', '원어민 실생활 핵심 표현은?'),
    ('lesson-02', 3): ('"산골 언덕 위의 샘(샘물)"', '영어로 뭐라고 부를까요?'),
    ('lesson-02', 4): ('"여름 한중간쯤에"', '한창 진행 중일 때를 뜻하는 표현은?'),
    ('lesson-02', 5): ('"두 분이 돌아가신 뒤에"', '돌아가시다는 완곡하게 영어로?'),
    ('lesson-02', 6): ('"물놀이용 타이어 튜브"', '영어로 정확한 명칭은?'),
    ('lesson-02', 7): ('"오후 내내 물놀이했어요"', '오후 내내는 영어로?'),
    ('lesson-02', 8): ('"아침 집안일/허드렛일을 끝내다"', '집안일은 영어로?'),
    ('lesson-02', 9): ('"정말 큰 기쁨이자 특별한 즐거움이에요"', '영어로 뭐라고 할까요?'),
    ('lesson-02', 10): ('"그 개울 그 자체"를', '강조할 때 쓰는 표현은?'),
    ('lesson-02', 11): ('"호수로 물이 흘러 들어가다"', '원어민이 쓰는 동사는?'),
    ('lesson-02', 12): ('"호수에 물고기를 방류하다"', '영어로 뭐라고 할까요?'),
    ('lesson-02', 13): ('"세월이 흐르면서, 수년에 걸쳐"', '영어 표현은?'),
    ('lesson-02', 14): ('"내장재를 모조리 다 뜯어내다"', '영어로 뭐라고 할까요?'),
    ('lesson-02', 15): ('"곰팡이가 피지 않도록"', '곰팡이 핀 상태는 영어로?'),
    ('lesson-02', 16): ('"경사 없이 평평하게 집을 짓다"', '수평인/평평한은 영어로?'),
    ('lesson-02', 17): ('"나이가 들어감에 따라"', '점진적 변화를 나타내는 접속사는?'),
    ('lesson-02', 18): ('"산 위의 광산(채굴) 장비"', '광업/채굴은 영어로?'),
    ('lesson-02', 19): ('"마음껏 누리고 즐길 수 있게 되었어요"', '~할 수 있게 되다는?'),
}

def get_fonts():
    font_paths = [
        '/System/Library/Fonts/AppleSDGothicNeo.ttc',
        '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',
        '/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf',
        '/Library/Fonts/Arial Unicode.ttf'
    ]
    korean_font_path = None
    for p in font_paths:
        if os.path.exists(p):
            korean_font_path = p
            break

    en_paths = [
        '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf',
        '/System/Library/Fonts/SFCompactRounded.ttf',
        '/Library/Fonts/Arial.ttf'
    ]
    en_font_path = None
    for p in en_paths:
        if os.path.exists(p):
            en_font_path = p
            break

    try:
        if korean_font_path and korean_font_path.endswith('.ttc'):
            font_title = ImageFont.truetype(korean_font_path, 46, index=6)
            font_sub = ImageFont.truetype(korean_font_path, 22, index=5)
            font_btn = ImageFont.truetype(korean_font_path, 22, index=6)
        elif korean_font_path:
            font_title = ImageFont.truetype(korean_font_path, 46)
            font_sub = ImageFont.truetype(korean_font_path, 22)
            font_btn = ImageFont.truetype(korean_font_path, 22)
        else:
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            font_btn = ImageFont.load_default()
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_btn = ImageFont.load_default()

    try:
        if en_font_path:
            font_en = ImageFont.truetype(en_font_path, 30)
            font_en_blank = ImageFont.truetype(en_font_path, 28)
        else:
            font_en = font_sub
            font_en_blank = font_sub
    except Exception:
        font_en = font_sub
        font_en_blank = font_sub

    return {
        'title': font_title,
        'sub': font_sub,
        'btn': font_btn,
        'en': font_en,
        'en_blank': font_en_blank
    }

def parse_quiz_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.split(r'##\s*Quiz\s*\d+', content)[1:]
    quizzes = []

    for i, block in enumerate(blocks):
        q_num = i + 1
        q_type_m = re.search(r'-\s*\*\*Type\*\*:\s*([^\n]+)', block)
        q_en_m = re.search(r'-\s*\*\*English\*\*:\s*([^\n]+)', block)
        q_ko_m = re.search(r'-\s*\*\*Korean\*\*:\s*([^\n]+)', block)
        q_ans_m = re.search(r'-\s*\*\*Answer\*\*:\s*([^\n]+)', block)
        q_exp_m = re.search(r'-\s*\*\*Explanation\*\*:\s*([^\n]+)', block)

        q_type = q_type_m.group(1).strip() if q_type_m else 'multiple-choice'
        q_en = q_en_m.group(1).strip() if q_en_m else ''
        q_ko = q_ko_m.group(1).strip() if q_ko_m else ''
        q_ans = q_ans_m.group(1).strip() if q_ans_m else ''
        q_exp = q_exp_m.group(1).strip() if q_exp_m else ''

        quizzes.append({
            'num': q_num,
            'type': q_type,
            'en': q_en,
            'ko': q_ko,
            'ans': q_ans,
            'exp': q_exp
        })
    return quizzes

def format_cloze_sentence(en_sentence):
    # Replaces [options, or, word] with [ ? ]
    cloze = re.sub(r'\[[^\]]+\]', '[ ? ]', en_sentence)
    # Truncate if too long
    if len(cloze) > 72:
        parts = cloze.split('[ ? ]')
        before = parts[0]
        after = parts[1] if len(parts) > 1 else ''
        if len(before) > 34:
            before = '...' + before[-30:]
        if len(after) > 34:
            after = after[:30] + '...'
        cloze = before + '[ ? ]' + after
    return cloze

def generate_og_image(lesson_id, quiz, fonts):
    w, h = 1200, 630
    img = Image.new('RGB', (w, h), color='#0F172A')
    draw = ImageDraw.Draw(img)

    # 1. Subtle Gradient Background
    for y in range(h):
        r = int(15 + (y / h) * 12)
        g = int(23 + (y / h) * 14)
        b = int(42 + (y / h) * 48)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # 2. Ambient Colorful Glow Spheres
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([820, -80, 1260, 360], fill=(99, 102, 241, 55))
    gdraw.ellipse([-80, 320, 360, 760], fill=(16, 185, 129, 45))
    gdraw.ellipse([450, 480, 850, 880], fill=(245, 158, 11, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(50))
    img.paste(Image.composite(glow, Image.new('RGBA', (w, h), (0, 0, 0, 0)), glow), (0, 0), glow)

    # 3. Main Glassmorphic Card Frame
    draw.rounded_rectangle([50, 40, 1150, 590], radius=28, fill=(30, 41, 59, 230), outline=(99, 102, 241, 90), width=2)

    # 4. Top Badges
    # Brand Pill
    draw.rounded_rectangle([90, 75, 310, 118], radius=21, fill=(79, 70, 229, 70), outline=(99, 102, 241, 160), width=1)
    draw.text((115, 84), '★ 현서네 리얼 영어', font=fonts['sub'], fill=(224, 231, 255))

    # Lesson / Quiz Badge
    lesson_num_str = lesson_id.replace('lesson-', '').lstrip('0')
    badge_text = f'LESSON {lesson_num_str} • QUIZ {quiz["num"]}'
    draw.rounded_rectangle([860, 75, 1110, 118], radius=21, fill=(99, 102, 241, 230))
    draw.text((885, 84), badge_text, font=fonts['sub'], fill=(255, 255, 255))

    # 5. Curiosity Challenge Headline
    curated = CURATED_HEADLINES.get((lesson_id, quiz['num']))
    if curated:
        line1, line2 = curated
    else:
        ko = quiz['ko'].strip()
        if len(ko) > 22:
            ko = ko[:20] + '...'
        line1 = f'"{ko}"를'
        line2 = '영어로 뭐라고 할까요?'

    draw.text((90, 165), line1, font=fonts['title'], fill=(251, 191, 36))
    draw.text((90, 230), line2, font=fonts['title'], fill=(248, 250, 252))

    # 6. Cloze Sentence Teaser Box
    draw.rounded_rectangle([90, 320, 1110, 425], radius=18, fill=(15, 23, 42, 230), outline=(79, 70, 229, 130), width=2)
    cloze_text = format_cloze_sentence(quiz['en'])

    # Render cloze text with highlighted [ ? ]
    if '[ ? ]' in cloze_text:
        before, after = cloze_text.split('[ ? ]', 1)
        before_bbox = draw.textbbox((0, 0), before, font=fonts['en'])
        before_w = before_bbox[2] - before_bbox[0]

        start_x = 125
        y_pos = 355
        draw.text((start_x, y_pos), before, font=fonts['en'], fill=(148, 163, 184))

        # Blank Pill Box
        blank_w = 90
        bx1 = start_x + before_w + 10
        bx2 = bx1 + blank_w
        draw.rounded_rectangle([bx1, y_pos - 8, bx2, y_pos + 42], radius=10, fill=(99, 102, 241, 90), outline=(129, 140, 248, 220), width=2)
        draw.text((bx1 + 24, y_pos + 2), '?', font=fonts['en_blank'], fill=(251, 191, 36))

        draw.text((bx2 + 10, y_pos), after, font=fonts['en'], fill=(148, 163, 184))
    else:
        draw.text((125, 355), cloze_text, font=fonts['en'], fill=(148, 163, 184))

    # 7. Bottom Bar & Action Callout
    draw.text((95, 492), '● 100% 무료 학습 • 원어민 실생활 발음 및 해설 수록', font=fonts['sub'], fill=(148, 163, 184))

    # CTA Button
    draw.rounded_rectangle([870, 474, 1110, 529], radius=28, fill=(16, 185, 129, 240))
    draw.text((905, 488), '정답 맞히기 ▶', font=fonts['btn'], fill=(255, 255, 255))

    # Output filename
    q_str = f'q{quiz["num"]}'
    filename = f'{lesson_id}-{q_str}.png'
    output_path = os.path.join(OG_DIR, filename)
    img.save(output_path, 'PNG', optimize=True)
    return filename

def main():
    print('🎨 Generating Pre-Rendered Open Graph Images for all quizzes...')
    fonts = get_fonts()
    total = 0

    for lesson_dir in sorted(glob.glob(os.path.join(ROOT_DIR, 'lessons', 'lesson-*'))):
        lesson_id = os.path.basename(lesson_dir)
        quiz_md = os.path.join(lesson_dir, 'quiz.md')
        if not os.path.exists(quiz_md):
            continue

        quizzes = parse_quiz_md(quiz_md)
        for q in quizzes:
            fname = generate_og_image(lesson_id, q, fonts)
            total += 1
            print(f'  🖼️  Generated: assets/img/og/{fname}')

    print(f'✨ Finished generating {total} unique Open Graph images!\n')

if __name__ == '__main__':
    main()
