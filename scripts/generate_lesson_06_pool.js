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
        english: 'After hiking off the trail, we [ended up near a hidden mountain waterfall].',
        answer: 'ended up near a hidden mountain waterfall',
        tokens: ['ended', 'up', 'near', 'a', 'hidden', 'mountain', 'waterfall'],
        options: ['ended', 'up', 'near', 'a', 'hidden', 'mountain', 'waterfall'],
        korean: '등산로를 벗어나 걷다가 우리는 결국 숨겨진 산골 폭포 근처에 이르게 되었어요.',
        explanation: '방향을 틀어 결국 뜻밖의 장소에 도달했음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Gene originally planned to stay for just one summer, but he [ended up, stood by, dropped in, cut out] living in the mountains for decades.',
        answer: 'ended up',
        options: ['ended up', 'stood by', 'dropped in', 'cut out'],
        korean: '진(Gene) 아버님은 원래 딱 한 해 여름만 머물 계획이었지만, 결국 수십 년 동안 산골에서 살게 되셨어요.',
        explanation: '당초 계획과 달리 산골 생활을 지속하게 된 결말입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The heavy evening fog rolled in, so the road trip group [ended up, pulled through, broke out, gave in] staying at a cozy motel.',
        answer: 'ended up',
        options: ['ended up', 'pulled through', 'broke out', 'gave in'],
        korean: '짙은 저녁 안개가 몰려와서 로드트립 일행은 결국 아늑한 모텔에서 하룻밤을 묵게 되었습니다.',
        explanation: '날씨로 인해 일정의 결말이 바뀌었음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They had so much fun chatting around the campfire that everyone [ended up, held back, passed up, checked out] sleeping under the stars.',
        answer: 'ended up',
        options: ['ended up', 'held back', 'passed up', 'checked out'],
        korean: '캠프파이어 주변에서 수다 떠는 것이 너무 재미있어서 모두가 결국 별빛 아래에서 잠을 자게 되었어요.',
        explanation: '즐거운 대화 끝에 야외 취침을 하게 된 상황입니다.'
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
        english: 'Wild deer often [hang around our cabin porch in the morning].',
        answer: 'hang around our cabin porch in the morning',
        tokens: ['hang', 'around', 'our', 'cabin', 'porch', 'in', 'the', 'morning'],
        options: ['hang', 'around', 'our', 'cabin', 'porch', 'in', 'the', 'morning'],
        korean: '아침이면 야생 사슴들이 우리 오두막 현관 주변에서 자주 어슬렁거려요.',
        explanation: '야생동물이 집 근처를 서성거리는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Tourists should not [hang around, speed up, cheer up, wrap up] near bear habitats after dusk when predators hunt.',
        answer: 'hang around',
        options: ['hang around', 'speed up', 'cheer up', 'wrap up'],
        korean: '맹수들이 사냥하는 해 질 녘 이후에는 관광객들이 곰 서식지 주변을 서성거려서는 안 됩니다.',
        explanation: '위험 지역에서 어슬렁거리지 말라는 경고입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Instead of going straight home after school, the teenagers liked to [hang around, back out, break down, drop out] by the town skate park.',
        answer: 'hang around',
        options: ['hang around', 'back out', 'break down', 'drop out'],
        korean: '방과 후 곧장 집에 가는 대신 십대 청소년들은 동네 스케이트 공원 근처에서 서성거리며 어울리는 것을 좋아했어요.',
        explanation: '친구들과 함께 시간을 보내는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Feel free to [hang around, turn away, cut off, stand aside] inside the visitor center until the afternoon rainstorm passes.',
        answer: 'hang around',
        options: ['hang around', 'turn away', 'cut off', 'stand aside'],
        korean: '오후 폭풍우가 지나갈 때까지 방문자 센터 안에서 편하게 머무르며 시간 보내세요.',
        explanation: '비를 피하며 실내에서 시간을 보내도록 권하는 말입니다.'
      }
    ]
  },

  // 3. Practical
  {
    keyExpression: 'Practical',
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
        english: 'He always gives [practical advice for fixing household appliances].',
        answer: 'practical advice for fixing household appliances',
        tokens: ['practical', 'advice', 'for', 'fixing', 'household', 'appliances'],
        options: ['practical', 'advice', 'for', 'fixing', 'household', 'appliances'],
        korean: '그는 가전제품 수리에 대해 항상 현실적이고 실용적인 조언을 해줍니다.',
        explanation: '실생활에 바로 도움 되는 조언을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A four-wheel-drive pickup truck is much more [practical, fancy, fragile, imaginary] than a luxury convertible on steep dirt roads.',
        answer: 'practical',
        options: ['practical', 'fancy', 'fragile', 'imaginary'],
        korean: '가파른 비포장 흙길에서는 고급 오픈카보다 4륜구동 픽업트럭이 훨씬 더 실용적입니다.',
        explanation: '상황에 부합하는 실용적인 차량입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Instead of buying ornamental souvenirs, she prefers [practical, useless, invisible, wasteful] gifts that people can use daily.',
        answer: 'practical',
        options: ['practical', 'useless', 'invisible', 'wasteful'],
        korean: '그녀는 장식용 기념품을 사는 대신 사람들이 매일 쓸 수 있는 실용적인 선물을 더 선호합니다.',
        explanation: '실용적인 선물의 가치를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The forestry workshop focuses on [practical, abstract, fictional, distant] hands-on training rather than academic lectures.',
        answer: 'practical',
        options: ['practical', 'abstract', 'fictional', 'distant'],
        korean: '산림 워크숍은 이론적인 학술 강의보다 실질적인 실습 훈련에 집중합니다.',
        explanation: '이론과 대비되는 실습 중심 교육입니다.'
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
        english: 'The whole family [went out to dinner at a seafood restaurant].',
        answer: 'went out to dinner at a seafood restaurant',
        tokens: ['went', 'out', 'to', 'dinner', 'at', 'a', 'seafood', 'restaurant'],
        options: ['went', 'out', 'to', 'dinner', 'at', 'a', 'seafood', 'restaurant'],
        korean: '온 가족이 해산물 식당으로 저녁 외식을 하러 나갔습니다.',
        explanation: '가족 전체가 저녁 외식을 즐기는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whenever Uncle Wayne visited town, Gene and Wayne [went out to dinner, called a doctor, fought a bear, ran a marathon] to catch up over steak.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'called a doctor', 'fought a bear', 'ran a marathon'],
        korean: '웨인 삼촌이 마을을 방문할 때마다, 진 아버님과 웨인은 스테이크를 먹으며 밀린 이야기를 나누기 위해 저녁 외식을 하러 나가셨어요.',
        explanation: '형제가 회포를 풀기 위해 외식을 나가는 정겨운 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Instead of cooking after our long road trip, we simply [went out to dinner, cut down trees, swept the roof, mowed the lawn] at the local diner.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'cut down trees', 'swept the roof', 'mowed the lawn'],
        korean: '긴 로드트립 후 요리하는 대신 우리는 동네 식당에서 편하게 저녁 외식을 했습니다.',
        explanation: '피곤할 때 밖에서 사 먹는 자연스러운 일상입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The office team finished the big quarterly project and happily [went out to dinner, stayed up late, packed their bags, filed complaints] together.',
        answer: 'went out to dinner',
        options: ['went out to dinner', 'stayed up late', 'packed their bags', 'filed complaints'],
        korean: '사무실 팀원들은 분기별 대형 프로젝트를 마무리하고 기분 좋게 다 함께 저녁 외식을 하러 나갔어요.',
        explanation: '프로젝트 성공 기념 회식입니다.'
      }
    ]
  },

  // 5. pushing, aside
  {
    keyExpression: 'pushing, aside',
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
        english: 'She was gently [pushing her vegetables aside on the plate].',
        answer: 'pushing her vegetables aside on the plate',
        tokens: ['pushing', 'her', 'vegetables', 'aside', 'on', 'the', 'plate'],
        options: ['pushing', 'her', 'vegetables', 'aside', 'on', 'the', 'plate'],
        korean: '그녀는 접시 위에서 야채들을 살포시 한쪽 옆으로 밀어두고 있었어요.',
        explanation: '먹기 싫은 야채를 옆으로 밀어놓는 행동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Before sitting down at the cluttered workbench, he started [pushing tools aside, building a house, painting walls, breaking glass] to clear space.',
        answer: 'pushing tools aside',
        options: ['pushing tools aside', 'building a house', 'painting walls', 'breaking glass'],
        korean: '어수선한 작업대에 앉기 전 그는 공간을 확보하기 위해 공구들을 옆으로 밀어 치워두기 시작했어요.',
        explanation: '물건을 옆으로 밀어 공간을 만드는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The determined hiker kept [pushing thorny branches aside, dropping her compass, losing her boots, falling backward] while navigating through dense brush.',
        answer: 'pushing thorny branches aside',
        options: ['pushing thorny branches aside', 'dropping her compass', 'losing her boots', 'falling backward'],
        korean: '결의에 찬 등산객은 빽빽한 덤불숲을 헤쳐 나가며 가시나무 가지들을 계속 옆으로 밀어 제쳤습니다.',
        explanation: '나뭇가지를 옆으로 헤치며 걷는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He succeeded by [pushing fear aside, running away quickly, giving up early, blaming others] and focusing entirely on his presentation.',
        answer: 'pushing fear aside',
        options: ['pushing fear aside', 'running away quickly', 'giving up early', 'blaming others'],
        korean: '그는 두려움을 한쪽 옆으로 제쳐두고 발표에만 온전히 집중함으로써 성공을 거두었습니다.',
        explanation: '감정이나 걱정을 떨쳐낼 때도 "push aside"를 씁니다.'
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
        english: 'He brought his guitar to [show off his musical skills at the party].',
        answer: 'show off his musical skills at the party',
        tokens: ['show', 'off', 'his', 'musical', 'skills', 'at', 'the', 'party'],
        options: ['show', 'off', 'his', 'musical', 'skills', 'at', 'the', 'party'],
        korean: '그는 파티에서 자신의 음악 실력을 뽐내기 위해 기타를 가져왔어요.',
        explanation: '자신의 재능을 남들에게 과시하려는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Don\'t buy flashy designer sports cars just to [show off, save money, live quietly, avoid traffic] to shallow acquaintances.',
        answer: 'show off',
        options: ['show off', 'save money', 'live quietly', 'avoid traffic'],
        korean: '천박한 지인들에게 과시하기 위해서만 화려한 명품 스포츠카를 사지 마세요.',
        explanation: '남에게 보여주기 위한 과시적 소비를 경계하는 말입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The little boy did a clumsy cartwheel on the lawn just to [show off, break a bone, fall asleep, cry loudly] for his grandparents.',
        answer: 'show off',
        options: ['show off', 'break a bone', 'fall asleep', 'cry loudly'],
        korean: '어린 소년은 조부모님께 자랑해 보이려고 잔디밭에서 어설픈 옆돌기를 해 보였습니다.',
        explanation: '어린아이가 어른들에게 재롱을 뽐내는 귀여운 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'True martial artists are humble and never feel the need to [show off, train hard, bow respectfully, stay disciplined] in public.',
        answer: 'show off',
        options: ['show off', 'train hard', 'bow respectfully', 'stay disciplined'],
        korean: '진정한 무도인은 겸손하며 대중 앞에서 자신의 실력을 과시할 필요를 결코 느끼지 않습니다.',
        explanation: '진정한 고수의 겸양을 나타냅니다.'
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
        english: 'Everyone in the office [enjoyed being around his cheerful personality].',
        answer: 'enjoyed being around his cheerful personality',
        tokens: ['enjoyed', 'being', 'around', 'his', 'cheerful', 'personality'],
        options: ['enjoyed', 'being', 'around', 'his', 'cheerful', 'personality'],
        korean: '사무실의 모든 사람들은 그의 유쾌한 성격 곁에 함께 어울리는 것을 좋아했습니다.',
        explanation: '밝은 사람 주변에 머물며 함께하는 즐거움입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Children always [enjoyed being around, refused staying with, cried loudly near, ran away from] Uncle Wayne because of his hilarious campfire tales.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'refused staying with', 'cried loudly near', 'ran away from'],
        korean: '웨인 삼촌의 재미있는 모닥불 이야기 덕분에 아이들은 늘 웨인 삼촌 곁에 어울려 있는 것을 너무 좋아했어요.',
        explanation: '유쾌한 삼촌 곁을 좋아하는 아이들의 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She has such a calming presence that patients sincerely [enjoyed being around, complained bitterly about, ran away from, grew nervous of] her during therapy.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'complained bitterly about', 'ran away from', 'grew nervous of'],
        korean: '그녀는 사람을 편안하게 해주는 힘이 있어서 환자들은 치료 시간 동안 그녀 곁에 함께 있는 것을 진심으로 좋아했습니다.',
        explanation: '마음을 편안하게 해주는 사람과 함께하는 만족감입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Even though they held differing opinions on politics, they [enjoyed being around, fought each other, broke relations with, refused greeting] one another as friends.',
        answer: 'enjoyed being around',
        options: ['enjoyed being around', 'fought each other', 'broke relations with', 'refused greeting'],
        korean: '비록 정치적 견해는 달랐지만, 그들은 친구로서 서로의 곁에 함께 어울리는 시간을 즐겼습니다.',
        explanation: '성숙한 우정을 묘사합니다.'
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
        english: 'Gene and Wayne Hunter [got taken to the bar by the elders].',
        answer: 'got taken to the bar by the elders',
        tokens: ['got', 'taken', 'to', 'the', 'bar', 'by', 'the', 'elders'],
        options: ['got', 'taken', 'to', 'the', 'bar', 'by', 'the', 'elders'],
        korean: '진과 웨인 헌터는 어른들에게 이끌려 술집으로 함께 데려가 졌어요.',
        explanation: '어른들의 손에 이끌려 펍으로 향했던 에피소드입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When my father visited his old hometown buddies, he inevitably [got taken to the bar, was thrown in jail, got lost at sea, was taken to court] on main street.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'was thrown in jail', 'got lost at sea', 'was taken to court'],
        korean: '아버지께서 옛 고향 친구들을 만나러 가셨을 때, 어김없이 번화가의 단골 술집으로 이끌려 가셨어요.',
        explanation: '오랜 친구들에게 이끌려 술자리에 가게 되는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The visiting sales reps [got taken to the bar, were given tickets, got kicked off, were turned away] by their hosts to celebrate the finalized contract.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'were given tickets', 'got kicked off', 'were turned away'],
        korean: '방문한 영업 담당자들은 계약 성사를 축하하기 위해 고객사 측의 안내로 술집으로 데려가 졌습니다.',
        explanation: '축하 술자리로 초대받아 동행한 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'On his twenty-first birthday, Mark happily [got taken to the bar, was locked up, got left behind, fell off a roof] by his college roommates.',
        answer: 'got taken to the bar',
        options: ['got taken to the bar', 'was locked up', 'got left behind', 'fell off a roof'],
        korean: '스물한 번째 생일에 마크는 대학 룸메이트들의 손에 이끌려 기분 좋게 펍으로 향했습니다.',
        explanation: '합법적 음주 연령이 된 생일 축하 파티입니다.'
      }
    ]
  },

  // 9. one of the times
  {
    keyExpression: 'one of the times',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I don\'t recall the exact date, but it was [one of the times, none of the days, all of the reasons, out of the blue] we visited grandma\'s country farmhouse.',
        answer: 'one of the times',
        options: ['one of the times', 'none of the days', 'all of the reasons', 'out of the blue'],
        korean: '정확한 날짜는 기억나지 않지만, 우리가 할머니의 시골 농가를 찾아갔던 여러 번 중 어느 한 번이었어요.',
        explanation: '"one of the times"는 과거에 반복되었던 만남 중 "그 여러 번 중 어느 한 번"을 회상할 때 씁니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'That funny incident happened during [one of the times we went camping].',
        answer: 'one of the times we went camping',
        tokens: ['one', 'of', 'the', 'times', 'we', 'went', 'camping'],
        options: ['one', 'of', 'the', 'times', 'we', 'went', 'camping'],
        korean: '그 재미있는 사건은 우리가 캠핑을 갔던 여러 번 중 어느 한 번 동안 일어났어요.',
        explanation: '여러 번의 캠핑 중 한 일화를 떠올릴 때 쓰는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This photograph was snapped during [one of the times, each of the rules, out of the question, ahead of the pack] we fished along the dry creek.',
        answer: 'one of the times',
        options: ['one of the times', 'each of the rules', 'out of the question', 'ahead of the pack'],
        korean: '이 사진은 우리가 마른 개울을 따라 낚시를 하러 갔던 여러 번 중 한 번에 찍힌 사진입니다.',
        explanation: '사진 속 추억의 순간을 회상합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Do you remember [one of the times, none of the places, all of the borders, some of the maps] our old station wagon broke down on highway 50?',
        answer: 'one of the times',
        options: ['one of the times', 'none of the places', 'all of the borders', 'some of the maps'],
        korean: '우리 옛 왜건 차량이 50번 국도에서 고장 났던 그 여러 번 중 한 번을 기억하니?',
        explanation: '자주 고장 나던 시절의 한 장면을 묻는 회상입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It was [one of the times, side by side, neck and neck, far and wide] Patty baked fresh apple pie for the family Sunday picnic.',
        answer: 'one of the times',
        options: ['one of the times', 'side by side', 'neck and neck', 'far and wide'],
        korean: '패티(Patty) 어머님이 가족 일요일 소풍을 위해 신선한 사과파이를 구워주셨던 여러 번 중 어느 한 번이었어요.',
        explanation: '어머니의 정성 어린 파이를 추억하는 표현입니다.'
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
        english: 'They had that awkward conversation [early in their relationship].',
        answer: 'early in their relationship',
        tokens: ['early', 'in', 'their', 'relationship'],
        options: ['early', 'in', 'their', 'relationship'],
        korean: '그들은 교제 초기 단계에 그 어색한 대화를 나누었습니다.',
        explanation: '연애 초기의 풋풋하거나 어색했던 순간입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Establishing honest communication [early in the relationship, out of the blue, behind the curve, down the drain] prevents deep misunderstandings later.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'out of the blue', 'behind the curve', 'down the drain'],
        korean: '연애 초기 단계에 솔직한 소통 방식을 정착시키는 것은 나중에 깊은 오해를 예방해 줍니다.',
        explanation: '관계 초기의 신뢰 형성을 강조합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He surprised her with handmade pottery [early in the relationship, late in the night, deep in thought, wide in range] which she still keeps on her mantelpiece.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'late in the night', 'deep in thought', 'wide in range'],
        korean: '그는 연애 초기에 직접 만든 도자기로 그녀를 깜짝 놀라게 해주었는데, 그녀는 그것을 지금도 벽난로 선반 위에 간직하고 있습니다.',
        explanation: '연애 초기의 뜻깊은 선물 추억입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Both of them were nervous and shy [early in the relationship, out of the box, beside the mark, under the thumb] before realizing how much they shared in common.',
        answer: 'early in the relationship',
        options: ['early in the relationship', 'out of the box', 'beside the mark', 'under the thumb'],
        korean: '둘은 공통점이 얼마나 많은지 깨닫기 전인 교제 초기에는 긴장하고 수줍어했어요.',
        explanation: '연애 초기의 수줍은 감정입니다.'
      }
    ]
  },

  // 11. all, the, way, from, to
  {
    keyExpression: 'all, the, way, from, to',
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
        english: 'They drove [all the way from Martinez to Lafayette in heavy traffic].',
        answer: 'all the way from Martinez to Lafayette in heavy traffic',
        tokens: ['all', 'the', 'way', 'from', 'Martinez', 'to', 'Lafayette', 'in', 'heavy', 'traffic'],
        options: ['all', 'the', 'way', 'from', 'Martinez', 'to', 'Lafayette', 'in', 'heavy', 'traffic'],
        korean: '그들은 극심한 교통 체증 속에서 마티네즈에서 라피엣까지 먼 길을 내내 운전해 갔어요.',
        explanation: '먼 거리를 중단 없이 이동한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My grandparents flew [all the way from, instead of, far behind, out toward] Seoul to attend our daughter\'s college graduation ceremony in California.',
        answer: 'all the way from',
        options: ['all the way from', 'instead of', 'far behind', 'out toward'],
        korean: '우리 조부모님께서는 캘리포니아에서 열린 딸의 대학교 졸업식에 참석하기 위해 서울에서 그 먼 거리를 줄곧 비행기 타고 오셨어요.',
        explanation: '먼 곳에서 먼 길을 마다하지 않고 찾아온 정성입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Water in this aqueduct flows [all the way from, by way of, at the cost of, under cover of] the Sierra snowpack directly into valley irrigation canals.',
        answer: 'all the way from',
        options: ['all the way from', 'by way of', 'at the cost of', 'under cover of'],
        korean: '이 수로의 물은 시에라 산맥의 만년설로부터 계곡 관개 수로로 먼 거리를 내내 흘러 들어옵니다.',
        explanation: '자연의 물이 먼 거리를 흘러오는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The historic steam train carried logs [all the way from, regardless of, in place of, on terms with] the high alpine ridge down to the coastal sawmill.',
        answer: 'all the way from',
        options: ['all the way from', 'regardless of', 'in place of', 'on terms with'],
        korean: '역사적인 증기 기관차는 높은 산등성이에서 해안가 제재소까지 통나무를 먼 거리를 내내 실어 날랐습니다.',
        explanation: '장거리 운송 과정을 묘사합니다.'
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
        options: ['went around a corner', 'backed up a hill', 'stopped at a sign,', 'blew a radiator'],
        korean: '차가 너무 빠르게 길모퉁이(코너)를 도는 바람에 고정되지 않은 장보기 식료품들이 뒷좌석 바닥으로 미끄러져 쏟아졌어요.',
        explanation: '"go around a corner"는 운전 중에 "길모퉁이/코너를 돌다"라는 뜻입니다 (과거형: went around a corner).'
      },
      {
        type: 'drag-and-drop',
        english: 'As soon as the truck [went around a sharp mountain corner], the pies slid over.',
        answer: 'went around a sharp mountain corner',
        tokens: ['went', 'around', 'a', 'sharp', 'mountain', 'corner'],
        options: ['went', 'around', 'a', 'sharp', 'mountain', 'corner'],
        korean: '트럭이 가파른 산길 모퉁이를 돌자마자 파이들이 옆으로 미끄러져 버렸어요.',
        explanation: '산길 코너를 돌 때 짐이 쏠리는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Slow down before you [go around a corner, drop your guard, lose your mind, run out of gas] on icy mountain roads.',
        answer: 'go around a corner',
        options: ['go around a corner', 'drop your guard', 'lose your mind', 'run out of gas'],
        korean: '빙판길 산골 도로에서는 모퉁이를 돌기 전에 속도를 줄이세요.',
        explanation: '코너링 전 감속 운전 안전 수칙입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The cyclist signaled with his left hand as he [went around a corner, took a shower, built a shelter, tied a knot] onto oak avenue.',
        answer: 'went around a corner',
        options: ['went around a corner', 'took a shower', 'built a shelter', 'tied a knot'],
        korean: '자전거 라이더는 오크 애비뉴로 모퉁이를 돌면서 왼손으로 수신호를 보냈습니다.',
        explanation: '자전거로 코너를 도는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [went around a corner, broke the bank, jumped the gun, hit the wall] and suddenly beheld a breathtaking panoramic view of the Pacific Ocean.',
        answer: 'went around a corner',
        options: ['went around a corner', 'broke the bank', 'jumped the gun', 'hit the wall'],
        korean: '우리가 길모퉁이를 돌자마자 눈앞에 태평양의 숨 막히는 파노라마 전망이 활짝 펼쳐졌어요.',
        explanation: '길모퉁이를 돌자마자 마주친 경이로운 풍경입니다.'
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
        english: 'Autumn is [my favorite time of year for cabin camping].',
        answer: 'my favorite time of year for cabin camping',
        tokens: ['my', 'favorite', 'time', 'of', 'year', 'for', 'cabin', 'camping'],
        options: ['my', 'favorite', 'time', 'of', 'year', 'for', 'cabin', 'camping'],
        korean: '가을은 오두막 캠핑을 하기에 내가 일 년 중 가장 좋아하는 시기예요.',
        explanation: '캠핑하기 좋은 특정 계절을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Flight ticket prices fluctuate wildly depending on [the time of year, the color of paint, the depth of water, the size of shoes], peaking in late December.',
        answer: 'the time of year',
        options: ['the time of year', 'the color of paint', 'the depth of water', 'the size of shoes'],
        korean: '항공권 가격은 연중 어느 시기인지에 따라 크게 요동치며, 12월 말에 정점을 찍습니다.',
        explanation: '시기나 성수기에 따른 가격 변동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Spring is [the time of year, out of hand, down to earth, above the law] when mountain wildflowers bloom across the alpine meadows.',
        answer: 'the time of year',
        options: ['the time of year', 'out of hand', 'down to earth', 'above the law'],
        korean: '봄은 고산지대 초원에 산골 야생화들이 만발하는 연중 시기입니다.',
        explanation: '꽃이 피는 계절적 시기를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Wearing heavy wool flannel is perfectly normal for [this time of year, that side of street, this kind of metal, that line of code] in northern California.',
        answer: 'this time of year',
        options: ['this time of year', 'that side of street', 'this kind of metal', 'that line of code'],
        korean: '북부 캘리포니아에서는 연중 이맘때 두꺼운 모직 플란넬 셔츠를 입는 것이 지극히 자연스럽습니다.',
        explanation: '계절적 시기에 맞는 옷차림입니다.'
      }
    ]
  },

  // 14. Take a nap
  {
    keyExpression: 'Take a nap',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'After spending the morning chopping firewood in the crisp mountain air, Gene likes to [take a nap, run an errand, buy a ticket, start a fire] on the porch hammock.',
        answer: 'take a nap',
        options: ['take a nap', 'run an errand', 'buy a ticket', 'start a fire'],
        korean: '상쾌한 산골 공기 속에서 아침 내내 장작을 팬 뒤, 진(Gene) 아버님은 현관 해먹에서 낮잠을 잠깐 주무시는 것을 좋아하십니다.',
        explanation: '"take a nap"은 "낮잠을 자다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I always feel refreshed after [I take a short twenty-minute nap].',
        answer: 'I take a short twenty-minute nap',
        tokens: ['I', 'take', 'a', 'short', 'twenty-minute', 'nap'],
        options: ['I', 'take', 'a', 'short', 'twenty-minute', 'nap'],
        korean: '나는 20분 동안 짧은 낮잠을 자고 나면 늘 몸이 개운해져요.',
        explanation: '짧은 낮잠 후의 재충전입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you feel exhausted after the long highway drive, pull into a rest stop and [take a nap, wash the car, buy a souvenir, read the news] safely.',
        answer: 'take a nap',
        options: ['take a nap', 'wash the car', 'buy a souvenir', 'read the news'],
        korean: '장거리 고속도로 운전 후 너무 피곤하다면 휴게소에 차를 대고 안전하게 낮잠을 청하세요.',
        explanation: '졸음운전 예방을 위한 낮잠 권장입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The warm autumn sunshine streaming through the cabin window tempted everyone to [take a nap, clean the roof, dig a trench, paint the barn].',
        answer: 'take a nap',
        options: ['take a nap', 'clean the roof', 'dig a trench', 'paint the barn'],
        korean: '오두막 창문으로 쏟아지는 따사로운 가을 햇살은 모두에게 나른하게 낮잠을 자고 싶게 만들었어요.',
        explanation: '따뜻한 햇살 속의 나른한 휴식입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Our energetic puppy finally exhausted himself after playing fetch and curled up to [take a nap, chew the rug, bark at clouds, dig a hole].',
        answer: 'take a nap',
        options: ['take a nap', 'chew the rug', 'bark at clouds', 'dig a hole'],
        korean: '우리 활기찬 강아지는 공놀이를 한 뒤 마침내 지쳐서 몸을 웅크리고 낮잠을 잤어요.',
        explanation: '강아지가 낮잠을 자는 귀여운 모습입니다.'
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
        options: ['dull moment', 'bright future', 'clear sky,', 'deep ocean'],
        korean: '야생동물 출몰과 끝없는 오두막 일거리 속에서 숲속에 산다는 것은 지루하거나 심심한 순간이 결코 없다는 것을 의미합니다.',
        explanation: '"never a dull moment"는 언제나 활기차고 사건이 끊이지 않아 "지루할 틈이 없다"라는 관용 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'With three playful puppies in the house, [there is never a single dull moment].',
        answer: 'there is never a single dull moment',
        tokens: ['there', 'is', 'never', 'a', 'single', 'dull', 'moment'],
        options: ['there', 'is', 'never', 'a', 'single', 'dull', 'moment'],
        korean: '집에 장난꾸러기 강아지 세 마리가 있으니 단 한 순간도 심심할 틈이 없어요.',
        explanation: '항상 떠들썩하고 재미있는 일상을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Between hosting foreign exchange students and running an organic bakery, they rarely experience a [dull moment, quick temper, fair trial, cold shoulder].',
        answer: 'dull moment',
        options: ['dull moment', 'quick temper', 'fair trial', 'cold shoulder'],
        korean: '외국인 유학생들을 홈스테이로 돌보고 유기농 빵집을 운영하느라 그들은 지루한 순간을 거의 겪지 않습니다.',
        explanation: '바쁘고 역동적인 라이프스타일입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Uncle Wayne always brings so much laughter to family dinners that there is never a [dull moment, heavy heart, sharp pain, second thought] at the table.',
        answer: 'dull moment',
        options: ['dull moment', 'heavy heart', 'sharp pain', 'second thought'],
        korean: '웨인 삼촌은 가족 저녁 식사 자리에 언제나 많은 웃음을 가져다주셔서 식탁에 지루할 틈이 전혀 없어요.',
        explanation: '웨인 삼촌의 유쾌한 입담을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The chaotic backstage production of the live Broadway musical ensured there was not one [dull moment, empty chair, flat note, wild animal] for the crew.',
        answer: 'dull moment',
        options: ['dull moment', 'empty chair', 'flat note', 'wild animal'],
        korean: '생방송 브로드웨이 뮤지컬의 긴박한 백스테이지 현장은 스태프들에게 잠시도 지루할 틈을 주지 않았습니다.',
        explanation: '분주하고 흥미진진한 무대 뒤편입니다.'
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
        english: 'He was [backing out of the narrow driveway] very cautiously.',
        answer: 'backing out of the narrow driveway',
        tokens: ['backing', 'out', 'of', 'the', 'narrow', 'driveway'],
        options: ['backing', 'out', 'of', 'the', 'narrow', 'driveway'],
        korean: '그는 좁은 진입로에서 매우 조심스럽게 후진하여 차를 빼고 있었어요.',
        explanation: '차량을 후진하여 밖으로 빼는 동작입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After promising to finance our start-up project, the lead investor is suddenly [backing out, leaning in, stepping up, digging down] at the eleventh hour.',
        answer: 'backing out',
        options: ['backing out', 'leaning in', 'stepping up', 'digging down'],
        korean: '우리 스타트업 프로젝트에 자금을 대기로 약속해 놓고 주요 투자자가 마지막 순간에 갑자기 발을 빼고(약속을 번복하고) 있어요.',
        explanation: '약속이나 계약에서 "발을 빼다, 철회하다"라는 비유적 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Check the wooden fence posts periodically to make sure the galvanized nails aren\'t [backing out, rusting fast, growing tall, shining bright] over time.',
        answer: 'backing out',
        options: ['backing out', 'rusting fast', 'growing tall', 'shining bright'],
        korean: '시간이 지나면서 아연도금 못들이 밖으로 삐져나오지 않는지 나무 울타리 기둥을 주기적으로 점검하세요.',
        explanation: '못이나 나사가 헐거워져 빠지는 현상입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'There is no [backing out, speeding ahead, standing around, looking down] once you sign the legal property deed.',
        answer: 'backing out',
        options: ['backing out', 'speeding ahead', 'standing around', 'looking down'],
        korean: '법적 부동산 증서에 서명하고 나면 약속을 번복하고 발을 뺄 수 없습니다.',
        explanation: '계약 체결 후 철회 불가함을 뜻합니다.'
      }
    ]
  },

  // 17. It's a pain
  {
    keyExpression: 'It\'s a pain',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Climbing up on a steep ladder in subzero cold to replace hundreds of loose roofing screws—[it\'s a pain, it\'s a breeze, it\'s a delight, it\'s a miracle] to deal with every winter.',
        answer: "it's a pain",
        options: ["it's a pain", "it's a breeze", "it's a delight", "it's a miracle"],
        korean: '영하의 추위 속에서 수백 개의 헐거워진 지붕 나사를 교체하기 위해 가파른 사다리에 오르는 것—겨울마다 처리하기 참 골칫거리이자 성가신 일이에요.',
        explanation: '"it\'s a pain"은 다루기 힘들고 귀찮은 "골칫거리이다, 참 성가신 일이다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Clearing heavy wet snow from the long driveway is [such a pain every morning].',
        answer: 'such a pain every morning',
        tokens: ['such', 'a', 'pain', 'every', 'morning'],
        options: ['such', 'a', 'pain', 'every', 'morning'],
        korean: '긴 진입로에서 무겁고 축축한 눈을 치우는 것은 매일 아침 정말 성가신 일이에요.',
        explanation: '매일 반복되는 번거로운 일거리를 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Filling out forty pages of bureaucratic immigration paperwork is [a pain, a pleasure, a breeze, a celebration], but necessary for the visa.',
        answer: 'a pain',
        options: ['a pain', 'a pleasure', 'a breeze', 'a celebration'],
        korean: '40페이지에 달하는 관료적 이민 서류를 작성하는 것은 참 골칫거리이지만 비자를 위해서는 필수적입니다.',
        explanation: '지루하고 성가신 서류 작업입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When the internet router drops connection during an important video conference, [it\'s a real pain, it\'s a big gift, it\'s a sweet treat, it\'s an easy fix].',
        answer: "it's a real pain",
        options: ["it's a real pain", "it's a big gift", "it's a sweet treat", "it's an easy fix"],
        korean: '중요한 화상 회의 중에 인터넷 공유기 연결이 끊기면 정말 골치 아프고 짜증 나는 일이에요.',
        explanation: '짜증 나고 성가신 기술 오류입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Finding parking downtown on a Saturday night is [such a pain, such a joy, so simple, so quiet] that we prefer taking the subway.',
        answer: 'such a pain',
        options: ['such a pain', 'such a joy', 'so simple', 'so quiet'],
        korean: '토요일 밤에 시내에서 주차 공간을 찾는 것은 너무나 번거롭고 골칫거리여서 우리는 지하철 타는 것을 더 선호해요.',
        explanation: '주차난의 번거로움을 표현합니다.'
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
        english: 'Gene met Patty [way back when they were young].',
        answer: 'way back when they were young',
        tokens: ['way', 'back', 'when', 'they', 'were', 'young'],
        options: ['way', 'back', 'when', 'they', 'were', 'young'],
        korean: '진 아버님은 패티 어머님을 두 분이 젊으셨던 아주 오래전에 처음 만나셨어요.',
        explanation: '젊은 시절 아득한 옛 추억을 회상할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: '[Way back, Near ahead, In between, Close by] before smartphones existed, travelers relied on folded paper highway maps and payphones.',
        answer: 'Way back',
        options: ['Way back', 'Near ahead', 'In between', 'Close by'],
        korean: '스마트폰이 존재하기 훨씬 전 먼 옛날에는 여행자들이 종이 고속도로 지도와 공중전화에 의존했습니다.',
        explanation: '아날로그 시절의 과거를 회상합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We used to hike this rugged mountain trail [way back, right now, just yet, soon enough] when Wayne and Gene were energetic teenagers.',
        answer: 'way back',
        options: ['way back', 'right now', 'just yet', 'soon enough'],
        korean: '웨인 삼촌과 진 아버님이 에너지 넘치던 십대였던 아주 먼 옛날에 우리는 이 험준한 산길을 하이킹하곤 했어요.',
        explanation: '형제의 청소년기 추억입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The original stone foundation of the cabin was laid [way back, up close, out front, by side] during the California gold rush era.',
        answer: 'way back',
        options: ['way back', 'up close', 'out front', 'by side'],
        korean: '오두막의 최초 석조 기초는 캘리포니아 골드러시 시대인 아주 먼 옛날에 놓였습니다.',
        explanation: '역사적인 과거 시점을 가리킵니다.'
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
        english: '[It was surprising that the mountain wildlife came so close] to the porch.',
        answer: 'It was surprising that the mountain wildlife came so close',
        tokens: ['It', 'was', 'surprising', 'that', 'the', 'mountain', 'wildlife', 'came', 'so', 'close'],
        options: ['It', 'was', 'surprising', 'that', 'the', 'mountain', 'wildlife', 'came', 'so', 'close'],
        korean: '산골 야생동물이 현관 가까이까지 다가왔다는 사실은 참 놀라웠습니다.',
        explanation: '야생동물이 인가 근처에 다가온 뜻밖의 광경입니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was illegal that, It was boring that, It was painful that] the fragile solar battery array survived the heavy blizzard without damage.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was illegal that', 'It was boring that', 'It was painful that'],
        korean: '연약한 태양광 배터리 설비가 거센 눈보라를 파손 없이 견뎌냈다는 사실은 참으로 놀라웠습니다.',
        explanation: '혹독한 날씨를 견뎌낸 뜻밖의 내구성입니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was formal that, It was typical that, It was silent that] the shy toddler recited the entire poem from memory on stage.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was formal that', 'It was typical that', 'It was silent that'],
        korean: '수줍음 많은 어린아이가 무대 위에서 시 전체를 암기하여 낭독했다는 사실은 대단히 놀라웠습니다.',
        explanation: '아이의 놀라운 발표 능력에 대한 감탄입니다.'
      },
      {
        type: 'multiple-choice',
        english: '[It was surprising that, It was cruel that, It was hollow that, It was fake that] the ancient wooden bridge remained structurally sound after a century of use.',
        answer: 'It was surprising that',
        options: ['It was surprising that', 'It was cruel that', 'It was hollow that', 'It was fake that'],
        korean: '그 오래된 목조 다리가 100년의 사용 후에도 구조적으로 여전히 튼튼하다는 사실은 참으로 놀라웠습니다.',
        explanation: '오래된 다리의 견고함에 대한 놀라움입니다.'
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
        english: 'Do not make loud noises that could [disturbed the nesting mountain birds].',
        answer: 'disturbed the nesting mountain birds',
        tokens: ['disturbed', 'the', 'nesting', 'mountain', 'birds'],
        options: ['disturbed', 'the', 'nesting', 'mountain', 'birds'],
        korean: '둥지를 튼 산새들의 평온을 방해할 수 있는 큰 소음을 내지 마세요.',
        explanation: '야생동물의 안식을 해치지 말라는 당부입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The sudden drone of a chainsaw [disturbed, blessed, welcomed, cleaned] the peaceful tranquility of the alpine valley.',
        answer: 'disturbed',
        options: ['disturbed', 'blessed', 'welcomed', 'cleaned'],
        korean: '전기톱의 갑작스러운 굉음이 고산 계곡의 평화로운 고요를 깨뜨리고 방해했습니다.',
        explanation: '소음이 평화를 깨뜨리는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He left a "Do Not Disturb" sign on his door so his deep sleep would not be [disturbed, assisted, encouraged, rewarded] by housekeeping.',
        answer: 'disturbed',
        options: ['disturbed', 'assisted', 'encouraged', 'rewarded'],
        korean: '그는 룸서비스 직원에 의해 깊은 잠을 방해받지 않도록 문에 "방해하지 마세요" 팻말을 걸어두었습니다.',
        explanation: '호텔의 방해금지 팻말 용법입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Hikers should walk softly so wildlife foraging on the forest floor is not [disturbed, defended, glorified, multiplied].',
        answer: 'disturbed',
        options: ['disturbed', 'defended', 'glorified', 'multiplied'],
        korean: '숲 바닥에서 먹이를 찾는 야생동물들이 방해받거나 놀라지 않도록 등산객들은 발걸음을 조용히 걸어야 합니다.',
        explanation: '자연보호 에티켓입니다.'
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
        english: 'There have been several confirmed [sightings of bald eagles near the lake].',
        answer: 'sightings of bald eagles near the lake',
        tokens: ['sightings', 'of', 'bald', 'eagles', 'near', 'the', 'lake'],
        options: ['sightings', 'of', 'bald', 'eagles', 'near', 'the', 'lake'],
        korean: '호수 근처에서 흰머리수리의 확인된 목격 사례가 여러 건 있었습니다.',
        explanation: '조류 목격 사례를 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Following multiple [sightings, dismissals, inventions, departures] of coyotes on the school playground, authorities reinforced perimeter fencing.',
        answer: 'sightings',
        options: ['sightings', 'dismissals', 'inventions', 'departures'],
        korean: '학교 운동장에서 코요테 목격 사례가 여러 차례 발생하자 당국은 외곽 울타리를 보강했습니다.',
        explanation: '맹수 목격에 따른 안전 조치입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whale watching cruises guarantee high odds of humpback whale [sightings, damages, disasters, conflicts] during migration months.',
        answer: 'sightings',
        options: ['sightings', 'damages', 'disasters', 'conflicts'],
        korean: '고래 관람 유람선은 고래 이동 기간 동안 혹등고래를 직접 목격할 높은 확률을 보장합니다.',
        explanation: '고래 탐사 투어의 목격 확률입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Astronomers gathered to record rare meteor [sightings, closures, bankruptcies, collisions] during the peak of the Perseid shower.',
        answer: 'sightings',
        options: ['sightings', 'closures', 'bankruptcies', 'collisions'],
        korean: '천문학자들은 페르세우스자리 유성우의 절정기 동안 드문 유성 목격 사례들을 기록하기 위해 모였습니다.',
        explanation: '천체 현상의 관측 및 목격입니다.'
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
        english: 'You [have got to learn how to shut off the main water valve].',
        answer: 'have got to learn how to shut off the main water valve',
        tokens: ['have', 'got', 'to', 'learn', 'how', 'to', 'shut', 'off', 'the', 'main', 'water', 'valve'],
        options: ['have', 'got', 'to', 'learn', 'how', 'to', 'shut', 'off', 'the', 'main', 'water', 'valve'],
        korean: '메인 수도 밸브를 잠그는 법을 반드시 배워두어야만 해요.',
        explanation: '동파 방지를 위해 꼭 숙지해야 할 필수 지침입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [have got to, are free to, choose not to, hesitate to] leave the trailhead now if we hope to reach the ridge before sunset.',
        answer: 'have got to',
        options: ['have got to', 'are free to', 'choose not to', 'hesitate to'],
        korean: '일몰 전에 능선에 도착하고 싶다면 우리는 지금 당장 등산로 입구를 출발해야만 합니다.',
        explanation: '시간 내 도착을 위한 긴급한 출발 의무입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You [have got to, had better not, were forbidden to, failed to] taste this fresh peach cobbler; it is absolutely phenomenal!',
        answer: 'have got to',
        options: ['have got to', 'had better not', 'were forbidden to', 'failed to'],
        korean: '이 갓 구운 복숭아 코블러 파이는 꼭 맛보셔야 해요. 정말 기가 막히게 맛있거든요!',
        explanation: '강한 권유를 나타낼 때 원어민들이 자주 쓰는 구어 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'In heavy blizzard conditions, drivers [have got to, are encouraged not to, are unable to, refuse to] equip tire chains on mountain passes.',
        answer: 'have got to',
        options: ['have got to', 'are encouraged not to', 'are unable to', 'refuse to'],
        korean: '심한 눈보라 상황에서는 운전자들이 산고개에서 스노우 체인을 반드시 장착해야만 합니다.',
        explanation: '안전을 위한 필수 의무 규정입니다.'
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
        english: 'We spent hours [figuring out how to program the solar inverter].',
        answer: 'figuring out how to program the solar inverter',
        tokens: ['figuring', 'out', 'how', 'to', 'program', 'the', 'solar', 'inverter'],
        options: ['figuring', 'out', 'how', 'to', 'program', 'the', 'solar', 'inverter'],
        korean: '우리는 태양광 인버터를 어떻게 프로그래밍하는지 방법을 알아내는 데 몇 시간을 보냈어요.',
        explanation: '기계 설정법을 연구하여 알아내는 과정입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Engineers are tirelessly [figuring out, giving away, turning back, shutting down] cleaner methods to capture geothermal energy.',
        answer: 'figuring out',
        options: ['figuring out', 'giving away', 'turning back', 'shutting down'],
        korean: '엔지니어들은 지열 에너지를 포집할 더 친환경적인 방법들을 끊임없이 연구해 알아내고 있습니다.',
        explanation: '신기술 개발을 위한 탐구입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She enjoys sitting by the window [figuring out, giving up on, falling off, looking down on] complex crossword puzzles over hot tea.',
        answer: 'figuring out',
        options: ['figuring out', 'giving up on', 'falling off', 'looking down on'],
        korean: '그녀는 따뜻한 차를 마시며 창가에 앉아 복잡한 십자말풀이 퍼즐의 정답을 풀어내는 것을 즐깁니다.',
        explanation: '퍼즐을 풀고 알아내는 여가 시간입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It took our family months of discussion [figuring out, setting fire to, turning away from, running short of] our long-term budget savings plan.',
        answer: 'figuring out',
        options: ['figuring out', 'setting fire to', 'turning away from', 'running short of'],
        korean: '장기적인 예산 저축 계획을 수립하고 알아내는 데 우리 가족은 몇 달간의 대화를 거쳐야 했습니다.',
        explanation: '장기 계획을 숙고하여 마련하는 모습입니다.'
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
