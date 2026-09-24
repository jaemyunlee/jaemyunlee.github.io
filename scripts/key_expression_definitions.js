/**
 * Centralized concise definitions and extraction helper for lesson key expressions.
 * Used by generate_key_expressions_srt.js and generate_youtube_description.js
 */

const CONCISE_DEFINITIONS = {
  // Lesson 01
  'happened to': '우연히 ~하다',
  'obviously': '당연히, 명백하게',
  'nosebleed': '맨 꼭대기 좌석(하늘석)',
  'nosebleed section': '맨 꼭대기 좌석(하늘석)',
  'nosebleed seats': '맨 꼭대기 좌석(하늘석)',
  'decent': '꽤 괜찮은, 만족스러운',
  'obstructed': '시야가 가려진, 방해된',
  'at least': '적어도, 최소한',
  'started to': '~하기 시작하다',
  'start to': '~하기 시작하다',
  'in a cast': '깁스를 한 상태인',
  'no way': '절대 불가능한, 방법이 없는',
  'turned out': '알고 보니 ~이다, 드러나다',
  'turn out': '알고 보니 ~이다, 드러나다',
  'spend the night': '하룻밤 자고 오다, 묵다',
  'mind': '신경 쓰다, 개의하다',
  'went on sale': '판매가 시작되다',
  'go on sale': '판매가 시작되다',
  'what year that came out': '몇 년도에 출시되었는지',
  'around': '대략, 대략 그쯤',
  'grow on me': '들을수록 점점 좋아지다',
  'grow on': '시간이 지날수록 점점 좋아지다',
  'due': '~까지 마감인, 제출 기한인',
  'new song came out': '신곡이 발매되다, 나오다',
  'come out': '발매되다, 나오다',
  'unlikely': '가능성이 희박한, 가망 없는',
  'ended up': '결국 ~하게 되다',
  'end up': '결국 ~하게 되다',
  'trying to': '~하려고 애쓰다, 노력하다',
  'try to': '~하려고 애쓰다, 노력하다',
  'all the way': '끝까지, 내내, 쭉',
  'at once': '한꺼번에, 동시에',
  'in advance': '미리, 사전에',
  'ahead of time': '미리, 시간 여유를 두고',

  // Lesson 02
  'property': '토지, 부지, 사유지',
  'managed to': '겨우겨우 ~해내다, 간신히 해내다',
  'manage to': '어떻게든/간신히 ~해내다',
  'a spring': '샘, 샘물, 수원지',
  'spring': '샘, 샘물, 수원지',
  'midway through': '중반에, 중간 무렵에',
  'passed': '돌아가신, 세상을 떠난',
  'pass': '돌아가시다, 세상을 떠나다',
  'inner tubes': '타이어 튜브, 물놀이용 튜브',
  'inner tube': '타이어 튜브, 물놀이용 튜브',
  'all afternoon': '오후 내내, 오후 온종일',
  'chores': '집안일, 허드렛일',
  'a treat': '특별한 즐거움, 큰 기쁨',
  'treat': '특별한 즐거움, 큰 기쁨',
  'itself': '그 자체, 그것 자체',
  'feeds': '(호수·하천으로) 흘러 들어가다',
  'feed': '(호수·하천으로) 흘러 들어가다',
  'stock': '(물고기를) 방류하다, 채우다',
  'through the years': '세월이 흐르면서, 수년에 걸쳐',
  'strip': '(내부 등을) 완전히 뜯어내다',
  'moldy': '곰팡이가 핀, 곰팡내 나는',
  'level': '평평한, 수평인',
  'as': '~함에 따라, ~하면서',
  'mining': '광업, 채굴',
  'get to': '~할 기회를 얻다, ~하게 되다',
  'used to': '예전에 ~하곤 했다 (지금은 아님)',
  "that's all I got": '제가 준비한 이야기는 여기까지예요',
  'thats all I got': '제가 준비한 이야기는 여기까지예요',
  "that's all i got": '제가 준비한 이야기는 여기까지예요',
  'thats all i got': '제가 준비한 이야기는 여기까지예요',

  // Lesson 03
  'strong-willed': '의지가 강한, 자기주관이 뚜렷한',
  'picked her up': '차로 데리러 가다, 태우러 가다',
  'kept on going': '계속해서 나아가다, 끊임없이 계속하다',
  'push my buttons': '속을 뒤집어놓다, 발끈하게 만들다',
  'pull over': '차를 길가에 대다, 정차하다',
  'ended up': '결국 ~하게 되다',
  'walk along': '~을 따라 걷다, 산책하다',
  'leash': '미아 방지 끈, 하네스',
  'stubborn': '완고한, 고집 센',
  'diapers': '기저귀를 찬, 배변 훈련 전인',
  'at a time': '한 번에, 연달아',
  'going off': '(대학 등으로) 떠나다, 진학하러 가다',
  'son in law': '사위',

  // Lesson 04
  'stood out': '유독 눈에 띄다, 두드러지다',
  'standing out': '유독 눈에 띄다, 두드러지다',
  'fit': '(분위기·상황에) 어울리다, 꼭 맞다',
  'quite a few': '꽤 많은, 상당수',
  'merch sections': '굿즈 판매 구역, 굿즈 코너',
  'odd time': '애매한 시간대, 특이한 시간',
  'nosebleed seats': '하늘석, 맨 꼭대기 좌석',
  'open air stadium': '야외 경기장, 지붕 없는 스타디움',
  'scripted setup': '대본대로 짜인 연출, 각본 설정',
  'up to us': '우리에게 달린, 우리가 할 몫인',
  'up to': '우리에게 달린, 우리가 할 몫인',
  'played that up': '분위기를 띄우다, 능청스럽게 장난치다',
  'appearance': '외모, 생김새',
  'turns out': '알고 보니 ~이다, 드러나다',
  'came across': '~한 느낌으로 다가오다, 전달되다',
  'turned into': '~로 변하다, 바뀌다',
  'felt random': '뜬금없게 느껴지다, 생뚱맞다',
  'get in line': '줄을 서다, 차례를 기다리다',
  'first in line': '맨 먼저 줄을 선, 첫 번째 순서의',
  'by the time': '~할 무렵에는, ~할 때쯤에',
  'throughout': '~내내, 줄곧',
  'wondering if': '~인지 궁금해하다',
  'at the end': '마지막에, 끝 무렵에',

  // Lesson 05
  'my brain is mush': '머리가 멍하다, 생각이 안 돌아가다',
  'minors': '부전공 (대학 부전공 이수)',
  'had to do with': '~와 관련이 있다, 상관이 있다',
  'have to do with': '~와 관련이 있다, 상관이 있다',
  'get into': '(학교·프로그램에) 들어가다, 입학하다',
  'transcript': '성적 증명서, 학업 이수 기록',
  'suit their requirements': '요구 조건/자격 요건에 부합하다',
  'covers': '(과목·주제를) 다루다, 포함하다',
  'cover': '(과목·주제를) 다루다, 대체 인정받다',
  'prerequisite': '선수 과목, 필수 선행 요건',
  'waived': '(수업·요건 등이) 면제된',
  'as well': '또한, 마찬가지로, 역시',
  'come up': '(시험 등에) 문제로 나오다, 언급되다',
  'multiple choice': '객관식 (선택형 문제)',
  'second guess': '자신의 결정을 뒤늦게 의심하다, 재고하다',
  'secondguess': '자신의 결정을 뒤늦게 의심하다, 재고하다',
  'decently': '나름 괜찮게, 꽤 준수하게',
  'out of the three': '3점 만점 중에서, 셋 중에서',
  'come up with': '(아이디어·답변 등을) 생각해내다, 짜내다',
  'opened my eyes': '새로운 사실에 눈을 뜨게 하다, 깨닫게 하다',
  'in-depth': '심도 있는, 상세하고 깊이 있는',
  'indepth': '심도 있는, 상세하고 깊이 있는',
  'fell into': '우연히 시작하다, 어쩌다 발을 들이다',
  'fall into': '우연히 시작하다, 어쩌다 발을 들이다',

  // Lesson 06
  'ended up': '결국 ~하게 되다',
  'hang around': '어슬렁거리다, 서성거리다',
  'practical': '실용적인, 현실적인',
  'went out to dinner': '저녁 외식을 하러 가다',
  'pushing the peppers aside': '고추를 한쪽으로 치워두다',
  'pushing, aside': '고추를 한쪽으로 쓱 치워두다',
  'pushing': '옆으로 밀어두다, 치우다',
  'show off': '과시하다, 뽐내다, 허세 부리다',
  'being around': '~와 함께 어울리는 시간을 좋아하다',
  'enjoyed being around': '~와 함께 어울리는 시간을 좋아하다',
  'taken to the bar': '술집에 데려가 지다',
  'one of the times': '그 여러 번 중 한 번',
  'early in the relationship': '연애 초기에',
  'all the way from, to': 'A에서 B까지 줄곧 내내',
  'all the way from': '줄곧, 내내 끝까지',
  'all the way from martinez to lafayette': '마티네즈에서 라피엣까지 줄곧 내내',
  'went around a corner': '코너(모퉁이)를 돌다',
  'the time of year': '연중 시기, 계절',
  'take a nap': '낮잠을 자다',
  'dull moment': '지루할 틈, 심심한 순간',
  'backing out': '(나사가) 헐거워져 삐져나오다',
  "it's a pain": '성가신 일, 골칫거리',
  'its a pain': '성가신 일, 골칫거리',
  'way back': '아주 먼 옛날에, 훨씬 전에',
  'it was surprising that': '~라는 점이 놀라웠다',
  'disturbed': '방해받은, 심기가 불편해진',
  'sightings': '(야생동물 등의) 목격, 출몰',
  'got to': '~해야만 한다',
  "you've got to": '~해야만 한다',
  'youve got to': '~해야만 한다',
  'have got to': '~해야만 한다',
  'figuring out': '방법을 알아내다, 파악하다',

  // Lesson 07
  'stop me in': '가던 길을 멈춰 세우다',
  'random': '뜬금없는, 엉뚱한',
  'really random': '정말 뜬금없는',
  'standpoint': '관점, 입장',
  'fermented': '발효된',
  'used to': '~하곤 했다',
  'every other week': '격주로, 2주에 한 번',
  'there were ever times where': '혹시라도 ~했던 적이 있다면',
  'got stared at': '빤히 쳐다보는 시선을 받다',
  'at least': '적어도, 최소한',
  'encouraged': '부추기다, 계속하도록 북돋우다',
  'encourage': '부추기다, 북돋우다',
  'have lived up to': '기대치에 부응하다, 미치다',
  'lived up to': '기대치에 부응하다, 미치다',
  'live up to': '기대치에 부응하다, 미치다',
  'was introduced to': '소개받아서 알게 되다',
  'be introduced by': '소개받다',
  'cant say': '확실히 꼬집어 말하긴 어렵다',
  "can't say": '확실히 꼬집어 말하긴 어렵다',
  'supposed to': '원래 마땅히 ~해야 하는',
  'taste the same': '예전의 똑같은 그 맛이 나다',
  'technically': '엄밀히 따져보면',
  'based it off of': '~을 바탕(기준)으로 삼다',
  'as good as': '~만큼 좋은(맛있는)',
  'turn out': '결과가 나오다, 완성되다',
  'whereas': '반면에, ~임에 비하여',
  'oilier to': '~에게 더 기름지게 느껴지는',
  'break from': '~을 잠시 쉬다, 휴식기를 갖다'
};

function extractConciseDefinition(quiz) {
  if (!quiz) return '';
  const ansKey = (quiz.answer || '').toLowerCase().trim();
  const cleanKey = ansKey.replace(/['"’]/g, '');
  if (CONCISE_DEFINITIONS[ansKey]) {
    return CONCISE_DEFINITIONS[ansKey];
  }
  if (CONCISE_DEFINITIONS[cleanKey]) {
    return CONCISE_DEFINITIONS[cleanKey];
  }

  // Try extracting from explanation quotes e.g. "strong-willed"는 "의지가 강한..."
  if (quiz.explanation) {
    const quoteMatches = [...quiz.explanation.matchAll(/"([^"]+)"/g)];
    for (const match of quoteMatches) {
      const candidate = match[1].trim();
      // Look for a concise Korean explanation (contains Hangul, length <= 35)
      if (/[\uac00-\ud7a3]/.test(candidate) && candidate.length <= 35) {
        return candidate;
      }
    }
  }

  // Fallback to Korean sentence truncated or simplified
  return (quiz.korean || '').replace(/[.?!]$/, '');
}

module.exports = {
  CONCISE_DEFINITIONS,
  extractConciseDefinition
};
