const fs = require('fs');
const path = require('path');

const LESSON_ID = 'lesson-04';
const LESSON_DIR = path.join(__dirname, '..', 'lessons', LESSON_ID);

const POOL = [
  // 1. stood out
  {
    keyExpression: 'stood out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Her bright red hat really [stood out, fell behind, backed down, checked out] in the big crowd.',
        answer: 'stood out',
        options: ['stood out', 'fell behind', 'backed down', 'checked out'],
        korean: '그녀의 밝은 빨간 모자는 많은 인파 속에서 유독 눈에 띄었어요.',
        explanation: '"stand out"은 여러 사람이나 사물들 사이에서 "유독 눈에 띄다, 두드러지다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'His cheerful smile [stood out in the class photo] taken yesterday.',
        answer: 'stood out in the class photo',
        tokens: ['stood', 'out', 'in', 'the', 'class', 'photo'],
        options: ['stood', 'out', 'in', 'the', 'class', 'photo'],
        korean: '어제 찍은 학급 사진 속에서 그의 환한 미소가 단연 돋보였어요.',
        explanation: '"stood out"은 여러 사람 사이에서 돋보였다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'One sweet song [stood out, blew away, passed through, tuned out] as the best one on the music album.',
        answer: 'stood out',
        options: ['stood out', 'blew away', 'passed through', 'tuned out'],
        korean: '감미로운 노래 한 곡이 음악 앨범 전체에서 가장 훌륭한 곡으로 유독 돋보였어요.',
        explanation: '여러 곡 중에서 가장 두드러졌음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her kind words and warm smile [stood out, turned off, broke up, dropped out] during the first meeting.',
        answer: 'stood out',
        options: ['stood out', 'turned off', 'broke up', 'dropped out'],
        korean: '첫 모임에서 그녀의 친절한 말과 따뜻한 미소가 남다르게 돋보였어요.',
        explanation: '"stood out"은 좋은 태도가 눈에 띄었음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The tall yellow flower [stood out, burned out, faded away, gave in] among the small green plants in the garden.',
        answer: 'stood out',
        options: ['stood out', 'burned out', 'faded away', 'gave in'],
        korean: '키 큰 노란 꽃이 정원의 작은 초록 식물들 사이에서 확연히 눈에 띄었어요.',
        explanation: '평범한 것들 사이에서 눈에 띄게 드러남을 뜻합니다.'
      }
    ]
  },

  // 2. fit
  {
    keyExpression: 'fit',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'This new jacket looks very nice, but it does not [fit, break, cost, lose] me well because it is too small.',
        answer: 'fit',
        options: ['fit', 'break', 'cost', 'lose'],
        korean: '이 새 자켓은 참 멋져 보이지만, 너무 작아서 내 몸에 잘 맞지 않아요.',
        explanation: '"fit"은 크기나 치수가 몸에 "맞다", 혹은 상황에 "어울리다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The new blue sofa will [fit the small living room perfectly] next to the window.',
        answer: 'fit the small living room perfectly',
        tokens: ['fit', 'the', 'small', 'living', 'room', 'perfectly'],
        options: ['fit', 'the', 'small', 'living', 'room', 'perfectly'],
        korean: '새 파란 소파는 창문 옆 작은 거실 공간에 완벽하게 들어맞을 거예요.',
        explanation: '"fit the room"은 방 크기나 분위기에 꼭 맞음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We wanted to buy that wooden table, but it did not [fit, hide, risk, earn] in our small kitchen.',
        answer: 'fit',
        options: ['fit', 'hide', 'risk', 'earn'],
        korean: '우리는 그 원목 식탁을 사고 싶었지만, 우리 작은 주방 공간에 들어가지 않았어요.',
        explanation: '공간에 크기가 꼭 맞게 들어가다를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Do these new sneakers [fit, fold, burn, drop] your feet comfortably, or do you need a bigger size?',
        answer: 'fit',
        options: ['fit', 'fold', 'burn', 'drop'],
        korean: '이 새 운동화가 발에 편안하게 잘 맞나요, 아니면 더 큰 사이즈가 필요하신가요?',
        explanation: '신발이나 옷의 사이즈가 맞는지 물을 때 "fit"을 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'That bright painting did not [fit, drag, tear, wipe] the quiet mood of the bedroom.',
        answer: 'fit',
        options: ['fit', 'drag', 'tear', 'wipe'],
        korean: '그 밝은 그림은 침실의 차분한 분위기와 어울리지 않았어요.',
        explanation: '"fit"은 분위기나 느낌에 어울림을 뜻합니다.'
      }
    ]
  },

  // 3. quite a few
  {
    keyExpression: 'quite a few',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Although it was cold outside, [quite a few, scarcely any, hardly one, barely all] people still came to the park.',
        answer: 'quite a few',
        options: ['quite a few', 'scarcely any', 'hardly one', 'barely all'],
        korean: '날씨가 쌀쌀했음에도 불구하고, 꽤 많은 사람들이 여전히 공원에 나왔어요.',
        explanation: '"quite a few"는 생각보다 "꽤 많은, 상당수의"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'There were [quite a few empty seats on the bus] this morning.',
        answer: 'quite a few empty seats on the bus',
        tokens: ['quite', 'a', 'few', 'empty', 'seats', 'on', 'the', 'bus'],
        options: ['quite', 'a', 'few', 'empty', 'seats', 'on', 'the', 'bus'],
        korean: '오늘 아침 버스에는 꽤 많은 빈자리가 있었어요.',
        explanation: '"quite a few"는 제법 많은 수를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I read [quite a few, scarcely one, barely any, hardly none] interesting books during my winter vacation.',
        answer: 'quite a few',
        options: ['quite a few', 'scarcely one', 'barely any', 'hardly none'],
        korean: '나는 겨울 방학 동안 꽤 많은 재미있는 책들을 읽었어요.',
        explanation: '"quite a few"는 상당한 수량을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She invited ten friends to the party, but [quite a few, almost none, hardly any, barely few] more people showed up.',
        answer: 'quite a few',
        options: ['quite a few', 'almost none', 'hardly any', 'barely few'],
        korean: '그녀는 파티에 열 명의 친구를 초대했지만, 꽤 많은 사람들이 더 찾아왔어요.',
        explanation: '"quite a few more"는 생각보다 꽤 많은 사람이 더 왔음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We saw [quite a few, scarcely any, hardly a, barely any] colorful birds in the garden trees this morning.',
        answer: 'quite a few',
        options: ['quite a few', 'scarcely any', 'hardly a', 'barely any'],
        korean: '우리는 오늘 아침 정원 나무들에서 꽤 많은 알록달록한 새들을 보았어요.',
        explanation: '"quite a few"는 많은 수량을 뜻합니다.'
      }
    ]
  },

  // 4. merch sections
  {
    keyExpression: 'merch sections',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'After the concert, many happy fans went to the [merch sections, luggage checks, emergency exits, boiler rooms] to buy tour t-shirts.',
        answer: 'merch sections',
        options: ['merch sections', 'luggage checks', 'emergency exits', 'boiler rooms'],
        korean: '콘서트가 끝난 후, 많은 행복한 팬들이 투어 티셔츠를 사기 위해 굿즈 판매 구역으로 갔어요.',
        explanation: '"merch sections"는 공연장이나 행사장 내의 "굿즈(기념품) 판매 부스/구역"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We bought two cool posters at the [official merch sections in the hall] before the show.',
        answer: 'official merch sections in the hall',
        tokens: ['official', 'merch', 'sections', 'in', 'the', 'hall'],
        options: ['official', 'merch', 'sections', 'in', 'the', 'hall'],
        korean: '우리는 공연 전에 로비에 있는 공식 굿즈 판매 구역에서 멋진 포스터 두 장을 샀어요.',
        explanation: '"merch sections"는 기념품을 파는 곳을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Long lines formed near the [merch sections, ticket gates, parking meters, bus doors] to get tour souvenir hats.',
        answer: 'merch sections',
        options: ['merch sections', 'ticket gates', 'parking meters', 'bus doors'],
        korean: '투어 기념 모자를 사기 위해 굿즈 판매 코너 근처에 긴 줄이 늘어섰어요.',
        explanation: '"merch sections"는 상품 판매 부스입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They sell fun stickers and keychains at the stadium [merch sections, luggage rooms, storage closets, repair shops].',
        answer: 'merch sections',
        options: ['merch sections', 'luggage rooms', 'storage closets', 'repair shops'],
        korean: '그들은 경기장 굿즈 판매 구역에서 재미있는 스티커와 열쇠고리를 팔아요.',
        explanation: '"merch sections"는 다양한 기념품을 파는 코너입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Look for the team caps at the [merch sections, fire escapes, boiler rooms, kitchen doors] near the main entrance.',
        answer: 'merch sections',
        options: ['merch sections', 'fire escapes', 'boiler rooms', 'kitchen doors'],
        korean: '정문 근처에 있는 굿즈 판매 구역에서 팀 모자를 찾아보세요.',
        explanation: '"merch sections"는 굿즈(상품) 판매대입니다.'
      }
    ]
  },

  // 5. odd time
  {
    keyExpression: 'odd time',
    sentences: [
      {
        type: 'multiple-choice',
        english: "Three o'clock in the morning is such an [odd time, exact moment, urgent date, ideal pace] to get a phone call.",
        answer: 'odd time',
        options: ['odd time', 'exact moment', 'urgent date', 'ideal pace'],
        korean: '새벽 3시는 전화를 받기에는 참 뜬금없고 이상한 시간이에요.',
        explanation: '"odd time"은 일반적이지 않은 "애매한 시간대, 특이한 시간"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Eating breakfast at midnight is an [odd time to eat warm pancakes] for most people.',
        answer: 'odd time to eat warm pancakes',
        tokens: ['odd', 'time', 'to', 'eat', 'warm', 'pancakes'],
        options: ['odd', 'time', 'to', 'eat', 'warm', 'pancakes'],
        korean: '자정에 아침 식사를 하는 것은 대부분의 사람들에게 따뜻한 팬케이크를 먹기에 이상한 시간이에요.',
        explanation: '"odd time"은 때에 맞지 않는 특이한 시간을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He arrived at the office at five in the morning, which was an [odd time, open spot, high speed, easy plan] to start work.',
        answer: 'odd time',
        options: ['odd time', 'open spot', 'high speed', 'easy plan'],
        korean: '그는 아침 5시에 사무실에 도착했는데, 일을 시작하기에는 참 별난 시간이었어요.',
        explanation: '"odd time"은 남들이 잘 안 다니는 이례적인 시간입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Why did you send me a text message at such an [odd time, old price, easy step, quick road] last night?',
        answer: 'odd time',
        options: ['odd time', 'old price', 'easy step', 'quick road'],
        korean: '어젯밤에 왜 그렇게 뜬금없는 시간에 나한테 문자를 보냈니?',
        explanation: '"at such an odd time"은 그렇게 별난 시간에라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Eating lunch at four in the afternoon is an [odd time, safe place, clear rule, high goal] for a meal.',
        answer: 'odd time',
        options: ['odd time', 'safe place', 'clear rule', 'high goal'],
        korean: '오후 4시에 점심을 먹는 것은 식사하기에 참 애매한 시간이에요.',
        explanation: '"odd time"은 식사나 활동에 맞지 않는 애매한 시간입니다.'
      }
    ]
  },

  // 6. nosebleed seats
  {
    keyExpression: 'nosebleed seats',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Even though we got [nosebleed seats, ringside chairs, floor passes, front rows] at the big stadium, we still enjoyed the game.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'ringside chairs', 'floor passes', 'front rows'],
        korean: '큰 경기장에서 비록 맨 꼭대기 좌석(하늘석)에 앉았지만, 우리는 여전히 경기를 즐겼어요.',
        explanation: '"nosebleed seats"는 경기장이나 대형 공연장의 "맨 꼭대기 높은 좌석(하늘석)"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We sat in the [nosebleed seats way up high] above the basketball court.',
        answer: 'nosebleed seats way up high',
        tokens: ['nosebleed', 'seats', 'way', 'up', 'high'],
        options: ['nosebleed', 'seats', 'way', 'up', 'high'],
        korean: '우리는 농구장 저 높은 곳에 있는 맨 꼭대기 좌석에 앉았어요.',
        explanation: '"nosebleed seats"는 코피가 날 만큼 높은 위치의 꼭대기 좌석을 비유합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The concert tickets were cheap because they were [nosebleed seats, floor seats, front chairs, stage desks] near the very top.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'floor seats', 'front chairs', 'stage desks'],
        korean: '콘서트 티켓은 맨 꼭대기 근처 좌석(하늘석)이어서 가격이 저렴했어요.',
        explanation: '"nosebleed seats"는 가격이 싼 꼭대기 좌석을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'You can see the whole soccer field clearly from the high [nosebleed seats, player benches, green grass, locker rooms].',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'player benches', 'green grass', 'locker rooms'],
        korean: '높은 맨 꼭대기 좌석에서도 축구장 전체를 한눈에 또렷하게 볼 수 있어요.',
        explanation: '"nosebleed seats"는 시야가 한눈에 내려다보이는 높은 좌석입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I bought [nosebleed seats, front chairs, stage tables, driver spots] for the concert because they fit my student budget.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'front chairs', 'stage tables', 'driver spots'],
        korean: '내 학생 예산에 맞았기 때문에 나는 콘서트 꼭대기 좌석(하늘석) 표를 샀어요.',
        explanation: '"nosebleed seats"는 가장 저렴한 꼭대기 층 좌석을 뜻합니다.'
      }
    ]
  },

  // 7. open air stadium
  {
    keyExpression: 'open air stadium',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Attending a summer evening rock concert at an [open air stadium, indoor theater, cinema room, recording studio] under starry skies is magical.',
        answer: 'open air stadium',
        options: ['open air stadium', 'indoor theater', 'cinema room', 'recording studio'],
        korean: '별빛 가득한 하늘 아래 야외 경기장(오픈 에어 스타디움)에서 열리는 여름 저녁 록 콘서트에 가는 것은 마법 같아요.',
        explanation: '"open air stadium"은 지붕이 없는 "야외 경기장/스타디움"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The music sounded great in the [big open air stadium by the river] last night.',
        answer: 'big open air stadium by the river',
        tokens: ['big', 'open', 'air', 'stadium', 'by', 'the', 'river'],
        options: ['big', 'open', 'air', 'stadium', 'by', 'the', 'river'],
        korean: '어젯밤 강가에 있는 큰 야외 경기장에서 음악 소리가 정말 멋지게 울려 퍼졌어요.',
        explanation: '"open air stadium"은 지붕이 열려 있는 야외 경기장입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'They played the soccer game in an [open air stadium, dark closet, small kitchen, basement room] under the blue sky.',
        answer: 'open air stadium',
        options: ['open air stadium', 'dark closet', 'small kitchen', 'basement room'],
        korean: '그들은 푸른 하늘 아래 야외 경기장에서 축구 경기를 치렀어요.',
        explanation: '"open air stadium"은 지붕이 없는 야외 경기장을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Because the game was in an [open air stadium, indoor pool, movie house, subway car], we brought our caps to block the sun.',
        answer: 'open air stadium',
        options: ['open air stadium', 'indoor pool', 'movie house', 'subway car'],
        korean: '경기가 야외 경기장에서 열렸기 때문에, 우리는 햇빛을 가리기 위해 모자를 챙겨갔어요.',
        explanation: '"open air stadium"은 햇빛과 바람이 들어오는 야외 경기장입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A cool summer breeze blew across the [open air stadium, closed office, classroom desk, hotel elevator] during the concert.',
        answer: 'open air stadium',
        options: ['open air stadium', 'closed office', 'classroom desk', 'hotel elevator'],
        korean: '콘서트가 열리는 동안 시원한 여름 바람이 야외 경기장 안으로 불어왔어요.',
        explanation: '"open air stadium"은 시원한 야외 분위기를 느낄 수 있는 경기장입니다.'
      }
    ]
  },

  // 8. scripted setup
  {
    keyExpression: 'scripted setup',
    sentences: [
      {
        type: 'multiple-choice',
        english: "The host's supposedly awkward blunder on stage was actually a clever [scripted setup, accidental glitch, random tragedy, genuine sorrow] to hype the audience.",
        answer: 'scripted setup',
        options: ['scripted setup', 'accidental glitch', 'random tragedy', 'genuine sorrow'],
        korean: '무대 위 사회자의 어색한 실수 같았던 행동은 사실 관객들의 호응을 끌어올리기 위한 영리한 대본 설정(각본 연출)이었어요.',
        explanation: '"scripted setup"은 미리 연출하고 짠 "대본에 따른 설정/기획"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The funny argument between the actors was [a clever scripted setup for the comedy show].',
        answer: 'a clever scripted setup for the comedy show',
        tokens: ['a', 'clever', 'scripted', 'setup', 'for', 'the', 'comedy', 'show'],
        options: ['a', 'clever', 'scripted', 'setup', 'for', 'the', 'comedy', 'show'],
        korean: '배우들 사이의 우스꽝스러운 말다툼은 코미디 쇼를 위해 영리하게 미리 짠 대본 설정이었어요.',
        explanation: '"scripted setup"은 사전에 기획된 각본 연출입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'That surprising moment on the talk show was a [scripted setup, natural disaster, sudden accident, broken glass] planned by the director.',
        answer: 'scripted setup',
        options: ['scripted setup', 'natural disaster, sudden accident, broken glass'],
        options: ['scripted setup', 'natural disaster', 'sudden accident', 'broken glass'],
        korean: '토크쇼의 그 놀라운 순간은 연출자가 미리 계획한 대본 설정이었어요.',
        explanation: '"scripted setup"은 사전에 짜인 연출을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It looked like a real mistake, but it was just a [scripted setup, deep regret, true pain, heavy storm] for the movie scene.',
        answer: 'scripted setup',
        options: ['scripted setup', 'deep regret', 'true pain', 'heavy storm'],
        korean: '진짜 실수처럼 보였지만, 그것은 영화 장면을 위한 대본 설정에 불과했어요.',
        explanation: '"scripted setup"은 미리 정해진 각본 연출입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The magic trick on stage was a neat [scripted setup, wild storm, bad error, lucky guess] that they practiced many times.',
        answer: 'scripted setup',
        options: ['scripted setup', 'wild storm', 'bad error', 'lucky guess'],
        korean: '무대 위 마술은 그들이 여러 번 연습한 깔끔한 각본 연출이었어요.',
        explanation: '"scripted setup"은 계획된 연출을 뜻합니다.'
      }
    ]
  },

  // 9. up to
  {
    keyExpression: 'up to',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'We have provided all the resources and guidelines, so now the final outcome is strictly [up to, down on, out of, off with] you.',
        answer: 'up to',
        options: ['up to', 'down on', 'out of', 'off with'],
        korean: '우리가 모든 자료와 가이드라인을 제공했으니, 이제 최종 결과는 전적으로 여러분에게 달려 있습니다.',
        explanation: '"be up to someone"은 "~에게 달려 있다, ~의 몫이다"라는 필수 관용구입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Which movie we watch tonight is [completely up to my little sister].',
        answer: 'completely up to my little sister',
        tokens: ['completely', 'up', 'to', 'my', 'little', 'sister'],
        options: ['completely', 'up', 'to', 'my', 'little', 'sister'],
        korean: '오늘 밤 우리가 어떤 영화를 볼지는 전적으로 내 여동생에게 달려 있어요.',
        explanation: '"up to someone"은 그 사람의 선택에 달렸음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We can eat pizza or noodles for lunch, so the choice is [up to, down to, off with, out of] you.',
        answer: 'up to',
        options: ['up to', 'down to', 'off with', 'out of'],
        korean: '점심으로 피자나 국수를 먹을 수 있으니, 선택은 네게 달려 있어.',
        explanation: '"up to you"는 네 선택에 달렸다는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whether we go for a walk in the park tomorrow is [up to, down by, out of, away from] the weather.',
        answer: 'up to',
        options: ['up to', 'down by', 'out of', 'away from'],
        korean: '내일 공원에 산책을 갈 수 있을지는 날씨에 달려 있어요.',
        explanation: '"up to"는 조건이나 상황에 달려 있음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It is [up to, off from, down at, back to] the soccer coach to choose the team captain today.',
        answer: 'up to',
        options: ['up to', 'off from', 'down at', 'back to'],
        korean: '오늘 팀 주장을 뽑는 것은 축구 코치님께 달려 있어요.',
        explanation: '"up to someone"은 그 사람의 권한이자 결정에 달렸음을 뜻합니다.'
      }
    ]
  },

  // 10. played that up
  {
    keyExpression: 'played that up',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'When the idol singer noticed the crowd screaming, he playfully [played that up, toned it down, backed away, cut it out] by winking toward the camera.',
        answer: 'played that up',
        options: ['played that up', 'toned it down', 'backed away', 'cut it out'],
        korean: '아이돌 가수는 관객들의 함성을 알아차리자 카메라를 향해 윙크하며 능청스럽게 분위기를 한껏 띄우고 과장했어요.',
        explanation: '"play something up"은 상황이나 매력을 "능청스럽게 과장하다, 부각하다, 분위기를 띄우다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The actor made a funny face and [played that up for the laughing kids].',
        answer: 'played that up for the laughing kids',
        tokens: ['played', 'that', 'up', 'for', 'the', 'laughing', 'kids'],
        options: ['played', 'that', 'up', 'for', 'the', 'laughing', 'kids'],
        korean: '배우는 우스꽝스러운 표정을 지으며 웃는 아이들을 위해 능청스럽게 분위기를 더 띄웠어요.',
        explanation: '"played that up"은 반응을 얻어 분위기를 더 띄우는 행동입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The friendly puppy saw everyone watching, so he [played that up, kept quiet, went away, sat down] by rolling playfully on the grass.',
        answer: 'played that up',
        options: ['played that up', 'kept quiet', 'went away', 'sat down'],
        korean: '다정한 강아지는 모두가 쳐다보는 것을 보고 잔디밭에서 장난스레 뒹굴며 귀여움을 한껏 과시했어요.',
        explanation: '"played that up"은 주목받는 상황을 더 즐기며 부각함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She heard her friends laughing at her joke, so she [played that up, stopped talking, ran home, hid away] with funny gestures.',
        answer: 'played that up',
        options: ['played that up', 'stopped talking', 'ran home', 'hid away'],
        korean: '그녀는 친구들이 자기 농담에 웃는 것을 듣고 재미있는 몸짓으로 분위기를 더 띄웠어요.',
        explanation: '"played that up"은 분위기를 더 살리고 과장함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He knew people loved his silly dance moves, so he [played that up, slowed down, gave up, walked out] during the song.',
        answer: 'played that up',
        options: ['played that up', 'slowed down', 'gave up', 'walked out'],
        korean: '그는 사람들이 자신의 우스꽝스러운 춤동작을 좋아한다는 것을 알고 노래하는 동안 능청스럽게 더 돋보이게 췄어요.',
        explanation: '"played that up"은 반응을 즐기며 상황을 과장하는 모습입니다.'
      }
    ]
  },

  // 11. appearance
  {
    keyExpression: 'appearance',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Professional flight attendants maintain a neat personal [appearance, velocity, fragrance, temperature] according to airline dress codes.',
        answer: 'appearance',
        options: ['appearance', 'velocity', 'fragrance', 'temperature'],
        korean: '전문 항공 승무원들은 항공사 복장 규정에 따라 단정한 개인 용모와 겉모습을 유지합니다.',
        explanation: '"appearance"는 사람의 "용모, 외모, 겉모습"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Wearing clean clothes gives you a [neat and polite personal appearance] at work.',
        answer: 'neat and polite personal appearance',
        tokens: ['neat', 'and', 'polite', 'personal', 'appearance'],
        options: ['neat', 'and', 'polite', 'personal', 'appearance'],
        korean: '깨끗한 옷을 입는 것은 직장에서 단정하고 예의 바른 외모를 보여줍니다.',
        explanation: '"personal appearance"는 개인의 단정한 용모나 겉모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her friendly smile and tidy [appearance, speed, weight, depth] made a great first impression on everyone.',
        answer: 'appearance',
        options: ['appearance', 'speed', 'weight', 'depth'],
        korean: '그녀의 상냥한 미소와 단정한 용모는 모두에게 훌륭한 첫인상을 주었어요.',
        explanation: '"appearance"는 사람의 옷차림이나 외모를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The hotel staff always keep a clean and professional [appearance, height, power, noise] in their uniforms.',
        answer: 'appearance',
        options: ['appearance', 'height', 'power', 'noise'],
        korean: '호텔 직원들은 유니폼을 입고 언제나 깔끔하고 단정한 용모를 유지해요.',
        explanation: '"appearance"는 단정한 차림새나 외모입니다.'
      },
      {
        type: 'multiple-choice',
        english: "You don't need fancy clothes to have a neat and simple [appearance, weather, engine, luggage] at school.",
        answer: 'appearance',
        options: ['appearance', 'weather', 'engine', 'luggage'],
        korean: '학교에서 단정하고 소박한 차림새(용모)를 위해 화려한 옷이 필요하진 않아요.',
        explanation: '"appearance"는 겉모습과 옷차림을 뜻합니다.'
      }
    ]
  },

  // 12. turns out
  {
    keyExpression: 'turns out',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I thought I lost my car keys, but it [turns out, blows away, cuts off, falls down] they were tucked inside my winter coat pocket.',
        answer: 'turns out',
        options: ['turns out', 'blows away', 'cuts off', 'falls down'],
        korean: '차 열쇠를 잃어버린 줄 알았는데, 알고 보니 겨울 코트 주머니 속에 쏙 들어가 있었더라고요.',
        explanation: '"it turns out (that)"은 몰랐던 사실이 밝혀지거나 "알고 보니 ~이다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We worried about the rain, but [it turns out the sun was shining] all day.',
        answer: 'it turns out the sun was shining',
        tokens: ['it', 'turns', 'out', 'the', 'sun', 'was', 'shining'],
        options: ['it', 'turns', 'out', 'the', 'sun', 'was', 'shining'],
        korean: '우리는 비가 올까 봐 걱정했지만, 알고 보니 온종일 해가 쨍쨍 비추고 있었어요.',
        explanation: '"it turns out"은 결과적으로 사실이 드러났음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I thought the test would be hard, but it [turns out, sets off, holds back, drives in] to be quite easy.',
        answer: 'turns out',
        options: ['turns out', 'sets off', 'holds back', 'drives in'],
        korean: '시험이 어려울 줄 알았는데, 알고 보니 꽤 쉬웠어요.',
        explanation: '"turns out to be"는 알고 보니 ~임이 드러나다를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She thought her friend was away on a trip, but it [turns out, looks after, breaks down, turns off] he was resting at home.',
        answer: 'turns out',
        options: ['turns out', 'looks after', 'breaks down', 'turns off'],
        korean: '그녀는 친구가 여행을 간 줄 알았지만, 알고 보니 집에서 쉬고 있었어요.',
        explanation: '"it turns out"은 새로운 사실의 발견을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It [turns out, runs out, fills in, counts down] that our new neighbor grew up in the same small hometown.',
        answer: 'turns out',
        options: ['turns out', 'runs out', 'fills in', 'counts down'],
        korean: '알고 보니 우리 새 이웃이 나와 같은 작은 고향에서 자랐더라고요.',
        explanation: '"it turns out that"은 몰랐던 사실이 밝혀졌을 때 씁니다.'
      }
    ]
  },

  // 13. came across
  {
    keyExpression: 'came across',
    sentences: [
      {
        type: 'multiple-choice',
        english: "While cleaning the dusty attic boxes, I [came across, fell behind, held up, backed off] a stack of grandfather's handwritten letters.",
        answer: 'came across',
        options: ['came across', 'fell behind', 'held up', 'backed off'],
        korean: '먼지 쌓인 다락방 상자들을 정리하다가 할아버지의 자필 편지 묶음을 우연히 발견했어요.',
        explanation: '"come across"는 물건이나 사람을 "우연히 발견하다/마주치다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'During our walk through town, we [came across a lovely little bakery] with fresh warm bread.',
        answer: 'came across a lovely little bakery',
        tokens: ['came', 'across', 'a', 'lovely', 'little', 'bakery'],
        options: ['came', 'across', 'a', 'lovely', 'little', 'bakery'],
        korean: '동네를 산책하는 동안, 우리는 따뜻한 빵이 있는 작고 사랑스러운 빵집을 우연히 발견했어요.',
        explanation: '"came across"는 길을 가다 우연히 마주치거나 발견함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'While cleaning my study desk, I [came across, turned away, broke up, drove by] my favorite old pen from school.',
        answer: 'came across',
        options: ['came across', 'turned away', 'broke up', 'drove by'],
        korean: '공부 책상을 정리하다가 학창 시절 내가 가장 좋아하던 오래된 펜을 우연히 발견했어요.',
        explanation: '"came across"는 잃어버렸거나 잊고 있던 물건을 우연히 찾는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She opened an old book and [came across, looked after, stayed away, put on] a colorful postcard from her friend.',
        answer: 'came across',
        options: ['came across', 'looked after', 'stayed away', 'put on'],
        korean: '그녀는 오래된 책을 펼치다가 친구가 보낸 알록달록한 엽서를 우연히 발견했어요.',
        explanation: '"came across"는 책 속 등에서 뜻밖의 물건을 발견함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'While walking in the park, we [came across, set up, blew out, threw away] a friendly cat resting under a bench.',
        answer: 'came across',
        options: ['came across', 'set up', 'blew out', 'threw away'],
        korean: '공원을 걷다가 우리는 벤치 밑에서 쉬고 있는 다정한 고양이를 우연히 마주쳤어요.',
        explanation: '"came across"는 사람이나 동물을 우연히 마주치는 것도 나타냅니다.'
      }
    ]
  },

  // 14. turned into
  {
    keyExpression: 'turned into',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'What started as a quiet picnic quickly [turned into, walked away, gave up, fell off] a lively birthday celebration with dozens of friends.',
        answer: 'turned into',
        options: ['turned into', 'walked away', 'gave up', 'fell off'],
        korean: '조용한 소풍으로 시작했던 자리가 순식간에 수십 명의 친구들과 함께하는 떠들썩한 생일 파티로 변모했어요.',
        explanation: '"turn into ~"는 원래의 상태에서 다른 무언가로 "변하다, 바뀌다"라는 핵심 구동사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'A few light drops of rain quickly [turned into a heavy summer storm] this afternoon.',
        answer: 'turned into a heavy summer storm',
        tokens: ['turned', 'into', 'a', 'heavy', 'summer', 'storm'],
        options: ['turned', 'into', 'a', 'heavy', 'summer', 'storm'],
        korean: '몇 방울의 가벼운 빗방울이 오늘 오후 순식간에 거센 여름 폭풍우로 변했어요.',
        explanation: '"turned into"는 다른 상태로 바뀌었음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Our quick chat in the kitchen [turned into, stood up, went off, passed by] a long conversation about our childhood.',
        answer: 'turned into',
        options: ['turned into', 'stood up', 'went off', 'passed by'],
        korean: '주방에서의 짧은 수다가 어린 시절에 관한 긴 대화로 이어졌어요(바뀌었어요).',
        explanation: '"turned into"는 다른 상황으로 전환됨을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The little green seed we planted in spring [turned into, checked out, pulled in, ran away] a beautiful sunflower.',
        answer: 'turned into',
        options: ['turned into', 'checked out', 'pulled in', 'ran away'],
        korean: '봄에 심은 작은 초록 씨앗이 아름다운 해바라기로 자라났어요(변했어요).',
        explanation: '"turned into"는 성장하여 완전히 다른 모습이 됨을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'What began as a small hobby soon [turned into, cut down, threw out, woke up] a successful small business.',
        answer: 'turned into',
        options: ['turned into', 'cut down', 'threw out', 'woke up'],
        korean: '작은 취미로 시작했던 일이 곧 성공적인 작은 사업으로 발전했어요(변했어요).',
        explanation: '"turned into"는 상태나 형태의 발전적 변화를 나타냅니다.'
      }
    ]
  },

  // 15. felt random
  {
    keyExpression: 'felt random',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The sudden question about 18th-century French poetry in our physics lecture [felt random, sounded logical, made sense, seemed normal] to everyone.',
        answer: 'felt random',
        options: ['felt random', 'sounded logical', 'made sense', 'seemed normal'],
        korean: '물리학 강의 도중 나온 18세기 프랑스 시에 대한 뜬금없는 질문은 모두에게 정말 생뚱맞게 느껴졌어요.',
        explanation: '"felt random"은 맥락에 맞지 않거나 "뜬금없게 느껴지다, 생뚱맞다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Getting a text message from an unknown number [felt random and strange late at night].',
        answer: 'felt random and strange late at night',
        tokens: ['felt', 'random', 'and', 'strange', 'late', 'at', 'night'],
        options: ['felt', 'random', 'and', 'strange', 'late', 'at', 'night'],
        korean: '모르는 번호로부터 문자를 받은 것은 늦은 밤에 참 뜬금없고 이상하게 느껴졌어요.',
        explanation: '"felt random"은 맥락 없이 갑작스러움을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Hearing a Christmas song on the radio in the middle of hot July [felt random, sounded right, looked neat, went well] to all listeners.',
        answer: 'felt random',
        options: ['felt random', 'sounded right', 'looked neat', 'went well'],
        korean: '무더운 7월 한가운데 라디오에서 크리스마스 노래가 나오는 것은 모든 청취자에게 참 뜬금없게 느껴졌어요.',
        explanation: '"felt random"은 시기나 상황에 전혀 맞지 않음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His sudden joke during the quiet test [felt random, seemed right, rang clear, looked fine] and confused the teacher.',
        answer: 'felt random',
        options: ['felt random', 'seemed right', 'rang clear', 'looked fine'],
        korean: '조용한 시험 시간에 나온 그의 갑작스러운 농담은 뜬금없게 느껴졌고 선생님을 어리둥절하게 만들었어요.',
        explanation: '"felt random"은 상황과 어울리지 않는 돌발 행동을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her sudden story about an elephant in Africa [felt random, sounded true, stood tall, worked out] during our dinner conversation.',
        answer: 'felt random',
        options: ['felt random', 'sounded true', 'stood tall', 'worked out'],
        korean: '저녁 식사 대화 중에 나온 아프리카 코끼리에 관한 그녀의 갑작스러운 이야기는 뜬금없게 느껴졌어요.',
        explanation: '"felt random"은 화제와 상관없는 생뚱맞은 이야기입니다.'
      }
    ]
  },

  // 16. get in line
  {
    keyExpression: 'get in line',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'To buy hot freshly baked croissants before they sell out, you must [get in line, get in touch, get along, get ahead] by seven in the morning.',
        answer: 'get in line',
        options: ['get in line', 'get in touch', 'get along', 'get ahead'],
        korean: '갓 구운 따끈한 크루아상이 매진되기 전에 사려면 아침 7시까지 줄을 서야만 해요.',
        explanation: '"get in line"은 차례를 기다리기 위해 "줄을 서다"라는 뜻의 가장 자연스러운 표현입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Everyone had to [get in line before entering the cinema] to show tickets.',
        answer: 'get in line before entering the cinema',
        tokens: ['get', 'in', 'line', 'before', 'entering', 'the', 'cinema'],
        options: ['get', 'in', 'line', 'before', 'entering', 'the', 'cinema'],
        korean: '모두가 티켓을 보여주기 위해 영화관에 들어가기 전 줄을 서야 했어요.',
        explanation: '"get in line"은 줄을 서서 차례를 기다리는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Please [get in line, take your seat, run across, sit down] behind the yellow line while waiting for the train.',
        answer: 'get in line',
        options: ['get in line', 'take your seat', 'run across', 'sit down'],
        korean: '기차를 기다리는 동안 노란 선 뒤로 줄을 서 주세요.',
        explanation: '"get in line"은 승차나 입장을 위해 줄을 서는 동작입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We arrived at the ice cream truck and had to [get in line, look up, turn back, wake up] behind ten happy kids.',
        answer: 'get in line',
        options: ['get in line', 'look up', 'turn back', 'wake up'],
        korean: '우리는 아이스크림 트럭에 도착해 열 명의 신난 아이들 뒤로 줄을 서야 했어요.',
        explanation: '"get in line"은 순서를 기다리기 위해 대기열에 들어가는 것입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you want to taste a free sample of the warm soup, please [get in line, go home, walk away, step aside] here.',
        answer: 'get in line',
        options: ['get in line', 'go home', 'walk away', 'step aside'],
        korean: '따뜻한 수프 무료 시식을 맛보고 싶으시다면, 이곳에 줄을 서 주세요.',
        explanation: '"get in line"은 대기열에 서다를 뜻합니다.'
      }
    ]
  },

  // 17. first in line
  {
    keyExpression: 'first in line',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Dedicated fans camped on the sidewalk overnight so they could be [first in line, last in order, late in arrival, lost in crowd] when doors opened.',
        answer: 'first in line',
        options: ['first in line', 'last in order', 'late in arrival', 'lost in crowd'],
        korean: '열성적인 팬들은 문이 열릴 때 맨 첫 번째로 줄을 서기 위해 보도블록 위에서 밤을 새워 텐트를 쳤어요.',
        explanation: '"first in line"은 대기열에서 "맨 앞줄에 선, 가장 먼저 줄을 선" 순서를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'She arrived early and was [first in line to buy tickets for the show] this morning.',
        answer: 'first in line to buy tickets for the show',
        tokens: ['first', 'in', 'line', 'to', 'buy', 'tickets', 'for', 'the', 'show'],
        options: ['first', 'in', 'line', 'to', 'buy', 'tickets', 'for', 'the', 'show'],
        korean: '그녀는 일찍 도착해서 오늘 아침 공연 티켓을 사기 위해 맨 첫 번째로 줄을 섰어요.',
        explanation: '"first in line"은 대기열의 가장 맨 앞을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The hungry boy ran to the school cafeteria and was [first in line, last to leave, out of sight, far behind] for fresh pizza.',
        answer: 'first in line',
        options: ['first in line', 'last to leave', 'out of sight', 'far behind'],
        korean: '배고픈 소년은 학교 식당으로 달려가 따끈한 피자를 받기 위해 맨 첫 번째로 줄을 섰어요.',
        explanation: '"first in line"은 줄의 가장 앞자리입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you want to be [first in line, slow to move, out of step, back in time] when the bakery opens, wake up before six.',
        answer: 'first in line',
        options: ['first in line', 'slow to move', 'out of step', 'back in time'],
        korean: '빵집이 열릴 때 맨 첫 번째로 줄을 서고 싶다면 6시 전에 일어나세요.',
        explanation: '"first in line"은 가장 먼저 줄을 선 상태를 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He stood [first in line, far away, off the road, in the tree] waiting for the morning bus doors to open.',
        answer: 'first in line',
        options: ['first in line', 'far away', 'off the road', 'in the tree'],
        korean: '그는 아침 버스 문이 열리기를 기다리며 맨 첫 번째로 줄을 서 있었어요.',
        explanation: '"first in line"은 줄의 제일 첫 번째 위치를 뜻합니다.'
      }
    ]
  },

  // 18. By the time
  {
    keyExpression: 'By the time',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[By the time, As long as, In case of, Due to the] we finally arrived at the concert arena, the opening act was already finishing.',
        answer: 'By the time',
        options: ['By the time', 'As long as', 'In case of', 'Due to the'],
        korean: '우리가 마침내 콘서트장에 도착했을 무렵에는 이미 오프닝 무대가 거의 끝나가고 있었어요.',
        explanation: '"by the time ~"은 "~할 때쯤에는, ~할 무렵에는"이라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: '[By the time we got home], mom had finished cooking a warm dinner for everyone.',
        answer: 'By the time we got home',
        tokens: ['By', 'the', 'time', 'we', 'got', 'home'],
        options: ['By', 'the', 'time', 'we', 'got', 'home'],
        korean: '우리가 집에 도착했을 무렵에는 엄마가 모두를 위해 따뜻한 저녁 식사를 다 차려놓으신 상태였어요.',
        explanation: '"By the time"은 특정 시점에 도달했을 때를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: '[By the time, As well as, So that, Even if] the heavy rain stopped, the sun was already setting behind the hills.',
        answer: 'By the time',
        options: ['By the time', 'As well as', 'So that', 'Even if'],
        korean: '폭우가 그쳤을 무렵에는 이미 해가 언덕 뒤로 지고 있었어요.',
        explanation: '"By the time"은 어떤 일이 일어났을 때를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: '[By the time, Because of, In spite of, Rather than] she finished reading all her school books, it was already midnight.',
        answer: 'By the time',
        options: ['By the time', 'Because of', 'In spite of', 'Rather than'],
        korean: '그녀가 학교 책들을 다 읽었을 무렵에는 이미 자정이 다 되어 있었어요.',
        explanation: '"By the time"은 완료되는 시점을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: '[By the time, As far as, Unless that, Until when] we reached the park, all our classmates were already playing soccer.',
        answer: 'By the time',
        options: ['By the time', 'As far as', 'Unless that', 'Until when'],
        korean: '우리가 공원에 도착했을 때쯤에는 이미 모든 반 친구들이 축구를 하고 있었어요.',
        explanation: '"By the time"은 어떤 동작이 이루어진 시점을 뜻합니다.'
      }
    ]
  },

  // 19. Throughout
  {
    keyExpression: 'Throughout',
    sentences: [
      {
        type: 'multiple-choice',
        english: '[Throughout, Beneath, Against, Between] the two-hour acoustic performance, the audience remained completely captivated and silent.',
        answer: 'Throughout',
        options: ['Throughout', 'Beneath', 'Against', 'Between'],
        korean: '2시간 동안의 어쿠스틱 공연 내내, 관객들은 완전히 매료되어 숨죽이고 있었습니다.',
        explanation: '"throughout"은 시간의 "처음부터 끝까지 내내, 줄곧"을 뜻하는 전치사입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He smiled and stayed cheerful [throughout the entire school day] with his friends.',
        answer: 'throughout the entire school day',
        tokens: ['throughout', 'the', 'entire', 'school', 'day'],
        options: ['throughout', 'the', 'entire', 'school', 'day'],
        korean: '그는 학교에 있는 하루 내내 친구들과 함께 미소를 지으며 밝게 지냈어요.',
        explanation: '"throughout the day"는 온종일 내내 지속됨을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It rained steadily [throughout, beside, under, behind] the whole weekend, so we stayed home and played board games.',
        answer: 'Throughout',
        options: ['Throughout', 'Beside', 'Under', 'Behind'],
        korean: '주말 내내 꾸준히 비가 내려서, 우리는 집에 머물며 보드게임을 했어요.',
        explanation: '"Throughout the weekend"는 주말 내내라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She stayed calm and focused [throughout, below, across, among] the entire one-hour English test.',
        answer: 'throughout',
        options: ['throughout', 'below', 'across', 'among'],
        korean: '그녀는 한 시간 동안의 영어 시험 내내 차분하게 집중했어요.',
        explanation: '"throughout the test"는 시험 내내를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The baby slept peacefully [throughout, against, beneath, without] the three-hour car ride to grandma\'s house.',
        answer: 'throughout',
        options: ['throughout', 'against', 'beneath', 'without'],
        korean: '아기는 할머니 댁으로 가는 세 시간의 차 이동 내내 평화롭게 잠을 잤어요.',
        explanation: '"throughout the ride"는 차를 타는 시간 내내라는 뜻입니다.'
      }
    ]
  },

  // 20. wondering if
  {
    keyExpression: 'wondering if',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'I called the local clinic, [wondering if, deciding that, proving why, knowing how] any doctor appointments were available today.',
        answer: 'wondering if',
        options: ['wondering if', 'deciding that', 'proving why', 'knowing how'],
        korean: '오늘 진료 예약이 가능한지 궁금해서 동네 의원에 전화를 걸어보았어요.',
        explanation: '"wonder if ~"는 "~인지 아닌지 궁금하다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'I called my friend, [wondering if she was free to have lunch] with me today.',
        answer: 'wondering if she was free to have lunch',
        tokens: ['wondering', 'if', 'she', 'was', 'free', 'to', 'have', 'lunch'],
        options: ['wondering', 'if', 'she', 'was', 'free', 'to', 'have', 'lunch'],
        korean: '오늘 나와 함께 점심을 먹을 시간이 되는지 궁금해서 친구에게 전화를 걸었어요.',
        explanation: '"wondering if"는 ~인지 궁금하여라는 분사구문입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He looked out the bedroom window, [wondering if, knowing that, finding how, proving what] it would rain during his afternoon walk.',
        answer: 'wondering if',
        options: ['wondering if', 'knowing that', 'finding how', 'proving what'],
        korean: '그는 오후 산책 때 비가 올지 궁금해하며 침실 창밖을 내다보았어요.',
        explanation: '"wondering if"는 날씨나 상황이 어떨지 궁금해하는 마음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She sent a quick message to mom, [wondering if, showing how, proving why, deciding that] we needed more milk from the store.',
        answer: 'wondering if',
        options: ['wondering if', 'showing how', 'proving why', 'deciding that'],
        korean: '가게에서 우유를 더 사 가야 하는지 궁금해서 그녀는 엄마에게 짧은 문자를 보냈어요.',
        explanation: '"wondering if"는 여부를 묻고 싶을 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We knocked on the front door, [wondering if, forgetting why, knowing that, deciding how] anyone was home.',
        answer: 'wondering if',
        options: ['wondering if', 'forgetting why', 'knowing that', 'deciding how'],
        korean: '집에 아무도 없는 것은 아닌지 궁금해하며 우리는 현관문을 두드렸어요.',
        explanation: '"wondering if"는 상황을 확신하지 못해 궁금해함을 뜻합니다.'
      }
    ]
  },

  // 21. at the end
  {
    keyExpression: 'at the end',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Surprise fireworks erupted over the stadium stage [at the end, in the middle, at the start, on the way] of the encore performance.',
        answer: 'at the end',
        options: ['at the end', 'in the middle', 'at the start', 'on the way'],
        korean: '앵콜 무대의 마지막 끝 무렵에 스타디움 무대 위로 깜짝 불꽃놀이가 터져 나왔어요.',
        explanation: '"at the end"는 공연이나 행사의 "마지막에, 끝 무렵에"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'Everyone stood up and clapped happily [at the end of the school play] yesterday.',
        answer: 'at the end of the school play',
        tokens: ['at', 'the', 'end', 'of', 'the', 'school', 'play'],
        options: ['at', 'the', 'end', 'of', 'the', 'school', 'play'],
        korean: '어제 학교 연극의 마지막 끝 무렵에 모두가 일어나 기쁘게 박수를 쳤어요.',
        explanation: '"at the end of"는 공연이나 행사의 마지막 시점을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Please write your name and today\'s date on the line [at the end, at first, in the front, on the top] of the page.',
        answer: 'at the end',
        options: ['at the end', 'at first', 'in the front', 'on the top'],
        korean: '페이지의 맨 마지막(끝) 줄에 당신의 이름과 오늘 날짜를 적어주세요.',
        explanation: '"at the end"는 글이나 문서의 끝부분을 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We enjoyed sweet ice cream [at the end, in the start, by chance, on time] of our family dinner.',
        answer: 'at the end',
        options: ['at the end', 'in the start', 'by chance', 'on time'],
        korean: '우리는 가족 저녁 식사의 마지막 끝 무렵에 달콤한 아이스크림을 즐겼어요.',
        explanation: '"at the end of dinner"는 식사 말미에 디저트를 먹는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The teacher answered all student questions [at the end, in advance, at the onset, ahead of time] of the lesson.',
        answer: 'at the end',
        options: ['at the end', 'in advance', 'at the onset', 'ahead of time'],
        korean: '선생님께서는 수업의 마지막 끝 무렵에 학생들의 모든 질문에 답해 주셨어요.',
        explanation: '"at the end of the lesson"은 수업이 끝나는 시점을 뜻합니다.'
      }
    ]
  }
];

// Write quiz-pool.json
const poolPath = path.join(LESSON_DIR, 'quiz-pool.json');
fs.writeFileSync(poolPath, JSON.stringify(POOL, null, 2), 'utf8');
console.log(`[Success] Written: ${poolPath} (${POOL.length} expressions, ${POOL.length * 5} sentences)`);

// Write quiz.md using the 1st sentence of each pool entry
let md = `# Lesson 4: Oakland BigBang Concert Quizzes\n\n`;
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
