const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-01';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. happened to
  {
    keyExpression: 'happened to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I just [happened to, planned to, refused to, hesitated to] see your message right before leaving the house.',
        answer: 'happened to',
        options: ['happened to', 'planned to', 'refused to', 'hesitated to'],
        korean: '집을 나서기 직전에 그냥 우연히 네 메시지를 보게 되었어.',
        explanation: '"happen to (동사)"는 계획하지 않고 "우연히 ~하다"라는 뜻의 매우 자연스러운 일상 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [happened to, wanted to, forgot to, stopped to] meet each other at the bus stop this morning.',
        answer: 'happened to',
        options: ['happened to', 'wanted to', 'forgot to', 'stopped to'],
        korean: '우리는 오늘 아침에 버스 정류장에서 우연히 서로 마주쳤어요.',
        explanation: '"happened to meet"은 약속 없이 "우연히 마주치다"라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She [happened to, failed to, refused to, disliked to] find an old family photo inside the book.',
        answer: 'happened to',
        options: ['happened to', 'failed to', 'refused to', 'disliked to'],
        korean: '그녀는 책 안에서 우연히 옛날 가족 사진 한 장을 발견했어요.',
        explanation: '"happened to find"는 찾으려고 하지 않았는데 "우연히 발견했다"는 의미입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [happened to, refused to, hesitated to, hated to] sit next to a very friendly man on the train.',
        answer: 'happened to',
        options: ['happened to', 'refused to', 'hesitated to', 'hated to'],
        korean: '기차에서 우연히 아주 친절한 분의 옆자리에 앉게 되었어요.',
        explanation: '"happened to sit"은 의도치 않게 "우연히 앉게 되다"를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They [happened to, forgot to, refused to, feared to] choose the exact same table at the cafe.',
        answer: 'happened to',
        options: ['happened to', 'forgot to', 'refused to', 'feared to'],
        korean: '그들은 카페에서 우연히 똑같은 테이블을 골라 앉게 되었어요.',
        explanation: '"happened to choose"는 우연의 일치를 자연스럽게 전하는 표현입니다.'
      }
    ]
  },
  // 2. obviously
  {
    keyExpression: 'obviously',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[Obviously, Surprisingly, Secretly, Rarely], we cannot go to the park today because it is raining hard.',
        answer: 'Obviously',
        options: ['Obviously', 'Surprisingly', 'Secretly', 'Rarely'],
        korean: '비가 많이 내리니 당연히 오늘 공원에 갈 수는 없죠.',
        explanation: '"Obviously"는 "당연히, 명백하게"라는 뜻으로 누구나 쉽게 짐작할 수 있는 명백한 사실을 전할 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He was [obviously very tired] after working all day long.',
        answer: 'obviously very tired',
        tokens: ['obviously', 'very', 'tired'],
        options: ['obviously', 'very', 'tired'],
        korean: '하루 종일 일한 뒤라 그는 눈에 띄게 당연히 무척 피곤해 보였어요.',
        explanation: '누가 보아도 분명하게 지친 상태를 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you want to speak good English, [obviously, secretly, sadly, barely] you have to practice every day.',
        answer: 'obviously',
        options: ['obviously', 'secretly', 'sadly', 'barely'],
        korean: '영어를 잘하고 싶다면, 당연히 매일 연습해야만 하죠.',
        explanation: '"obviously"는 너무나 당연한 인과관계를 강조할 때 문장 앞에서 자주 쓰입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'A cold glass of water [obviously tastes best] on a hot summer day.',
        answer: 'obviously tastes best',
        tokens: ['obviously', 'tastes', 'best'],
        options: ['obviously', 'tastes', 'best'],
        korean: '더운 여름날에는 시원한 물 한 잔이 당연히 가장 맛있죠.',
        explanation: '누구나 공감할 수 있는 자연스러운 사실을 강조합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She was [obviously, rarely, secretly, barely] happy when she opened the birthday present.',
        answer: 'obviously',
        options: ['obviously', 'rarely', 'secretly', 'barely'],
        korean: '생일 선물을 열었을 때 그녀는 누가 봐도 확실하게 행복해 보였어요.',
        explanation: '얼굴에 기쁨이 훤히 드러날 때 "obviously happy"라고 말합니다.'
      }
    ]
  },
  // 3. nosebleed
  {
    keyExpression: 'nosebleed',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Even though our tickets were in the [nosebleed, front row, VIP box, orchestra] section, we still enjoyed the big concert.',
        answer: 'nosebleed',
        options: ['nosebleed', 'front row', 'VIP box', 'orchestra'],
        korean: '비록 우리 표가 맨 꼭대기 구역(하늘석)이었지만, 우리는 여전히 큰 콘서트를 즐길 수 있었어요.',
        explanation: '"nosebleed section" 또는 "nosebleed seats"는 경기장이나 콘서트장의 "맨 꼭대기 높은 좌석(코피가 날 정도로 높다는 비유)"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We bought cheap tickets [in the nosebleed section] for the baseball game.',
        answer: 'in the nosebleed section',
        tokens: ['in', 'the', 'nosebleed', 'section'],
        options: ['in', 'the', 'nosebleed', 'section'],
        korean: '우리는 야구 경기의 맨 꼭대기 좌석(하늘석) 표를 싸게 샀어요.',
        explanation: '경기장의 가장 높은 구역을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The seats are high up in the [nosebleed, ground floor, stage front, middle row] area, but you can see the whole field.',
        answer: 'nosebleed',
        options: ['nosebleed', 'ground floor', 'stage front', 'middle row'],
        korean: '좌석이 맨 꼭대기 구역 높은 곳에 있지만, 경기장 전체가 한눈에 보여요.',
        explanation: '"nosebleed"는 높은 층 꼭대기 좌석을 가리키는 대표적인 구어 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I do not like sitting [in the nosebleed seats] because I am afraid of heights.',
        answer: 'in the nosebleed seats',
        tokens: ['in', 'the', 'nosebleed', 'seats'],
        options: ['in', 'the', 'nosebleed', 'seats'],
        korean: '저는 높은 곳을 무서워해서 맨 꼭대기 좌석에 앉는 것을 안 좋아해요.',
        explanation: '높은 좌석 구역을 뜻하는 일상 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Can you see the players clearly from the [nosebleed, front line, first row, stage door] seats?',
        answer: 'nosebleed',
        options: ['nosebleed', 'front line', 'first row', 'stage door'],
        korean: '맨 꼭대기 좌석에서도 선수들이 잘 보이나요?',
        explanation: '경기장 꼭대기 구역을 질문할 때 유용하게 쓰입니다.'
      }
    ]
  },
  // 4. decent
  {
    keyExpression: 'decent',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Our hotel was not expensive, but it had a [decent, terrible, dirty, noisy] room and clean beds.',
        answer: 'decent',
        options: ['decent', 'terrible', 'dirty', 'noisy'],
        korean: '우리 호텔은 비싸지 않았지만, 꽤 괜찮은 방과 깨끗한 침대가 있었어요.',
        explanation: '"decent"는 아주 훌륭하진 않아도 "꽤 괜찮은, 만족스러운, 적당한"을 뜻하는 필수 일상 형용사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We found a [decent place for lunch] near the subway station.',
        answer: 'decent place for lunch',
        tokens: ['decent', 'place', 'for', 'lunch'],
        options: ['decent', 'place', 'for', 'lunch'],
        korean: '우리는 지하철역 근처에서 점심 먹기 꽤 괜찮은 식당을 찾았어요.',
        explanation: '적당하고 만족스러운 장소를 말할 때 "decent place"를 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This small coffee shop makes a [decent, broken, sour, silent] cup of coffee for two dollars.',
        answer: 'decent',
        options: ['decent', 'broken', 'sour', 'silent'],
        korean: '이 작은 카페는 2달러에 꽤 괜찮은 커피 한 잔을 만들어 줘요.',
        explanation: '품질이 꽤 만족스러울 때 "decent cup of coffee"라고 합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He bought a [decent used car] for a very fair price.',
        answer: 'decent used car',
        tokens: ['decent', 'used', 'car'],
        options: ['decent', 'used', 'car'],
        korean: '그는 아주 적당한 가격에 꽤 쓸 만하고 괜찮은 중고차를 한 대 샀어요.',
        explanation: '상태가 양호하고 쓸 만함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The movie was not great, but it was [decent, awful, invisible, painful] enough to watch with friends.',
        answer: 'decent',
        options: ['decent', 'awful', 'invisible', 'painful'],
        korean: '그 영화가 대단하진 않았지만, 친구들과 보기에 꽤 괜찮았어요.',
        explanation: '무난하게 볼 만한 수준을 "decent"라고 표현합니다.'
      }
    ]
  },
  // 5. obstructed
  {
    keyExpression: 'obstructed',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The movie ticket was cheaper because the seat had an [obstructed, unlimited, crystal-clear, open] view behind a tall person.',
        answer: 'obstructed',
        options: ['obstructed', 'unlimited', 'crystal-clear', 'open'],
        korean: '키 큰 사람 뒤라 시야가 가려진 자리여서 영화 티켓이 더 저렴했어요.',
        explanation: '"obstructed"는 기둥이나 사람 등에 의해 "시야가 가려진, 방해된"을 뜻합니다 ("obstructed view": 시야 제한석).'
      },
      {
        type: 'drag-and-drop',
        english: 'I could not see the stage well [because of an obstructed view].',
        answer: 'because of an obstructed view',
        tokens: ['because', 'of', 'an', 'obstructed', 'view'],
        options: ['because', 'of', 'an', 'obstructed', 'view'],
        korean: '앞이 가려진 시야 때문에 무대가 잘 보이지 않았어요.',
        explanation: '시야가 방해받은 상황을 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Does this low-price seat have an [obstructed, perfect, sunny, empty] view of the screen?',
        answer: 'obstructed',
        options: ['obstructed', 'perfect', 'sunny', 'empty'],
        korean: '이 저렴한 좌석은 화면 시야가 가려져 있나요?',
        explanation: '시야 제한 여부를 물어볼 때 쓰는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We asked for different seats [with no obstructed view].',
        answer: 'with no obstructed view',
        tokens: ['with', 'no', 'obstructed', 'view'],
        options: ['with', 'no', 'obstructed', 'view'],
        korean: '우리는 시야가 가려지지 않은 다른 좌석을 요청했어요.',
        explanation: '가려짐 없이 훤히 트인 자리를 찾을 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A large pole in front of my seat [obstructed, cleaned, opened, helped] my view of the game.',
        answer: 'obstructed',
        options: ['obstructed', 'cleaned', 'opened', 'helped'],
        korean: '내 자리 앞에 있는 큰 기둥 하나가 경기 시야를 가려버렸어요.',
        explanation: '동사로 쓰여 "시야를 가리다, 방해하다"를 뜻합니다.'
      }
    ]
  },
  // 6. Compared to
  {
    keyExpression: 'Compared to',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[Compared to, Regardless of, In spite of, In place of] my old phone, this new phone is very fast.',
        answer: 'Compared to',
        options: ['Compared to', 'Regardless of', 'In spite of', 'In place of'],
        korean: '내 옛날 휴대폰과 비교하면, 이 새 휴대폰은 정말 빨라요.',
        explanation: '"Compared to ~"는 "~에 비하면, ~와 비교했을 때"라는 뜻으로 두 대상을 쉽게 대조할 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: '[Compared to yesterday], the weather is much warmer today.',
        answer: 'Compared to yesterday',
        tokens: ['Compared', 'to', 'yesterday'],
        options: ['Compared', 'to', 'yesterday'],
        korean: '어제와 비교하면, 오늘은 날씨가 훨씬 따뜻해요.',
        explanation: '어제 날씨와 오늘 날씨를 비교하는 자연스러운 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This small room is quite quiet [compared to, inside of, because of, away from] the busy street outside.',
        answer: 'compared to',
        options: ['compared to', 'inside of', 'because of', 'away from'],
        korean: '바깥의 번화한 거리에 비하면, 이 작은 방은 꽤 조용해요.',
        explanation: '"compared to"는 장소나 상태의 차이를 나타낼 때 쓰입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Taking the train is fast [compared to the bus].',
        answer: 'compared to the bus',
        tokens: ['compared', 'to', 'the', 'bus'],
        options: ['compared', 'to', 'the', 'bus'],
        korean: '버스에 비하면 기차를 타는 것이 빠릅니다.',
        explanation: '교통수단의 속도를 비교할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His coffee has lots of sugar [compared to, looking for, pointing at, turning on] mine.',
        answer: 'compared to',
        options: ['compared to', 'looking for', 'pointing at', 'turning on'],
        korean: '내 커피에 비하면 그의 커피에는 설탕이 많이 들어가 있어요.',
        explanation: '두 음료의 단맛을 비교하는 문맥입니다.'
      }
    ]
  },
  // 7. at least
  {
    keyExpression: 'at least',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'You should drink [at least, at most, at best, at once] eight cups of water every day to stay healthy.',
        answer: 'at least',
        options: ['at least', 'at most', 'at best', 'at once'],
        korean: '건강을 유지하려면 매일 적어도 물 여덟 잔은 마셔야 해요.',
        explanation: '"at least"는 "적어도, 최소한"이라는 뜻으로 최소 수량이나 기준을 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It will take [at least twenty minutes] to walk to the train station.',
        answer: 'at least twenty minutes',
        tokens: ['at', 'least', 'twenty', 'minutes'],
        options: ['at', 'least', 'twenty', 'minutes'],
        korean: '기차역까지 걸어가는 데 최소한 20분은 걸릴 거예요.',
        explanation: '최소 소요 시간을 안내할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We missed the bus, but [at least, at once, at last, at all] it is not raining today.',
        answer: 'at least',
        options: ['at least', 'at once', 'at last', 'at all'],
        korean: '버스는 놓쳤지만, 적어도 오늘 비가 안 와서 다행이에요.',
        explanation: '아쉬운 상황에서도 다행스러운 점을 말할 때 "at least"를 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I want to read [at least one book] every month.',
        answer: 'at least one book',
        tokens: ['at', 'least', 'one', 'book'],
        options: ['at', 'least', 'one', 'book'],
        korean: '저는 매달 적어도 책 한 권은 읽고 싶어요.',
        explanation: '자신의 최소 목표를 다짐할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He did not win the prize, but he tried his best, [at least, by far, on sale, in turn].',
        answer: 'at least',
        options: ['at least', 'by far', 'on sale', 'in turn'],
        korean: '그는 상을 받지는 못했지만, 적어도 최선은 다했어요.',
        explanation: '결과와 상관없이 최소한의 노력이나 위안을 표현합니다.'
      }
    ]
  },
  // 8. started to
  {
    keyExpression: 'started to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'It [started to, stopped to, refused to, forgot to] rain, so we ran inside the house.',
        answer: 'started to',
        options: ['started to', 'stopped to', 'refused to', 'forgot to'],
        korean: '비가 내리기 시작해서, 우리는 집 안으로 뛰어 들어갔어요.',
        explanation: '"started to (동사원형)"는 어떤 행동이나 상태가 "~하기 시작했다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'My little brother [started to walk] when he was one year old.',
        answer: 'started to walk',
        tokens: ['started', 'to', 'walk'],
        options: ['started', 'to', 'walk'],
        korean: '내 남동생은 한 살 때 걷기 시작했어요.',
        explanation: '새로운 행동을 시작한 시점을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [started to, stopped to, hated to, failed to] learn English with simple sentences last year.',
        answer: 'started to',
        options: ['started to', 'stopped to', 'hated to', 'failed to'],
        korean: '저는 작년에 쉬운 문장으로 영어 공부를 시작했어요.',
        explanation: '배움을 시작했음을 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The baby [started to cry] because she was hungry.',
        answer: 'started to cry',
        tokens: ['started', 'to', 'cry'],
        options: ['started', 'to', 'cry'],
        korean: '아기가 배가 고파서 울기 시작했어요.',
        explanation: '갑작스러운 울음의 시작을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After walking for an hour, we [started to, stopped to, refused to, disliked to] feel hungry.',
        answer: 'started to',
        options: ['started to', 'stopped to', 'refused to', 'disliked to'],
        korean: '한 시간 동안 걸은 뒤에 우리는 배가 고프기 시작했어요.',
        explanation: '배고픔을 느끼기 시작했다는 자연스러운 표현입니다.'
      }
    ]
  },
  // 9. in a cast
  {
    keyExpression: 'in a cast',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'He fell off his bike and had to keep his arm [in a cast, in a rush, in disguise, in trouble] for four weeks.',
        answer: 'in a cast',
        options: ['in a cast', 'in a rush', 'in disguise', 'in trouble'],
        korean: '그는 자전거에서 넘어져 팔에 4주 동안 깁스를 하고 있어야 했어요.',
        explanation: '"in a cast"는 팔이나 다리에 "깁스를 하고 있는 상태"를 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She cannot play tennis because [her leg is in a cast].',
        answer: 'her leg is in a cast',
        tokens: ['her', 'leg', 'is', 'in', 'a', 'cast'],
        options: ['her', 'leg', 'is', 'in', 'a', 'cast'],
        korean: '그녀는 다리에 깁스를 하고 있어서 테니스를 칠 수 없어요.',
        explanation: '깁스를 한 다리 상태를 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My friend had his wrist [in a cast, in a box, in a hurry, in a line] all last month.',
        answer: 'in a cast',
        options: ['in a cast', 'in a box', 'in a hurry', 'in a line'],
        korean: '내 친구는 지난달 내내 손목에 깁스를 하고 있었어요.',
        explanation: '신체 부위가 깁스된 상태를 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It was hard to take a shower with [my foot in a cast].',
        answer: 'my foot in a cast',
        tokens: ['my', 'foot', 'in', 'a', 'cast'],
        options: ['my', 'foot', 'in', 'a', 'cast'],
        korean: '발에 깁스를 한 채로 샤워하는 것은 힘들었어요.',
        explanation: '깁스를 하고 겪는 불편한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His right hand was [in a cast, in a bag, in a row, in a way], so he wrote with his left hand.',
        answer: 'in a cast',
        options: ['in a cast', 'in a bag', 'in a row', 'in a way'],
        korean: '그는 오른손에 깁스를 하고 있어서 왼손으로 글을 썼어요.',
        explanation: '손에 깁스를 한 상황을 전합니다.'
      }
    ]
  },
  // 10. no way
  {
    keyExpression: 'no way',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'There was [no way, no doubt, some chance, every reason] we could catch the bus because we left home too late.',
        answer: 'no way',
        options: ['no way', 'no doubt', 'some chance', 'every reason'],
        korean: '집에서 너무 늦게 나와서 버스를 탈 수 있는 방법은 전혀 없었어요.',
        explanation: '"There is no way ~"는 "~할 방법이 전혀 없다 / 절대 불가능하다"라는 강한 불가능의 일상 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'There is [no way I can eat] this whole pizza alone.',
        answer: 'no way I can eat',
        tokens: ['no', 'way', 'I', 'can', 'eat'],
        options: ['no', 'way', 'I', 'can', 'eat'],
        korean: '나 혼자서 이 피자 한 판을 다 먹을 방법은 절대 없어.',
        explanation: '혼자 다 먹기 불가능하다는 재미있는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'No, [no way, no idea, no problem, no wonder]! I cannot believe he finished that entire book in one hour.',
        answer: 'no way',
        options: ['no way', 'no idea', 'no problem', 'no wonder'],
        korean: '말도 안 돼(절대 그럴 리 없어)! 그 두꺼운 책을 한 시간 만에 다 읽었다니 믿을 수 없어.',
        explanation: '놀라움이나 믿기지 않음을 나타내는 감탄사로 쓰입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'There was [no way to call you] because my phone battery died.',
        answer: 'no way to call you',
        tokens: ['no', 'way', 'to', 'call', 'you'],
        options: ['no', 'way', 'to', 'call', 'you'],
        korean: '휴대폰 배터리가 나가서 너에게 전화할 방법이 전혀 없었어.',
        explanation: '연락할 수단이 전혀 없었음을 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'There is [no way, no time, no point, no use] she forgot your birthday; she is your best friend!',
        answer: 'no way',
        options: ['no way', 'no time', 'no point', 'no use'],
        korean: '그녀가 네 생일을 잊었을 리가 전혀 없어. 네 가장 친한 친구잖아!',
        explanation: '절대 그럴 리가 없다는 강한 확신을 나타냅니다.'
      }
    ]
  },
  // 11. turned out
  {
    keyExpression: 'turned out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We thought the shop was closed, but it [turned out, looked like, caught on, went down] they were just eating lunch.',
        answer: 'turned out',
        options: ['turned out', 'looked like', 'caught on', 'went down'],
        korean: '우리는 가게가 문을 닫은 줄 알았는데, 알고 보니 그냥 점심을 먹고 있던 것이었어요.',
        explanation: '"turn out (that) ~"은 "알고 보니 ~임이 드러나다 / 결과적으로 ~로 밝혀지다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The test [turned out to be easy] for all of us.',
        answer: 'turned out to be easy',
        tokens: ['turned', 'out', 'to', 'be', 'easy'],
        options: ['turned', 'out', 'to', 'be', 'easy'],
        korean: '그 시험은 우리 모두에게 알고 보니 쉬운 것으로 드러났어요.',
        explanation: '실제 결과가 쉬웠음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I thought I lost my key, but it [turned out, gave up, ran down, fell through] to be deep in my pocket.',
        answer: 'turned out',
        options: ['turned out', 'gave up', 'ran down', 'fell through'],
        korean: '열쇠를 잃어버린 줄 알았는데, 알고 보니 내 주머니 깊숙한 곳에 있었어요.',
        explanation: '예상과 달리 실제 사실이 밝혀진 상황입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The weather [turned out to be sunny] after the morning clouds.',
        answer: 'turned out to be sunny',
        tokens: ['turned', 'out', 'to', 'be', 'sunny'],
        options: ['turned', 'out', 'to', 'be', 'sunny'],
        korean: '아침 구름이 걷히고 날씨는 결국 화창해졌어요.',
        explanation: '결과적인 날씨 변화를 전합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The quiet new student [turned out, dropped out, backed up, stood out] to be a great soccer player.',
        answer: 'turned out',
        options: ['turned out', 'dropped out', 'backed up', 'stood out'],
        korean: '조용하던 그 전학생은 알고 보니 대단한 축구 선수였어요.',
        explanation: '숨겨진 실력이나 사실이 드러난 문맥입니다.'
      }
    ]
  },
  // 12. spend the night
  {
    keyExpression: 'spend the night',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'It was too late to drive home safely, so we decided to [spend the night, waste the time, pass the buck, lose the face] at a nearby motel.',
        answer: 'spend the night',
        options: ['spend the night', 'waste the time', 'pass the buck', 'lose the face'],
        korean: '집까지 안전하게 운전하기엔 너무 늦어서, 우리는 근처 모텔에서 하룻밤 자고 가기로 했어요.',
        explanation: '"spend the night"은 어디서 "하룻밤을 자다 / 묵고 가다"를 뜻하는 일상 회화 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Can my best friend [spend the night at our house] on Friday?',
        answer: 'spend the night at our house',
        tokens: ['spend', 'the', 'night', 'at', 'our', 'house'],
        options: ['spend', 'the', 'night', 'at', 'our', 'house'],
        korean: '금요일에 내 제일 친한 친구가 우리 집에서 자고 가도 돼요?',
        explanation: '친구와 밤을 함께 보내는 슬립오버 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Because of the heavy snow, many travelers had to [spend the night, break the bank, call the roll, play the game] at the airport.',
        answer: 'spend the night',
        options: ['spend the night', 'break the bank', 'call the roll', 'play the game'],
        korean: '폭설 때문에 많은 여행객들이 공항에서 밤을 지새워야 했어요.',
        explanation: '어쩔 수 없이 공항에서 하룻밤을 보낸 상황입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'They invited us to [spend the night at their cabin].',
        answer: 'spend the night at their cabin',
        tokens: ['spend', 'the', 'night', 'at', 'their', 'cabin'],
        options: ['spend', 'the', 'night', 'at', 'their', 'cabin'],
        korean: '그들은 우리에게 자신들의 오두막에서 하룻밤 자고 가라고 초대해 주었어요.',
        explanation: '숙박 초대를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I packed a small bag so I could [spend the night, change the mind, take the bus, wash the car] at my grandma\'s house.',
        answer: 'spend the night',
        options: ['spend the night', 'change the mind', 'take the bus', 'wash the car'],
        korean: '할머니 댁에서 하룻밤 자고 올 수 있도록 작은 가방 하나를 챙겼어요.',
        explanation: '하룻밤 묵기 위한 짐 싸기를 나타냅니다.'
      }
    ]
  },
  // 13. mind
  {
    keyExpression: 'mind',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I asked my friend if I could borrow her pen, and she said she did not [mind, notice, forget, regret] at all.',
        answer: 'mind',
        options: ['mind', 'notice', 'forget', 'regret'],
        korean: '친구에게 펜을 빌려도 되는지 물어봤는데, 그녀는 전혀 신경 안 쓴다(괜찮다)고 말했어요.',
        explanation: '"mind"는 "신경 쓰다, 꺼리다, 언짢아하다"라는 뜻으로, 부정문이나 의문문에서 부탁이나 허락을 구할 때 자주 쓰입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Do you [mind if I open the window] for some air?',
        answer: 'mind if I open the window',
        tokens: ['mind', 'if', 'I', 'open', 'the', 'window'],
        options: ['mind', 'if', 'I', 'open', 'the', 'window'],
        korean: '환기를 위해 창문을 열어도 괜찮으실까요(신경 쓰이시나요)?',
        explanation: '공손하게 양해를 구할 때 쓰는 대표적인 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I do not [mind, tell, sing, call] waiting for a few minutes while you get ready.',
        answer: 'mind',
        options: ['mind', 'tell', 'sing', 'call'],
        korean: '네가 준비하는 동안 몇 분 정도 기다리는 건 전혀 상관없어(괜찮아).',
        explanation: '"I don\'t mind ~ing"은 "~하는 것은 전혀 문제없다/괜찮다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Would you [mind helping me with this box]?',
        answer: 'mind helping me with this box',
        tokens: ['mind', 'helping', 'me', 'with', 'this', 'box'],
        options: ['mind', 'helping', 'me', 'with', 'this', 'box'],
        korean: '이 상자 옮기는 것 좀 도와주실 수 있을까요?',
        explanation: '공손하게 도움을 요청하는 패턴입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My mom does not [mind, want, hate, fear] if we stay up a little late on Friday night.',
        answer: 'mind',
        options: ['mind', 'want', 'hate', 'fear'],
        korean: '우리 엄마는 금요일 밤에 우리가 조금 늦게 자도 괜찮아하셔(개의치 않으셔).',
        explanation: '부모님이 너그럽게 허락해 주시는 상황입니다.'
      }
    ]
  },
  // 14. went on sale
  {
    keyExpression: 'went on sale',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The concert tickets [went on sale, took a break, made a scene, dropped the ball] at nine in the morning, and they sold out fast.',
        answer: 'went on sale',
        options: ['went on sale', 'took a break', 'made a scene', 'dropped the ball'],
        korean: '콘서트 티켓이 아침 9시에 판매가 시작되었고, 금방 매진되었어요.',
        explanation: '"go on sale"은 티켓이나 물건이 "판매를 시작하다"를 뜻합니다 (과거형: went on sale).'
      },
      {
        type: 'drag-and-drop',
        english: 'Warm winter coats [went on sale at the store] yesterday.',
        answer: 'went on sale at the store',
        tokens: ['went', 'on', 'sale', 'at', 'the', 'store'],
        options: ['went', 'on', 'sale', 'at', 'the', 'store'],
        korean: '따뜻한 겨울 코트들이 어제 가게에서 판매되기 시작했어요.',
        explanation: '매장에서 상품 판매가 시작된 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His new story book [went on sale, went to bed, made a cake, took a walk] online this week.',
        answer: 'went on sale',
        options: ['went on sale', 'went to bed', 'made a cake', 'took a walk'],
        korean: '그의 새 이야기책이 이번 주에 온라인에서 판매를 시작했어요.',
        explanation: '도서 발매를 알리는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The new video game [went on sale at midnight].',
        answer: 'went on sale at midnight',
        tokens: ['went', 'on', 'sale', 'at', 'midnight'],
        options: ['went', 'on', 'sale', 'at', 'midnight'],
        korean: '새 비디오 게임이 자정에 판매를 시작했어요.',
        explanation: '출시 시점을 알리는 자연스러운 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Fresh apples [went on sale, ran away, fell off, grew up] for half price at the supermarket.',
        answer: 'went on sale',
        options: ['went on sale', 'ran away', 'fell off', 'grew up'],
        korean: '신선한 사과가 슈퍼마켓에서 반값 할인 판매를 시작했어요.',
        explanation: '"on sale"은 할인 판매 중임을 나타낼 때도 자주 쓰입니다.'
      }
    ]
  },
  // 15. what year that came out
  {
    keyExpression: 'what year that came out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I love that old animated movie, but I cannot remember [what year that came out, what time it closed, how much it earned, where it disappeared].',
        answer: 'what year that came out',
        options: ['what year that came out', 'what time it closed', 'how much it earned', 'where it disappeared'],
        korean: '그 옛날 만화 영화를 정말 좋아하는데, 몇 년도에 나왔는지는 기억이 잘 안 나요.',
        explanation: '"come out"은 영화, 노래, 책 등이 세상에 "출시되다 / 개봉하다 / 나오다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Do you know [what year that came out] in theaters?',
        answer: 'what year that came out',
        tokens: ['what', 'year', 'that', 'came', 'out'],
        options: ['what', 'year', 'that', 'came', 'out'],
        korean: '그 영화가 몇 년도에 극장에 개봉했는지 아시나요?',
        explanation: '개봉 연도를 묻는 간접의문문입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My brother loves this song, but he forgets [what year that came out, why it is sweet, who cooked dinner, how to sleep].',
        answer: 'what year that came out',
        options: ['what year that came out', 'why it is sweet', 'who cooked dinner', 'how to sleep'],
        korean: '내 남동생은 이 노래를 좋아하지만, 몇 년도에 발표되었는지는 잊어버렸어요.',
        explanation: '노래 발매 연도를 가리킵니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Let me search online to see [what year that came out].',
        answer: 'what year that came out',
        tokens: ['what', 'year', 'that', 'came', 'out'],
        options: ['what', 'year', 'that', 'came', 'out'],
        korean: '그 작품이 몇 년도에 출시되었는지 인터넷으로 찾아볼게요.',
        explanation: '출시 연도를 확인하는 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Can you tell me [what year that came out, who is dancing, where the car is, how big the house is] on television?',
        answer: 'what year that came out',
        options: ['what year that came out', 'who is dancing', 'where the car is, how big the house is'],
        korean: '그 방송 프로그램이 몇 년도에 TV에 방영되었는지 알려줄 수 있나요?',
        explanation: '방영 연도를 묻는 질문입니다.'
      }
    ]
  },
  // 16. around there
  {
    keyExpression: 'around there',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Did he arrive at two or three o\'clock? Yes, I think it was right [around there, far beyond, out of sight, down under].',
        answer: 'around there',
        options: ['around there', 'far beyond', 'out of sight', 'down under'],
        korean: '그가 2시나 3시쯤 도착했나요? 네, 제 생각엔 대략 그 무렵쯤이었던 것 같아요.',
        explanation: '"around there"는 시간이나 숫자, 장소의 "그 언저리, 그 무렵, 대략 그쯤"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Is the small bakery [right around there] near the park?',
        answer: 'right around there',
        tokens: ['right', 'around', 'there'],
        options: ['right', 'around', 'there'],
        korean: '그 작은 빵집이 공원 근처 바로 그 부근에 있나요?',
        explanation: '장소 부근을 확인할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Was the book about ten dollars? Yes, the price was [around there, inside out, off the wall, out of order].',
        answer: 'around there',
        options: ['around there', 'inside out', 'off the wall', 'out of order'],
        korean: '그 책이 대략 10달러 정도였나요? 네, 가격이 대략 그 정도 언저리였어요.',
        explanation: '대략적인 가격 범위를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I think I dropped my pen [somewhere around there].',
        answer: 'somewhere around there',
        tokens: ['somewhere', 'around', 'there'],
        options: ['somewhere', 'around', 'there'],
        korean: '내 펜을 저기 그 언저리 어딘가에 떨어뜨린 것 같아요.',
        explanation: '물건을 잃어버린 위치 근처를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She said she would wait for us [around there, under the sea, in the sky, off the record] by the front door.',
        answer: 'around there',
        options: ['around there', 'under the sea', 'in the sky', 'off the record'],
        korean: '그녀는 앞문 근처 그 부근에서 우리를 기다리겠다고 말했어요.',
        explanation: '만날 약속 장소 근처를 나타냅니다.'
      }
    ]
  },
  // 17. grow on
  {
    keyExpression: 'grow on',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I did not like this green tea at first, but over time it began to [grow on, run down, burn out, fall behind] me.',
        answer: 'grow on',
        options: ['grow on', 'run down', 'burn out, fall behind'],
        korean: '처음엔 이 녹차가 별로였지만, 시간이 지나면서 점점 마음에 들기 시작했어요.',
        explanation: '"grow on (누구)"는 처음엔 마음에 안 들거나 어색했지만 "차츰 점점 마음에 들다 / 정이 들다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'That quiet song [began to grow on me] after listening twice.',
        answer: 'began to grow on me',
        tokens: ['began', 'to', 'grow', 'on', 'me'],
        options: ['began', 'to', 'grow', 'on', 'me'],
        korean: '그 조용한 노래는 두 번 듣고 나니 점점 좋아지기 시작했어요.',
        explanation: '음악이 차츰 좋아지는 상황을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This small town will quickly [grow on, give up, look into, blow up] you once you make friends here.',
        answer: 'grow on',
        options: ['grow on', 'give up', 'look into', 'blow up'],
        korean: '여기서 친구들을 사귀고 나면 이 작은 마을도 금방 정이 들고 좋아질 거예요.',
        explanation: '새로운 장소에 정이 드는 문맥입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Her simple jokes [soon grew on all of us].',
        answer: 'soon grew on all of us',
        tokens: ['soon', 'grew', 'on', 'all', 'of', 'us'],
        options: ['soon', 'grew', 'on', 'all', 'of', 'us'],
        korean: '그녀의 소박한 농담들은 곧 우리 모두의 마음에 들었어요.',
        explanation: '사람의 성향이 점차 매력적으로 다가오는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I thought the jacket looked strange, but it slowly [grew on, flew over, tore up, dug into] me.',
        answer: 'grew on',
        options: ['grew on', 'flew over', 'tore up', 'dug into'],
        korean: '그 재킷이 처음엔 이상해 보였지만, 볼수록 점차 마음에 들었어요.',
        explanation: '옷이나 물건이 볼수록 좋아지는 상황입니다.'
      }
    ]
  },
  // 18. due
  {
    keyExpression: 'due',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I cannot play games tonight because my English homework is [due, lost, past, late] tomorrow morning.',
        answer: 'due',
        options: ['due', 'lost', 'past', 'late'],
        korean: '내일 아침까지 제출해야 하는 영어 숙제가 있어서 오늘 밤에는 게임을 할 수 없어요.',
        explanation: '"due (시점)"은 과제, 요금, 보고서 등이 "~까지 마감인 / 제출해야 하는"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'When is our class project [due next week]?',
        answer: 'due next week',
        tokens: ['due', 'next', 'week'],
        options: ['due', 'next', 'week'],
        korean: '우리 조별 과제가 다음 주 언제까지 마감인가요?',
        explanation: '과제 제출 마감일을 묻는 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The electric bill is [due, slow, full, warm] by the end of this Friday.',
        answer: 'due',
        options: ['due', 'slow', 'full', 'warm'],
        korean: '전기 요금 고지서는 이번 주 금요일까지 납부해야 해요.',
        explanation: '요금 납부 기한을 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'These library books are [due back tomorrow].',
        answer: 'due back tomorrow',
        tokens: ['due', 'back', 'tomorrow'],
        options: ['due', 'back', 'tomorrow'],
        korean: '이 도서관 책들은 내일까지 반납해야 합니다.',
        explanation: '도서 반납 기한을 알릴 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Please turn in your paper before five o\'clock when it is [due, open, free, hot].',
        answer: 'due',
        options: ['due', 'open', 'free', 'hot'],
        korean: '마감 시간인 5시가 되기 전에 보고서를 제출해 주세요.',
        explanation: '정해진 마감 시점을 강조합니다.'
      }
    ]
  },
  // 19. came out
  {
    keyExpression: 'came out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'A great new movie [came out, gave up, ran down, fell through] in theaters last Friday.',
        answer: 'came out',
        options: ['came out', 'gave up', 'ran down', 'fell through'],
        korean: '지난주 금요일에 극장에 아주 좋은 새 영화가 개봉했어요(나왔어요).',
        explanation: '"come out"은 영화나 음악 등이 세상에 "나오다 / 개봉하다 / 발매되다"를 뜻합니다 (과거형: came out).'
      },
      {
        type: 'drag-and-drop',
        english: 'The singer\'s new album [came out last month].',
        answer: 'came out last month',
        tokens: ['came', 'out', 'last', 'month'],
        options: ['came', 'out', 'last', 'month'],
        korean: '그 가수의 새 앨범이 지난달에 나왔어요.',
        explanation: '음반 발매 시점을 알립니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The warm sun finally [came out, went away, broke down, sat up] after the rain stopped.',
        answer: 'came out',
        options: ['came out', 'went away', 'broke down', 'sat up'],
        korean: '비가 그친 뒤 마침내 따뜻한 해가 구름 밖으로 나왔어요.',
        explanation: '해가 구름 사이로 모습을 드러낼 때도 "come out"을 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I was so happy when [my test results came out].',
        answer: 'my test results came out',
        tokens: ['my', 'test', 'results', 'came', 'out'],
        options: ['my', 'test', 'results', 'came', 'out'],
        korean: '내 시험 결과가 나왔을 때 나는 정말 기뻤어요.',
        explanation: '결과나 점수가 발표되었음을 전합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When the famous actor [came out, took in, put on, made up] of the door, all the fans smiled.',
        answer: 'came out',
        options: ['came out', 'took in', 'put on', 'made up'],
        korean: '유명 배우가 문밖으로 걸어 나왔을 때, 모든 팬들이 미소를 지었어요.',
        explanation: '방이나 건물 밖으로 사람이 나오는 물리적 동작입니다.'
      }
    ]
  },
  // 20. unlikely
  {
    keyExpression: 'unlikely',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'It is [unlikely, certain, definite, guaranteed] that the bus will be on time during this heavy rain.',
        answer: 'unlikely',
        options: ['unlikely', 'certain', 'definite', 'guaranteed'],
        korean: '이렇게 폭우가 쏟아지는 동안에는 버스가 정시에 올 가능성이 낮아요(그럴 것 같지 않아요).',
        explanation: '"unlikely"는 어떤 일이 일어날 "가능성이 낮은, 그럴 것 같지 않은"을 뜻하는 유용한 형용사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It is very [unlikely that he will forget] your call.',
        answer: 'unlikely that he will forget',
        tokens: ['unlikely', 'that', 'he', 'will', 'forget'],
        options: ['unlikely', 'that', 'he', 'will', 'forget'],
        korean: '그가 네 전화를 잊어버릴 가능성은 아주 희박해.',
        explanation: '그럴 리가 거의 없음을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Snow in May is very [unlikely, common, daily, simple] in this warm city.',
        answer: 'unlikely',
        options: ['unlikely', 'common', 'daily', 'simple'],
        korean: '이 따뜻한 도시에서 5월에 눈이 내릴 가능성은 거의 없어요.',
        explanation: '발생하기 어려운 드문 일을 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It seems [unlikely we will win] the game today.',
        answer: 'unlikely we will win',
        tokens: ['unlikely', 'we', 'will', 'win'],
        options: ['unlikely', 'we', 'will', 'win'],
        korean: '오늘 경기에서 우리가 이길 가능성은 낮아 보여요.',
        explanation: '승리 확률이 낮다고 솔직하게 표현하는 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She thought it was [unlikely, ready, happy, friendly] to find an empty seat on Friday evening.',
        answer: 'unlikely',
        options: ['unlikely', 'ready', 'happy', 'friendly'],
        korean: '그녀는 금요일 저녁에 빈자리를 찾기는 어려울 것(가능성이 낮을 것)이라고 생각했어요.',
        explanation: '빈자리 찾기가 쉽지 않을 것이라는 뉘앙스입니다.'
      }
    ]
  },
  // 21. handicap seats
  {
    keyExpression: 'handicap seats',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Please keep the [handicap seats, luggage bins, driver cabins, exit doors] open for people who need them.',
        answer: 'handicap seats',
        options: ['handicap seats', 'luggage bins', 'driver cabins', 'exit doors'],
        korean: '몸이 불편하거나 도움이 필요한 분들을 위해 장애인 전용 좌석을 비워 두세요.',
        explanation: '"handicap seats"는 버스나 경기장, 극장의 "장애인/교통약자 전용 좌석"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'These front spots are reserved [for handicap seats on the bus].',
        answer: 'for handicap seats on the bus',
        tokens: ['for', 'handicap', 'seats', 'on', 'the', 'bus'],
        options: ['for', 'handicap', 'seats', 'on', 'the', 'bus'],
        korean: '앞쪽의 이 자리들은 버스의 장애인 전용 좌석으로 지정되어 있습니다.',
        explanation: '대중교통의 교통약자석을 안내합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The movie theater has wide spaces near the front for [handicap seats, food tables, big speakers, ticket gates].',
        answer: 'handicap seats',
        options: ['handicap seats', 'food tables', 'big speakers', 'ticket gates'],
        korean: '그 영화관 앞쪽에는 휠체어 이용자를 위한 장애인 전용 좌석 공간이 넓게 마련되어 있어요.',
        explanation: '영화관 내 장애인 전용 공간을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He pointed out the [clean handicap seats near the door].',
        answer: 'clean handicap seats near the door',
        tokens: ['clean', 'handicap', 'seats', 'near', 'the', 'door'],
        options: ['clean', 'handicap', 'seats', 'near', 'the', 'door'],
        korean: '그는 출입문 근처의 깨끗한 장애인 전용 좌석을 가리켜 주었어요.',
        explanation: '장애인 좌석의 위치를 친절하게 안내하는 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You should give up the [handicap seats, steering wheel, radio buttons, engine parts] when an older person gets on the train.',
        answer: 'handicap seats',
        options: ['handicap seats', 'steering wheel', 'radio buttons', 'engine parts'],
        korean: '어르신이 기차에 타시면 장애인/노약자 전용 좌석을 양보해야 해요.',
        explanation: '배려가 필요한 전용 좌석을 가리킵니다.'
      }
    ]
  },
  // 22. trying to
  {
    keyExpression: 'trying to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I am [trying to, stopping to, hating to, failing to] finish my English homework before dinner time.',
        answer: 'trying to',
        options: ['trying to', 'stopping to', 'hating to', 'failing to'],
        korean: '저는 저녁 식사 시간 전에 영어 숙제를 끝내려고 노력하는(애쓰는) 중이에요.',
        explanation: '"try to (동사원형)"는 목표를 이루기 위해 "~하려고 애쓰다 / 노력하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She is [trying to learn how] to drive a car.',
        answer: 'trying to learn how',
        tokens: ['trying', 'to', 'learn', 'how'],
        options: ['trying', 'to', 'learn', 'how'],
        korean: '그녀는 운전하는 법을 배우려고 노력하고 있어요.',
        explanation: '새로운 기술을 익히려고 애쓰는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We are [trying to, refusing to, forgetting to, disliking to] save some money for our family trip.',
        answer: 'trying to',
        options: ['trying to', 'refusing to', 'forgetting to', 'disliking to'],
        korean: '우리는 가족 여행을 위해 돈을 조금 모으려고 노력하고 있어요.',
        explanation: '목표를 세우고 노력하는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He was [trying to open the door] with the wrong key.',
        answer: 'trying to open the door',
        tokens: ['trying', 'to', 'open', 'the', 'door'],
        options: ['trying', 'to', 'open', 'the', 'door'],
        korean: '그는 엉뚱한 열쇠로 문을 열려고 애쓰고 있었어요.',
        explanation: '어떤 동작을 시도하는 모습을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The little cat was [trying to, stopping to, fearing to, refusing to] climb up the big tree.',
        answer: 'trying to',
        options: ['trying to', 'stopping to', 'fearing to', 'refusing to'],
        korean: '그 작은 고양이는 큰 나무 위로 올라가려고 애쓰고 있었어요.',
        explanation: '애쓰는 행동을 생생하게 표현합니다.'
      }
    ]
  },
  // 23. all the way
  {
    keyExpression: 'all the way',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'She walked [all the way, half the time, out of breath, at once] home from the train station in the snow.',
        answer: 'all the way',
        options: ['all the way', 'half the time', 'out of breath', 'at once'],
        korean: '그녀는 눈 속에서 기차역부터 집까지 먼 길을 내내 걸어왔어요.',
        explanation: '"all the way"는 어떤 장소나 목적지까지 "먼 길을 내내 / 끝까지 완전히"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He drove [all the way to the beach] to see the sunset.',
        answer: 'all the way to the beach',
        tokens: ['all', 'the', 'way', 'to', 'the', 'beach'],
        options: ['all', 'the', 'way', 'to', 'the', 'beach'],
        korean: '그는 일몰을 보기 위해 해변까지 먼 길을 내내 차를 몰고 갔어요.',
        explanation: '먼 목적지까지 멈추지 않고 이동한 문맥입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Did you really come [all the way, by the way, on the way, in the way] here just to say hello to me?',
        answer: 'all the way',
        options: ['all the way', 'by the way', 'on the way', 'in the way'],
        korean: '나한테 안부 인사 한마디 하려고 정말 여기까지 먼 길을 내내 와 준 거야?',
        explanation: '먼 거리를 찾아와 준 고마움을 나타내는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We carried the heavy box [all the way up the stairs].',
        answer: 'all the way up the stairs',
        tokens: ['all', 'the', 'way', 'up', 'the', 'stairs'],
        options: ['all', 'the', 'way', 'up', 'the', 'stairs'],
        korean: '우리는 계단 꼭대기까지 그 무거운 상자를 내내 들고 올라갔어요.',
        explanation: '끝까지 물건을 운반한 힘든 과정을 전합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The children ran [all the way, in no time, for a while, by mistake] to the playground without stopping.',
        answer: 'all the way',
        options: ['all the way', 'in no time', 'for a while', 'by mistake'],
        korean: '아이들은 멈추지도 않고 놀이터까지 내내 뛰어갔어요.',
        explanation: '끝까지 계속 이어진 이동을 표현합니다.'
      }
    ]
  },
  // 24. at once
  {
    keyExpression: 'at once',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Please do not all talk [at once, at peace, at hand, at home]; speak one by one so I can hear you.',
        answer: 'at once',
        options: ['at once', 'at peace', 'at hand', 'at home'],
        korean: '모두 한꺼번에(동시에) 말씀하지 마시고, 제가 들을 수 있게 한 분씩 말씀해 주세요.',
        explanation: '"at once"는 여러 사람이 행동할 때 "한꺼번에, 동시에"라는 의미를 가집니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I cannot carry [four heavy bags at once].',
        answer: 'four heavy bags at once',
        tokens: ['four', 'heavy', 'bags', 'at', 'once'],
        options: ['four', 'heavy', 'bags', 'at', 'once'],
        korean: '나는 무거운 가방 네 개를 한꺼번에 들 수는 없어요.',
        explanation: '한 번에 여러 개를 처리하기 힘든 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When the bell rang, all the students stood up [at once, at play, at bay, at work] to leave the room.',
        answer: 'at once',
        options: ['at once', 'at play', 'at bay', 'at work'],
        korean: '종이 울리자 모든 학생들이 교실을 나가려고 일제히 동시에 일어났어요.',
        explanation: '모두가 동시에 일어난 상황입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Two customer orders [came in at once].',
        answer: 'came in at once',
        tokens: ['came', 'in', 'at', 'once'],
        options: ['came', 'in', 'at', 'once'],
        korean: '두 손님의 주문이 동시에 한꺼번에 들어왔어요.',
        explanation: '동시 발생을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He tried to answer three phone calls [at once, at noon, at risk, at dawn] while writing an email.',
        answer: 'at once',
        options: ['at once', 'at noon', 'at risk', 'at dawn'],
        korean: '그는 이메일을 쓰면서 전화 세 통을 동시에 받으려고 애썼어요.',
        explanation: '여러 일을 한꺼번에 처리하려는 모습입니다.'
      }
    ]
  },
  // 25. in advance
  {
    keyExpression: 'in advance',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'You should buy your train ticket [in advance, in danger, in return, in person] to get a good seat by the window.',
        answer: 'in advance',
        options: ['in advance', 'in danger', 'in return', 'in person'],
        korean: '창가 쪽 좋은 자리를 잡으려면 기차표를 미리(사전에) 사두는 것이 좋아요.',
        explanation: '"in advance"는 어떤 일이 일어나기 전에 "미리, 사전에"를 뜻하는 일상 필수 부사구입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Please let us know [in advance if you cannot come].',
        answer: 'in advance if you cannot come',
        tokens: ['in', 'advance', 'if', 'you', 'cannot', 'come'],
        options: ['in', 'advance', 'if', 'you', 'cannot', 'come'],
        korean: '내일 못 오시게 되면 미리 사전에 알려주세요.',
        explanation: '사전에 미리 연락을 부탁하는 정중한 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We booked our small hotel room two weeks [in advance, in public, in secret, in fact] for the vacation.',
        answer: 'in advance',
        options: ['in advance', 'in public', 'in secret', 'in fact'],
        korean: '우리는 휴가를 위해 2주 전에 미리 작은 호텔 방을 예약했어요.',
        explanation: '기간과 함께 쓰여 "2주 전에 미리"를 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It is always smart to [prepare your lunch in advance].',
        answer: 'prepare your lunch in advance',
        tokens: ['prepare', 'your', 'lunch', 'in', 'advance'],
        options: ['prepare', 'your', 'lunch', 'in', 'advance'],
        korean: '점심 도시락을 미리 준비해 두는 것은 언제나 현명한 일이에요.',
        explanation: '미리 준비하는 좋은 습관을 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She paid for the cooking class [in advance, in trouble, in line, in tears] before the first lesson.',
        answer: 'in advance',
        options: ['in advance', 'in trouble', 'in line', 'in tears'],
        korean: '그녀는 첫 수업이 시작하기 전에 요리 강습비를 미리 선납했어요.',
        explanation: '선결제나 사전 납부를 뜻합니다.'
      }
    ]
  },
  // 26. ahead of time
  {
    keyExpression: 'ahead of time',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We arrived at the bus terminal [ahead of time, out of line, out of control, out of date], so we had time to drink a warm coffee.',
        answer: 'ahead of time',
        options: ['ahead of time', 'out of line', 'out of control', 'out of date'],
        korean: '우리는 버스 터미널에 예정 시간보다 일찍(미리) 도착해서, 따뜻한 커피 한 잔을 마실 시간이 있었어요.',
        explanation: '"ahead of time"은 예정된 시각이나 일정보다 "미리, 시간 여유 있게 일찍"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I always like to [finish my homework ahead of time].',
        answer: 'finish my homework ahead of time',
        tokens: ['finish', 'my', 'homework', 'ahead', 'of', 'time'],
        options: ['finish', 'my', 'homework', 'ahead', 'of', 'time'],
        korean: '저는 언제나 숙제를 마감 시간보다 일찍 미리 끝내는 것을 좋아해요.',
        explanation: '여유 있게 미리 끝내는 습관입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you pack your bags [ahead of time, on foot, by chance, at last], you will not feel rushed in the morning.',
        answer: 'ahead of time',
        options: ['ahead of time', 'on foot', 'by chance', 'at last'],
        korean: '가방을 미리 여유 있게 싸두면 아침에 서두르지 않아도 될 거예요.',
        explanation: '시간적 여유를 두고 미리 챙기는 행동입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He sent the meeting notes [well ahead of time].',
        answer: 'well ahead of time',
        tokens: ['well', 'ahead', 'of', 'time'],
        options: ['well', 'ahead', 'of', 'time'],
        korean: '그는 회의 메모를 시간 여유를 넉넉히 두고 훨씬 미리 보내주었어요.',
        explanation: '충분히 이른 시점에 미리 보낸 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She cleaned the entire living room [ahead of time, by heart, out of blue, in general] before her guests arrived.',
        answer: 'ahead of time',
        options: ['ahead of time', 'by heart', 'out of blue', 'in general'],
        korean: '그녀는 손님들이 도착하기 전에 거실 전체를 미리 시간 맞춰 깨끗이 청소해 두었어요.',
        explanation: '손님맞이 전 미리 청소한 문맥입니다.'
      }
    ]
  }
];

// Write quiz-pool.json
const poolPath = path.join(LESSON_DIR, 'quiz-pool.json');
fs.writeFileSync(poolPath, JSON.stringify(POOL, null, 2), 'utf8');
console.log(`[Success] Written: ${poolPath} (${POOL.length} expressions, ${POOL.length * 5} sentences)`);

// Write quiz.md using the 1st sentence of each pool entry
let md = `# Lesson 1: Morning Routine & Daily Habits Quizzes\n\n`;
POOL.forEach((item, idx) => {
  const s = item.sentences[0];
  md += `## Quiz ${idx + 1}\n`;
  md += `- **Type**: ${s.type}\n`;
  md += `- **English**: ${s.english}\n`;
  md += `- **Answer**: ${s.answer}\n`;
  if (s.options) {
    md += `- **Options**: ${s.options.join(', ')}\n`;
  }
  md += `- **Korean**: ${s.korean}\n`;
  md += `- **Explanation**: ${s.explanation}\n\n`;
});

const quizMdPath = path.join(LESSON_DIR, 'quiz.md');
fs.writeFileSync(quizMdPath, md.trim() + '\n', 'utf8');
console.log(`[Success] Written: ${quizMdPath}`);
