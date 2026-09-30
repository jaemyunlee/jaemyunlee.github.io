const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-07';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. stop me in
  {
    keyExpression: 'stop me in',
    baseForm: 'stop me in',
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
        english: 'Shoppers often [stop me in the supermarket to ask for recommendations] on fresh fruit.',
        answer: 'stop me in the supermarket to ask for recommendations',
        tokens: ['stop', 'me', 'in', 'the', 'supermarket', 'to', 'ask', 'for', 'recommendations'],
        options: ['stop', 'me', 'in', 'the', 'supermarket', 'to', 'ask', 'for', 'recommendations'],
        korean: '손님들은 신선한 과일에 관한 추천을 묻기 위해 슈퍼마켓에서 종종 가던 나를 불러세우곤 해요.',
        explanation: '가던 사람을 불러세워 말을 건네는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A tourist decided to [stop me in, look me up, turn me down, cheer me on] the train station to ask for directions to the park.',
        answer: 'stop me in',
        options: ['stop me in', 'look me up', 'turn me down', 'cheer me on'],
        korean: '어떤 관광객이 공원 가는 길을 묻기 위해 기차역에서 가던 나를 멈춰 세웠어요.',
        explanation: '길을 묻기 위해 사람을 불러세우는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Did a neighbor really [stop you in, lock you in, count you in, drop you in] the hallway just to compliment your cute puppy?',
        answer: 'stop you in',
        options: ['stop you in', 'lock you in', 'count you in', 'drop you in'],
        korean: '이웃 주민이 복도에서 가던 너를 멈춰 세우고 네 귀여운 강아지를 칭찬해 주었니?',
        explanation: '가던 사람을 멈추어 말을 건네는 일상 구어입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A nice lady tried to [stop me in, push me in, call me in, shut me in] the garden path to admire the pretty flowers.',
        answer: 'stop me in',
        options: ['stop me in', 'push me in', 'call me in', 'shut me in'],
        korean: '어떤 친절한 여성분이 예쁜 꽃을 감상하며 정원 길에서 가던 나를 불러세웠어요.',
        explanation: '"stop someone in"은 특정 장소에서 불러세움을 뜻합니다.'
      }
    ]
  },

  // 2. random
  {
    keyExpression: 'random',
    baseForm: 'random',
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
        english: 'Singing a winter song on a hot summer day [felt random and funny to my friends].',
        answer: 'felt random and funny to my friends',
        tokens: ['felt', 'random', 'and', 'funny', 'to', 'my', 'friends'],
        options: ['felt', 'random', 'and', 'funny', 'to', 'my', 'friends'],
        korean: '무더운 여름날에 겨울 노래를 부르는 것은 내 친구들에게 참 뜬금없고 재미있게 느껴졌어요.',
        explanation: '"random"은 맥락 없이 돌발적인 상황을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Hearing a loud rooster sound inside the quiet library felt very [random, careful, polite, normal] to everyone.',
        answer: 'random',
        options: ['random', 'careful', 'polite', 'normal'],
        korean: '조용한 도서관 안에서 시끄러운 수탉 울음소리를 들은 것은 모두에게 참 뜬금없게 느껴졌어요.',
        explanation: '"random"은 장소나 상황에 맞지 않는 뜬금없음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The teacher asked a [random, serious, strict, difficult] trivia question about penguins to make the class laugh.',
        answer: 'random',
        options: ['random', 'serious', 'strict', 'difficult'],
        korean: '선생님께서는 학생들을 웃게 하려고 펭귄에 관한 뜬금없는 퀴즈 질문 하나를 던지셨어요.',
        explanation: '"random question"은 뜬금없는 질문입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His story about an elephant in Africa was quite [random, neat, quiet, sweet] during our dinner chat.',
        answer: 'random',
        options: ['random', 'neat', 'quiet', 'sweet'],
        korean: '저녁 식사 대화 중에 나온 아프리카 코끼리에 관한 그의 이야기는 꽤 뜬금없었어요.',
        explanation: '"random"은 화제와 무관하게 불쑥 튀어나온 이야기입니다.'
      }
    ]
  },

  // 3. standpoint
  {
    keyExpression: 'standpoint',
    baseForm: 'standpoint',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'From an authentic cultural [standpoint, boundary, destination, foundation], fermenting kimchi with seafood enhances its umami depth.',
        answer: 'standpoint',
        options: ['standpoint', 'boundary', 'destination, foundation'],
        options: ['standpoint', 'boundary', 'destination', 'foundation'],
        korean: '전통적인 문화적 관점(입장)에서 볼 때 해산물과 함께 김치를 발효시키는 것은 감칠맛의 깊이를 더해줍니다.',
        explanation: '"standpoint"는 판단이나 주장의 근거가 되는 "관점, 입장, 견지"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'From a financial [standpoint, saving a little money each week is a smart idea].',
        answer: 'standpoint, saving a little money each week is a smart idea',
        tokens: ['standpoint,', 'saving', 'a', 'little', 'money', 'each', 'week', 'is', 'a', 'smart', 'idea'],
        options: ['standpoint,', 'saving', 'a', 'little', 'money', 'each', 'week', 'is', 'a', 'smart', 'idea'],
        korean: '재정적인 관점(입장)에서 볼 때, 매주 조금씩 돈을 저축하는 것은 현명한 생각이에요.',
        explanation: '"from a standpoint"는 ~의 관점에서 볼 때라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'From a health [standpoint, boundary, destination, foundation], drinking plenty of fresh water every day is very important.',
        answer: 'standpoint',
        options: ['standpoint', 'boundary', 'destination', 'foundation'],
        korean: '건강의 관점(견지)에서 볼 때, 매일 신선한 물을 충분히 마시는 것은 매우 중요해요.',
        explanation: '"from a health standpoint"는 건강적 관점이라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Looking at the problem from her [standpoint, highway, airport, garden] helped us understand why she was upset.',
        answer: 'standpoint',
        options: ['standpoint', 'highway', 'airport', 'garden'],
        korean: '그녀의 입장(관점)에서 문제를 바라보는 것은 그녀가 왜 속상했는지 이해하는 데 도움이 되었어요.',
        explanation: '"from someone\'s standpoint"는 그 사람의 입장에서라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'From a teacher\'s [standpoint, mountain, hallway, sidewalk], reading daily helps children learn new words quickly.',
        answer: 'standpoint',
        options: ['standpoint', 'mountain', 'hallway', 'sidewalk'],
        korean: '선생님의 관점에서 볼 때, 매일 책을 읽는 것은 아이들이 새 단어를 빠르게 배우도록 도와줘요.',
        explanation: '"standpoint"는 특정 역할이나 입장에서의 관점입니다.'
      }
    ]
  },

  // 4. fermented
  {
    keyExpression: 'fermented',
    baseForm: 'fermented',
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
        english: 'Yogurt and cheese are healthy [fermented foods made from fresh milk].',
        answer: 'fermented foods made from fresh milk',
        tokens: ['fermented', 'foods', 'made', 'from', 'fresh', 'milk'],
        options: ['fermented', 'foods', 'made', 'from', 'fresh', 'milk'],
        korean: '요거트와 치즈는 신선한 우유로 만든 건강한 발효 식품이에요.',
        explanation: '"fermented foods"는 발효 식품들을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Bread dough rises softly because the yeast creates tiny air bubbles in the [fermented, frozen, burned, melted] mixture.',
        answer: 'fermented',
        options: ['fermented', 'frozen', 'burned', 'melted'],
        korean: '효모가 발효된 반죽 속에 작은 공기 방울을 만들기 때문에 빵 반죽이 부드럽게 부풀어 올라요.',
        explanation: '"fermented"는 발효 과정을 거친 상태를 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Korean cooking uses delicious [fermented, dry, cold, hard] soybean paste to make warm, comforting soup.',
        answer: 'fermented',
        options: ['fermented', 'dry', 'cold', 'hard'],
        korean: '한국 요리는 따뜻하고 구수한 국을 끓이기 위해 맛있는 발효된 된장(대두장)을 사용해요.',
        explanation: '"fermented soybean paste"는 된장 등 발효 장류를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Crispy pickles are made from cucumbers kept in [fermented, dry, hot, boiled] salty water jars.',
        answer: 'fermented',
        options: ['fermented', 'dry', 'hot', 'boiled'],
        korean: '아삭한 피클은 소금물 병에 담가 발효시킨 오이로 만들어집니다.',
        explanation: '"fermented"는 절여서 발효된 상태를 가리킵니다.'
      }
    ]
  },

  // 5. used to
  {
    keyExpression: 'used to',
    baseForm: 'used to',
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
        english: 'We [used to play in the city park together] every afternoon after school.',
        answer: 'used to play in the city park together',
        tokens: ['used', 'to', 'play', 'in', 'the', 'city', 'park', 'together'],
        options: ['used', 'to', 'play', 'in', 'the', 'city', 'park', 'together'],
        korean: '우리는 방과 후 매일 오후에 시립 공원에서 함께 놀곤 했어요.',
        explanation: '"used to play"는 과거의 습관적 놀이를 회상합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He [used to, gets used to, wants to, refuses to] ride the yellow school bus, but now he rides his bicycle every day.',
        answer: 'used to',
        options: ['used to', 'gets used to', 'wants to', 'refuses to'],
        korean: '그는 노란 스쿨버스를 타곤 했지만, 지금은 매일 자전거를 타요.',
        explanation: '"used to"는 과거와 현재의 대비를 보여줍니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My family [used to, are used to, learn to, hope to] go camping by the lake every summer when I was a little boy.',
        answer: 'used to',
        options: ['used to', 'are used to', 'learn to', 'hope to'],
        korean: '내가 어린 소년이었을 때 우리 가족은 매년 여름 호숫가로 캠핑을 가곤 했어요.',
        explanation: '"used to go"는 과거의 정기적인 활동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She [used to, is used to, learns to, hates to] drink lots of sweet soda, but now she only drinks plain water.',
        answer: 'used to',
        options: ['used to', 'is used to', 'learns to', 'hates to'],
        korean: '그녀는 달콤한 탄산음료를 많이 마시곤 했지만, 지금은 맹물만 마셔요.',
        explanation: '"used to drink"는 과거의 식습관을 나타냅니다.'
      }
    ]
  },

  // 6. every other week
  {
    keyExpression: 'every other week',
    baseForm: 'every other week',
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
        english: 'I visit my grandparents [every other week on Sunday morning] to help in their garden.',
        answer: 'every other week on Sunday morning',
        tokens: ['every', 'other', 'week', 'on', 'Sunday', 'morning'],
        options: ['every', 'other', 'week', 'on', 'Sunday', 'morning'],
        korean: '나는 조부모님의 정원 일을 돕기 위해 2주에 한 번씩(격주로) 일요일 아침마다 찾아봬요.',
        explanation: '"every other week"는 격주 빈도를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He gets his paycheck [every other week, once a century, twice a minute, every second] on Friday afternoon.',
        answer: 'every other week',
        options: ['every other week', 'once a century', 'twice a minute', 'every second'],
        korean: '그는 금요일 오후에 2주마다 한 번씩(격주로) 급여를 받아요.',
        explanation: '"every other week"는 2주 간격의 지급 주기를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We clean the large kitchen windows [every other week, every second, once a decade, once a year] to keep them clear.',
        answer: 'every other week',
        options: ['every other week', 'every second', 'once a decade', 'once a year'],
        korean: '우리는 깨끗하게 유지하기 위해 격주로(2주마다) 큰 주방 창문들을 닦아요.',
        explanation: '"every other week"는 정기적인 격주 청소입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The mobile book bus visits our small town [every other week, every instant, each hour, twice a second] on Tuesday.',
        answer: 'every other week',
        options: ['every other week', 'every instant, each hour, twice a second'],
        options: ['every other week', 'every instant', 'each hour', 'twice a second'],
        korean: '이동식 도서관 버스는 화요일마다 2주에 한 번씩(격주로) 우리 작은 마을을 찾아와요.',
        explanation: '"every other week"는 2주 간격의 방문 주기입니다.'
      }
    ]
  },

  // 7. there were ever times where
  {
    keyExpression: 'there were ever times where',
    baseForm: 'there were ever times where',
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
        english: 'If [there were ever times where she felt tired], she rested on the park bench.',
        answer: 'there were ever times where she felt tired',
        tokens: ['there', 'were', 'ever', 'times', 'where', 'she', 'felt', 'tired'],
        options: ['there', 'were', 'ever', 'times', 'where', 'she', 'felt', 'tired'],
        korean: '혹시라도 그녀가 피곤함을 느꼈던 때가 있으면, 그녀는 공원 벤치에서 쉬었어요.',
        explanation: '"there were ever times where"는 과거에 혹시라도 그런 때가 있었다면을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whenever [there were ever times where, there were few minutes when, there were no rooms that, there were old houses why] it rained on Saturday, the kids played board games inside.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were few minutes when', 'there were no rooms that', 'there were old houses why'],
        korean: '토요일에 비가 내렸던 적이 있을 때면 언제나 아이들은 실내에서 보드게임을 했어요.',
        explanation: '"there were ever times where"는 과거의 조건적 상황을 회상합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If [there were ever times where, there were no books that, there were short days when, there were few boys why] we needed a helping hand, grandpa was always ready to help.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were no books that', 'there were short days when', 'there were few boys why'],
        korean: '혹시라도 우리가 도움의 손길이 필요했던 때가 있으면, 할아버지는 언제나 도와줄 준비가 되어 계셨어요.',
        explanation: '"there were ever times where"는 필요가 발생했던 때들을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whenever [there were ever times where, there were cold cups that, there were no cars when, there were bright stars why] he felt lonely, he called his mother.',
        answer: 'there were ever times where',
        options: ['there were ever times where', 'there were cold cups that', 'there were no cars when', 'there were bright stars why'],
        korean: '혹시라도 그가 외로움을 느꼈던 때가 있을 때면 언제나 그는 어머니께 전화를 걸었어요.',
        explanation: '"there were ever times where"는 특정 감정이나 상태가 들었던 때를 뜻합니다.'
      }
    ]
  },

  // 8. got stared at
  {
    keyExpression: 'got stared at',
    baseForm: 'get stared at',
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
        english: 'He wore a giant yellow hat and [got stared at by people on the street].',
        answer: 'got stared at by people on the street',
        tokens: ['got', 'stared', 'at', 'by', 'people', 'on', 'the', 'street'],
        options: ['got', 'stared', 'at', 'by', 'people', 'on', 'the', 'street'],
        korean: '그는 커다란 노란 모자를 썼고 길거리 사람들에게 빤히 쳐다봄을 당했어요(시선 집중을 받았어요).',
        explanation: '"got stared at"는 주위 사람들의 시선을 집중해서 받는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The very tall basketball player always [got stared at, got turned away, got dropped off, got counted out] whenever he entered a small grocery shop.',
        answer: 'got stared at',
        options: ['got stared at', 'got turned away', 'got dropped off', 'got counted out'],
        korean: '키가 무척 큰 그 농구 선수는 작은 식료품점에 들어갈 때마다 늘 사람들에게 빤히 쳐다봄을 당했어요.',
        explanation: '"got stared at"는 눈에 띄어 사람들이 빤히 쳐다보는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She [got stared at, got left behind, got locked up, got paid back] with surprise when her phone started ringing loudly in the quiet cinema.',
        answer: 'got stared at',
        options: ['got stared at', 'got left behind', 'got locked up', 'got paid back'],
        korean: '조용한 영화관에서 휴대전화가 시끄럽게 울리기 시작하자 그녀는 놀란 사람들에게 빤히 쳐다봄을 당했어요.',
        explanation: '"got stared at"는 당황스러운 상황에서 사람들의 시선을 받음입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The cute puppy wearing bright red boots [got stared at, got blown away, got picked out, got shut down] by all the children in the shopping mall.',
        answer: 'got stared at',
        options: ['got stared at', 'got blown away', 'got picked out', 'got shut down'],
        korean: '밝은 빨간 부츠를 신은 귀여운 강아지는 쇼핑몰 안의 모든 아이들에게 빤히 쳐다봄을 당했어요(시선을 사로잡았어요).',
        explanation: '"got stared at"는 귀엽거나 신기해서 시선 집중을 받는 것입니다.'
      }
    ]
  },

  // 9. at least
  {
    keyExpression: 'at least',
    baseForm: 'at least',
    sentences: [
      {
        type: 'multiple-choice',
        english: "Even if the spicy stew didn't turn out completely authentic, [at least, at best, at random, at large] you tried your hardest to cook it for dinner.",
        answer: 'at least',
        options: ['at least', 'at best', 'at random', 'at large'],
        korean: '비록 매운 찌개가 완벽하게 원조 맛으로 나오진 않았더라도, 적어도 당신이 저녁으로 끓여주려고 최선을 다했다는 점만으로도 좋아요.',
        explanation: '"at least"는 "적어도, 최소한"이라는 뜻으로 아쉬움 속에서 긍정적인 면을 짚을 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The morning was cloudy and cold, but [at least it did not rain during our picnic].',
        answer: 'at least it did not rain during our picnic',
        tokens: ['at', 'least', 'it', 'did', 'not', 'rain', 'during', 'our', 'picnic'],
        options: ['at', 'least', 'it', 'did', 'not', 'rain', 'during', 'our', 'picnic'],
        korean: '아침은 흐리고 추웠지만, 적어도 우리 소풍 동안 비가 내리지 않은 것만 해도 다행이었어요.',
        explanation: '"at least"는 불완전한 상황에서 다행스러운 점을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The bus arrived twenty minutes late, but [at least, at once, at random, at large] everyone found a warm, comfortable seat inside.',
        answer: 'at least',
        options: ['at least', 'at once', 'at random', 'at large'],
        korean: '버스가 20분 늦게 도착했지만, 적어도 모두가 안에서 따뜻하고 편안한 좌석을 찾았어요.',
        explanation: '"at least"는 최소한의 긍정적 측면을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We did not win the championship match, but [at least, at present, at sight, at heart] all our teammates played hard together.',
        answer: 'at least',
        options: ['at least', 'at present', 'at sight', 'at heart'],
        korean: '우리가 결승전에서 이기지는 못했지만, 적어도 우리 팀원 모두가 함께 열심히 뛰었어요.',
        explanation: '"at least"는 결과와 무관하게 가치 있는 점을 강조합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I lost my favorite pen at school, but [at least, at ease, at speed, at will] I still have my notebook safe in my bag.',
        answer: 'at least',
        options: ['at least', 'at ease', 'at speed', 'at will'],
        korean: '학교에서 가장 아끼던 펜을 잃어버렸지만, 적어도 공책은 가방에 안전하게 남아 있어요.',
        explanation: '"at least"는 그나마 다행인 점을 말할 때 씁니다.'
      }
    ]
  },

  // 10. encouraged
  {
    keyExpression: 'encouraged',
    baseForm: 'encourage',
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
        english: 'The kind teacher always [encouraged the young students to read good books].',
        answer: 'encouraged the young students to read good books',
        tokens: ['encouraged', 'the', 'young', 'students', 'to', 'read', 'good', 'books'],
        options: ['encouraged', 'the', 'young', 'students', 'to', 'read', 'good', 'books'],
        korean: '친절한 선생님께서는 어린 학생들이 좋은 책을 읽도록 언제나 격려해 주셨어요.',
        explanation: '"encouraged someone to do"는 ~하도록 격려하고 북돋웠다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her mother\'s warm smile and kind words [encouraged, frightened, stopped, blocked] her to try out for the school choir.',
        answer: 'encouraged',
        options: ['encouraged', 'frightened', 'stopped', 'blocked'],
        korean: '어머니의 따뜻한 미소와 다정한 말씀은 그녀가 학교 합창단 오디션에 도전하도록 용기를 북돋아 주었어요.',
        explanation: '"encouraged"는 용기를 주어 행동하게 함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Winning their first soccer match [encouraged, bored, silenced, froze] the young players to practice even harder.',
        answer: 'encouraged',
        options: ['encouraged', 'bored', 'silenced', 'froze'],
        korean: '첫 축구 경기에서 승리한 것은 어린 선수들이 더 열심히 연습하도록 격려(동기부여)해 주었어요.',
        explanation: '"encouraged"는 동기부여와 의욕을 심어주는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My best friend [encouraged, refused, checked, broke] me to study every day so we could pass the test together.',
        answer: 'encouraged',
        options: ['encouraged', 'refused', 'checked', 'broke'],
        korean: '내 단짝 친구는 함께 시험에 합격할 수 있도록 매일 공부하라고 나를 격려해 주었어요.',
        explanation: '"encouraged"는 친구를 응원하고 북돋움을 뜻합니다.'
      }
    ]
  },

  // 11. have lived up to
  {
    keyExpression: 'have lived up to',
    baseForm: 'live up to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'He tried cooking Kimchi Jjigae several times since, but none of the later batches [have lived up to, have given birth to, have turned blind to, have run out of] that legendary first pot.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have given birth to', 'have turned blind to', 'have run out of'],
        korean: '그 이후로 그가 김치찌개를 여러 번 끓여보았지만, 그 어떤 후속작도 그 전설적인 첫 번째 냄비의 기대치에는 전혀 미치지 못했어요.',
        explanation: '"live up to ~"는 기대나 기준에 "부응하다, 미치다"라는 뜻입니다. 여기서는 "have + p.p.(현재완료)" 형태로 쓰여 과거부터 지금까지 경험한 것들을 아울러 "기대에 부응해 왔다"라는 의미를 가지며, "none of them"과 결합하여 "그 어떤 것도 기대에 미치지 못했다"라는 완료 부정의 뉘앙스를 나타냅니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'None of the new movie sequels [have lived up to the exciting original story].',
        answer: 'have lived up to the exciting original story',
        tokens: ['have', 'lived', 'up', 'to', 'the', 'exciting', 'original', 'story'],
        options: ['have', 'lived', 'up', 'to', 'the', 'exciting', 'original', 'story'],
        korean: '새 영화 속편들 중 그 어떤 작품도 그 흥미진진했던 원작의 기대치에 부응하지 못했어요.',
        explanation: '"have lived up to"는 지금까지 기대에 미쳐왔다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Several new bakeries opened in our town, but none [have lived up to, have passed away to, have looked down on, have run out of] grandma\'s warm homemade bread.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have passed away to', 'have looked down on', 'have run out of'],
        korean: '우리 동네에 새 빵집들이 몇 군데 문을 열었지만, 그 어떤 곳도 할머니의 따뜻한 손맛 빵 기대치에 미치지 못했어요.',
        explanation: '"have lived up to"는 기준이나 기대치에 미침을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The soccer team played with great energy today, and their efforts [have lived up to, have died down to, have backed off from, have broken into] the coach\'s high hopes.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have died down to', 'have backed off from', 'have broken into'],
        korean: '오늘 축구팀은 엄청난 에너지로 뛰었고, 그들의 노력은 코치님의 높은 기대에 훌륭히 부응해 왔어요.',
        explanation: '"have lived up to expectations"는 기대에 부응했음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His honest actions and kind words [have lived up to, have turned away from, have looked into, have dropped out of] his family\'s proud reputation.',
        answer: 'have lived up to',
        options: ['have lived up to', 'have turned away from', 'have looked into', 'have dropped out of'],
        korean: '그의 정직한 행동과 따뜻한 말은 가족의 자랑스러운 명성에 걸맞게 부응해 왔어요.',
        explanation: '"have lived up to"는 명성이나 가치에 부응함을 나타냅니다.'
      }
    ]
  },

  // 12. was introduced to
  {
    keyExpression: 'was introduced to',
    baseForm: 'be introduced to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Kelly [was introduced to, was accused of, was deprived of, was disposed of] the hidden alleyway Kimchi Jjigae spot by her friendly coworkers in Seoul.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was accused of', 'was deprived of, was disposed of'],
        options: ['was introduced to', 'was accused of', 'was deprived of', 'was disposed of'],
        korean: '켈리는 서울에서 다정한 직장 동료들의 소개로 그 골목길 숨은 김치찌개 맛집을 소개받아 처음 알게 되었어요.',
        explanation: '"be introduced to ~"는 누군가의 소개로 사람이나 사물을 "소개받다, 처음 접하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He [was introduced to American football by his cousins] last winter.',
        answer: 'was introduced to American football by his cousins',
        tokens: ['was', 'introduced', 'to', 'American', 'football', 'by', 'his', 'cousins'],
        options: ['was', 'introduced', 'to', 'American', 'football', 'by', 'his', 'cousins'],
        korean: '그는 지난겨울 사촌들의 소개로 미식축구를 처음 접하게 되었어요.',
        explanation: '"was introduced to"는 스포츠나 취미를 처음 소개받았음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She [was introduced to, was warned of, was robbed of, was cleared of] classical piano music by her grandmother at a young age.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was warned of', 'was robbed of', 'was cleared of'],
        korean: '그녀는 어린 나이에 할머니의 소개로 클래식 피아노 음악을 처음 접했어요.',
        explanation: '"was introduced to"는 음악이나 예술을 처음 접하는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The friendly new student [was introduced to, was accused of, was rid of, was stripped of] the whole school during morning assembly.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was accused of', 'was rid of', 'was stripped of'],
        korean: '다정한 전학생은 아침 조회 시간에 전교생에게 소개되었어요.',
        explanation: '"was introduced to"는 사람들에게 소개를 받는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [was introduced to, was tired of, was guilty of, was afraid of] this wonderful adventure book by my favorite teacher.',
        answer: 'was introduced to',
        options: ['was introduced to', 'was tired of', 'was guilty of', 'was afraid of'],
        korean: '나는 내가 가장 좋아하는 선생님의 소개로 이 멋진 모험 소설을 알게 되었어요.',
        explanation: '"was introduced to"는 책이나 작품을 추천받아 접함을 뜻합니다.'
      }
    ]
  },

  // 13. can't say
  {
    keyExpression: "can't say",
    baseForm: "can't say",
    sentences: [
      {
        type: 'multiple-choice',
        english: "I know I loved the soup, but I honestly [can't say, shouldn't listen, mustn't eat, wouldn't doubt] exactly which secret ingredient made it taste so remarkable.",
        answer: "can't say",
        options: ["can't say", "shouldn't listen", "mustn't eat", "wouldn't doubt"],
        korean: '내가 그 찌개를 정말 좋아했다는 건 알지만, 솔직히 어떤 비밀 재료가 그렇게 놀라운 맛을 냈는지는 딱 꼬집어 말할 수가 없어요.',
        explanation: '"can\'t say"는 정확한 이유나 사실을 "딱 잘라 말할 수 없다, 잘 모르겠다"라는 완곡한 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: "I like both bright colors, so I [can't say which shirt looks better] on you.",
        answer: "can't say which shirt looks better",
        tokens: ["can't", 'say', 'which', 'shirt', 'looks', 'better'],
        options: ["can't", 'say', 'which', 'shirt', 'looks', 'better'],
        korean: '두 밝은 색상 다 마음에 들어서 어느 셔츠가 너한테 더 잘 어울리는지 딱 잘라 말할 수 없네.',
        explanation: '"can\'t say"는 확답하기 어렵다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: "The math test was tricky, so I [can't say, won't drink, can't sleep, mustn't cook] for certain if I scored a perfect grade.",
        answer: "can't say",
        options: ["can't say", 'won\'t drink', 'can\'t sleep', 'mustn\'t cook'],
        korean: '수학 시험이 까다로워서 만점을 받았는지 확실히 딱 잘라 말할 수는 없어요.',
        explanation: '"can\'t say for certain"은 확실히 말할 수 없다입니다.'
      },
      {
        type: 'multiple-choice',
        english: "I [can't say, shouldn't walk, won't drive, wouldn't fly] why the school bus is running twenty minutes late today.",
        answer: "can't say",
        options: ["can't say", 'shouldn\'t walk', 'won\'t drive', 'wouldn\'t fly'],
        korean: '오늘 스쿨버스가 왜 20분 늦게 오는지 이유는 딱 잘라 알 수가 없어요.',
        explanation: '"can\'t say why"는 이유를 단정 지어 말할 수 없음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: "She is very gentle, so she [can't say, mustn't look, won't read, shouldn't buy] anything mean or unkind about others.",
        answer: "can't say",
        options: ["can't say", 'mustn\'t look', 'won\'t read', 'shouldn\'t buy'],
        korean: '그녀는 매우 다정해서 남들에 대해 나쁘거나 불친절한 말을 차마 하지 못해요.',
        explanation: '"can\'t say anything bad"는 나쁜 말을 하지 못함을 뜻합니다.'
      }
    ]
  },

  // 14. supposed to
  {
    keyExpression: 'supposed to',
    baseForm: 'supposed to',
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
        english: 'Students are [supposed to turn off cell phones] during the test.',
        answer: 'supposed to turn off cell phones',
        tokens: ['supposed', 'to', 'turn', 'off', 'cell', 'phones'],
        options: ['supposed', 'to', 'turn', 'off', 'cell', 'phones'],
        korean: '학생들은 시험 중에 휴대전화를 끄기로 되어 있어요(꺼야 해요).',
        explanation: '"supposed to turn off"는 규칙상 끄기로 되어 있음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You are [supposed to, driven to, caught to, dropped to] wash your hands with warm water and soap before dinner.',
        answer: 'supposed to',
        options: ['supposed to', 'driven to', 'caught to', 'dropped to'],
        korean: '저녁 식사 전에는 따뜻한 물과 비누로 손을 씻어야 해요(씻기로 되어 있어요).',
        explanation: '"supposed to wash"는 당연히 지켜야 할 위생 수칙입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'What time is the morning passenger train [supposed to, bound to, able to, used to] arrive at the platform?',
        answer: 'supposed to',
        options: ['supposed to', 'bound to', 'able to', 'used to'],
        korean: '아침 여객 기차는 플랫폼에 몇 시에 도착하기로 예정되어 있나요?',
        explanation: '"supposed to arrive"는 시간표상의 예정 시각입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The weather report said it was [supposed to, made to, taught to, called to] be sunny and warm all weekend.',
        answer: 'supposed to',
        options: ['supposed to', 'made to', 'taught to', 'called to'],
        korean: '일기예보에서는 주말 내내 날씨가 맑고 따뜻하기로 되어 있다고 했어요.',
        explanation: '"supposed to be sunny"는 예보상의 날씨를 가리킵니다.'
      }
    ]
  },

  // 15. taste the same
  {
    keyExpression: 'taste the same',
    baseForm: 'taste the same',
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
        english: 'Without real butter, these cookies just do not [taste the same as grandma\'s recipe].',
        answer: 'taste the same as grandma\'s recipe',
        tokens: ['taste', 'the', 'same', 'as', 'grandma\'s', 'recipe'],
        options: ['taste', 'the', 'same', 'as', 'grandma\'s', 'recipe'],
        korean: '진짜 버터가 없으면 이 쿠키들은 할머니 레시피와 똑같은 맛이 나지 않아요.',
        explanation: '"taste the same as"는 ~와 똑같은 맛이 남을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Fresh warm toast just doesn\'t [taste the same, look the light, make the bed, hit the road] once it sits out and gets completely cold.',
        answer: 'taste the same',
        options: ['taste the same', 'look the light', 'make the bed', 'hit the road'],
        korean: '갓 구운 따뜻한 토스트는 밖에 방치되어 완전히 식어버리면 예전과 똑같은 맛이 나지 않아요.',
        explanation: '"taste the same"은 원래의 맛과 동일함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Does this homemade pizza [taste the same, sound the bell, ring the clock, take the seat] as the one we had at the Italian restaurant?',
        answer: 'taste the same',
        options: ['taste the same', 'sound the bell', 'ring the clock', 'take the seat'],
        korean: '이 홈메이드 피자가 우리가 그 이탈리안 레스토랑에서 먹었던 것과 똑같은 맛이 나나요?',
        explanation: '"taste the same"은 맛의 일치 여부를 묻습니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Coffee with cold water never [taste the same, keep the peace, turn the key, tell the time] as a hot brewed cup.',
        answer: 'taste the same',
        options: ['taste the same', 'keep the peace', 'turn the key', 'tell the time'],
        korean: '찬물에 탄 커피는 갓 내린 뜨거운 커피 한 잔과 똑같은 맛이 나지 않아요.',
        explanation: '"taste the same"은 음식의 고유한 풍미가 같음을 뜻합니다.'
      }
    ]
  },

  // 16. Technically
  {
    keyExpression: 'Technically',
    baseForm: 'technically',
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
        english: '[Technically, tomorrow is a national holiday], so our school is closed.',
        answer: 'Technically, tomorrow is a national holiday',
        tokens: ['Technically,', 'tomorrow', 'is', 'a', 'national', 'holiday'],
        options: ['Technically,', 'tomorrow', 'is', 'a', 'national', 'holiday'],
        korean: '엄밀히 따져보면 내일은 국경일이어서 우리 학교는 쉬어요.',
        explanation: '"Technically"는 공식 규정이나 엄밀한 사실에 따름을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Technically, Casually, Slowly, Sadly], a spider is an arachnid and not an insect because it has eight legs.',
        answer: 'Technically',
        options: ['Technically', 'Casually', 'Slowly', 'Sadly'],
        korean: '엄밀히 따지자면 거미는 다리가 8개이므로 곤충이 아니라 거미류에 속합니다.',
        explanation: '"Technically"는 과학적·학술적 정확성을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Technically, Loudly, Happily, Blindly], calendar winter starts in December, but November is already freezing here.',
        answer: 'Technically',
        options: ['Technically', 'Loudly', 'Happily', 'Blindly'],
        korean: '달력상으로는 엄밀히 겨울이 12월에 시작하지만, 이곳은 11월도 이미 몹시 추워요.',
        explanation: '"Technically"는 규정상이나 공식 기준을 말할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He is [technically, deeply, sweetly, loudly] correct about the library rule, even if it feels very strict to us.',
        answer: 'technically',
        options: ['technically', 'deeply', 'sweetly', 'loudly'],
        korean: '우리에게 다소 엄격하게 느껴질지라도 도서관 규칙에 대해 엄밀히 말하자면 그의 말이 맞아요.',
        explanation: '"technically correct"는 규칙상 정확함을 뜻합니다.'
      }
    ]
  },

  // 17. based it off of
  {
    keyExpression: 'based it off of',
    baseForm: 'base off of',
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
        english: 'She drew a lovely picture and [based it off of a photo of her garden].',
        answer: 'based it off of a photo of her garden',
        tokens: ['based', 'it', 'off', 'of', 'a', 'photo', 'of', 'her', 'garden'],
        options: ['based', 'it', 'off', 'of', 'a', 'photo', 'of', 'her', 'garden'],
        korean: '그녀는 사랑스러운 그림 하나를 그렸고, 자기 정원 사진을 바탕으로 삼았어요.',
        explanation: '"based it off of"는 원본이나 사진을 기초로 제작했음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He wrote an exciting short story and [based it off of, cut it out of, held it back from, gave it up to] his own childhood adventures in the woods.',
        answer: 'based it off of',
        options: ['based it off of', 'cut it out of', 'held it back from', 'gave it up to'],
        korean: '그는 흥미진진한 단편 소설을 썼고, 숲속에서 겪은 자신의 어린 시절 모험을 바탕으로 삼았어요.',
        explanation: '"based off of"는 경험을 바탕으로 이야기를 지어냄을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When mom prepared the potato soup, she [based it off of, threw it out of, broke it up into, ran it down to] the simple recipe grandma taught her.',
        answer: 'based it off of',
        options: ['based it off of', 'throw it out of', 'broke it up into', 'ran it down to'],
        options: ['based it off of', 'threw it out of', 'broke it up into', 'ran it down to'],
        korean: '엄마가 감자 수프를 만드셨을 때, 할머니께서 가르쳐주신 간단한 레시피를 바탕으로 삼으셨어요.',
        explanation: '"based it off of"는 조리법을 기초로 삼음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The movie director made a thrilling film and [based it off of, took it away from, put it down to, wiped it out of] a true historical event.',
        answer: 'based it off of',
        options: ['based it off of', 'took it away from', 'put it down to', 'wiped it out of'],
        korean: '영화감독은 스릴 넘치는 영화를 제작했고, 실제 역사적 사건을 바탕으로 삼았어요.',
        explanation: '"based off of"는 실화를 바탕으로 함을 나타냅니다.'
      }
    ]
  },

  // 18. as good as
  {
    keyExpression: 'as good as',
    baseForm: 'as good as',
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
        english: 'This fresh homemade pizza is [just as good as the restaurant pizza].',
        answer: 'just as good as the restaurant pizza',
        tokens: ['just', 'as', 'good', 'as', 'the', 'restaurant', 'pizza'],
        options: ['just', 'as', 'good', 'as', 'the', 'restaurant', 'pizza'],
        korean: '이 갓 구운 집 피자는 식당 피자만큼이나 맛있어요.',
        explanation: '"as good as"는 ~만큼 훌륭한이라는 동등 비교입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Today\'s sunny weather is every bit [as good as, as cold as, as dark as, as sad as] yesterday\'s pleasant afternoon.',
        answer: 'as good as',
        options: ['as good as', 'as cold as', 'as dark as', 'as sad as'],
        korean: '오늘의 화창한 날씨는 어제의 기분 좋은 오후만큼이나 참 좋아요.',
        explanation: '"as good as"는 날씨나 기분이 그에 못지않게 좋음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her new watercolor painting is every bit [as good as, as weak as, as low as, as bad as] the art on the calendar.',
        answer: 'as good as',
        options: ['as good as', 'as weak as', 'as low as', 'as bad as'],
        korean: '그녀의 새 수채화 그림은 달력에 실린 미술 작품만큼이나 훌륭해요.',
        explanation: '"as good as"는 작품의 완성도가 대등함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After wiping off the dust, my old bicycle looks [as good as, as slow as, as short as, as hard as] new.',
        answer: 'as good as',
        options: ['as good as', 'as slow as', 'as short as', 'as hard as'],
        korean: '먼지를 닦아내자 내 오래된 자전거는 새것만큼이나 좋아 보여요.',
        explanation: '"as good as new"는 새것이나 다름없는 상태입니다.'
      }
    ]
  },

  // 19. turn out
  {
    keyExpression: 'turn out',
    baseForm: 'turn out',
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
        english: 'We practiced every day, and our school play [turned out great in the end].',
        answer: 'turned out great in the end',
        tokens: ['turned', 'out', 'great', 'in', 'the', 'end'],
        options: ['turned', 'out', 'great', 'in', 'the', 'end'],
        korean: '우리는 매일 연습했고, 우리 학교 연극은 결국 대단히 훌륭하게 끝마쳐졌어요(결과가 나왔어요).',
        explanation: '"turned out great"은 결과가 대단히 훌륭하게 나오다를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Don\'t worry about the small mistakes; I am sure everything will [turn out, break in, run away, hold on] just fine.',
        answer: 'turn out',
        options: ['turn out', 'break in', 'run away', 'hold on'],
        korean: '작은 실수들에 대해 너무 걱정하지 마세요. 모든 것이 결국 잘 풀릴 거라고(결과가 좋을 거라고) 확신해요.',
        explanation: '"turn out fine"은 결과가 잘 되다를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I was very nervous before the English test, but it [turned out, fell out, went down, gave in] to be much easier than I thought.',
        answer: 'turned out',
        options: ['turned out', 'fell out', 'went down', 'gave in'],
        korean: '영어 시험 전에 몹시 긴장했지만, 생각했던 것보다 훨씬 더 쉬운 것으로 드러났어요(결과가 나왔어요).',
        explanation: '"turned out to be"는 결과적으로 ~임이 밝혀지다입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The cloudy morning [turned out, dropped out, backed down, set up] to be a warm and sunny afternoon for soccer.',
        answer: 'turned out',
        options: ['turned out', 'dropped out', 'backed down', 'set up'],
        korean: '흐렸던 아침은 결국 축구하기에 따뜻하고 화창한 오후로 바뀌었어요(결과가 되었어요).',
        explanation: '"turned out"은 결국 어떤 상태로 결말이 남을 뜻합니다.'
      }
    ]
  },

  // 20. whereas
  {
    keyExpression: 'whereas',
    baseForm: 'whereas',
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
        english: 'Kelly likes sweet warm tea, [whereas her husband Jaemyun prefers black coffee].',
        answer: 'whereas her husband Jaemyun prefers black coffee',
        tokens: ['whereas', 'her', 'husband', 'Jaemyun', 'prefers', 'black', 'coffee'],
        options: ['whereas', 'her', 'husband', 'Jaemyun', 'prefers', 'black', 'coffee'],
        korean: '켈리는 달콤하고 따뜻한 차를 좋아하는 반면에, 남편 재면은 블랙커피를 더 좋아해요.',
        explanation: '"whereas"는 두 사람의 취향을 대조하는 접속사입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The red apple was sweet and juicy, [whereas, therefore, likewise, instead] the green apple was extremely sour.',
        answer: 'whereas',
        options: ['whereas', 'therefore', 'likewise', 'instead'],
        korean: '빨간 사과는 달콤하고 과즙이 풍부했던 반면에, 초록 사과는 아주 떫고 시었어요.',
        explanation: '"whereas"는 두 사물의 상반된 맛을 대조합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Cats are quiet indoor pets, [whereas, besides, moreover, meanwhile] active dogs love to run outside in the yard.',
        answer: 'whereas',
        options: ['whereas', 'besides', 'moreover', 'meanwhile'],
        korean: '고양이는 조용한 실내 반려동물인 반면에, 활발한 개들은 마당 밖에서 뛰어노는 것을 무척 좋아해요.',
        explanation: '"whereas"는 성향의 명확한 차이를 대조할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He finished his drawing in ten minutes, [whereas, thus, anyway, however] his sister spent an hour to be very neat.',
        answer: 'whereas',
        options: ['whereas', 'thus', 'anyway', 'however'],
        korean: '그는 10분 만에 그림을 끝마친 반면에, 여동생은 매우 깔끔하게 그리기 위해 한 시간을 들였어요.',
        explanation: '"whereas"는 걸린 시간과 태도의 차이를 대조합니다.'
      }
    ]
  },

  // 21. oilier to
  {
    keyExpression: 'oilier to',
    baseForm: 'oilier to',
    sentences: [
      {
        type: 'multiple-choice',
        english: "Adding extra pork belly made the stew taste noticeably [oilier to, drier to, colder to, firmer to] Kelly's palate than before.",
        answer: 'oilier to',
        options: ['oilier to', 'drier to', 'colder to', 'firmer to'],
        korean: '삼겹살을 추가로 더 넣었더니 찌개가 예전보다 켈리의 입맛에 확연히 더 기름지게(느끼하게) 느껴졌어요.',
        explanation: '"oilier to ~"는 기름기가 더 많아 누구에게 "~에게 더 기름지게/느끼하게 느껴지는"이라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The fried potatoes tasted [oilier to me without lemon juice] to balance them.',
        answer: 'oilier to me without lemon juice',
        tokens: ['oilier', 'to', 'me', 'without', 'lemon', 'juice'],
        options: ['oilier', 'to', 'me', 'without', 'lemon', 'juice'],
        korean: '맛을 잡아줄 레몬즙이 없으니 튀긴 감자가 내 입맛에는 더 기름지게(느끼하게) 느껴졌어요.',
        explanation: '"oilier to me"는 내 입맛에 더 기름지다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Eating fried chicken two nights in a row felt noticeably [oilier to, sweeter to, fresher to, louder to] the family.',
        answer: 'oilier to',
        options: ['oilier to', 'sweeter to', 'fresher to', 'louder to'],
        korean: '이틀 연속으로 프라이드치킨을 먹는 것은 가족들에게 눈에 띄게 더 기름지게 느껴졌어요.',
        explanation: '"oilier to"는 특정 사람에게 기름지게 다가옴을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The warm soup tasted [oilier to, colder to, harder to, drier to] her after adding extra butter.',
        answer: 'oilier to',
        options: ['oilier to', 'colder to', 'harder to', 'drier to'],
        korean: '버터를 더 넣은 뒤 따뜻한 수프가 그녀의 입맛에 더 기름지게 느껴졌어요.',
        explanation: '"oilier to her"는 그녀에게 기름지게 느껴짐입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This thick pasta dish was much [oilier to, cleaner to, sharper to, softer to] our dinner guests than the light salad.',
        answer: 'oilier to',
        options: ['oilier to', 'cleaner to', 'sharper to', 'softer to'],
        korean: '이 진한 파스타 요리는 가벼운 샐러드보다 저녁 손님들의 입맛에 훨씬 더 기름지게 느껴졌어요.',
        explanation: '"oilier to guests"는 손님들의 미각에 기름지게 다가옴을 뜻합니다.'
      }
    ]
  },

  // 22. break from
  {
    keyExpression: 'break from',
    baseForm: 'break from',
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
        english: 'We decided to take a [two-week break from computer screens during vacation].',
        answer: 'two-week break from computer screens during vacation',
        tokens: ['two-week', 'break', 'from', 'computer', 'screens', 'during', 'vacation'],
        options: ['two-week', 'break', 'from', 'computer', 'screens', 'during', 'vacation'],
        korean: '우리는 방학 동안 컴퓨터 화면으로부터 2주간의 휴식기를 갖기로 결정했어요.',
        explanation: '"break from screens"는 화면을 잠시 멀리하고 쉬는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After studying all morning, he took a short fifteen-minute [break from, race with, battle against, push to] his books to drink water.',
        answer: 'break from',
        options: ['break from', 'race with', 'battle against, push to'],
        options: ['break from', 'race with', 'battle against', 'push to'],
        korean: '아침 내내 공부한 뒤, 그는 물을 마시기 위해 책으로부터 짧은 15분간의 휴식 시간을 가졌어요.',
        explanation: '"break from studying"은 공부를 잠시 쉬는 시간입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Taking a weekend [break from, dance with, run at, cry for] noisy city life made everyone feel refreshed and peaceful.',
        answer: 'break from',
        options: ['break from', 'dance with', 'run at', 'cry for'],
        korean: '시끄러운 도시 생활로부터 주말 휴식기를 가진 것은 모두를 상쾌하고 평화롭게 만들어 주었어요.',
        explanation: '"break from city life"는 일상이나 도시를 벗어난 휴식입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She took a three-day [break from, jump to, look through, touch with] social media to focus on reading her new novel.',
        answer: 'break from',
        options: ['break from', 'jump to', 'look through', 'touch with'],
        korean: '그녀는 새 소설을 읽는 데 집중하기 위해 소셜 미디어로부터 3일간의 휴식기를 가졌어요.',
        explanation: '"break from social media"는 SNS를 잠시 쉬는 기간입니다.'
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
  if (item.baseForm) {
    md += `- **BaseForm**: ${item.baseForm}\n`;
  }
  if (s.options) {
    md += `- **Options**: ${s.options.join(', ')}\n`;
  }
  md += `- **Korean**: ${s.korean}\n`;
  md += `- **Explanation**: ${s.explanation}\n\n`;
});

const quizMdPath = path.join(LESSON_DIR, 'quiz.md');
fs.writeFileSync(quizMdPath, md.trim() + '\n', 'utf8');
console.log(`[Success] Written: ${quizMdPath}`);
