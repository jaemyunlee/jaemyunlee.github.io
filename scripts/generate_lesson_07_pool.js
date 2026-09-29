const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-07';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. stop me in
  {
    keyExpression: 'stop me in',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'A friendly stranger had the nerve to [stop me in, throw me out, pick me up, push me away] the grocery store aisle to ask how to cook Napa cabbage.',
        answer: 'stop me in',
        options: ['stop me in', 'throw me out', 'pick me up', 'push me away'],
        korean: '어떤 친절한 낯선 분이 식료품점 통로에서 불쑥 가던 나를 불러세우더니(멈춰 세우더니) 배추를 어떻게 요리하는지 묻더라고요.',
        explanation: '"stop someone in (a place)"는 가던 사람을 특정 장소에서 "불러세우다, 멈춰 세우다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Shoppers often [stop me in the supermarket to ask for recommendations].',
        answer: 'stop me in the supermarket to ask for recommendations',
        tokens: ['stop', 'me', 'in', 'the', 'supermarket', 'to', 'ask', 'for', 'recommendations'],
        options: ['stop', 'me', 'in', 'the', 'supermarket', 'to', 'ask', 'for', 'recommendations'],
        korean: '손님들은 슈퍼마켓에서 종종 가던 나를 불러세워 추천을 물어보곤 해요.',
        explanation: '마트에서 사람을 불러세워 질문하는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A tourist decided to [stop me in, look me up, turn me down, cheer me on] the subway station to ask for directions to the museum.',
        answer: 'stop me in',
        options: ['stop me in', 'look me up', 'turn me down', 'cheer me on'],
        korean: '어떤 관광객이 지하철역에서 가던 나를 멈춰 세우고 박물관 가는 길을 물어보았습니다.',
        explanation: '길을 묻기 위해 길 가던 사람을 불러세우는 흔한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Did someone really [stop you in, lock you in, count you in, drop you in] the hallway just to compliment your handmade wool sweater?',
        answer: 'stop you in',
        options: ['stop you in', 'lock you in', 'count you in', 'drop you in'],
        korean: '누군가 정말 복도에서 가던 너를 멈춰 세우고 네 수제 털스웨터를 칭찬해 주었니?',
        explanation: '복도에서 가던 사람을 멈추고 말을 건네는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Reporters attempted to [stop the mayor in, drop the mayor in, push the mayor in, call the mayor in] the lobby for a quick statement on city taxes.',
        answer: 'stop the mayor in',
        options: ['stop the mayor in', 'drop the mayor in', 'push the mayor in', 'call the mayor in'],
        korean: '기자들은 시세에 관한 짧은 발언을 듣기 위해 로비에서 가던 시장을 불러세우려고 시도했습니다.',
        explanation: '취재를 위해 인물을 불러세우는 표현입니다.'
      }
    ]
  },

  // 2. random
  {
    keyExpression: 'random',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Getting asked about Korean culinary recipes while standing in the bakery line felt completely [random, punctual, official, logical] to me.',
        answer: 'random',
        options: ['random', 'punctual', 'official', 'logical'],
        korean: '빵집 줄에 서 있는 동안 한국 요리 레시피에 대한 질문을 받은 것은 나에게 정말 뜬금없고 생뚱맞게 느껴졌어요.',
        explanation: '"random"은 맥락에 맞지 않고 "뜬금없는, 뜻밖의, 무작위의"라는 일상적인 구어 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He asked such [a totally random question out of nowhere].',
        answer: 'a totally random question out of nowhere',
        tokens: ['a', 'totally', 'random', 'question', 'out', 'of', 'nowhere'],
        options: ['a', 'totally', 'random', 'question', 'out', 'of', 'nowhere'],
        korean: '그는 난데없이 너무나 뜬금없는 질문을 던졌어요.',
        explanation: '맥락 없이 튀어나온 엉뚱한 질문을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I received a message from a [random, formal, identical, mutual] phone number claiming I won an international sweepstakes.',
        answer: 'random',
        options: ['random', 'formal', 'identical', 'mutual'],
        korean: '내가 해외 경품 추첨에 당첨되었다고 주장하는 생뚱맞은 낯선 전화번호로부터 메시지를 받았습니다.',
        explanation: '모르는 무작위의 번호를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We took a [random, deliberate, planned, calculated] scenic road trip on Saturday without consulting any online map beforehand.',
        answer: 'random',
        options: ['random', 'deliberate', 'planned', 'calculated'],
        korean: '우리는 토요일에 미리 온라인 지도를 확인하지도 않고 발길 닿는 대로 즉흥적인 드라이브를 떠났어요.',
        explanation: '계획 없이 마음 내키는 대로 떠나는 드라이브입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Finding an old vintage cassette tape under the car seat was such a [random, scheduled, routine, orderly] discovery.',
        answer: 'random',
        options: ['random', 'scheduled', 'routine', 'orderly'],
        korean: '차 시트 밑에서 오래된 빈티지 카세트테이프를 발견한 것은 참 뜻밖이고 생뚱맞은 발견이었어요.',
        explanation: '예상치 못한 뜻밖의 발견입니다.'
      }
    ]
  },

  // 3. standpoint
  {
    keyExpression: 'standpoint',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'From an authentic cultural [standpoint, boundary, destination, foundation], fermenting kimchi with seafood enhances its umami depth.',
        answer: 'standpoint',
        options: ['standpoint', 'boundary', 'destination', 'foundation'],
        korean: '전통적인 문화적 관점(입장)에서 볼 때 해산물과 함께 김치를 발효시키는 것은 감칠맛의 깊이를 더해줍니다.',
        explanation: '"standpoint"는 판단이나 주장의 근거가 되는 "관점, 입장, 견지"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'From a financial [standpoint, cooking at home saves tremendous money].',
        answer: 'standpoint, cooking at home saves tremendous money',
        tokens: ['standpoint,', 'cooking', 'at', 'home', 'saves', 'tremendous', 'money'],
        options: ['standpoint,', 'cooking', 'at', 'home', 'saves', 'tremendous', 'money'],
        korean: '재정적인 관점에서 집에서 요리해 먹는 것은 엄청난 돈을 절약해 줍니다.',
        explanation: '경제적인 입장에서 바라본 평가입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Looking at urban zoning from an ecological [standpoint, footprint, playground, headline], city parks provide crucial wildlife corridors.',
        answer: 'standpoint',
        options: ['standpoint', 'footprint', 'playground', 'headline'],
        korean: '생태학적 관점에서 도시 구역 설계를 살펴보면, 도시 공원은 야생동물에게 매우 중요한 이동 통로를 제공합니다.',
        explanation: '생태학적 견해를 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'From a consumer\'s [standpoint, passport, warranty, trademark], clear nutritional labeling on grocery packaging is indispensable.',
        answer: 'standpoint',
        options: ['standpoint', 'passport', 'warranty', 'trademark'],
        korean: '소비자의 입장에서 볼 때 식품 포장지의 명확한 영양 성분 표시는 필수적입니다.',
        explanation: '소비자의 입장을 대변하는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His scientific critique was made purely from a pedagogical [standpoint, territory, atmosphere, dimension] to help students learn better.',
        answer: 'standpoint',
        options: ['standpoint', 'territory', 'atmosphere', 'dimension'],
        korean: '그의 과학적 비평은 학생들이 더 잘 배울 수 있도록 돕기 위해 순전히 교육적 관점에서 이루어졌습니다.',
        explanation: '교육적 측면에서의 판단입니다.'
      }
    ]
  },

  // 4. fermented
  {
    keyExpression: 'fermented',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Traditional Korean kimchi is naturally [fermented, dehydrated, evaporated, incinerated] with garlic, ginger, and chili flakes.',
        answer: 'fermented',
        options: ['fermented', 'dehydrated', 'evaporated', 'incinerated'],
        korean: '전통 한국 김치는 마늘, 생강, 고춧가루와 함께 자연적으로 발효됩니다.',
        explanation: '"fermented"는 미생물의 작용으로 "발효된"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Eating naturally [fermented foods promotes excellent gut microbiome health].',
        answer: 'fermented foods promotes excellent gut microbiome health',
        tokens: ['fermented', 'foods', 'promotes', 'excellent', 'gut', 'microbiome', 'health'],
        options: ['fermented', 'foods', 'promotes', 'excellent', 'gut', 'microbiome', 'health'],
        korean: '자연 발효 식품을 섭취하는 것은 훌륭한 장내 미생물 건강을 촉진합니다.',
        explanation: '발효 식품의 건강상 이점입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Sourdough bread gets its distinct tangy flavor and chewy texture from slowly [fermented, frozen, burned, powdered] dough.',
        answer: 'fermented',
        options: ['fermented', 'frozen', 'burned', 'powdered'],
        korean: '사워도우 빵은 천천히 발효된 반죽에서 특유의 톡 쏘는 풍미와 쫄깃한 식감을 얻습니다.',
        explanation: '발효 반죽의 특징입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Sauerkraut is German thinly sliced cabbage that has been salted and [fermented, boiled, fried, melted] in jars.',
        answer: 'fermented',
        options: ['fermented', 'boiled', 'fried', 'melted'],
        korean: '자우어크라우트는 소금에 절여 병 속에서 발효시킨 독일식 얇게 썬 양배추 요리입니다.',
        explanation: '독일의 대표적 발효 음식 설명입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Miso soup is made from a rich paste of [fermented, bleached, filtered, artificial] soybeans and koji rice.',
        answer: 'fermented',
        options: ['fermented', 'bleached', 'filtered', 'artificial'],
        korean: '미소 된장국은 발효된 대두와 누룩 쌀로 만든 진한 장으로 끓여집니다.',
        explanation: '발효된 콩으로 만든 장입니다.'
      }
    ]
  },

  // 5. used to
  {
    keyExpression: 'used to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'When Kelly lived in Seoul, she [used to, forgot to, refused to, hesitated to] visit that famous hole-in-the-wall Kimchi Jjigae eatery every week.',
        answer: 'used to',
        options: ['used to', 'forgot to', 'refused to', 'hesitated to'],
        korean: '켈리는 서울에 살았을 때 매주 그 유명하고 허름한 김치찌개 맛집을 찾곤 했었어요.',
        explanation: '"used to (동사원형)"는 과거에 지속적으로 "하곤 했다"라는 과거의 습관을 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'My coworkers and I [used to eat lunch together every Friday].',
        answer: 'used to eat lunch together every Friday',
        tokens: ['used', 'to', 'eat', 'lunch', 'together', 'every', 'Friday'],
        options: ['used', 'to', 'eat', 'lunch', 'together', 'every', 'Friday'],
        korean: '직장 동료들과 나는 매주 금요일마다 함께 점심을 먹곤 했어요.',
        explanation: '과거의 규칙적인 식사 습관입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Our family [used to, was used for, grew into, took over] spend every summer holiday at the cabin before we moved out of state.',
        answer: 'used to',
        options: ['used to', 'was used for', 'grow into', 'took over'],
        korean: '우리가 다른 주로 이사하기 전에는 온 가족이 매년 여름휴가를 오두막에서 보내곤 했습니다.',
        explanation: '과거의 정기적인 휴가 추억입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Grandpa [used to, had to, got to, ought to] tell us fascinating bedtime stories about growing up on a vintage orchard farm.',
        answer: 'used to',
        options: ['used to', 'had to', 'got to', 'ought to'],
        korean: '할아버지께서는 시골 과수원 농장에서 자라던 시절의 흥미진진한 옛날이야기를 우리에게 들려주시곤 했어요.',
        explanation: '할아버지의 옛날이야기 습관입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [used to, tended for, aimed at, drove to] drink black coffee, but lately I prefer aromatic green tea in the morning.',
        answer: 'used to',
        options: ['used to', 'tended for', 'aimed at', 'drove to'],
        korean: '예전에는 블랙커피를 마시곤 했지만, 요즘에는 아침에 향긋한 녹차를 더 좋아해요.',
        explanation: '과거와 현재의 기호 변화를 비교합니다.'
      }
    ]
  },

  // 6. every other week
  {
    keyExpression: 'every other week',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Our office study group gathers [every other week, every single day, once a century, twice a minute] on Thursday to practice spoken English.',
        answer: 'every other week',
        options: ['every other week', 'every single day', 'once a century', 'twice a minute'],
        korean: '우리 사무실 스터디 그룹은 영어 회화를 연습하기 위해 격주로(2주에 한 번씩) 목요일마다 모입니다.',
        explanation: '"every other week"는 "격주로, 2주에 한 번꼴로"라는 빈도 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We visit the wholesale supermarket [every other week to stock up on groceries].',
        answer: 'every other week to stock up on groceries',
        tokens: ['every', 'other', 'week', 'to', 'stock', 'up', 'on', 'groceries'],
        options: ['every', 'other', 'week', 'to', 'stock', 'up', 'on', 'groceries'],
        korean: '우리는 식료품을 쟁여두기 위해 격주로 대형 창고형 마트를 방문해요.',
        explanation: '2주에 한 번 장을 보는 주기입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The mobile library bus stops at our rural village [every other week, on thin ice, out of date, by a hair] on Wednesday morning.',
        answer: 'every other week',
        options: ['every other week', 'on thin ice', 'out of date', 'by a hair'],
        korean: '이동식 도서관 버스는 격주 수요일 아침마다 우리 시골 마을에 정차합니다.',
        explanation: '순회 도서관의 격주 운행 일정입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Residential recycling collection occurs [every other week, without a hitch, off the record, behind the back], alternating with trash pickup.',
        answer: 'every other week',
        options: ['every other week', 'without a hitch', 'off the record', 'behind the back'],
        korean: '주택가 재활용 쓰레기 수거는 일반 쓰레기 수거와 번갈아 가며 격주로 진행됩니다.',
        explanation: '격주 수거 시스템을 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She schedules a physical therapy massage [every other week, out of nowhere, at first glance, in cold blood] to relieve chronic neck pain.',
        answer: 'every other week',
        options: ['every other week', 'out of nowhere', 'at first glance', 'in cold blood'],
        korean: '그녀는 만성 목 통증을 완화하기 위해 격주로 물리치료 마사지를 예약합니다.',
        explanation: '격주 치료 일정입니다.'
      }
    ]
  },

  // 7. there were ever times where
  {
    keyExpression: 'there were ever times where',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'If [there were ever times where, there were never days when, there were no places that, there were few reasons why] no one was available to join her, Kelly went to the restaurant alone.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were never days when', 'there were no places that', 'there were few reasons why'],
        korean: '혹시라도 아무도 같이 갈 수 없었던 적이 있으면, 켈리는 혼자서라도 그 식당에 갔어요.',
        explanation: '"there were ever times where ~"는 "혹시라도 ~했던 적/경우가 있으면"이라는 회상 및 조건 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'If [there were ever times where you needed help], I was always there.',
        answer: 'there were ever times where you needed help',
        tokens: ['there', 'were', 'ever', 'times', 'where', 'you', 'needed', 'help'],
        options: ['there', 'were', 'ever', 'times', 'where', 'you', 'needed', 'help'],
        korean: '혹시라도 네가 도움이 필요했던 적이 있었다면, 난 언제나 곁에 있었어.',
        explanation: '과거에 도움이 필요했던 상황들을 포괄하는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whenever [there were ever times where, there were strictly rules that, there were zero doubts how, there were all cases if] budget deficits arose, the committee reviewed travel expenses.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were strictly rules that', 'there were zero doubts how', 'there were all cases if'],
        korean: '예산 적자가 발생했던 적이 있을 때마다 위원회는 출장비를 재검토했습니다.',
        explanation: '특정 상황이 발생했을 때의 대처를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I wondered whether [there were ever times where, there were clear skies that, there were heavy trucks why, there were loud bells how] the ancient lighthouse keeper felt truly lonely.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were clear skies that', 'there were heavy trucks why', 'there were loud bells how'],
        korean: '그 옛날 등대지기가 진정으로 외로움을 느꼈던 적이 있었을까 나는 궁금했어요.',
        explanation: '과거에 그런 순간이 존재했는지에 대한 사색입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'During winter blizzards, [there were ever times where, there were warm springs that, there were sunny rays which, there were loud sirens how] roads remained blocked for three days.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were warm springs that', 'there were sunny rays which', 'there were loud sirens how'],
        korean: '겨울 눈보라 동안에는 도로가 사흘 동안 막혀 있었던 적도 있었어요.',
        explanation: '과거의 심각했던 고립 사례를 회상합니다.'
      }
    ]
  },

  // 8. got stared at
  {
    keyExpression: 'got stared at',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Walking into a rural traditional restaurant as a group of tall foreigners, we naturally [got stared at, got thrown out, got cheered on, got paid off] with curious eyes.',
        answer: 'got stared at',
        options: ['got stared at', 'got thrown out', 'got cheered on', 'got paid off'],
        korean: '키 큰 외국인 무리로 시골 전통 식당에 들어서자, 우리는 자연스럽게 호기심 어린 시선으로 사람들에게 빤히 쳐다봄을 당했어요(시선 집중을 받았어요).',
        explanation: '"get stared at"는 다른 사람들에게 "빤히 쳐다봄을 당하다, 시선 집중을 받다"라는 수동 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She [got stared at because of her colorful retro hat].',
        answer: 'got stared at because of her colorful retro hat',
        tokens: ['got', 'stared', 'at', 'because', 'of', 'her', 'colorful', 'retro', 'hat'],
        options: ['got', 'stared', 'at', 'because', 'of', 'her', 'colorful', 'retro', 'hat'],
        korean: '그녀는 화려한 복고풍 모자 때문에 사람들의 시선을 한 몸에 받았어요.',
        explanation: '눈에 띄는 패션으로 시선을 받는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When my twin brother and I wore identical neon jumpsuits to the mall, we definitely [got stared at, got forgotten, got dismissed, got arrested] by shoppers.',
        answer: 'got stared at',
        options: ['got stared at', 'got forgotten', 'got dismissed', 'got arrested'],
        korean: '쌍둥이 동생과 내가 쇼핑몰에 똑같은 네온 점프수트를 입고 갔을 때 쇼핑객들에게 확실히 시선 집중을 받았습니다.',
        explanation: '독특한 복장으로 사람들의 쳐다봄을 당하는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Nobody likes to [get stared at, get cheered up, get well soon, get along with] when they accidentally drop their cafeteria tray.',
        answer: 'get stared at',
        options: ['get stared at', 'get cheered up', 'get well soon', 'get along with'],
        korean: '실수로 구내식당 쟁반을 떨어뜨렸을 때 모든 사람이 빤히 쳐다보는 것을 좋아하는 사람은 아무도 없어요.',
        explanation: '당황스러운 순간 사람들의 시선이 쏠리는 불쾌함입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Traveling off the beaten tourist path meant we occasionally [got stared at, got carried away, got into trouble, got off the hook] in small mountain villages.',
        answer: 'got stared at',
        options: ['got stared at', 'got carried away', 'got into trouble', 'got off the hook'],
        korean: '관광 코스를 벗어나 여행한다는 것은 시골 산골 마을에서 때때로 호기심 어린 시선 집중을 받는 것을 의미했습니다.',
        explanation: '외국인이 드문 오지에서의 시선 집중입니다.'
      }
    ]
  },

  // 9. at least
  {
    keyExpression: 'at least',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Even if the spicy stew didn\'t turn out completely authentic, [at least, at best, at random, at large] you tried your hardest to cook it for dinner.',
        answer: 'at least',
        options: ['at least', 'at best', 'at random', 'at large'],
        korean: '비록 매운 찌개가 완벽하게 원조 맛으로 나오진 않았더라도, 적어도 당신이 저녁으로 끓여주려고 최선을 다했다는 점만으로도 좋아요.',
        explanation: '"at least"는 "적어도, 최소한"이라는 뜻으로 아쉬움 속에서 긍정적인 면을 짚을 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'It was raining hard, but [at least we had warm rain jackets].',
        answer: 'at least we had warm rain jackets',
        tokens: ['at', 'least', 'we', 'had', 'warm', 'rain', 'jackets'],
        options: ['at', 'least', 'we', 'had', 'warm', 'rain', 'jackets'],
        korean: '비가 억수같이 쏟아졌지만, 적어도 우리에겐 따뜻한 우비가 있었어요.',
        explanation: '악조건 속에서도 최소한의 위안이 된 요소를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You should spend [at least, at most, at bay, at sea] twenty minutes reviewing new vocabulary cards before going to bed.',
        answer: 'at least',
        options: ['at least', 'at most', 'at bay', 'at sea'],
        korean: '잠자리에 들기 전 적어도 20분은 새로운 어휘 카드를 복습하는 데 시간을 써야 합니다.',
        explanation: '최소한의 소요 시간을 권장합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The flight was delayed three hours, but [at least, at sight, at heart, at odds] the airline provided complimentary lunch vouchers.',
        answer: 'at least',
        options: ['at least', 'at sight', 'at heart', 'at odds'],
        korean: '비행기가 3시간 지연되었지만, 적어도 항공사에서 무료 점심 식사권을 제공해 주었습니다.',
        explanation: '불편 속의 최소한의 보상입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Although our proposal wasn\'t selected, [at least, at risk, at peace, at dawn] the panel provided constructive feedback for next time.',
        answer: 'at least',
        options: ['at least', 'at risk', 'at peace', 'at dawn'],
        korean: '비록 우리 제안서가 채택되지는 않았지만, 적어도 심사위원단이 다음을 위한 건설적인 피드백을 제공해 주었습니다.',
        explanation: '결과의 아쉬움 속에서 얻은 배움입니다.'
      }
    ]
  },

  // 10. encouraged
  {
    keyExpression: 'encouraged',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Giving Jaemyun a perfect ten-out-of-ten review on his very first Kimchi Jjigae definitely [encouraged, discouraged, intimidated, prohibited] him to keep experimenting in the kitchen.',
        answer: 'encouraged',
        options: ['encouraged', 'discouraged', 'intimidated', 'prohibited'],
        korean: '남편 재면의 맨 첫 번째 김치찌개에 10점 만점을 주었던 것이 확실히 그가 주방에서 계속 요리 실험을 하도록 부추기고(격려하고) 말았어요.',
        explanation: '"encourage"는 상대방의 행동을 "부추기다, 용기를 북돋우다, 격려하다"라는 뜻입니다 (과거형: encouraged).'
      },
      {
        type: 'drag-and-drop',
        english: 'Her enthusiastic praise [encouraged him to cook more often].',
        answer: 'encouraged him to cook more often',
        tokens: ['encouraged', 'him', 'to', 'cook', 'more', 'often'],
        options: ['encouraged', 'him', 'to', 'cook', 'more', 'often'],
        korean: '그녀의 열렬한 칭찬은 그가 더 자주 요리하도록 용기를 북돋아 주었습니다.',
        explanation: '칭찬이 더 많은 요리 시도를 부추긴 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The mentor warmly [encouraged, scolded, doubted, silenced] the young writer to submit her short story to the national literary competition.',
        answer: 'encouraged',
        options: ['encouraged', 'scolded', 'doubted', 'silenced'],
        korean: '멘토는 젊은 작가에게 전국 문학 공모전에 단편 소설을 출품해 보라고 따뜻하게 격려했습니다.',
        explanation: '도전을 독려하고 격려하는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Flexible working hours strongly [encouraged, pressured, forbade, prevented] employee creativity and work-life balance.',
        answer: 'encouraged',
        options: ['encouraged', 'pressured', 'forbade', 'prevented'],
        korean: '유연근무제는 직원들의 창의성과 일과 삶의 균형을 강력하게 북돋워 주었습니다.',
        explanation: '제도가 긍정적 효과를 장려함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Hearing loud cheers from the spectators [encouraged, tired, stopped, misled] the exhausted marathoner during the final mile.',
        answer: 'encouraged',
        options: ['encouraged', 'tired', 'stopped', 'misled'],
        korean: '관중들의 큰 환호성을 들은 것은 지친 마라토너가 마지막 1마일을 달리는 데 큰 힘을 북돋아 주었습니다.',
        explanation: '응원이 주는 힘과 격려입니다.'
      }
    ]
  },

  // 11. have lived up to
  {
    keyExpression: 'have lived up to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'He tried cooking Kimchi Jjigae several times since, but none of the later batches [have lived up to, have given birth to, have turned blind to, have run out of] that legendary first pot.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have given birth to', 'have turned blind to', 'have run out of'],
        korean: '그 이후로 그가 김치찌개를 여러 번 끓여보았지만, 그 어떤 후속작도 그 전설적인 첫 번째 냄비의 기대치에는 전혀 미치지 못했어요.',
        explanation: '"live up to ~"는 기대나 기준에 "부응하다, 미치다"라는 뜻입니다 (현재완료: have lived up to).'
      },
      {
        type: 'drag-and-drop',
        english: 'None of the sequels [have lived up to the original movie].',
        answer: 'have lived up to the original movie',
        tokens: ['have', 'lived', 'up', 'to', 'the', 'original', 'movie'],
        options: ['have', 'lived', 'up', 'to', 'the', 'original', 'movie'],
        korean: '그 어떤 속편도 원작 영화의 기대치에는 미치지 못했습니다.',
        explanation: '원작의 명성에 미치지 못하는 속편들을 비유합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Few modern smartphone cameras [have lived up to, have backed down from, have fallen through with, have broken down to] the excessive advertising hype.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have backed down from', 'have fallen through with', 'have broken down to'],
        korean: '과도한 광고 홍보의 기대치에 제대로 부응한 현대 스마트폰 카메라는 거의 없었습니다.',
        explanation: '광고의 기대치에 부응하지 못함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her stellar performance throughout the tournament proved that she [has lived up to, has given up on, has looked down on, has turned away from] the coach\'s high expectations.',
        answer: 'has lived up to',
        options: ['has lived up to', 'has given up on', 'has looked down on', 'has turned away from'],
        korean: '대회 내내 보여준 그녀의 뛰어난 활약은 그녀가 코치의 높은 기대에 훌륭하게 부응했음을 입증했습니다.',
        explanation: '기대에 부응하여 성과를 낸 경우입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The scenic cliffside resort was so breathtaking that it [has lived up to, has fallen behind, has cut corners, has run short of] its glowing five-star reputation.',
        answer: 'has lived up to',
        options: ['has lived up to', 'has fallen behind', 'has cut corners', 'has run short of'],
        korean: '그 아름다운 절벽 리조트는 너무나 환상적이어서 찬란한 5성급 명성에 온전히 부응했습니다.',
        explanation: '명성에 걸맞은 훌륭한 품질입니다.'
      }
    ]
  },

  // 12. was introduced to
  {
    keyExpression: 'was introduced to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Kelly [was introduced to, was accused of, was deprived of, was disposed of] the hidden alleyway Kimchi Jjigae spot by her friendly coworkers in Seoul.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was accused of', 'was deprived of', 'was disposed of'],
        korean: '켈리는 서울에서 다정한 직장 동료들의 소개로 그 골목길 숨은 김치찌개 맛집을 소개받아 처음 알게 되었어요.',
        explanation: '"be introduced to ~"는 누군가의 소개로 사람이나 사물을 "소개받다, 처음 접하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I [was introduced to Korean barbecue by my university roommate].',
        answer: 'was introduced to Korean barbecue by my university roommate',
        tokens: ['was', 'introduced', 'to', 'Korean', 'barbecue', 'by', 'my', 'university', 'roommate'],
        options: ['was', 'introduced', 'to', 'Korean', 'barbecue', 'by', 'my', 'university', 'roommate'],
        korean: '나는 대학교 룸메이트의 소개로 한국식 바비큐를 처음 접하게 되었어요.',
        explanation: '친구를 통해 새로운 음식을 접한 계기입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'During his stay in Kyoto, he [was introduced to, was relieved of, was caught up in, was stripped of] the intricate art of traditional tea ceremony.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was relieved of', 'was caught up in', 'was stripped of'],
        korean: '교토에 머무는 동안 그는 전통 다도의 정교한 예술을 처음으로 접하고 배우게 되었습니다.',
        explanation: '새로운 전통문화를 접하게 된 경험입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She [was introduced to, was tired of, was guilty of, was fearful of] classic jazz records by her grandfather when she was just eight years old.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was tired of', 'was guilty of', 'was fearful of'],
        korean: '그녀는 겨우 여덟 살 때 할아버지의 소개로 클래식 재즈 음반들을 처음 접하게 되었습니다.',
        explanation: '가족을 통해 음악에 입문한 계기입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'New team recruits [were introduced to, were cleared of, were kept out of, were taken for] the project management software during orientation.',
        answer: 'were introduced to',
        options: ['were introduced to', 'were cleared of', 'were kept out of', 'were taken for'],
        korean: '신규 입사자들은 오리엔테이션 동안 프로젝트 관리 소프트웨어를 소개받았습니다.',
        explanation: '새로운 업무 툴을 안내받는 상황입니다.'
      }
    ]
  },

  // 13. can't say
  {
    keyExpression: 'can\'t say',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I know I loved the soup, but I honestly [can\'t say, shouldn\'t listen, mustn\'t eat, wouldn\'t doubt] exactly which secret ingredient made it taste so remarkable.',
        answer: "can't say",
        options: ["can't say", "shouldn't listen", "mustn't eat", "wouldn't doubt"],
        korean: '내가 그 찌개를 정말 좋아했다는 건 알지만, 솔직히 어떤 비밀 재료가 그렇게 놀라운 맛을 냈는지는 딱 꼬집어 말할 수가 없어요.',
        explanation: '"can\'t say"는 정확한 이유나 사실을 "딱 잘라 말할 수 없다, 잘 모르겠다"라는 완곡한 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I [can\'t say for sure whether the restaurant is open] today.',
        answer: "can't say for sure whether the restaurant is open",
        tokens: ["can't", 'say', 'for', 'sure', 'whether', 'the', 'restaurant', 'is', 'open'],
        options: ["can't", 'say', 'for', 'sure', 'whether', 'the', 'restaurant', 'is', 'open'],
        korean: '오늘 그 식당이 문을 열었는지 확실하게는 말할 수 없어요.',
        explanation: '"can\'t say for sure"는 확실히 장담할 수 없음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [can\'t say, can\'t hear, can\'t breathe, can\'t swallow] that I enjoyed the horror movie, though the visual effects were impressive.',
        answer: "can't say",
        options: ["can't say", "can't hear", "can't breathe", "can't swallow"],
        korean: '시각 효과는 인상 깊었지만 그 공포 영화를 즐겼다고는 솔직히 말할 수 없네요.',
        explanation: '솔직한 감상평을 완곡하게 전달할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When asked about future stock performance, financial analysts [can\'t say, won\'t watch, shan\'t sleep, shouldn\'t drink] with absolute certainty.',
        answer: "can't say",
        options: ["can't say", "won't watch", "shan't sleep", "shouldn't drink"],
        korean: '미래 주가 변동에 대해 질문을 받았을 때 금융 분석가들도 100% 확신을 가지고 단언할 수는 없습니다.',
        explanation: '예측의 불확실성을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [can\'t say, don\'t touch, won\'t jump, mustn\'t burn] that we were surprised when the championship trophy was awarded to the favorites.',
        answer: "can't say",
        options: ["can't say", "don't touch", "won't jump", "mustn't burn"],
        korean: '우승 트로피가 가장 유력했던 팀에게 돌아갔을 때 우리가 놀랐다고는 말할 수 없었어요(예상했던 일이었죠).',
        explanation: '"can\'t say I was surprised"는 놀랍지 않았다는 관용구입니다.'
      }
    ]
  },

  // 14. supposed to
  {
    keyExpression: 'supposed to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Is authentic Kimchi Jjigae really [supposed to, forced to, liable to, prone to] be thick and stew-like, or lighter like a clear broth?',
        answer: 'supposed to',
        options: ['supposed to', 'forced to', 'liable to', 'prone to'],
        korean: '진짜 원조 김치찌개는 진하고 찌개다워야 하는 게 맞는 건가요(원래 그런 건가요), 아니면 맑은 국물처럼 더 가벼워야 하는 건가요?',
        explanation: '"be supposed to ~"는 원래의 규칙이나 기준에 따라 "~하기로 되어 있다, 원래 ~해야 한다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'You are [supposed to simmer the stew on low heat] for rich flavor.',
        answer: 'supposed to simmer the stew on low heat',
        tokens: ['supposed', 'to', 'simmer', 'the', 'stew', 'on', 'low', 'heat'],
        options: ['supposed', 'to', 'simmer', 'the', 'stew', 'on', 'low', 'heat'],
        korean: '깊은 풍미를 위해서는 약불에서 찌개를 은근히 졸여야 해요.',
        explanation: '요리법의 기본 원칙을 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'What time are the conference keynote speakers [supposed to, likely from, capable in, eager with] take the podium this morning?',
        answer: 'supposed to',
        options: ['supposed to', 'likely from', 'capable in', 'eager with'],
        korean: '오늘 아침 콘퍼런스 기조 연설자분들은 몇 시에 연단에 오르기로 예정되어 있나요?',
        explanation: '공식 일정상 예정된 시간을 묻습니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Children are [supposed to, forced by, gifted with, doomed to] wash their hands thoroughly before sitting down at the dinner table.',
        answer: 'supposed to',
        options: ['supposed to', 'forced by', 'gifted with', 'doomed to'],
        korean: '아이들은 식탁에 앉기 전에 손을 깨끗이 씻어야 마땅합니다.',
        explanation: '지켜야 할 규칙이나 예절입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It was [supposed to, meant by, bound from, proud of] rain heavily today, but the sky remained clear and blue all afternoon.',
        answer: 'supposed to',
        options: ['supposed to', 'meant by', 'bound from', 'proud of'],
        korean: '오늘 비가 많이 내리기로 예보되어 있었는데, 오후 내내 하늘이 맑고 푸르렀어요.',
        explanation: '예보나 예상과 달리 전개된 날씨입니다.'
      }
    ]
  },

  // 15. taste the same
  {
    keyExpression: 'taste the same',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Ever since eating at that memorable Seoul restaurant, other versions of the soup just don\'t [taste the same, sound the alarm, see the point, feel the pinch] to Kelly.',
        answer: 'taste the same',
        options: ['taste the same', 'sound the alarm', 'see the point', 'feel the pinch'],
        korean: '그 기억에 남는 서울 식당에서 먹어본 이후로 다른 김치찌개들은 켈리에게 그냥 예전의 똑같은 그 맛이 나지 않았어요.',
        explanation: '"taste the same"은 음식의 맛이 "똑같은 맛이 나다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Store-bought strawberry jam simply doesn\'t [taste the same as grandma\'s homemade jam].',
        answer: "taste the same as grandma's homemade jam",
        tokens: ['taste', 'the', 'same', 'as', "grandma's", 'homemade', 'jam'],
        options: ['taste', 'the', 'same', 'as', "grandma's", 'homemade', 'jam'],
        korean: '시판 딸기잼은 할머니의 수제 잼과 결코 똑같은 맛이 나지 않아요.',
        explanation: '수제 음식과 시판 음식의 맛의 차이를 비교합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Even if you substitute butter with margarine, the baked cookies will not [taste the same, look the fool, walk the line, pull the plug].',
        answer: 'taste the same',
        options: ['taste the same', 'look the fool', 'walk the line', 'pull the plug'],
        korean: '버터 대신 마가린을 대체해서 넣더라도 구운 쿠키에서 결코 똑같은 맛이 나지는 않을 거예요.',
        explanation: '재료 대체로 인한 풍미 차이입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Coffee brewed with filtered spring water doesn\'t [taste the same, turn the tide, break the code, hold the fort] as tap water coffee.',
        answer: 'taste the same',
        options: ['taste the same', 'turn the tide', 'break the code', 'hold the fort'],
        korean: '정수된 샘물로 내린 커피는 수돗물로 내린 커피와 똑같은 맛이 나지 않습니다.',
        explanation: '물에 따른 커피 맛의 차이입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After changing their recipe last year, the soft drink doesn\'t [taste the same, ring the bell, bear the brunt, hit the nail] to loyal fans.',
        answer: 'taste the same',
        options: ['taste the same', 'ring the bell', 'bear the brunt', 'hit the nail'],
        korean: '작년에 레시피를 바꾼 후 그 탄산음료는 오랜 팬들에게 예전과 똑같은 맛이 나지 않습니다.',
        explanation: '레시피 변경 후 달라진 맛에 대한 팬들의 반응입니다.'
      }
    ]
  },

  // 16. technically
  {
    keyExpression: 'technically',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[Technically, Emotionally, Casually, Hastily], tomatoes are botanically classified as fruits, although we cook them as vegetables.',
        answer: 'Technically',
        options: ['Technically', 'Emotionally', 'Casually', 'Hastily'],
        korean: '엄밀히 따져보면(기술적으로는), 토마토는 채소처럼 요리해 먹지만 식물학적으로는 과일로 분류됩니다.',
        explanation: '"technically"는 규칙이나 사실을 "엄밀히 따지면, 정확히 말하자면"이라는 부사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: '[Technically, was it really that good of a soup]? Maybe not.',
        answer: 'Technically, was it really that good of a soup',
        tokens: ['Technically,', 'was', 'it', 'really', 'that', 'good', 'of', 'a', 'soup'],
        options: ['Technically,', 'was', 'it', 'really', 'that', 'good', 'of', 'a', 'soup'],
        korean: '엄밀히 따져보면 그게 정말 그렇게까지 훌륭한 찌개였을까요? 아마 아닐 수도 있죠.',
        explanation: '객관적으로 엄밀히 재평가해 보는 화법입니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Technically, Clumsily, Blindly, Loudly], the library closes at nine, but staff begin locking exterior gates ten minutes prior.',
        answer: 'Technically',
        options: ['Technically', 'Clumsily', 'Blindly', 'Loudly'],
        korean: '엄밀히 말하면 도서관은 9시에 닫지만, 직원들은 10분 전부터 정문을 잠그기 시작합니다.',
        explanation: '공식 규정과 실제 운영의 미세한 차이를 짚습니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He is [technically, poorly, rarely, faintly] our manager, but he treats everyone on the crew like equal partners.',
        answer: 'technically',
        options: ['technically', 'poorly', 'rarely', 'faintly'],
        korean: '직함상 엄밀히 따지면 그가 우리의 관리자이지만, 그는 팀원 모두를 동등한 파트너처럼 대합니다.',
        explanation: '직함과 실제 태도의 차이입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You can [technically, blindly, bitterly, coldly] hike the trail in running sneakers, but sturdy boots provide much better traction.',
        answer: 'technically',
        options: ['technically', 'blindly', 'bitterly', 'coldly'],
        korean: '엄밀히 따지면 러닝화로도 그 등산로를 걸을 수는 있지만, 튼튼한 등산화가 훨씬 더 좋은 접지력을 제공합니다.',
        explanation: '이론상 가능하지만 권장되지 않는 상황입니다.'
      }
    ]
  },

  // 17. based it off of
  {
    keyExpression: 'based it off of',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Whenever she evaluates a bowl of spicy kimchi soup, Kelly [based it off of, tore it up from, gave it up to, looked it down on] that nostalgic memory from her early Seoul days.',
        answer: 'based it off of',
        options: ['based it off of', 'tore it up from', 'gave it up to', 'looked it down on'],
        korean: '매운 김치찌개 한 그릇을 맛보고 평가할 때마다 켈리는 서울 초기 시절의 그 아련한 추억을 (맛의) 기준으로 삼았어요.',
        explanation: '"base something off of ~"는 무엇을 "~을 바탕으로 삼다, ~을 기준으로 삼다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The screenplay writer [based it off of a true historical event].',
        answer: 'based it off of a true historical event',
        tokens: ['based', 'it', 'off', 'of', 'a', 'true', 'historical', 'event'],
        options: ['based', 'it', 'off', 'of', 'a', 'true', 'historical', 'event'],
        korean: '각본가는 실제 역사적 사건을 바탕으로 그것을 집필했습니다.',
        explanation: '실화를 바탕으로 창작했음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The architect drew the cabin blueprint and [based it off of, broke it away from, washed it out of, held it back from] traditional Scandinavian mountain shelters.',
        answer: 'based it off of',
        options: ['based it off of', 'broke it away from', 'washed it out of', 'held it back from'],
        korean: '건축가는 오두막 청사진을 그릴 때 전통적인 스칸디나비아 산장 양식을 바탕으로 삼았습니다.',
        explanation: '디자인의 기초가 된 원형입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He calculated the quarterly financial budget and [based it off of, turned it into, pulled it down from, ran it over with] last year\'s sales figures.',
        answer: 'based it off of',
        options: ['based it off of', 'turned it into', 'pulled it down from', 'ran it over with'],
        korean: '그는 분기별 재정 예산을 산출할 때 작년 매출 수치를 바탕(기준)으로 삼았습니다.',
        explanation: '통계적 기준 자료를 삼는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We designed the course curriculum and [based it off of, backed it out of, took it apart from, carried it over to] real-world student feedback.',
        answer: 'based it off of',
        options: ['based it off of', 'backed it out of', 'took it apart from', 'carried it over to'],
        korean: '우리는 강의 교육과정을 설계할 때 실제 학생들의 피드백을 바탕으로 구성했습니다.',
        explanation: '사용자 의견을 토대로 개발한 커리큘럼입니다.'
      }
    ]
  },

  // 18. as good as
  {
    keyExpression: 'as good as',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The restaurant was decent, but their Kimchi Jjigae was still not [as good as, as bad as, as tall as, as loud as] the phenomenal one Jaemyun made two months ago.',
        answer: 'as good as',
        options: ['as good as', 'as bad as', 'as tall as', 'as loud as'],
        korean: '그 식당도 괜찮았지만 그들의 김치찌개는 두 달 전 남편 재면이 만들어 주었던 그 환상적인 찌개만큼 맛있지는 여전히 않았어요.',
        explanation: '"as good as ~"는 "~만큼 좋은, ~만큼 훌륭한/맛있는"을 뜻하는 동등 비교 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'This local cafe coffee is [just as good as expensive specialty brew].',
        answer: 'just as good as expensive specialty brew',
        tokens: ['just', 'as', 'good', 'as', 'expensive', 'specialty', 'brew'],
        options: ['just', 'as', 'good', 'as', 'expensive', 'specialty', 'brew'],
        korean: '이 동네 카페 커피는 값비싼 스페셜티 커피만큼이나 훌륭해요.',
        explanation: '저렴한 커피가 고급 커피에 못지않음을 칭찬합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'With modern digital restoration, vintage vinyl records sound almost [as good as, as dark as, as cold as, as far as] live studio master tapes.',
        answer: 'as good as',
        options: ['as good as', 'as dark as', 'as cold as', 'as far as'],
        korean: '현대적인 디지털 복원 기술 덕분에 빈티지 LP 음반 소리는 라이브 스튜디오 마스터 테이프만큼이나 훌륭하게 들립니다.',
        explanation: '음질이 원본에 필적할 만큼 좋음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A home-cooked bowl of chicken noodle soup is [as good as, as dry as, as heavy as, as harsh as] medicine when you have a winter cold.',
        answer: 'as good as',
        options: ['as good as', 'as dry as', 'as heavy as', 'as harsh as'],
        korean: '집에서 끓인 따뜻한 치킨 누들 수프 한 그릇은 겨울 감기에 걸렸을 때 약만큼이나 좋습니다.',
        explanation: '치유 효과가 약에 필적함을 비유합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His word is [as good as, as hard as, as late as, as bitter as] gold, so you can trust his business commitments completely.',
        answer: 'as good as',
        options: ['as good as', 'as hard as', 'as late as', 'as bitter as'],
        korean: '그의 약속은 금만큼이나 확실하고 신뢰할 수 있으니 그의 사업적 약속을 전적으로 신뢰해도 좋습니다.',
        explanation: '"as good as gold"는 매우 신뢰할 수 있음을 뜻하는 관용구입니다.'
      }
    ]
  },

  // 19. turn out
  {
    keyExpression: 'turn out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The problem with cooking without measuring cups is that you never know how the recipe is going to [turn out, back down, blow away, fall off] in the end.',
        answer: 'turn out',
        options: ['turn out', 'back down', 'blow away', 'fall off'],
        korean: '계량컵 없이 요리할 때의 문제는 최종적으로 요리 결과가 어떻게 나올지 결코 알 수 없다는 점이에요.',
        explanation: '"turn out"은 결과나 상태가 최종적으로 "어떻게 되다, 결과가 나오다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We followed the instructions, and [the chocolate cake turned out wonderfully moist].',
        answer: 'the chocolate cake turned out wonderfully moist',
        tokens: ['the', 'chocolate', 'cake', 'turned', 'out', 'wonderfully', 'moist'],
        options: ['the', 'chocolate', 'cake', 'turned', 'out', 'wonderfully', 'moist'],
        korean: '우리가 레시피 설명대로 따랐더니 초콜릿 케이크가 놀라울 정도로 촉촉하게 완성되었어요.',
        explanation: '요리 결과물이 훌륭하게 완성된 결말입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We worried about heavy rain ruining the garden party, but everything [turned out, broke out, faded out, passed out] beautifully.',
        answer: 'turned out',
        options: ['turned out', 'broke out', 'faded out', 'passed out'],
        korean: '폭우가 가든파티를 망칠까 봐 걱정했지만 모든 것이 아름답게 잘 풀렸어요.',
        explanation: '결과가 긍정적으로 잘 마무리된 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'No matter how the election [turns out, burns down, cuts off, falls through], the community must stay united.',
        answer: 'turns out',
        options: ['turns out', 'burns down', 'cuts off', 'falls through'],
        korean: '선거 결과가 어떻게 나오든 간에 우리 지역사회는 단합을 유지해야 합니다.',
        explanation: '결과의 향방을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I was hesitant about taking the ceramics class, but it [turned out, held up, backed off, gave in] to be the most relaxing hobby.',
        answer: 'turned out',
        options: ['turned out', 'held up', 'backed off', 'gave in'],
        korean: '도예 수업을 듣는 것이 망설여졌지만, 알고 보니 가장 마음을 편안하게 해주는 취미가 되었어요.',
        explanation: '경험 후 알게 된 뜻밖의 만족감입니다.'
      }
    ]
  },

  // 20. Whereas
  {
    keyExpression: 'Whereas',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Recent batches of Kimchi Jjigae tasted quite greasy, [whereas, therefore, otherwise, despite] that first one Kelly loved had no heavy oiliness at all.',
        answer: 'whereas',
        options: ['whereas', 'therefore', 'otherwise', 'despite'],
        korean: '최근 끓인 김치찌개들은 꽤 기름지게 느껴졌던 반면에, 켈리가 너무나 좋아했던 그 첫 번째 찌개에는 그런 텁텁한 기름기가 전혀 없었어요.',
        explanation: '"whereas"는 두 가지 사실을 대조하여 "반면에, ~임에 반하여"를 뜻하는 핵심 접속사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He prefers spicy food, [whereas his sister likes mild flavors].',
        answer: 'whereas his sister likes mild flavors',
        tokens: ['whereas', 'his', 'sister', 'likes', 'mild', 'flavors'],
        options: ['whereas', 'his', 'sister', 'likes', 'mild', 'flavors'],
        korean: '그는 매운 음식을 좋아하는 반면에, 그의 여동생은 순한 맛을 좋아합니다.',
        explanation: '상반된 음식 취향을 대조하는 문장입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Some people prefer living in bustling metropolitan cities, [whereas, furthermore, besides, moreover] others thrive in quiet rural cabins.',
        answer: 'whereas',
        options: ['whereas', 'furthermore', 'besides', 'moreover'],
        korean: '어떤 사람들은 번화한 대도시에서 사는 것을 선호하는 반면에, 다른 사람들은 조용한 시골 오두막에서 행복을 느낍니다.',
        explanation: '라이프스타일의 극명한 대조입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The morning hike was brisk and chilly, [whereas, consequently, likewise, identically] the afternoon walk turned humid and hot.',
        answer: 'whereas',
        options: ['whereas', 'consequently', 'likewise', 'identically'],
        korean: '아침 하이킹은 상쾌하고 쌀쌀했던 반면에, 오후 산책은 습하고 더워졌습니다.',
        explanation: '시간대에 따른 날씨 대조입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her first novel was a gritty psychological thriller, [whereas, hence, thus, similarly] her second book was a whimsical fantasy.',
        answer: 'whereas',
        options: ['whereas', 'hence', 'thus', 'similarly'],
        korean: '그녀의 첫 번째 소설은 어두운 심리 스릴러였던 반면에, 두 번째 책은 기발한 판타지였습니다.',
        explanation: '두 작품 간 장르적 대조입니다.'
      }
    ]
  },

  // 21. oilier to
  {
    keyExpression: 'oilier to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Adding extra pork belly made the stew taste noticeably [oilier to, drier to, colder to, firmer to] Kelly\'s palate than before.',
        answer: 'oilier to',
        options: ['oilier to', 'drier to', 'colder to', 'firmer to'],
        korean: '삼겹살을 추가로 더 넣었더니 찌개가 예전보다 켈리의 입맛에 확연히 더 기름지게(느끼하게) 느껴졌어요.',
        explanation: '"oilier to ~"는 기름기가 더 많아 누구에게 "~에게 더 기름지게/느끼하게 느껴지는"이라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'This soup feels [much oilier to me than the last bowl].',
        answer: 'much oilier to me than the last bowl',
        tokens: ['much', 'oilier', 'to', 'me', 'than', 'the', 'last', 'bowl'],
        options: ['much', 'oilier', 'to', 'me', 'than', 'the', 'last', 'bowl'],
        korean: '이 찌개는 지난번 그릇보다 나에게 훨씬 더 기름지게 느껴져요.',
        explanation: '개인적 미각으로 느끼는 기름진 정도의 비교입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Deep-fried dumplings often taste [oilier to, sweeter to, cooler to, calmer to] customers if the frying oil temperature is too low.',
        answer: 'oilier to',
        options: ['oilier to', 'sweeter to', 'cooler to', 'calmer to'],
        korean: '튀김 기름 온도가 너무 낮으면 군만두가 손님들에게 더 기름지게 느껴지곤 합니다.',
        explanation: '튀김 요리의 기름진 식감 설명입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The heavy cream sauce felt [oilier to, fresher to, greener to, lighter to] her digestive system after the long workout.',
        answer: 'oilier to',
        options: ['oilier to', 'fresher to', 'greener to', 'lighter to'],
        korean: '진한 크림소스는 긴 운동 후 그녀의 소화기관에 더부룩하고 기름지게 느껴졌습니다.',
        explanation: '위에 부담을 주는 기름진 느낌입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Skimming the floating fat off the simmering broth makes it taste far less [oilier to, hotter to, saltier to, sourer to] dinner guests.',
        answer: 'oilier to',
        options: ['oilier to', 'hotter to', 'saltier to', 'sourer to'],
        korean: '끓는 육수 위에 뜬 기름을 걷어내면 저녁 식사 손님들에게 훨씬 덜 기름지게 느껴집니다.',
        explanation: '기름기를 걷어내어 담백하게 만드는 조리법입니다.'
      }
    ]
  },

  // 22. break from
  {
    keyExpression: 'break from',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'After eating stew for four nights in a row, Kelly suggested taking a two-month [break from, fight with, step into, look at] Kimchi Jjigae so Jaemyun could reset his recipe.',
        answer: 'break from',
        options: ['break from', 'fight with', 'step into', 'look at'],
        korean: '나흘 밤 연속으로 찌개를 먹은 뒤, 켈리는 남편 재면이 레시피를 재정비할 수 있도록 김치찌개는 두 달 동안 잠시 휴식기를 갖자고 제안했어요.',
        explanation: '"take a break from ~"는 특정 활동이나 음식 등으로부터 "잠시 휴식기를 갖다, 잠시 쉬다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Let\'s take a short [break from cooking and order takeout tonight].',
        answer: 'break from cooking and order takeout tonight',
        tokens: ['break', 'from', 'cooking', 'and', 'order', 'takeout', 'tonight'],
        options: ['break', 'from', 'cooking', 'and', 'order', 'takeout', 'tonight'],
        korean: '오늘 밤엔 요리로부터 잠시 쉬어가며 배달 음식을 시켜 먹자.',
        explanation: '요리를 하루 쉬고 배달 음식을 먹자는 제안입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After months of grueling computer screen time, she took a weekend [break from, jump into, march toward, look into] all social media and smartphones.',
        answer: 'break from',
        options: ['break from', 'jump into', 'march toward', 'look into'],
        korean: '컴퓨터 화면을 보며 보낸 몇 달간의 고된 시간 끝에 그녀는 주말 동안 모든 소셜 미디어와 스마트폰으로부터 잠시 휴식기를 가졌습니다.',
        explanation: '디지털 디톡스 휴식입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A brief ten-minute [break from, rush into, dive under, fall behind] intense study helps restore mental concentration.',
        answer: 'break from',
        options: ['break from', 'rush into', 'dive under', 'fall behind'],
        korean: '집중적인 공부로부터의 짧은 10분간의 휴식은 정신적 집중력을 되찾는 데 큰 도움이 됩니다.',
        explanation: '학습 중 짧은 재충전 휴식입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The band decided to take a year-long [break from, climb up, push toward, fall down] touring to spend precious time with their families.',
        answer: 'break from',
        options: ['break from', 'climb up', 'push toward', 'fall down'],
        korean: '그 밴드는 가족들과 소중한 시간을 보내기 위해 투어 공연으로부터 1년간의 휴식기를 갖기로 결정했습니다.',
        explanation: '활동을 잠시 중단하고 쉬는 기간입니다.'
      }
    ]
  }
];

// Write quiz-pool.json
const poolPath = path.join(LESSON_DIR, 'quiz-pool.json');
fs.writeFileSync(poolPath, JSON.stringify(POOL, null, 2), 'utf8');
console.log(`[Success] Written: ${poolPath} (${POOL.length} expressions, ${POOL.length * 5} sentences)`);

// Write quiz.md using the 1st sentence of each pool entry
let md = `# Lesson 7: Costco Kimchi & Kelly's Kimchi Jjigae Review Quizzes\n\n`;
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
