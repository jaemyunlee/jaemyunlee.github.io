const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-03';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. strong-willed
  {
    keyExpression: 'strong-willed',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Our eldest daughter is remarkably [strong-willed, soft-spoken, short-tempered, open-minded] and never gives up until she solves the puzzle herself.',
        answer: 'strong-willed',
        options: ['strong-willed', 'soft-spoken', 'short-tempered', 'open-minded'],
        korean: '우리 큰딸은 대단히 의지가 강하고 고집이 있어서, 스스로 퍼즐을 풀 때까지 절대 포기하지 않아요.',
        explanation: '"strong-willed"는 "의지가 강한, 자기주관이 뚜렷한"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She is too [strong-willed to change her mind] once a decision is made.',
        answer: 'strong-willed to change her mind',
        tokens: ['strong-willed', 'to', 'change', 'her', 'mind'],
        options: ['strong-willed', 'to', 'change', 'her', 'mind'],
        korean: '그녀는 주관이 너무 뚜렷해서 한번 결정을 내리면 마음을 바꾸지 않아요.',
        explanation: '"strong-willed to change one\'s mind"는 결단력이 확고함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Working with such a [strong-willed, absent-minded, light-hearted, double-faced] team leader was challenging, but we learned a lot from her determination.',
        answer: 'strong-willed',
        options: ['strong-willed', 'absent-minded', 'light-hearted', 'double-faced'],
        korean: '그렇게 주관과 신념이 확고한 팀장님과 일하는 것은 쉽지 않았지만, 우리는 그녀의 결단력에서 많은 것을 배웠습니다.',
        explanation: '신념과 추진력이 강한 사람을 묘사할 때 쓰입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Even as a toddler, Liam was [strong-willed, delicate, indifferent, submissive] about dressing himself in mismatched clothes.',
        answer: 'strong-willed',
        options: ['strong-willed', 'delicate', 'indifferent', 'submissive'],
        korean: '아장아장 걷는 아기였을 때도 리암은 짝이 맞지 않는 옷이라도 자기가 직접 입겠다고 고집을 부렸어요.',
        explanation: '어린아이라도 스스로 하겠다는 고집이나 주관을 나타낼 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The young entrepreneur was [strong-willed, passive, fragile, cautious] enough to push forward despite countless rejections from investors.',
        answer: 'strong-willed',
        options: ['strong-willed', 'passive', 'fragile', 'cautious'],
        korean: '그 젊은 창업가는 투자자들의 수많은 거절에도 불구하고 밀고 나갈 만큼 의지가 확고했습니다.',
        explanation: '역경에도 흔들리지 않고 꿋꿋이 나아가는 굳은 의지를 표현합니다.'
      }
    ]
  },

  // 2. picked her up
  {
    keyExpression: 'picked her up',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Dad drove to soccer practice and [picked her up, dropped her off, checked her in, pointed her out] right when the rain began to pour.',
        answer: 'picked her up',
        options: ['picked her up', 'dropped her off', 'checked her in', 'pointed her out'],
        korean: '아빠는 축구 연습장으로 차를 몰고 가 비가 쏟아지기 시작할 때 딱 맞춰 그녀를 태우러 가셨어요.',
        explanation: '"pick someone up"은 차로 사람을 "태우러 가다, 데리러 가다"라는 핵심 구동사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I [picked her up from the airport] late yesterday evening.',
        answer: 'picked her up from the airport',
        tokens: ['picked', 'her', 'up', 'from', 'the', 'airport'],
        options: ['picked', 'her', 'up', 'from', 'the', 'airport'],
        korean: '어제 늦은 저녁에 공항에서 그녀를 차로 픽업해 데려왔습니다.',
        explanation: '공항이나 역에서 차로 맞이할 때 "picked her up from ~"을 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After violin lessons finished, her grandmother [picked her up, turned her down, wrote her off, called her out] in the family minivan.',
        answer: 'picked her up',
        options: ['picked her up', 'turned her down', 'wrote her off', 'called her out'],
        korean: '바이올린 레슨이 끝난 후, 할머니께서 가족용 미니밴으로 그녀를 데리러 오셨어요.',
        explanation: '학원이나 레슨 후 차로 데리러 갈 때 쓰는 일상 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Since her car was in the repair shop, her husband [picked her up, gave her away, held her back, paid her off] after work.',
        answer: 'picked her up',
        options: ['picked her up', 'gave her away', 'held her back', 'paid her off'],
        korean: '그녀의 차가 정비소에 있었기 때문에, 남편이 퇴근 후 차로 데리러 왔어요.',
        explanation: '퇴근길에 차로 마중 나가 태워오는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The school bus broke down, so many worried parents quickly [picked her up, stood her up, took her over, brought her down] directly from the gate.',
        answer: 'picked her up',
        options: ['picked her up', 'stood her up', 'took her over', 'brought her down'],
        korean: '스쿨버스가 고장 나서 많은 걱정 어린 부모님들이 교문 앞에서 직접 그녀를 차로 태워 갔어요.',
        explanation: '차로 직접 데리러 갈 때 "picked her up"을 씁니다.'
      }
    ]
  },

  // 3. kept on going
  {
    keyExpression: 'kept on going',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Even though everyone else wanted to take a rest, the energetic toddler [kept on going, turned around, backed away, gave up] without slowing down.',
        answer: 'kept on going',
        options: ['kept on going', 'turned around', 'backed away', 'gave up'],
        korean: '다른 사람들은 모두 쉬고 싶어 했지만, 에너지 넘치는 걸음마 아기는 속도를 줄이지 않고 지치지도 않고 계속 나아갔어요.',
        explanation: '"keep on going"은 멈추지 않고 "계속해서 나아가다, 계속하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The argument [kept on going for nearly an hour] in the car.',
        answer: 'kept on going for nearly an hour',
        tokens: ['kept', 'on', 'going', 'for', 'nearly', 'an', 'hour'],
        options: ['kept', 'on', 'going', 'for', 'nearly', 'an', 'hour'],
        korean: '그 말다툼은 차 안에서 거의 한 시간 동안이나 멈추지 않고 계속되었어요.',
        explanation: '상황이나 대화가 멈추지 않고 계속 이어졌음을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Despite the painful blister on his heel, the runner gritted his teeth and [kept on going, fell apart, called it off, faded out] toward the finish line.',
        answer: 'kept on going',
        options: ['kept on going', 'fell apart', 'called it off', 'faded out'],
        korean: '발뒤꿈치에 아픈 물집이 생겼음에도 그 러너는 이를 악물고 결승선을 향해 계속해서 달렸습니다.',
        explanation: '고통을 참고 끝까지 계속 전진하는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The old mechanical clock made a ticking noise, but it [kept on going, died out, turned off, went blind] without missing a beat.',
        answer: 'kept on going',
        options: ['kept on going', 'died out', 'turned off', 'went blind'],
        korean: '오래된 괘종시계에서 째깍거리는 소리가 났지만, 박자를 놓치지 않고 계속 잘 돌아갔어요.',
        explanation: '기계나 장치가 멈추지 않고 계속 작동함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When the teacher asked the class to quiet down, the lively chat [kept on going, shut down, froze up, cooled off] in the back row.',
        answer: 'kept on going',
        options: ['kept on going', 'shut down', 'froze up', 'cooled off'],
        korean: '선생님이 조용히 하라고 하셨을 때도, 뒷줄에서는 왁자지껄한 수다가 멈추지 않고 계속 이어졌어요.',
        explanation: '주의를 주어도 멈추지 않고 계속 지속되는 모습입니다.'
      }
    ]
  },

  // 4. push my buttons
  {
    keyExpression: 'push my buttons',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'My little brother knows exactly which teasing words will [push my buttons, turn the tables, pull my leg, ring a bell] whenever we play video games.',
        answer: 'push my buttons',
        options: ['push my buttons', 'turn the tables', 'pull my leg', 'ring a bell'],
        korean: '내 남동생은 비디오 게임을 할 때마다 어떤 놀리는 말이 내 속을 뒤집어놓는지 아주 정확히 알고 있어요.',
        explanation: '"push someone\'s buttons"는 상대방의 화를 돋우거나 "속을 뒤집어놓다"라는 관용 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Please stop making that noise; you are trying to [push my buttons on purpose].',
        answer: 'push my buttons on purpose',
        tokens: ['push', 'my', 'buttons', 'on', 'purpose'],
        options: ['push', 'my', 'buttons', 'on', 'purpose'],
        korean: '그 소리 좀 그만 내줄래? 너 지금 일부러 내 속을 긁어놓으려는 거잖아.',
        explanation: '"push my buttons on purpose"는 고의로 화를 돋우려는 행동을 지적할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'During family discussions, he tries to stay calm even when relatives inadvertently [push his buttons, hold his hand, give him away, make his day].',
        answer: 'push his buttons',
        options: ['push his buttons', 'hold his hand', 'give him away', 'make his day'],
        korean: '가족 모임 대화 중에 그는 친척들이 본의 아니게 신경을 긁더라도 침착함을 유지하려고 노력합니다.',
        explanation: '상대방의 신경을 건드리거나 발끈하게 만드는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Teenagers sometimes master the art of knowing how to [push their parents\' buttons, pull their weight, pass the buck, pay their dues] with a single eye roll.',
        answer: "push their parents' buttons",
        options: ["push their parents' buttons", "pull their weight", "pass the buck", "pay their dues"],
        korean: '십대 청소년들은 눈을 한 번 치켜뜨는 것만으로도 부모님의 속을 뒤집어놓는 법을 아주 잘 알곤 합니다.',
        explanation: '부모님의 버튼을 눌러 화나게 만드는 모습을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I promised myself not to let rude online comments [push my buttons, clear my mind, raise my glass, fill my shoes].',
        answer: 'push my buttons',
        options: ['push my buttons', 'clear my mind', 'raise my glass', 'fill my shoes'],
        korean: '나는 무례한 인터넷 댓글들이 내 감정을 상하게 하고 속을 뒤집어놓지 않도록 마음에 다짐했어요.',
        explanation: '불필요하게 감정적으로 동요되거나 화가 나는 것을 방지할 때 씁니다.'
      }
    ]
  },

  // 5. pull over
  {
    keyExpression: 'pull over',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'When the flashing red and blue lights appeared in the rear-view mirror, the driver had to [pull over, speed up, cut in, back out] onto the shoulder.',
        answer: 'pull over',
        options: ['pull over', 'speed up', 'cut in', 'back out'],
        korean: '룸미러에 번쩍이는 빨갛고 파란 경광등이 나타나자, 운전자는 갓길로 차를 대야만 했어요.',
        explanation: '"pull over"는 운전 중에 차를 길가나 갓길에 "정차하다, 차를 대다"라는 필수 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The heavy fog forced us to [pull over to the side of the road].',
        answer: 'pull over to the side of the road',
        tokens: ['pull', 'over', 'to', 'the', 'side', 'of', 'the', 'road'],
        options: ['pull', 'over', 'to', 'the', 'side', 'of', 'the', 'road'],
        korean: '짙은 안개 때문에 우리는 길가 한쪽에 차를 세워야만 했습니다.',
        explanation: '"pull over to the side of the road"는 길가에 안전하게 정차하는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you feel drowsy while driving on the highway, immediately [pull over, push through, step on it, look away] at the next rest stop.',
        answer: 'pull over',
        options: ['pull over', 'push through', 'step on it', 'look away'],
        korean: '고속도로에서 운전 중 졸음이 오면 다음 휴게소에서 즉시 차를 정차하세요.',
        explanation: '안전을 위해 차를 멈추고 쉴 때 권장되는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The tour bus driver decided to [pull over, back down, take off, turn up] so passengers could photograph the scenic mountain canyon.',
        answer: 'pull over',
        options: ['pull over', 'back down', 'take off', 'turn up'],
        korean: '관광버스 기사님은 승객들이 아름다운 산골 협곡 풍경을 사진에 담을 수 있도록 차를 길가에 세워주셨어요.',
        explanation: '풍경을 감상하도록 차를 잠시 대는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'My phone started ringing urgently, so I signaled right and [pulled over, drove off, sped ahead, broke through] safely.',
        answer: 'pulled over',
        options: ['pulled over', 'drove off', 'sped ahead', 'broke through'],
        korean: '전화벨이 다급하게 울리기 시작해서, 우측 깜빡이를 켜고 안전하게 차를 길가에 정차했어요.',
        explanation: '운전 중 전화를 받기 위해 차를 대는 모습입니다.'
      }
    ]
  },

  // 6. ended up
  {
    keyExpression: 'ended up',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We originally intended to cook spaghetti at home, but we [ended up, began by, insisted on, gave up] ordering delivery pizza instead.',
        answer: 'ended up',
        options: ['ended up', 'began by', 'insisted on', 'gave up'],
        korean: '우리는 원래 집에서 스파게티를 요리할 계획이었지만, 결국 대신 배달 피자를 시켜 먹게 되었어요.',
        explanation: '"end up (동명사/-ing)"는 계획과 달리 "결국 ~하게 되다"라는 핵심 구동사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'After wandering around downtown for hours, we [ended up eating at a small noodle shop].',
        answer: 'ended up eating at a small noodle shop',
        tokens: ['ended', 'up', 'eating', 'at', 'a', 'small', 'noodle', 'shop'],
        options: ['ended', 'up', 'eating', 'at', 'a', 'small', 'noodle', 'shop'],
        korean: '시내를 몇 시간 동안 돌아다닌 끝에, 우리는 결국 작은 국숫집에서 식사하게 되었습니다.',
        explanation: '방황 끝에 결국 특정 장소에 이르게 되었음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Because the afternoon flight was canceled, all passengers [ended up, took off, set out, gave in] staying at an airport hotel.',
        answer: 'ended up',
        options: ['ended up', 'took off', 'set out', 'gave in'],
        korean: '오후 비행기가 결항되는 바람에 모든 승객이 결국 공항 호텔에 묵게 되었습니다.',
        explanation: '의도치 않은 상황으로 결국 호텔에 묵게 된 결말입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He debated between engineering and economics, but he [ended up, held back, passed out, turned away] choosing computer science.',
        answer: 'ended up',
        options: ['ended up', 'held back', 'passed out', 'turned away'],
        korean: '그는 공학과 경제학 사이에서 고민했지만, 결국 컴퓨터공학을 선택하게 되었습니다.',
        explanation: '긴 고민 끝에 내린 최종적인 결론을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I went to the bookstore just to browse, but I [ended up, held up, dropped off, pulled out] buying three hardcovers.',
        answer: 'ended up',
        options: ['ended up', 'held up', 'dropped off', 'pulled out'],
        korean: '그냥 구경만 하려고 서점에 들어갔는데, 결국 양장본 책 세 권을 사고 말았어요.',
        explanation: '구경만 하려다 결국 구매로 이어진 자연스러운 일상 회화입니다.'
      }
    ]
  },

  // 7. walk along
  {
    keyExpression: 'walk along',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'On quiet Sunday mornings, they love to [walk along, run into, fall off, jump over] the sandy shoreline listening to gentle waves.',
        answer: 'walk along',
        options: ['walk along', 'run into', 'fall off', 'jump over'],
        korean: '한적한 일요일 아침마다 그들은 잔잔한 파도 소리를 들으며 모래 해변을 따라 산책하는 것을 참 좋아합니다.',
        explanation: '"walk along ~"은 해변이나 길을 "따라서 걷다, 산책하다"라는 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We used to [walk along the riverbank every evening] after supper.',
        answer: 'walk along the riverbank every evening',
        tokens: ['walk', 'along', 'the', 'riverbank', 'every', 'evening'],
        options: ['walk', 'along', 'the', 'riverbank', 'every', 'evening'],
        korean: '예전에 우리는 저녁 식사 후 매일 저녁 강둑을 따라 산책하곤 했어요.',
        explanation: '"walk along the riverbank"는 강변 둑을 따라 걷는 여유로운 일상을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The cobblestone promenade is a delightful place to [walk along, crash into, trip over, hide away] while enjoying local street musicians.',
        answer: 'walk along',
        options: ['walk along', 'crash into', 'trip over', 'hide away'],
        korean: '그 자갈길 산책로는 현지 거리 음악가들의 연주를 즐기며 따라 걷기에 참 즐거운 곳이에요.',
        explanation: '산책로나 거리를 따라 거니는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Visitors are reminded to [walk along, push through, jump off, cut across] the marked wooden boardwalk to protect fragile sand dunes.',
        answer: 'walk along',
        options: ['walk along', 'push through', 'jump off', 'cut across'],
        korean: '방문객들은 연약한 모래언덕을 보호하기 위해 표시된 나무 데크길을 따라 걸어달라는 안내를 받습니다.',
        explanation: '정해진 통로나 길을 따라 걸어가야 함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'In autumn, neighborhood residents gather to [walk along, break into, turn against, pull apart] the tree-lined avenue covered in gold leaves.',
        answer: 'walk along',
        options: ['walk along', 'break into', 'turn against', 'pull apart'],
        korean: '가을이면 동네 주민들은 황금빛 낙엽으로 뒤덮인 가로수길을 따라 걷기 위해 모입니다.',
        explanation: '아름다운 길을 따라 거니는 정경을 묘사합니다.'
      }
    ]
  },

  // 8. leash
  {
    keyExpression: 'leash',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'City regulations require all dog owners to keep their pets on a sturdy [leash, collar, cage, basket] while walking in public parks.',
        answer: 'leash',
        options: ['leash', 'collar', 'cage', 'basket'],
        korean: '시 규정에 따르면 모든 반려견 보호자는 공공 공원에서 산책할 때 반려견을 튼튼한 목줄(리드줄)에 매어두어야 합니다.',
        explanation: '"leash"는 반려동물을 통제하는 "목줄, 가슴줄, 리드줄"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Always keep your dog on [a short leash near busy traffic].',
        answer: 'a short leash near busy traffic',
        tokens: ['a', 'short', 'leash', 'near', 'busy', 'traffic'],
        options: ['a', 'short', 'leash', 'near', 'busy', 'traffic'],
        korean: '혼잡한 차도 근처에서는 항상 반려견을 짧은 목줄에 매어두세요.',
        explanation: '"keep on a short leash"는 안전을 위해 줄을 짧게 잡는 것을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When the golden retriever saw a playful squirrel, he pulled hard on his [leash, saddle, harness, bridle] to chase it.',
        answer: 'leash',
        options: ['leash', 'saddle', 'harness', 'bridle'],
        korean: '골든 리트리버는 장난기 넘치는 다람쥐를 보자 뒤쫓아가려고 목줄을 세게 잡아당겼어요.',
        explanation: '강아지가 산책 중 목줄을 잡아당기는 흔한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Before stepping out the front door, she clipped the leather [leash, belt, ribbon, chain] onto her puppy\'s collar.',
        answer: 'leash',
        options: ['leash', 'belt', 'ribbon', 'chain'],
        korean: '현관문을 나서기 전, 그녀는 강아지 목걸이에 가죽 목줄을 채웠습니다.',
        explanation: '산책 줄을 연결하는 동작을 표현합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'This suburban park features a fenced designated area where dogs can run freely off [leash, guard, boundary, track].',
        answer: 'leash',
        options: ['leash', 'guard', 'boundary', 'track'],
        korean: '이 교외 공원에는 강아지들이 목줄 없이 자유롭게 뛰어놀 수 있는 울타리 쳐진 전용 구역이 마련되어 있어요.',
        explanation: '"off leash"는 목줄을 풀고 자유롭게 다니는 상태를 의미합니다.'
      }
    ]
  },

  // 9. stubborn
  {
    keyExpression: 'stubborn',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Grandpa can be quite [stubborn, generous, gentle, timid] when it comes to adopting new smartphone technology.',
        answer: 'stubborn',
        options: ['stubborn', 'generous', 'gentle', 'timid'],
        korean: '할아버지께서는 새로운 스마트폰 기술을 받아들이는 것에 대해서는 꽤 완고하고 고집스러우실 때가 있어요.',
        explanation: '"stubborn"은 "완고한, 고집 센"을 뜻하는 성격 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He was too [stubborn to admit he was lost] in the woods.',
        answer: 'stubborn to admit he was lost',
        tokens: ['stubborn', 'to', 'admit', 'he', 'was', 'lost'],
        options: ['stubborn', 'to', 'admit', 'he', 'was', 'lost'],
        korean: '그는 너무 고집이 세서 숲에서 길을 잃었다는 사실을 인정하지 않았어요.',
        explanation: '"too stubborn to admit"는 고집 때문에 인정하지 않는 태도를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The old donkey stood in the middle of the dirt trail, completely [stubborn, polite, fragile, cooperative] and refusing to budge.',
        answer: 'stubborn',
        options: ['stubborn', 'polite', 'fragile', 'cooperative'],
        korean: '그 늙은 당나귀는 흙길 한가운데에 버티고 서서 완전히 고집스럽게 한 발짝도 움직이려 하지 않았어요.',
        explanation: '당나귀처럼 말을 듣지 않고 꼼짝도 않는 고집스러운 태도입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Despite hours of friendly persuasion, his [stubborn, flexible, modest, cheerful] attitude made compromise impossible.',
        answer: 'stubborn',
        options: ['stubborn', 'flexible', 'modest', 'cheerful'],
        korean: '몇 시간 동안의 다정한 설득에도 불구하고, 그의 완고한 태도로 인해 타협은 불가능했습니다.',
        explanation: '타협을 거부하는 완고한 태도를 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We tried several stain removers, but that [stubborn, polite, mild, delicate] grease mark on the table cloth refused to come out.',
        answer: 'stubborn',
        options: ['stubborn', 'polite', 'mild', 'delicate'],
        korean: '얼룩 제거제를 여러 개 써보았지만, 식탁보의 그 고질적이고 잘 안 지워지는 기름 자국은 없어지지 않았어요.',
        explanation: '사물이나 얼룩이 "잘 지워지지 않는, 끈질긴" 경우에도 "stubborn"을 씁니다.'
      }
    ]
  },

  // 10. diapers
  {
    keyExpression: 'diapers',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'New parents quickly realize how expensive disposable [diapers, blankets, pacifiers, rattles] can be during the first year.',
        answer: 'diapers',
        options: ['diapers', 'blankets', 'pacifiers', 'rattles'],
        korean: '초보 부모들은 첫 1년 동안 일회용 기저귀 값이 얼마나 많이 드는지 금세 깨닫게 됩니다.',
        explanation: '"diapers"는 아기나 환자가 차는 "기저귀"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I have to buy [a big pack of baby diapers] at the wholesale club.',
        answer: 'a big pack of baby diapers',
        tokens: ['a', 'big', 'pack', 'of', 'baby', 'diapers'],
        options: ['a', 'big', 'pack', 'of', 'baby', 'diapers'],
        korean: '창고형 할인마트에서 아기 기저귀 대용량 팩을 하나 사야 해요.',
        explanation: '"pack of baby diapers"는 아기 기저귀 팩을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Before heading to the grocery store, she packed extra wipes and clean [diapers, crayons, ribbons, spoons] into the baby bag.',
        answer: 'diapers',
        options: ['diapers', 'crayons', 'ribbons', 'spoons'],
        korean: '식료품점에 가기 전, 그녀는 기저귀 가방에 여분의 물티슈와 깨끗한 기저귀들을 챙겨 넣었어요.',
        explanation: '외출 전 아기 기저귀를 챙기는 일상 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Potty training requires tremendous patience, but eventually toddlers learn to stop wearing [diapers, mittens, scarves, boots].',
        answer: 'diapers',
        options: ['diapers', 'mittens', 'scarves', 'boots'],
        korean: '배변 훈련은 엄청난 인내심이 필요하지만, 결국 아이들은 기저귀를 떼는 법을 배우게 됩니다.',
        explanation: '기저귀를 떼는 성장 과정을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The nursery room was fully stocked with soft cotton cloth [diapers, curtains, cushions, aprons] for eco-friendly parenting.',
        answer: 'diapers',
        options: ['diapers', 'curtains', 'cushions', 'aprons'],
        korean: '아기방에는 친환경 육아를 위한 부드러운 순면 천기저귀들이 가득 구비되어 있었어요.',
        explanation: '"cloth diapers"는 천기저귀를 가리킵니다.'
      }
    ]
  },

  // 11. at a time
  {
    keyExpression: 'at a time',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Because the suspension bridge is narrow, only five hikers are permitted to cross [at a time, in a pinch, by a hair, on a whim].',
        answer: 'at a time',
        options: ['at a time', 'in a pinch', 'by a hair', 'on a whim'],
        korean: '출렁다리가 좁기 때문에, 한 번에 다섯 명의 등산객만 건너도록 허용됩니다.',
        explanation: '"at a time"은 한 번에, 일시에라는 뜻의 수량/시간 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Please take the steep steps [one step at a time] to prevent slipping.',
        answer: 'one step at a time',
        tokens: ['one', 'step', 'at', 'a', 'time'],
        options: ['one', 'step', 'at', 'a', 'time'],
        korean: '미끄러지지 않도록 가파른 계단을 한 계단씩 차근차근 밟으세요.',
        explanation: '"one step at a time"은 한 번에 한 걸음씩, 차근차근을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When tackling a massive programming project, it helps to solve one specific bug [at a time, of all time, for the time being, behind the times].',
        answer: 'at a time',
        options: ['at a time', 'of all time', 'for the time being', 'behind the times'],
        korean: '거대한 프로그래밍 프로젝트를 다룰 때는 한 번에 하나의 특정 버그씩 해결해 나가는 것이 도움이 됩니다.',
        explanation: '한 번에 하나씩 순차적으로 처리함을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The museum elevator is small, so security only allows ten visitors inside [at a time, ahead of time, in good time, out of time].',
        answer: 'at a time',
        options: ['at a time', 'ahead of time', 'in good time', 'out of time'],
        korean: '박물관 엘리베이터가 작아서 보안 요원은 한 번에 10명의 관람객만 탑승하도록 허용합니다.',
        explanation: '한 번에 들어가는 인원수를 제한하는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Do not try to read the entire textbook in one night; study two chapters [at a time, by any chance, under no circumstances, down the road] for better memory.',
        answer: 'at a time',
        options: ['at a time', 'by any chance', 'under no circumstances', 'down the road'],
        korean: '하룻밤 사이에 교과서 전체를 다 읽으려 하지 말고, 더 나은 기억을 위해 한 번에 두 단원씩 공부하세요.',
        explanation: '한 번에 정해진 분량씩 나누어 학습함을 권장합니다.'
      }
    ]
  },

  // 12. going off
  {
    keyExpression: 'going off',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Early this morning, the loud fire alarm started [going off, breaking in, fading away, calming down] across the entire apartment complex.',
        answer: 'going off',
        options: ['going off', 'breaking in', 'fading away', 'calming down'],
        korean: '오늘 이른 아침, 아파트 단지 전체에 시끄러운 화재경보기가 울리기 시작했어요.',
        explanation: '"go off"는 알람, 경보기, 폭탄 등이 "울리다, 터지다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'My phone alarm kept [going off every ten minutes] because I hit snooze.',
        answer: 'going off every ten minutes',
        tokens: ['going', 'off', 'every', 'ten', 'minutes'],
        options: ['going', 'off', 'every', 'ten', 'minutes'],
        korean: '내가 스누즈 버튼을 눌러서 휴대폰 알람이 10분마다 계속 울렸어요.',
        explanation: '"going off every ten minutes"는 10분 간격으로 알람이 계속 울림을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'When lightning struck the nearby transformer, car alarms in the parking lot began [going off, running out, checking out, passing by] simultaneously.',
        answer: 'going off',
        options: ['going off', 'running out', 'checking out', 'passing by'],
        korean: '번개가 근처 변압기를 내리치자 주차장의 차량 경보기들이 일제히 요란하게 울리기 시작했어요.',
        explanation: '경보기가 일제히 울리는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If smoke fills the kitchen while searing steak, the detector will prevent disaster by [going off, falling behind, dropping out, turning in] loudly.',
        answer: 'going off',
        options: ['going off', 'falling behind', 'dropping out', 'turning in'],
        korean: '스테이크를 굽다가 주방에 연기가 차면 화재감지기가 큰 소리로 울려 재난을 예방해 줍니다.',
        explanation: '연기감지기가 울리는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She woke up in a panic because she didn\'t hear her alarm clock [going off, giving in, standing by, making up] at six o\'clock.',
        answer: 'going off',
        options: ['going off', 'giving in', 'standing by', 'making up'],
        korean: '그녀는 6시에 알람 시계가 울리는 소리를 듣지 못해서 깜짝 놀라 허둥지둥 일어났어요.',
        explanation: '알람 소리가 울리는 것을 나타냅니다.'
      }
    ]
  },

  // 13. son in law
  {
    keyExpression: 'son in law',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'My mother-in-law Pati always prepares a hearty home-cooked meal whenever her [son-in-law, nephew, cousin, brother] visits for the weekend.',
        answer: 'son-in-law',
        options: ['son-in-law', 'nephew', 'cousin', 'brother'],
        korean: '장모님 패티(Pati)께서는 사위가 주말에 방문할 때마다 늘 푸짐한 집밥 요리를 정성껏 준비해 주십니다.',
        explanation: '"son-in-law"는 "사위"를 뜻하는 가족 호칭입니다. (Pati는 장모님, Jaemyun은 사위)'
      },
      {
        type: 'drag-and-drop',
        english: 'Gene welcomed his [son-in-law into the family cabin] with warm hospitality.',
        answer: 'son-in-law into the family cabin',
        tokens: ['son-in-law', 'into', 'the', 'family', 'cabin'],
        options: ['son-in-law', 'into', 'the', 'family', 'cabin'],
        korean: '장인어른 진(Gene)께서는 가족 오두막으로 찾아온 사위를 따뜻한 환대로 맞아주셨어요.',
        explanation: '장인어른(Gene)과 사위(Jaemyun)의 다정한 관계를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They are thrilled to welcome such a kind and caring young man as their new [son-in-law, grandfather, uncle, landlord].',
        answer: 'son-in-law',
        options: ['son-in-law', 'grandfather', 'uncle', 'landlord'],
        korean: '그들은 이렇게 친절하고 자상한 청년을 새 사위로 맞이하게 되어 매우 기뻐하고 있습니다.',
        explanation: '결혼을 통해 사위를 가족으로 맞이하는 축복입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'After the wedding, my parents proudly introduced my husband as their wonderful [son-in-law, cousin, stepbrother, roommate] to relatives.',
        answer: 'son-in-law',
        options: ['son-in-law', 'cousin', 'stepbrother', 'roommate'],
        korean: '결혼식 후, 우리 부모님은 친척들에게 남편을 멋진 사위라고 자랑스럽게 소개해 주셨어요.',
        explanation: '부모님이 딸의 남편을 사위로 소개하는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The elderly couple and their [son-in-law, stranger, competitor, neighbor] spent the afternoon fixing the porch deck together.',
        answer: 'son-in-law',
        options: ['son-in-law', 'stranger', 'competitor', 'neighbor'],
        korean: '노부부와 그들의 사위는 오후 내내 함께 현관 데크를 고치며 시간을 보냈습니다.',
        explanation: '장인·장모와 사위가 함께 집안일을 도우며 시간을 보내는 훈훈한 모습입니다.'
      }
    ]
  }
];

// Write quiz-pool.json
const poolPath = path.join(LESSON_DIR, 'quiz-pool.json');
fs.writeFileSync(poolPath, JSON.stringify(POOL, null, 2), 'utf8');
console.log(`[Success] Written: ${poolPath} (${POOL.length} expressions, ${POOL.length * 5} sentences)`);

// Write quiz.md using the 1st sentence of each pool entry
let md = `# Lesson 3: Stories from Mom (Pati) - Growing Up Kelly Quizzes\n\n`;
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
