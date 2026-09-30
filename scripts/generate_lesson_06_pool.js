const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-06';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. ended up
  {
    keyExpression: 'ended up',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We set out looking for a quick camping spot, but we [ended up, backed down, took off, turned away] renting a beautiful rustic cabin by the lake.',
        answer: 'ended up',
        options: ['ended up', 'backed down', 'took off', 'turned away'],
        korean: '우리는 간단한 캠핑 장소를 찾아 나섰지만, 결국 호숫가의 아름다운 통나무 오두막을 빌리게 되었어요.',
        explanation: '"ended up"은 계획과 달리 "결국 ~하게 되다"라는 핵심 구동사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I went to buy milk, but I [ended up buying some sweet apples] as well.',
        answer: 'ended up buying some sweet apples',
        tokens: ['ended', 'up', 'buying', 'some', 'sweet', 'apples'],
        options: ['ended', 'up', 'buying', 'some', 'sweet', 'apples'],
        korean: '우유를 사러 갔는데, 결국 달콤한 사과도 몇 개 사게 되었어요.',
        explanation: '"ended up buying"은 결국 사게 되었다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They missed the evening bus and [ended up, began to, refused to, hoped to] walking all the way home.',
        answer: 'ended up',
        options: ['ended up', 'began to', 'refused to', 'hoped to'],
        korean: '그들은 저녁 버스를 놓쳐서 결국 집까지 내내 걸어가게 되었어요.',
        explanation: '"ended up walking"은 결국 걸어가게 되었음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We intended to watch only one episode, but we [ended up, failed to, stopped to, hated to] watching three more.',
        answer: 'ended up',
        options: ['ended up', 'failed to', 'stopped to', 'hated to'],
        korean: '우리는 딱 한 편만 볼 생각이었지만, 결국 세 편을 더 보게 되었어요.',
        explanation: '"ended up watching"은 결국 더 보게 되었다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He took the wrong road and [ended up, looked for, aimed at, planned to] at a quiet mountain lake.',
        answer: 'ended up',
        options: ['ended up', 'looked for', 'aimed at', 'planned to'],
        korean: '그는 길을 잘못 들어서 결국 조용한 산골 호수에 도달하게 되었어요.',
        explanation: '"ended up"은 예상치 못한 장소에 다다름을 나타냅니다.'
      }
    ]
  },

  // 2. hang around
  {
    keyExpression: 'hang around',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'On lazy weekend afternoons, local kids love to [hang around, run away, pull over, push through] the general store drinking cold soda.',
        answer: 'hang around',
        options: ['hang around', 'run away', 'pull over', 'push through'],
        korean: '한가로운 주말 오후면 동네 아이들은 시원한 탄산음료를 마시며 잡화점 주변을 서성거리며 어울려 놀기를 좋아합니다.',
        explanation: '"hang around"는 특별한 목적 없이 특정 장소에서 "서성거리다, 시간을 보내다, 어울려 놀다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We often [hang around the cozy cafe] with friends after school.',
        answer: 'hang around the cozy cafe',
        tokens: ['hang', 'around', 'the', 'cozy', 'cafe'],
        options: ['hang', 'around', 'the', 'cozy', 'cafe'],
        korean: '우리는 방과 후에 친구들과 아늑한 카페 주변에서 자주 시간을 보내요.',
        explanation: '"hang around"는 특별한 일 없이 어울려 시간을 보내는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Do not [hang around, drive through, pass by, move along] the train tracks because it can be dangerous.',
        answer: 'hang around',
        options: ['hang around', 'drive through', 'pass by', 'move along'],
        korean: '위험할 수 있으니 기찻길 주변을 서성거리지 마세요.',
        explanation: '"hang around"는 특정 장소 주변을 서성거리는 행동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The friendly pet dogs love to [hang around, turn off, fall down, walk away] the kitchen whenever dad is cooking.',
        answer: 'hang around',
        options: ['hang around', 'turn off', 'fall down', 'walk away'],
        korean: '다정한 반려견들은 아빠가 요리하실 때마다 주방 주변을 서성거리기를 참 좋아해요.',
        explanation: '"hang around"는 곁을 맴돌며 시간을 보내는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He likes to [hang around, hurry off, drop out, step down] the quiet library reading nature magazines.',
        answer: 'hang around',
        options: ['hang around', 'hurry off', 'drop out', 'step down'],
        korean: '그는 조용한 도서관에서 자연 잡지를 읽으며 여유롭게 시간을 보내는 것을 좋아해요.',
        explanation: '"hang around"는 여유롭게 머무르는 것을 뜻합니다.'
      }
    ]
  },

  // 3. practical
  {
    keyExpression: 'practical',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Living in a remote mountain cabin requires [practical, theoretical, decorative, delicate] survival skills like chopping firewood and clearing snow.',
        answer: 'practical',
        options: ['practical', 'theoretical', 'decorative', 'delicate'],
        korean: '외딴 산골 오두막에서 생활하려면 장작 패기와 제설 작업 같은 실용적이고 현실적인 생존 기술이 필요합니다.',
        explanation: '"practical"은 "실용적인, 현실적인"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'A sturdy backpack is [a practical gift for a student] going to school.',
        answer: 'a practical gift for a student',
        tokens: ['a', 'practical', 'gift', 'for', 'a', 'student'],
        options: ['a', 'practical', 'gift', 'for', 'a', 'student'],
        korean: '튼튼한 배낭은 등교하는 학생에게 아주 실용적인 선물이에요.',
        explanation: '"practical gift"는 실용적인 선물을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Wearing warm boots in the cold winter snow is a very [practical, theoretical, decorative, delicate] choice.',
        answer: 'practical',
        options: ['practical', 'theoretical', 'decorative', 'delicate'],
        korean: '추운 겨울 눈 속에서 따뜻한 부츠를 신는 것은 매우 실용적인 선택이에요.',
        explanation: '"practical"은 실제로 유용하고 쓸모가 있음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Learning how to cook simple meals at home is a [practical, useless, broken, dangerous] skill for everyday life.',
        answer: 'practical',
        options: ['practical', 'useless', 'broken', 'dangerous'],
        korean: '집에서 간단한 식사를 요리하는 법을 배우는 것은 일상생활에 아주 실용적인 기술이에요.',
        explanation: '"practical skill"은 실생활에 바로 쓰이는 기술입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He bought a small, [practical, heavy, complicated, weak] car that is very easy to park in town.',
        answer: 'practical',
        options: ['practical', 'heavy', 'complicated', 'weak'],
        korean: '그는 동네에서 주차하기가 매우 쉬운 작고 실용적인 차 한 대를 샀어요.',
        explanation: '"practical car"는 실속 있고 편리한 자동차를 뜻합니다.'
      }
    ]
  },

  // 4. went out to dinner
  {
    keyExpression: 'went out to dinner',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'To celebrate our wedding anniversary, we all [went out to dinner, stayed in bed, cleaned the garage, painted the fence] at a cozy Italian bistro.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'stayed in bed', 'cleaned the garage', 'painted the fence'],
        korean: '결혼기념일을 축하하기 위해 우리 가족은 모두 아늑한 이탈리안 비스트로로 저녁 외식을 하러 나갔어요.',
        explanation: '"go out to dinner"는 "저녁 외식을 하러 밖으로 나가다"라는 뜻입니다 (과거형: went out to dinner).'
      },
      {
        type: 'drag-and-drop',
        english: 'After finishing our school exams, my friends and I [went out to dinner at a pizza place].',
        answer: 'went out to dinner at a pizza place',
        tokens: ['went', 'out', 'to', 'dinner', 'at', 'a', 'pizza', 'place'],
        options: ['went', 'out', 'to', 'dinner', 'at', 'a', 'pizza', 'place'],
        korean: '학교 시험을 마친 뒤, 친구들과 나는 피자 가게로 저녁 외식을 하러 나갔어요.',
        explanation: '"went out to dinner"는 저녁을 먹으러 밖으로 나갔음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Because nobody wanted to cook tonight, the whole family [went out to dinner, washed the car, cut the grass, fixed the roof] together.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'washed the car', 'cut the grass', 'fixed the roof'],
        korean: '오늘 밤 아무도 요리하고 싶어 하지 않아서, 온 가족이 함께 저녁 외식을 하러 나갔어요.',
        explanation: '"went out to dinner"는 식당으로 저녁을 먹으러 나감을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They [went out to dinner, took a shower, went to sleep, did the dishes] at a quiet restaurant right after the movie ended.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'took a shower', 'went to sleep', 'did the dishes'],
        korean: '영화가 끝난 직후 그들은 조용한 식당으로 저녁 외식을 하러 갔어요.',
        explanation: '"went out to dinner"는 외식하러 간 상황을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Every Friday evening, grandma and grandpa [went out to dinner, stayed outside, worked in the field, painted the house] at their favorite neighborhood diner.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'stayed outside', 'worked in the field', 'painted the house'],
        korean: '금요일 저녁마다 할머니와 할아버지께서는 가장 좋아하시는 동네 식당으로 저녁 외식을 하러 나가셨어요.',
        explanation: '"went out to dinner"는 규칙적인 저녁 외식을 뜻합니다.'
      }
    ]
  },

  // 5. pushing the peppers aside
  {
    keyExpression: 'pushing the peppers aside',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The spicy Sichuan noodles were too hot, so he was carefully [pushing the peppers aside, stirring the soup well, drinking the broth fast, adding extra salt in].',
        answer: 'pushing the peppers aside',
        options: ['pushing the peppers aside', 'stirring the soup well', 'drinking the broth fast', 'adding extra salt in'],
        korean: '매운 사천 국수가 너무 매워서 그는 매운 고추들을 조심스럽게 한쪽 옆으로 밀어 치워두고 있었어요.',
        explanation: '"push ~ aside"는 피하고 싶은 것을 "한쪽 옆으로 밀어두다, 제쳐놓다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She ate her fried rice while carefully [pushing the green peppers aside] on the plate.',
        answer: 'pushing the green peppers aside',
        tokens: ['pushing', 'the', 'green', 'peppers', 'aside'],
        options: ['pushing', 'the', 'green', 'peppers', 'aside'],
        korean: '그녀는 접시 위에 있는 피망들을 조심스레 한쪽으로 밀어 치우면서 볶음밥을 먹었어요.',
        explanation: '"pushing peppers aside"는 먹지 않는 고추를 옆으로 치우는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The little boy did not like spicy food, so he was [pushing the peppers aside, eating the crust first, drinking all the milk, cutting the steak up] with his fork.',
        answer: 'pushing the peppers aside',
        options: ['pushing the peppers aside', 'eating the crust first', 'drinking all the milk', 'cutting the steak up'],
        korean: '어린 소년은 매운 음식을 좋아하지 않아서 포크로 고추들을 한쪽 옆으로 밀어두고 있었어요.',
        explanation: '"pushing the peppers aside"는 고추를 옆으로 제쳐놓는 행동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He was [pushing the peppers aside, mixing the bowl fast, boiling the water, freezing the ice] so the curry would not taste too hot.',
        answer: 'pushing the peppers aside',
        options: ['pushing the peppers aside', 'mixing the bowl fast', 'boiling the water', 'freezing the ice'],
        korean: '그는 카레가 너무 맵지 않도록 고추들을 한쪽 옆으로 밀어 치워두고 있었어요.',
        explanation: '"pushing peppers aside"는 매운맛을 줄이기 위해 고추를 치우는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Before taking a bite of the noodles, she started [pushing the peppers aside, throwing the bowl, pouring the soup out, baking the bread] to the edge of the bowl.',
        answer: 'pushing the peppers aside',
        options: ['pushing the peppers aside', 'throwing the bowl', 'pouring the soup out', 'baking the bread'],
        korean: '국수를 한 입 먹기 전에 그녀는 그릇 가장자리로 고추들을 밀어두기 시작했어요.',
        explanation: '"pushing peppers aside"는 피하려는 식재료를 옆으로 밀어내는 동작입니다.'
      }
    ]
  },

  // 6. show off
  {
    keyExpression: 'show off',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'He wanted to [show off, keep quiet, back down, hide away] in front of his new friends by eating the spiciest chili pepper at the table.',
        answer: 'show off',
        options: ['show off', 'keep quiet', 'back down', 'hide away'],
        korean: '그는 식탁에서 가장 매운 고추를 먹음으로써 새 친구들 앞에서 뽐내며 과시(허세)를 부리고 싶어 했어요.',
        explanation: '"show off"는 남들 앞에서 자신의 용기나 능력을 "뽐내다, 자랑하다, 과시하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The little boy wanted to [show off his shiny new bicycle] to everyone.',
        answer: 'show off his shiny new bicycle',
        tokens: ['show', 'off', 'his', 'shiny', 'new', 'bicycle'],
        options: ['show', 'off', 'his', 'shiny', 'new', 'bicycle'],
        korean: '어린 소년은 자신의 반짝이는 새 자전거를 모두에게 자랑하고(뽐내고) 싶어 했어요.',
        explanation: '"show off"는 새 물건이나 능력을 자랑하는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She did not want to [show off, speak up, play along, run away], so she quietly put her first-place medal in her pocket.',
        answer: 'show off',
        options: ['show off', 'speak up', 'play along', 'run away'],
        korean: '그녀는 뽐내거나 자랑하고 싶지 않아서 1등 메달을 조용히 주머니에 넣었어요.',
        explanation: '"show off"는 남에게 과시하거나 자랑하는 태도입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The playful puppy ran fast in the yard to [show off, fall down, go to bed, sit still] how high he could leap.',
        answer: 'show off',
        options: ['show off', 'fall down', 'go to bed', 'sit still'],
        korean: '장난꾸러기 강아지는 자신이 얼마나 높이 뛸 수 있는지 뽐내기 위해 마당에서 빠르게 달렸어요.',
        explanation: '"show off"는 귀엽게 능력을 뽐냄을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He likes to [show off, turn down, drop out, walk away] his simple magic card tricks at family gatherings.',
        answer: 'show off',
        options: ['show off', 'turn down', 'drop out', 'walk away'],
        korean: '그는 가족 모임에서 간단한 마술 카드 묘기를 뽐내는 것을 좋아해요.',
        explanation: '"show off"는 재주를 남들에게 자랑스레 보여주는 것입니다.'
      }
    ]
  },

  // 7. enjoyed being around
  {
    keyExpression: 'enjoyed being around',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Gene always [enjoyed being around, hated talking to, feared meeting with, avoided looking at] his warm-hearted father-in-law.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'hated talking to', 'feared meeting with', 'avoided looking at'],
        korean: '진(Gene) 아버님은 마음씨 따뜻한 장인어른 곁에 함께 어울려 있는 것을 늘 참 좋아하셨어요.',
        explanation: '"enjoy being around someone"은 상대방 곁에 "함께 어울려 있는 것을 좋아하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The children always [enjoyed being around their kind grandpa] on summer visits.',
        answer: 'enjoyed being around their kind grandpa',
        tokens: ['enjoyed', 'being', 'around', 'their', 'kind', 'grandpa'],
        options: ['enjoyed', 'being', 'around', 'their', 'kind', 'grandpa'],
        korean: '아이들은 여름 방문 때 다정한 할아버지 곁에 함께 있는 것을 늘 무척 좋아했어요.',
        explanation: '"enjoyed being around"는 함께 있는 시간을 즐겼음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Everyone in the class [enjoyed being around, ran away from, stayed away from, cried in front of] the cheerful new student.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'ran away from', 'stayed away from', 'cried in front of'],
        korean: '반의 모든 학생들이 그 밝고 유쾌한 전학생 곁에 함께 어울려 있는 것을 좋아했어요.',
        explanation: '"enjoyed being around"는 주위에 함께 있기를 좋아함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Kelly always [enjoyed being around, was bored by, disliked seeing, refused to meet] her friendly uncle Wayne during family trips.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'was bored by', 'disliked seeing', 'refused to meet'],
        korean: '켈리는 가족 여행 동안 친근한 웨인 삼촌 곁에 함께 어울려 있는 것을 언제나 좋아했어요.',
        explanation: '웨인은 켈리의 삼촌(Wayne is Kelly\'s uncle)입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I truly [enjoyed being around, was afraid of, hated sitting with, stayed apart from] my cousins during the holiday vacation.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'was afraid of', 'hated sitting with', 'stayed apart from'],
        korean: '나는 연휴 방학 동안 사촌들 곁에 함께 어울려 있는 시간을 진심으로 즐겼어요.',
        explanation: '"enjoyed being around"는 어울리는 시간을 즐겁게 보냄을 뜻합니다.'
      }
    ]
  },

  // 8. got taken to the bar
  {
    keyExpression: 'got taken to the bar',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'After a hard day of baling hay on the ranch, the young farmhands all [got taken to the bar, were sent to prison, walked into traffic, stayed in hospital] by the senior manager for a round of drinks.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'were sent to prison', 'walked into traffic', 'stayed in hospital'],
        korean: '목장에서 건초를 묶는 고된 하루를 보낸 후, 젊은 농장 일꾼들은 선임 매니저에게 이끌려 한잔하러 모두 술집으로 데려가 졌어요.',
        explanation: '"get taken to the bar"는 상대방에게 이끌려 "술집으로 함께 데려가 지다/끌려가다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'On his twenty-first birthday, he [got taken to the local bar by friends] for a drink.',
        answer: 'got taken to the local bar by friends',
        tokens: ['got', 'taken', 'to', 'the', 'local', 'bar', 'by', 'friends'],
        options: ['got', 'taken', 'to', 'the', 'local', 'bar', 'by', 'friends'],
        korean: '스물한 번째 생일에 그는 친구들에게 이끌려 동네 술집으로 축하 한잔을 하러 데려가 졌어요.',
        explanation: '"got taken to the bar"는 다른 사람들에게 이끌려 술집에 감을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After the big game, the happy soccer players [got taken to the bar, went to the clinic, slept in the bus, waited in the snow] to celebrate their victory.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'went to the clinic', 'slept in the bus', 'waited in the snow'],
        korean: '큰 경기가 끝난 뒤, 신난 축구 선수들은 승리를 축하하기 위해 모두 술집으로 데려가 졌어요.',
        explanation: '"got taken to the bar"는 축하 자리에 데려가진 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The out-of-town guests [got taken to the bar, were put in jail, fell into the river, stayed at the station] by their friendly host to hear live music.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'were put in jail', 'fell into the river', 'stayed at the station'],
        korean: '외지에서 온 손님들은 라이브 음악을 듣기 위해 친절한 호스트에게 이끌려 술집(바)으로 안내받아 갔어요.',
        explanation: '"got taken to the bar"는 안내되어 데려가짐을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When he completed the difficult project, he [got taken to the bar, was kept in bed, got lost in town, walked off the ship] by his coworkers for a toast.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'was kept in bed', 'got lost in town', 'walked off the ship'],
        korean: '어려운 프로젝트를 완수했을 때, 그는 건배를 나누기 위해 직장 동료들에게 이끌려 바로 데려가 졌어요.',
        explanation: '"got taken to the bar"는 동료들과 축하 자리에 함께 가게 된 것입니다.'
      }
    ]
  },

  // 9. one of the times
  {
    keyExpression: 'one of the times',
    sentences: [
      {
        type: 'multiple-choice',
        english: "I don't recall the exact date, but it was [one of the times, none of the days, all of the reasons, out of the blue] we visited grandma's country farmhouse.",
        answer: 'one of the times',
        options: ['one of the times', 'none of the days', 'all of the reasons', 'out of the blue'],
        korean: '정확한 날짜는 기억나지 않지만, 우리가 할머니의 시골 농가를 찾아갔던 여러 번 중 어느 한 번이었어요.',
        explanation: '"one of the times"는 과거에 반복되었던 만남 중 "그 여러 번 중 어느 한 번"을 회상할 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'This funny photo was taken during [one of the times we went camping] in the woods.',
        answer: 'one of the times we went camping',
        tokens: ['one', 'of', 'the', 'times', 'we', 'went', 'camping'],
        options: ['one', 'of', 'the', 'times', 'we', 'went', 'camping'],
        korean: '이 재미있는 사진은 우리가 숲으로 캠핑을 갔던 여러 번 중 어느 한 번에 찍힌 거예요.',
        explanation: '"one of the times"는 여러 번 중 한 번을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I remember that chilly day; it was [one of the times, none of the rules, all of the games, out of the way] it snowed heavily in April.',
        answer: 'one of the times',
        options: ['one of the times', 'none of the rules', 'all of the games', 'out of the way'],
        korean: '나는 그 쌀쌀했던 날을 기억해요. 4월에 눈이 많이 내렸던 여러 번 중 어느 한 번이었어요.',
        explanation: '"one of the times"는 과거 특정 경험을 회상할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'That was [one of the times, none of the words, all of the songs, away from home] my sister baked sweet cookies for our family.',
        answer: 'one of the times',
        options: ['one of the times', 'none of the words', 'all of the songs', 'away from home'],
        korean: '그때는 내 여동생이 우리 가족을 위해 달콤한 쿠키를 구워주었던 여러 번 중 한 번이었어요.',
        explanation: '"one of the times"는 다회 중 하나의 사건을 지칭합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It happened during [one of the times, none of the books, each of the cars, out of place] we drove along the ocean road together.',
        answer: 'one of the times',
        options: ['one of the times', 'none of the books', 'each of the cars', 'out of place'],
        korean: '우리가 함께 해안 도로를 드라이브했던 여러 번 중 한 번 일어난 일이었어요.',
        explanation: '"one of the times"는 추억 속 특정 시점을 가리킵니다.'
      }
    ]
  },

  // 10. early in the relationship
  {
    keyExpression: 'early in the relationship',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'It was still pretty [early in the relationship, late in the game, high in the sky, lost in the woods] when Gene and Patty drove together to meet her parents.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'late in the game', 'high in the sky', 'lost in the woods'],
        korean: '진(Gene) 아버님과 패티(Patty) 어머님이 부모님을 뵈러 함께 차를 타고 갔을 때는 우리가 연애를 시작한 지 꽤 초기 단계였을 때였어요.',
        explanation: '"early in the relationship"은 연인 관계가 시작된 지 얼마 되지 않은 "연애(교제) 초기 단계"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'They were shy with each other [early in the relationship as friends].',
        answer: 'early in the relationship as friends',
        tokens: ['early', 'in', 'the', 'relationship', 'as', 'friends'],
        options: ['early', 'in', 'the', 'relationship', 'as', 'friends'],
        korean: '그들은 친구로서의 관계 초기에는 서로 수줍어했어요.',
        explanation: '"early in the relationship"은 관계의 초기 단계를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They talked for hours about their favorite books [early in the relationship, late at night, high in the air, far from home] when they first met.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'late at night', 'high in the air', 'far from home'],
        korean: '처음 만났을 때 그들은 교제 초기 단계에 좋아하는 책에 대해 몇 시간 동안 이야기했어요.',
        explanation: '"early in the relationship"은 사귀기 시작한 지 얼마 안 된 무렵입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It is very common to feel polite and careful [early in the relationship, deep in the water, late in the winter, out of the door] with someone new.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'deep in the water', 'late in the winter', 'out of the door'],
        korean: '새로운 사람과의 교제 초기 단계에는 예의를 차리고 조심스러워하는 것이 무척 자연스러워요.',
        explanation: '"early in the relationship"은 관계 형성의 초반부입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They went for a simple picnic in the park [early in the relationship, late in life, up in the hills, down the road] on their third date.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'late in life', 'up in the hills', 'down the road'],
        korean: '그들은 세 번째 데이트였던 교제 초기 단계에 공원으로 간단한 소풍을 갔어요.',
        explanation: '"early in the relationship"은 연애 초기를 가리킵니다.'
      }
    ]
  },

  // 11. all the way from
  {
    keyExpression: 'all the way from',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We carefully transported the fragile wedding cake [all the way from, in spite of, by means of, on behalf of] San Francisco to Lake Tahoe without a scratch.',
        answer: 'all the way from',
        options: ['all the way from', 'in spite of', 'by means of', 'on behalf of'],
        korean: '우리는 깨지기 쉬운 웨딩 케이크를 샌프란시스코에서 레이크 타호까지 먼 거리를 도중에 멈추지 않고 내내 싣고 갔어요.',
        explanation: '"all the way from A to B"는 A에서 B까지의 먼 거리를 "도중에 쉬지 않고 내내 줄곧"이라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'My grandparents traveled [all the way from Korea to visit us] this summer.',
        answer: 'all the way from Korea to visit us',
        tokens: ['all', 'the', 'way', 'from', 'Korea', 'to', 'visit', 'us'],
        options: ['all', 'the', 'way', 'from', 'Korea', 'to', 'visit', 'us'],
        korean: '우리 조부모님께서는 올여름 우리를 방문하기 위해 한국에서부터 먼 길을 내내 찾아오셨어요.',
        explanation: '"all the way from"은 먼 거리에서부터 줄곧 찾아왔음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He walked [all the way from, in front of, on top of, by way of] the train station to our front door in the rain.',
        answer: 'all the way from',
        options: ['all the way from', 'in front of', 'on top of', 'by way of'],
        korean: '그는 빗속에서 기차역에서부터 우리 집 현관문까지 먼 길을 내내 걸어왔어요.',
        explanation: '"all the way from"은 출발지로부터 쉬지 않고 걸어옴을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The whole family drove [all the way from, because of, inside of, next to] California to Texas for the reunion.',
        answer: 'all the way from',
        options: ['all the way from', 'because of', 'inside of', 'next to'],
        korean: '온 가족이 가족 모임을 위해 캘리포니아에서부터 텍사스까지 먼 거리를 내내 운전해 갔어요.',
        explanation: '"all the way from"은 긴 이동 거리를 강조합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She rode her bicycle [all the way from, despite of, on account of, in view of] her school to the beach on Saturday.',
        answer: 'all the way from',
        options: ['all the way from', 'despite of', 'on account of', 'in view of'],
        korean: '그녀는 토요일에 학교에서부터 해변까지 먼 거리를 자전거로 줄곧 달렸어요.',
        explanation: '"all the way from"은 장거리 이동의 연속성을 나타냅니다.'
      }
    ]
  },

  // 12. went around a corner
  {
    keyExpression: 'went around a corner',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The car suddenly [went around a corner, backed up a hill, stopped at a sign, blew a radiator] too fast, and the unsecured groceries slid across the backseat.',
        answer: 'went around a corner',
        options: ['went around a corner', 'backed up a hill', 'stopped at a sign', 'blew a radiator'],
        korean: '차가 너무 빠르게 길모퉁이(코너)를 도는 바람에 고정되지 않은 장보기 식료품들이 뒷좌석 바닥으로 미끄러져 쏟아졌어요.',
        explanation: '"go around a corner"는 운전 중에 "길모퉁이/코너를 돌다"라는 뜻입니다 (과거형: went around a corner).'
      },
      {
        type: 'drag-and-drop',
        english: 'The yellow school bus [went around a corner and stopped] by the gate.',
        answer: 'went around a corner and stopped',
        tokens: ['went', 'around', 'a', 'corner', 'and', 'stopped'],
        options: ['went', 'around', 'a', 'corner', 'and', 'stopped'],
        korean: '노란 스쿨버스가 모퉁이를 돌아 교문 옆에 멈춰 섰어요.',
        explanation: '"went around a corner"는 코너를 돌았음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He slowed down safely as he [went around a corner, climbed up a tree, jumped into water, flew in the air] on his bicycle.',
        answer: 'went around a corner',
        options: ['went around a corner', 'climbed up a tree', 'jumped into water', 'flew in the air'],
        korean: '그는 자전거로 모퉁이를 돌 때 안전하게 속도를 줄였어요.',
        explanation: '"went around a corner"는 코너를 도는 주행 동작입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The playful puppy ran fast and [went around a corner, fell asleep, sat down, flew away] into the garden path.',
        answer: 'went around a corner',
        options: ['went around a corner', 'fell asleep', 'sat down', 'flew away'],
        korean: '장난꾸러기 강아지는 빠르게 달려 모퉁이를 돌아 정원 길로 들어섰어요.',
        explanation: '"went around a corner"는 방향을 꺾어 모퉁이를 돌아가는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The delivery truck carefully [went around a corner, backed up a tree, broke the sea, flew in space] on the narrow street.',
        answer: 'went around a corner',
        options: ['went around a corner', 'backed up a tree', 'broke the sea', 'flew in space'],
        korean: '배달 트럭은 좁은 골목길에서 조심스럽게 모퉁이를 돌았어요.',
        explanation: '"went around a corner"는 길모퉁이를 도는 동작입니다.'
      }
    ]
  },

  // 13. the time of year
  {
    keyExpression: 'the time of year',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The types of wildlife you encounter in the high Sierra depend heavily on [the time of year, the price of fuel, the rule of law, the speed of sound].',
        answer: 'the time of year',
        options: ['the time of year', 'the price of fuel', 'the rule of law', 'the speed of sound'],
        korean: '높은 시에라 산맥에서 마주치는 야생동물의 종류는 연중 어느 시기인지(계절)에 따라 크게 달라집니다.',
        explanation: '"the time of year"는 1년 중 특정 시기나 "계절(season)"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The forest leaves change color depending on [the time of year in our state].',
        answer: 'the time of year in our state',
        tokens: ['the', 'time', 'of', 'year', 'in', 'our', 'state'],
        options: ['the', 'time', 'of', 'year', 'in', 'our', 'state'],
        korean: '숲의 나뭇잎들은 우리 주에서 연중 어느 시기인지(계절)에 따라 색이 변해요.',
        explanation: '"the time of year"는 연중 시기나 계절을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Fresh sweet apples are very cheap depending on [the time of year, the shape of cars, the size of shoes, the color of paint].',
        answer: 'the time of year',
        options: ['the time of year', 'the shape of cars', 'the size of shoes', 'the color of paint'],
        korean: '신선하고 달콤한 사과는 연중 어느 시기(철)인지에 따라 가격이 매우 저렴해요.',
        explanation: '"the time of year"는 과일 등의 제철 시기를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'December is always a cheerful and busy [time of year, place to live, road to take, song to sing] for families.',
        answer: 'time of year',
        options: ['time of year', 'place to live', 'road to take', 'song to sing'],
        korean: '12월은 가족들에게 언제나 유쾌하고 바쁜 연중 시기(연말)예요.',
        explanation: '"time of year"는 1년 중 특정 달이나 계절 시기를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The sun goes down very early at this [time of year, part of town, side of the room, kind of book] in the winter.',
        answer: 'time of year',
        options: ['time of year', 'part of town', 'side of the room', 'kind of book'],
        korean: '겨울철 이 시기에는 해가 매우 일찍 져요.',
        explanation: '"at this time of year"는 연중 이 무렵에라는 뜻입니다.'
      }
    ]
  },

  // 14. take a nap
  {
    keyExpression: 'take a nap',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'After spending the morning chopping firewood in the crisp mountain air, Gene likes to [take a nap, run an errand, buy a ticket, start a fire] on the porch hammock.',
        answer: 'take a nap',
        options: ['take a nap', 'run an errand', 'buy a ticket, start a fire'],
        options: ['take a nap', 'run an errand', 'buy a ticket', 'start a fire'],
        korean: '상쾌한 산골 공기 속에서 아침 내내 장작을 팬 뒤, 진(Gene) 아버님은 현관 해먹에서 낮잠을 잠깐 주무시는 것을 좋아하십니다.',
        explanation: '"take a nap"은 "낮잠을 자다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Grandpa likes to [take a short nap in the afternoon] on the porch.',
        answer: 'take a short nap in the afternoon',
        tokens: ['take', 'a', 'short', 'nap', 'in', 'the', 'afternoon'],
        options: ['take', 'a', 'short', 'nap', 'in', 'the', 'afternoon'],
        korean: '할아버지께서는 오후에 현관 테라스에서 짧게 낮잠을 주무시는 것을 좋아하세요.',
        explanation: '"take a nap"은 낮잠을 자는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I felt so sleepy after lunch that I decided to [take a nap, paint the wall, wash the car, cook dinner] for thirty minutes.',
        answer: 'take a nap',
        options: ['take a nap', 'paint the wall', 'wash the car', 'cook dinner'],
        korean: '점심 식사 후 너무 졸려서 나는 30분 동안 낮잠을 자기로 했어요.',
        explanation: '"take a nap"은 잠깐 잠을 자서 피로를 푸는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The little baby will usually [take a nap, read a book, ride a bike, write a letter] after drinking warm milk.',
        answer: 'take a nap',
        options: ['take a nap', 'read a book', 'ride a bike', 'write a letter'],
        korean: '어린 아기는 보통 따뜻한 우유를 마신 후에 낮잠을 자요.',
        explanation: '"take a nap"은 아기나 어른의 낮잠입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'On lazy Sunday afternoons, dad often likes to [take a nap, build a shed, buy a boat, fix the car] on the soft living room couch.',
        answer: 'take a nap',
        options: ['take a nap', 'build a shed', 'buy a boat', 'fix the car'],
        korean: '나른한 일요일 오후면 아빠는 거실의 푹신한 소파에서 종종 낮잠을 주무시는 것을 좋아하세요.',
        explanation: '"take a nap"은 나른할 때 낮잠을 자는 행동입니다.'
      }
    ]
  },

  // 15. dull moment
  {
    keyExpression: 'dull moment',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Living in the forest with wildlife sightings and endless cabin chores means there is never a [dull moment, bright future, clear sky, deep ocean].',
        answer: 'dull moment',
        options: ['dull moment', 'bright future', 'clear sky', 'deep ocean'],
        korean: '야생동물 출몰과 끝없는 오두막 일거리 속에서 숲속에 산다는 것은 지루하거나 심심한 순간이 결코 없다는 것을 의미합니다.',
        explanation: '"never a dull moment"는 언제나 활기차고 사건이 끊이지 않아 "지루할 틈이 없다"라는 관용 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'With three playful puppies in the house, there is [never a dull moment for our family].',
        answer: 'never a dull moment for our family',
        tokens: ['never', 'a', 'dull', 'moment', 'for', 'our', 'family'],
        options: ['never', 'a', 'dull', 'moment', 'for', 'our', 'family'],
        korean: '집에 장난꾸러기 강아지 세 마리가 있어서 우리 가족에게는 지루할 틈이 전혀 없어요.',
        explanation: '"never a dull moment"는 언제나 재미있고 바쁘다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Our summer camp was so full of fun games that there was never a [dull moment, dark night, cold drink, loud sound] all week.',
        answer: 'dull moment',
        options: ['dull moment', 'dark night', 'cold drink', 'loud sound'],
        korean: '우리 여름 캠프는 재미있는 게임으로 가득 차서 일주일 내내 지루할 틈이 한순간도 없었어요.',
        explanation: '"never a dull moment"는 지루하거나 심심할 틈이 없음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Traveling with my cheerful cousins means there is rarely a [dull moment, sad song, heavy storm, red light] on the road.',
        answer: 'dull moment',
        options: ['dull moment', 'sad song', 'heavy storm', 'red light'],
        korean: '유쾌한 사촌들과 함께 여행하는 것은 길 위에서 지루할 틈이 거의 없다는 것을 의미해요.',
        explanation: '"rarely a dull moment"는 심심할 틈이 거의 없음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'In a lively classroom with young children, there is never a [dull moment, warm coat, small desk, tall tree] for the teacher.',
        answer: 'dull moment',
        options: ['dull moment', 'warm coat', 'small desk', 'tall tree'],
        korean: '어린아이들이 있는 활기찬 교실에서는 선생님에게 지루할 틈이 전혀 없어요.',
        explanation: '"never a dull moment"는 늘 활력이 넘치고 사건이 이어짐을 뜻합니다.'
      }
    ]
  },

  // 16. backing out
  {
    keyExpression: 'backing out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The old metal screws on the cabin roof are [backing out, holding tight, sealing up, turning on] due to the expansion and contraction of timber.',
        answer: 'backing out',
        options: ['backing out', 'holding tight', 'sealing up', 'turning on'],
        korean: '목재의 수축과 팽창 때문에 오두막 지붕의 오래된 금속 나사들이 헐거워져 밖으로 삐져나오고 있어요.',
        explanation: '"back out"은 나사 등이 헐거워져 "밖으로 삐져나오다, 빠져나오다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I noticed a loose screw [backing out of the wooden chair leg] yesterday.',
        answer: 'backing out of the wooden chair leg',
        tokens: ['backing', 'out', 'of', 'the', 'wooden', 'chair', 'leg'],
        options: ['backing', 'out', 'of', 'the', 'wooden', 'chair', 'leg'],
        korean: '어제 나무 의자 다리에서 헐거워진 나사가 밖으로 삐져나오고 있는 것을 발견했어요.',
        explanation: '"backing out"은 나사가 풀려 삐져나옴을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The old nails on the garden fence were slowly [backing out, sticking down, painting over, locking up] after years of rain.',
        answer: 'backing out',
        options: ['backing out', 'sticking down', 'painting over', 'locking up'],
        korean: '정원 울타리의 오래된 못들이 오랜 비바람 끝에 서서히 밖으로 삐져나오고 있었어요.',
        explanation: '"backing out"은 못이나 나사가 헐거워져 밀려 나옴을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Watch out for that metal pin [backing out, holding fast, lying still, drying up] of the door hinge.',
        answer: 'backing out',
        options: ['backing out', 'holding fast', 'lying still', 'drying up'],
        korean: '문경첩에서 밖으로 빠져나오고 있는 저 쇠핀을 조심하세요.',
        explanation: '"backing out"은 고정된 핀이나 나사가 밀려 나오는 상태입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Dad used a screwdriver to tighten the loose screws that were [backing out, falling asleep, cooling off, washing away] of the kitchen cabinet.',
        answer: 'backing out',
        options: ['backing out', 'falling asleep', 'cooling off', 'washing away'],
        korean: '아빠는 주방 수납장에서 밖으로 삐져나오고 있던 헐거운 나사들을 드라이버로 조이셨어요.',
        explanation: '"backing out"은 나사가 느슨해져 밀려 나오는 현상입니다.'
      }
    ]
  },

  // 17. it's a pain
  {
    keyExpression: "it's a pain",
    sentences: [
      {
        type: 'multiple-choice',
        english: "Climbing up on a steep ladder in subzero cold to replace hundreds of loose roofing screws—[it's a pain, it's a breeze, it's a delight, it's a miracle] to deal with every winter.",
        answer: "it's a pain",
        options: ["it's a pain", "it's a breeze", "it's a delight", "it's a miracle"],
        korean: '영하의 추위 속에서 수백 개의 헐거워진 지붕 나사를 교체하기 위해 가파른 사다리에 오르는 것—겨울마다 처리하기 참 골칫거리이자 성가신 일이에요.',
        explanation: '"it\'s a pain"은 다루기 힘들고 귀찮은 "골칫거리이다, 참 성가신 일이다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: "Washing a huge mountain of dishes by hand after dinner—[it's a pain for everyone].",
        answer: "it's a pain for everyone",
        tokens: ["it's", 'a', 'pain', 'for', 'everyone'],
        options: ["it's", 'a', 'pain', 'for', 'everyone'],
        korean: '저녁 식사 후 산더미 같은 설거지를 손으로 하는 것—모두에게 참 성가신 일이에요.',
        explanation: '"it\'s a pain"은 번거롭고 귀찮은 일을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: "Cleaning deep snow off the car windshield every freezing morning—[it's a pain, it's a joy, it's a gift, it's a party] in the winter.",
        answer: "it's a pain",
        options: ["it's a pain", "it's a joy", "it's a gift", "it's a party"],
        korean: '매서운 아침마다 자동차 앞 유리의 두꺼운 눈을 치우는 것—겨울철엔 참 귀찮고 성가신 일이에요.',
        explanation: '"it\'s a pain"은 귀찮은 수고로움을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: "Carrying heavy grocery bags up four flights of stairs—[it's a pain, it's a song, it's a dream, it's a breeze] without an elevator.",
        answer: "it's a pain",
        options: ["it's a pain", "it's a song", "it's a dream", "it's a breeze"],
        korean: '엘리베이터 없이 무거운 장보기 가방을 4층까지 계단으로 들고 올라가는 것—정말 골칫거리이자 힘든 일이에요.',
        explanation: '"it\'s a pain"은 번거롭고 힘든 일입니다.'
      },
      {
        type: 'multiple-choice',
        english: "Waiting in a slow, crowded line at the post office on Monday morning—[it's a pain, it's a laugh, it's a game, it's a treat] for busy people.",
        answer: "it's a pain",
        options: ["it's a pain", "it's a laugh", "it's a game", "it's a treat"],
        korean: '월요일 아침 우체국에서 느리고 붐비는 줄을 서서 기다리는 것—바쁜 사람들에겐 참 성가신 일이에요.',
        explanation: '"it\'s a pain"은 짜증 나거나 답답하고 귀찮은 상황을 뜻합니다.'
      }
    ]
  },

  // 18. Way back
  {
    keyExpression: 'Way back',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[Way back, Soon after, Right away, Step forward] in the nineteen-seventies, our family purchased this parcel of forested land near Yosemite.',
        answer: 'Way back',
        options: ['Way back', 'Soon after', 'Right away', 'Step forward'],
        korean: '아주 먼 옛날(훨씬 전) 1970년대에 우리 가족은 요세미티 근처의 이 울창한 숲 부지를 매입했습니다.',
        explanation: '"way back"은 과거의 "아주 먼 옛날에, 훨씬 전에"를 뜻하는 일상 회화 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: '[Way back when I was a little kid], we played outside until dinner without phones.',
        answer: 'Way back when I was a little kid',
        tokens: ['Way', 'back', 'when', 'I', 'was', 'a', 'little', 'kid'],
        options: ['Way', 'back', 'when', 'I', 'was', 'a', 'little', 'kid'],
        korean: '내가 어린아이였던 아주 먼 옛날에는 휴대전화 없이도 저녁때까지 밖에서 놀았어요.',
        explanation: '"Way back when"은 아주 오래전 시절을 회상할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Way back, Soon then, Just now, Up front] in elementary school, we walked to school together every morning.',
        answer: 'Way back',
        options: ['Way back', 'Soon then', 'Just now', 'Up front'],
        korean: '아주 오래전 초등학교 시절에는 매일 아침 함께 걸어서 등교했어요.',
        explanation: '"Way back"은 오래전 과거 시점을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My grandfather built that small red barn [way back, right now, soon after, forward then] in nineteen-sixty.',
        answer: 'way back',
        options: ['way back', 'right now', 'soon after', 'forward then'],
        korean: '우리 할아버지께서는 아주 오래전 1960년에 저 작은 빨간 헛간을 지으셨어요.',
        explanation: '"way back in (year)"는 아주 먼 과거 연도를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Way back, Near by, Look out, Come here] when my mother was young, her family lived on a small dairy farm.',
        answer: 'Way back',
        options: ['Way back', 'Near by', 'Look out', 'Come here'],
        korean: '아주 오래전 우리 엄마가 어렸을 적에, 외가 식구들은 작은 낙농 농장에 살았어요.',
        explanation: '"Way back"은 부모님 세대의 오랜 옛날을 뜻합니다.'
      }
    ]
  },

  // 19. It was surprising that
  {
    keyExpression: 'It was surprising that',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was forbidden that, It was impossible that, It was mandatory that] a mama bear and her older cub showed up in broad daylight near our cabin.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was forbidden that', 'It was impossible that', 'It was mandatory that'],
        korean: '한낮 대낮에 어미 곰과 다 큰 새끼 곰이 우리 오두막 근처에 나타났다는 사실은 참 놀라웠어요.',
        explanation: '"it was surprising that ~"은 "~라는 사실이 참 놀라웠다"라는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: '[It was surprising that the sun came out] after such a stormy morning.',
        answer: 'It was surprising that the sun came out',
        tokens: ['It', 'was', 'surprising', 'that', 'the', 'sun', 'came', 'out'],
        options: ['It', 'was', 'surprising', 'that', 'the', 'sun', 'came', 'out'],
        korean: '그렇게 폭풍우가 몰아치던 아침 뒤에 해가 쨍쨍 나왔다는 사실은 참 놀라웠어요.',
        explanation: '"It was surprising that"은 예상치 못한 일에 놀라움을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was illegal that, It was boring that, It was painful that] our small school team won the city soccer championship.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was illegal that', 'It was boring that', 'It was painful that'],
        korean: '우리 작은 학교 팀이 도시 축구 대회에서 우승했다는 사실은 참 놀라웠어요.',
        explanation: '"It was surprising that"은 놀라운 성과를 말할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was bad that, It was late that, It was dark that] all fifteen guests arrived at the dinner on time.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was bad that', 'It was late that', 'It was dark that'],
        korean: '열다섯 명의 손님 전원이 저녁 식사에 제시간에 도착했다는 것은 참 놀라웠어요.',
        explanation: '"It was surprising that"은 뜻밖의 사실을 언급할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was ugly that, It was cold that, It was poor that] he solved the difficult puzzle in just five minutes.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was ugly that', 'It was cold that', 'It was poor that'],
        korean: '그가 어려운 퍼즐을 단 5분 만에 풀었다는 사실은 참 놀라웠어요.',
        explanation: '"It was surprising that"은 기대 이상의 빠른 결과에 놀라움을 표합니다.'
      }
    ]
  },

  // 20. disturbed
  {
    keyExpression: 'disturbed',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Something in the deep timber must have [disturbed, cheered, praised, honored] the bear and forced her to move during the afternoon heat.',
        answer: 'disturbed',
        options: ['disturbed', 'cheered', 'praised', 'honored'],
        korean: '깊은 숲속의 무언가가 곰의 평온(휴식)을 방해해서 한낮의 더위 속에 이동하게 만들었음이 틀림없어요.',
        explanation: '"disturbed"는 휴식이나 평온을 "방해하다, 어지럽히다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The loud barking dog [disturbed my sleep early this morning] at dawn.',
        answer: 'disturbed my sleep early this morning',
        tokens: ['disturbed', 'my', 'sleep', 'early', 'this', 'morning'],
        options: ['disturbed', 'my', 'sleep', 'early', 'this', 'morning'],
        korean: '시끄럽게 짖는 개가 오늘 이른 새벽 내 잠을 방해했어요.',
        explanation: '"disturbed my sleep"은 수면을 방해받았음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Please turn your phone to silent so other moviegoers are not [disturbed, helped, painted, washed] during the film.',
        answer: 'disturbed',
        options: ['disturbed', 'helped', 'painted', 'washed'],
        korean: '영화 상영 중에 다른 관객들이 방해받지 않도록 휴대전화를 무음으로 바꿔주세요.',
        explanation: '"disturbed"는 집중이나 관람을 방해받는 상태입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The sudden knock on the front door [disturbed, pleased, fed, thanked] her quiet reading time in the study.',
        answer: 'disturbed',
        options: ['disturbed', 'pleased', 'fed', 'thanked'],
        korean: '현관문을 두드리는 갑작스러운 소리가 서재에서의 그녀의 조용한 독서 시간을 방해했어요.',
        explanation: '"disturbed"는 평온한 시간을 깨뜨림을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The gentle sound of soft rain outside never [disturbed, dried, bought, cleaned] the sleeping cat on the sofa.',
        answer: 'disturbed',
        options: ['disturbed', 'dried', 'bought', 'cleaned'],
        korean: '창밖의 부드러운 빗소리는 소파 위에서 자고 있는 고양이의 단잠을 전혀 방해하지 않았어요.',
        explanation: '"disturbed"는 휴식을 어지럽히다의 부정문 표현입니다.'
      }
    ]
  },

  // 21. sightings
  {
    keyExpression: 'sightings',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Park rangers reported frequent [sightings, cancellations, deletions, purchases] of black bears and mountain lions near the residential cabins this summer.',
        answer: 'sightings',
        options: ['sightings', 'cancellations', 'deletions', 'purchases'],
        korean: '공원 순찰대원들은 올여름 주거용 오두막 근처에서 흑곰과 산사자의 잦은 목격 사례들을 보고했습니다.',
        explanation: '"sightings"는 희귀 동물이나 물체의 "목격 사례, 목격"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'There were multiple [sightings of deer in our backyard] early in the morning.',
        answer: 'sightings of deer in our backyard',
        tokens: ['sightings', 'of', 'deer', 'in', 'our', 'backyard'],
        options: ['sightings', 'of', 'deer', 'in', 'our', 'backyard'],
        korean: '이른 아침에 우리 집 뒷마당에서 사슴이 여러 차례 목격되었어요.',
        explanation: '"sightings of deer"는 사슴 목격 사례들을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Neighbors shared recent [sightings, tickets, songs, dances] of a cute lost puppy near the school playground.',
        answer: 'sightings',
        options: ['sightings', 'tickets', 'songs', 'dances'],
        korean: '이웃들은 학교 운동장 근처에서 귀여운 길 잃은 강아지를 최근 목격한 사례들을 공유했어요.',
        explanation: '"sightings"는 동물이나 대상을 직접 목격한 일입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Hikers reported several [sightings, drawings, bookings, buildings] of colorful wild birds in the tall mountain pines.',
        answer: 'sightings',
        options: ['sightings', 'drawings', 'bookings', 'buildings'],
        korean: '등산객들은 높은 산골 소나무에서 알록달록한 야생 조류들을 여러 차례 목격했다고 전했어요.',
        explanation: '"sightings"는 자연 속 야생 동식물의 목격입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The local news reported frequent [sightings, recipes, receipts, lessons] of friendly dolphins playing near the city harbor.',
        answer: 'sightings',
        options: ['sightings', 'recipes', 'receipts', 'lessons'],
        korean: '지역 뉴스는 시 항구 근처에서 노니는 다정한 돌고래들의 잦은 목격을 보도했어요.',
        explanation: '"sightings"는 바다 동물 등의 목격 사례입니다.'
      }
    ]
  },

  // 22. have got to
  {
    keyExpression: 'have got to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Before freezing winter temperatures arrive, you [have got to, might not want to, are forbidden to, would rather not] drain all exterior water pipes.',
        answer: 'have got to',
        options: ['have got to', 'might not want to', 'are forbidden to', 'would rather not'],
        korean: '영하의 겨울 추위가 닥치기 전에 야외 수도 배관의 물을 반드시 빼두어야만 합니다.',
        explanation: '"have got to"는 강한 필요성과 의무를 나타내어 "반드시 ~해야만 한다" (= must, have to)라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'You [have got to taste this warm homemade soup] right now.',
        answer: 'have got to taste this warm homemade soup',
        tokens: ['have', 'got', 'to', 'taste', 'this', 'warm', 'homemade', 'soup'],
        options: ['have', 'got', 'to', 'taste', 'this', 'warm', 'homemade', 'soup'],
        korean: '지금 당장 이 따뜻한 집밥 수프를 꼭 맛보셔야 해요.',
        explanation: '"have got to taste"는 꼭 맛봐야 한다는 강한 권유입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [have got to, must not, are banned to, are forced to not] leave the house early to catch the morning train on time.',
        answer: 'have got to',
        options: ['have got to', 'must not', 'are banned to', 'are forced to not'],
        korean: '아침 기차를 제시간에 타려면 우리는 반드시 일찍 집을 나서야만 해요.',
        explanation: '"have got to"는 반드시 해야 하는 행동을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I [have got to, would rather avoid, am not supposed to, plan to never] finish my science homework before going outside to play.',
        answer: 'have got to',
        options: ['have got to', 'would rather avoid', 'am not supposed to', 'plan to never'],
        korean: '나가서 놀기 전에 나는 과학 숙제를 반드시 끝마쳐야만 해요.',
        explanation: '"have got to"는 해야 할 과업의 필수성을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You [have got to, need not, should never, are unable to] see the pretty spring flowers in the park; they look lovely.',
        answer: 'have got to',
        options: ['have got to', 'need not', 'should never', 'are unable to'],
        korean: '공원에 핀 예쁜 봄꽃들을 꼭 보셔야 해요. 정말 사랑스러워요.',
        explanation: '"have got to see"는 꼭 봐야 한다는 강력한 추천입니다.'
      }
    ]
  },

  // 23. figuring out
  {
    keyExpression: 'figuring out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'When you first move into a mountain cabin, you spend several weeks [figuring out, throwing away, giving in, breaking down] how all the woodstoves and generators operate.',
        answer: 'figuring out',
        options: ['figuring out', 'throwing away', 'giving in', 'breaking down'],
        korean: '산골 오두막에 처음 이사 오면 나무 난로와 발전기가 어떻게 작동하는지 원리를 알아내는 데 몇 주를 보내게 됩니다.',
        explanation: '"figure out"은 문제를 해결하거나 작동 원리 등을 "알아내다, 이해하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He spent the afternoon [figuring out the tricky math puzzle] in his workbook.',
        answer: 'figuring out the tricky math puzzle',
        tokens: ['figuring', 'out', 'the', 'tricky', 'math', 'puzzle'],
        options: ['figuring', 'out', 'the', 'tricky', 'math', 'puzzle'],
        korean: '그는 문제집에 있는 까다로운 수학 퍼즐을 풀어내며(알아내며) 오후를 보냈어요.',
        explanation: '"figuring out"은 해결책이나 답을 찾아내는 과정입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We spent an hour [figuring out, throwing out, giving up, breaking off] how to assemble the new wooden bookshelf.',
        answer: 'figuring out',
        options: ['figuring out', 'throwing out', 'giving up', 'breaking off'],
        korean: '우리는 새 원목 책장을 어떻게 조립해야 하는지 알아내는 데 한 시간을 보냈어요.',
        explanation: '"figuring out how to"는 방법을 알아내다를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She is very clever at [figuring out, turning away, running from, hiding behind] how to fix broken household gadgets.',
        answer: 'figuring out',
        options: ['figuring out', 'turning away', 'running from', 'hiding behind'],
        korean: '그녀는 고장 난 가전제품을 어떻게 고치는지 알아내는 데 매우 영리해요.',
        explanation: '"figuring out"은 문제 해결 방안을 파악하는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The children had fun [figuring out, burning up, walking out, giving in] the rules of the new board game together.',
        answer: 'figuring out',
        options: ['figuring out', 'burning up', 'walking out', 'giving in'],
        korean: '아이들은 새 보드게임의 규칙을 함께 알아내며 즐거운 시간을 보냈어요.',
        explanation: '"figuring out the rules"는 규칙을 이해하고 익히는 것입니다.'
      }
    ]
  }
];

// Write quiz-pool.json
const poolPath = path.join(LESSON_DIR, 'quiz-pool.json');
fs.writeFileSync(poolPath, JSON.stringify(POOL, null, 2), 'utf8');
console.log(`[Success] Written: ${poolPath} (${POOL.length} expressions, ${POOL.length * 5} sentences)`);

// Write quiz.md using the 1st sentence of each pool entry
let md = `# Lesson 6: Gene's Cabin Life & Mountain Wildlife Quizzes\n\n`;
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
