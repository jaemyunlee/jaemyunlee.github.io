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
        english: 'Among dozens of qualified applicants, her creative portfolio really [stood out, fell behind, backed down, checked out] to the hiring panel.',
        answer: 'stood out',
        options: ['stood out', 'fell behind', 'backed down', 'checked out'],
        korean: '수십 명의 쟁쟁한 지원자들 중에서 그녀의 창의적인 포트폴리오는 면접관들에게 유독 눈에 띄었어요.',
        explanation: '"stand out"은 여러 사람이나 사물들 사이에서 "유독 눈에 띄다, 두드러지다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'His bright neon jacket [stood out in the crowded concert stadium].',
        answer: 'stood out in the crowded concert stadium',
        tokens: ['stood', 'out', 'in', 'the', 'crowded', 'concert', 'stadium'],
        options: ['stood', 'out', 'in', 'the', 'crowded', 'concert', 'stadium'],
        korean: '그의 밝은 네온 자켓은 인파로 가득 찬 콘서트 경기장 안에서 단연 돋보였어요.',
        explanation: '군중 속에서 눈에 띄게 돋보이는 모습을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'One particular acoustic song [stood out, blew away, passed through, tuned out] as the emotional highlight of the entire music album.',
        answer: 'stood out',
        options: ['stood out', 'blew away', 'passed through', 'tuned out'],
        korean: '어쿠스틱 곡 한 곡이 앨범 전체에서 가장 감성적인 하이라이트로 유독 돋보였습니다.',
        explanation: '전체 수록곡 중 가장 특별하게 두드러졌음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her polite manners and clear communication [stood out, turned off, broke up, dropped out] during the internship orientation.',
        answer: 'stood out',
        options: ['stood out', 'turned off', 'broke up', 'dropped out'],
        korean: '인턴십 오리엔테이션에서 그녀의 공손한 태도와 명확한 의사소통은 남다르게 돋보였습니다.',
        explanation: '태도와 능력이 다른 사람들 사이에서 돋보이는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The vintage sports car [stood out, burned out, faded away, gave in] among rows of ordinary commuter sedans in the parking lot.',
        answer: 'stood out',
        options: ['stood out', 'burned out', 'faded away', 'gave in'],
        korean: '주차장에 늘어선 평범한 출퇴근용 세단들 사이에서 그 클래식 스포츠카는 단연 눈에 띄었어요.',
        explanation: '평범한 것들 사이에서 확연히 구별되는 차별성을 나타냅니다.'
      }
    ]
  },

  // 2. fit
  {
    keyExpression: 'fit',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The upbeat pop soundtrack didn\'t really [fit, break, cost, lose] the melancholic atmosphere of the historical documentary film.',
        answer: 'fit',
        options: ['fit', 'break', 'cost', 'lose'],
        korean: '신나는 팝 음악 사운드트랙은 역사 다큐멘터리 영화의 쓸쓸한 분위기와 전혀 어울리지 않았어요.',
        explanation: '"fit"은 분위기나 상황, 장소에 "어울리다, 꼭 들어맞다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'His leadership style seemed to [fit the company culture perfectly].',
        answer: 'fit the company culture perfectly',
        tokens: ['fit', 'the', 'company', 'culture', 'perfectly'],
        options: ['fit', 'the', 'company', 'culture', 'perfectly'],
        korean: '그의 리더십 스타일은 회사 기업 문화에 완벽하게 들어맞는 것 같았어요.',
        explanation: '"fit the culture"는 문화나 환경에 잘 어울림을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We tried rearranging the furniture, but the massive dining table simply did not [fit, hide, risk, earn] in our compact apartment.',
        answer: 'fit',
        options: ['fit', 'hide', 'risk', 'earn'],
        korean: '가구를 다시 배치해 보았지만, 그 거대한 식탁은 우리 아담한 아파트 공간에 도무지 들어맞지 않았어요.',
        explanation: '공간이나 치수에 꼭 들어맞지 않는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Does this jacket [fit, fold, burn, drop] you comfortably across the shoulders, or is it too tight?',
        answer: 'fit',
        options: ['fit', 'fold', 'burn', 'drop'],
        korean: '이 자켓 어깨너비가 편안하게 잘 맞나요, 아니면 너무 끼나요?',
        explanation: '옷의 사이즈나 핏이 잘 맞는지 묻는 일상 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She was wondering whether her personal teaching philosophy would [fit, drag, tear, wipe] into the traditional school curriculum.',
        answer: 'fit',
        options: ['fit', 'drag', 'tear', 'wipe'],
        korean: '그녀는 자신의 개인적인 교육 철학이 전통적인 학교 교육과정에 잘 부합할지 고민하고 있었어요.',
        explanation: '철학이나 가치관이 조직의 방향성에 부합함을 의미합니다.'
      }
    ]
  },

  // 3. quite a few
  {
    keyExpression: 'quite a few',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Although the weather forecast predicted rain, [quite a few, scarcely any, hardly one, barely all] fans still showed up at the stadium.',
        answer: 'quite a few',
        options: ['quite a few', 'scarcely any', 'hardly one', 'barely all'],
        korean: '비가 올 거라는 일기예보에도 불구하고, 꽤 많은 팬들이 여전히 경기장에 나타났어요.',
        explanation: '"quite a few"는 생각보다 "꽤 많은, 상당수의"를 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'There were [quite a few international tourists waiting] outside the museum gates.',
        answer: 'quite a few international tourists waiting',
        tokens: ['quite', 'a', 'few', 'international', 'tourists', 'waiting'],
        options: ['quite', 'a', 'few', 'international', 'tourists', 'waiting'],
        korean: '박물관 문 밖에는 꽤 많은 외국인 관광객들이 대기하고 있었어요.',
        explanation: '적지 않은 수의 사람들이 기다리고 있음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I noticed [quite a few, zero none, scarcely single, barely half] typographical errors in the first draft of the report.',
        answer: 'quite a few',
        options: ['quite a few', 'zero none', 'scarcely single', 'barely half'],
        korean: '보고서 초안에서 꽤 많은 오탈자들을 발견했습니다.',
        explanation: '상당한 개수의 오류나 실수를 가리킵니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We have received [quite a few, hardly any, barely a, scarcely one] positive inquiries regarding our newly launched online course.',
        answer: 'quite a few',
        options: ['quite a few', 'hardly any', 'barely a', 'scarcely one'],
        korean: '우리가 새로 출시한 온라인 강의에 대해 꽤 많은 긍정적인 문의들을 받았습니다.',
        explanation: '생각보다 많은 반응을 얻었음을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She has traveled to [quite a few, barely one, scarcely few, zero any] European countries during her summer sabbatical.',
        answer: 'quite a few',
        options: ['quite a few', 'barely one', 'scarcely few', 'zero any'],
        korean: '그녀는 여름 안식년 기간 동안 꽤 많은 유럽 국가들을 여행했습니다.',
        explanation: '다수의 국가를 방문했음을 나타냅니다.'
      }
    ]
  },

  // 4. merch sections
  {
    keyExpression: 'merch sections',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Enthusiastic concertgoers rushed toward the official [merch sections, luggage checks, emergency exits, boiler rooms] to grab tour hoodies.',
        answer: 'merch sections',
        options: ['merch sections', 'luggage checks', 'emergency exits', 'boiler rooms'],
        korean: '열정적인 콘서트 관객들은 투어 후드티를 사기 위해 공식 굿즈 판매 코너로 서둘러 달려갔어요.',
        explanation: '"merch sections"는 공연장이나 행사장 내의 "굿즈(기념품) 판매 부스/구역"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The lines around the [merch sections were extraordinarily long tonight].',
        answer: 'merch sections were extraordinarily long tonight',
        tokens: ['merch', 'sections', 'were', 'extraordinarily', 'long', 'tonight'],
        options: ['merch', 'sections', 'were', 'extraordinarily', 'long', 'tonight'],
        korean: '오늘 밤 굿즈 판매 구역 주변의 줄은 상상을 초월할 정도로 길었어요.',
        explanation: '공연장 굿즈 구역의 긴 대기열을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Stadium staff set up several pop-up [merch sections, parking meters, lost luggage racks, ticketing booths] around the concourse to ease congestion.',
        answer: 'merch sections',
        options: ['merch sections', 'parking meters', 'lost luggage racks', 'ticketing booths'],
        korean: '경기장 직원들은 혼잡을 완화하기 위해 중앙 홀 곳곳에 임시 굿즈 판매대를 여러 군데 설치했어요.',
        explanation: '혼잡 방지를 위한 분산형 굿즈 코너를 설명합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Most limited-edition lightsticks had completely sold out at all the [merch sections, sound booths, electrical closets, press boxes] before showtime.',
        answer: 'merch sections',
        options: ['merch sections', 'sound booths', 'electrical closets', 'press boxes'],
        korean: '대부분의 한정판 응원봉은 공연 시작 전 이미 모든 굿즈 구역에서 매진되었습니다.',
        explanation: '굿즈 코너에서의 품절 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Fans checked the arena floor map to locate the indoor [merch sections, fuel pumps, security vaults, cargo bays] near gate three.',
        answer: 'merch sections',
        options: ['merch sections', 'fuel pumps', 'security vaults', 'cargo bays'],
        korean: '팬들은 3번 게이트 근처의 실내 굿즈 코너 위치를 찾기 위해 경기장 도면을 확인했어요.',
        explanation: '안내 지도에서 굿즈 판매 구역을 찾는 모습입니다.'
      }
    ]
  },

  // 5. odd time
  {
    keyExpression: 'odd time',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Three o\'clock in the morning is such an [odd time, exact moment, urgent date, ideal pace] to receive a non-urgent phone notification.',
        answer: 'odd time',
        options: ['odd time', 'exact moment', 'urgent date', 'ideal pace'],
        korean: '새벽 3시는 급하지도 않은 스마트폰 알림을 받기에는 참 뜬금없고 애매한 시간이에요.',
        explanation: '"odd time"은 남들이 잘 찾지 않거나 일반적이지 않은 "애매한 시간대, 특이한 시간"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'He usually eats lunch at [an odd time like three in the afternoon].',
        answer: 'an odd time like three in the afternoon',
        tokens: ['an', 'odd', 'time', 'like', 'three', 'in', 'the', 'afternoon'],
        options: ['an', 'odd', 'time', 'like', 'three', 'in', 'the', 'afternoon'],
        korean: '그는 대개 오후 3시처럼 어중간한 시간에 점심을 먹곤 합니다.',
        explanation: '일반적인 식사 시간이 아닌 애매한 시간대를 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The gym was virtually empty because four in the afternoon is an [odd time, peak period, golden hour, urgent rush] for fitness enthusiasts.',
        answer: 'odd time',
        options: ['odd time', 'peak period', 'golden hour', 'urgent rush'],
        korean: '오후 4시는 헬스 애호가들에게는 어중간하고 한산한 시간대여서 헬스장이 거의 텅 비어 있었어요.',
        explanation: '사람이 붐비지 않는 한적한 비수기 시간대입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Why are you mowing the front lawn at such an [odd time, sharp second, identical minute, official hour] on a rainy Tuesday?',
        answer: 'odd time',
        options: ['odd time', 'sharp second', 'identical minute', 'official hour'],
        korean: '비 오는 화요일에 왜 이렇게 뜬금없고 엉뚱한 시간에 잔디를 깎고 계신 건가요?',
        explanation: '상식 밖의 이상하거나 어색한 시간대를 지적할 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Booking international flights during an [odd time, high demand, rush hour, luxury season] of night often saves significant money.',
        answer: 'odd time',
        options: ['odd time', 'high demand', 'rush hour', 'luxury season'],
        korean: '심야의 애매한 시간대에 국제선 비행기를 예약하면 상당한 비용을 절약할 수 있습니다.',
        explanation: '비인기 시간대 항공권을 뜻합니다.'
      }
    ]
  },

  // 6. nosebleed seats
  {
    keyExpression: 'nosebleed seats',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'Even though we got [nosebleed seats, ringside chairs, floor passes, orchestra tickets] at the baseball park, we could still see the entire field clearly.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'ringside chairs', 'floor passes', 'orchestra tickets'],
        korean: '야구장에서 비록 맨 꼭대기 좌석(하늘석)을 예매했지만, 그라운드 전체를 한눈에 또렷이 볼 수 있었어요.',
        explanation: '"nosebleed seats"는 경기장이나 대형 공연장의 "맨 꼭대기 높은 좌석(하늘석)"을 뜻합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'We watched the concert from [the nosebleed seats way up top].',
        answer: 'the nosebleed seats way up top',
        tokens: ['the', 'nosebleed', 'seats', 'way', 'up', 'top'],
        options: ['the', 'nosebleed', 'seats', 'way', 'up', 'top'],
        korean: '우리는 저 맨 꼭대기 하늘석에서 콘서트를 관람했어요.',
        explanation: '가장 높은 꼭대기 좌석에서의 관람 경험입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Tickets in the [nosebleed seats, VIP boxes, stage front, royal suites] were much cheaper, allowing our college club to go together.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'VIP boxes', 'stage front', 'royal suites'],
        korean: '맨 꼭대기 구역 티켓은 훨씬 저렴해서 우리 대학교 동아리원들이 다 같이 갈 수 있었어요.',
        explanation: '가격이 저렴한 경기장 최상단 좌석입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you sit in the [nosebleed seats, front row, pit circle, dugout], remember to bring compact binoculars to watch player facial expressions.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'front row', 'pit circle', 'dugout'],
        korean: '맨 꼭대기 좌석에 앉는다면 선수들의 표정을 볼 수 있도록 소형 쌍안경을 챙기는 것을 잊지 마세요.',
        explanation: '높은 좌석이라 쌍안경이 필요한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Despite climbing a hundred stairs to our [nosebleed seats, baseline booths, center stage, warm bench], the roar of eighty thousand fans was thrilling.',
        answer: 'nosebleed seats',
        options: ['nosebleed seats', 'baseline booths', 'center stage', 'warm bench'],
        korean: '꼭대기 하늘석까지 계단 백 개를 올라갔음에도 불구하고, 8만 관중의 함성은 짜릿했습니다.',
        explanation: '높은 곳에 올라가서 느끼는 현장의 열기입니다.'
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
        english: 'A sudden rain shower cooled down the [open air stadium during the festival].',
        answer: 'open air stadium during the festival',
        tokens: ['open', 'air', 'stadium', 'during', 'the', 'festival'],
        options: ['open', 'air', 'stadium', 'during', 'the', 'festival'],
        korean: '갑작스러운 소나기가 페스티벌 동안 야외 스타디움의 열기를 식혀주었어요.',
        explanation: '지붕 없는 야외 스타디움에서의 날씨 변화를 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Because Oakland Coliseum is an [open air stadium, airtight bubble, private basement, soundproof garage], fans felt the refreshing coastal breeze throughout the night.',
        answer: 'open air stadium',
        options: ['open air stadium', 'airtight bubble', 'private basement', 'soundproof garage'],
        korean: '오클랜드 콜리세움은 야외 경기장이기 때문에, 팬들은 밤새 시원한 바닷바람을 느낄 수 있었습니다.',
        explanation: '야외 경기장 특유의 바람과 자연환경을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Fireworks lit up the twilight horizon directly above the [open air stadium, subterranean vault, concrete tunnel, dark attic] as the finale song concluded.',
        answer: 'open air stadium',
        options: ['open air stadium', 'subterranean vault', 'concrete tunnel', 'dark attic'],
        korean: '마지막 곡이 끝나자 야외 스타디움 바로 위 황혼의 지평선에 불꽃놀이가 환하게 번졌어요.',
        explanation: '야외 공연장 상공에서 터지는 불꽃놀이 풍경입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Unlike enclosed domes, an [open air stadium, indoor hall, closed arena, studio booth] leaves spectators exposed to unpredictable sunshine and wind.',
        answer: 'open air stadium',
        options: ['open air stadium', 'indoor hall', 'closed arena', 'studio booth'],
        korean: '밀폐된 돔 경기장과 달리, 야외 스타디움은 관객들이 변화무쌍한 햇빛과 바람을 직접 맞게 됩니다.',
        explanation: '돔 경기장과 야외 경기장의 차이를 비교합니다.'
      }
    ]
  },

  // 8. scripted setup
  {
    keyExpression: 'scripted setup',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'The host\'s supposedly awkward blunder on stage was actually a clever [scripted setup, accidental glitch, random tragedy, genuine sorrow] to hype the audience.',
        answer: 'scripted setup',
        options: ['scripted setup', 'accidental glitch', 'random tragedy', 'genuine sorrow'],
        korean: '무대 위 사회자의 어색한 실수 같았던 행동은 사실 관객들의 호응을 끌어올리기 위한 영리한 대본 설정(각본 연출)이었어요.',
        explanation: '"scripted setup"은 미리 연출하고 짠 "대본에 따른 설정/기획"을 의미합니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'The comedy skit looked natural, but it was [a carefully planned scripted setup].',
        answer: 'a carefully planned scripted setup',
        tokens: ['a', 'carefully', 'planned', 'scripted', 'setup'],
        options: ['a', 'carefully', 'planned', 'scripted', 'setup'],
        korean: '그 코미디 콩트는 자연스러워 보였지만, 치밀하게 기획된 대본 연출이었어요.',
        explanation: '사전에 철저히 기획된 연출을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Viewers quickly realized the reality show dispute was a [scripted setup, natural disaster, biological reaction, chemical bond] engineered for ratings.',
        answer: 'scripted setup',
        options: ['scripted setup', 'natural disaster', 'biological reaction', 'chemical bond'],
        korean: '시청자들은 리얼리티 쇼의 말다툼이 시청률을 위해 조작된 대본 설정이었다는 것을 금세 알아차렸어요.',
        explanation: '방송용으로 인위적으로 만들어진 설정입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The magician\'s assistant acted like a surprised volunteer from the crowd, completing the [scripted setup, legal contract, medical prescription, tax audit] flawlessly.',
        answer: 'scripted setup',
        options: ['scripted setup', 'legal contract', 'medical prescription', 'tax audit'],
        korean: '마술사의 조수는 관객 중에서 깜짝 뽑힌 지원자처럼 연기하며 각본된 설정을 완벽하게 완성해 냈습니다.',
        explanation: '마술 공연의 짜고 치는 연출을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'I prefer unscripted spontaneity over any artificial [scripted setup, sincere handshake, true friendship, raw emotion] on television.',
        answer: 'scripted setup',
        options: ['scripted setup', 'sincere handshake', 'true friendship', 'raw emotion'],
        korean: '나는 텔레비전의 인위적인 대본 설정보다 대본 없는 자연스러운 즉흥성을 더 선호합니다.',
        explanation: '자연스러운 진행과 대비되는 인위적 각본입니다.'
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
        english: 'Whether we eat Mexican or Italian tonight is [entirely up to you].',
        answer: 'entirely up to you',
        tokens: ['entirely', 'up', 'to', 'you'],
        options: ['entirely', 'up', 'to', 'you'],
        korean: '오늘 저녁에 멕시코 음식을 먹을지 이탈리아 음식을 먹을지는 전적으로 너한테 달렸어.',
        explanation: '"entirely up to you"는 상대방의 선택에 전적으로 맡길 때 씁니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It is not [up to, proud of, fed up, sick with] the junior staff to approve major corporate budget expenditures.',
        answer: 'up to',
        options: ['up to', 'proud of', 'fed up', 'sick with'],
        korean: '주요 기업 예산 지출을 승인하는 것은 신입 직원들의 권한이나 몫이 아닙니다.',
        explanation: '책임과 권한이 누구에게 있는지 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The venue holds [up to, down by, out for, away from] five thousand spectators during major weekend sporting events.',
        answer: 'up to',
        options: ['up to', 'down by', 'out for', 'away from'],
        korean: '그 경기장은 주말 주요 스포츠 경기 동안 최대 5천 명의 관중을 수용할 수 있습니다.',
        explanation: '"up to (숫자)"는 "최대 ~까지"를 뜻하는 수량 한도 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: '"What have you been [up to, down for, out against, over with] lately?" my former coworker asked over coffee.',
        answer: 'up to',
        options: ['up to', 'down for', 'out against', 'over with'],
        korean: '"요즘 무슨 일 하면서 지냈어?" 옛 직장 동료가 커피를 마시며 안부를 물었어요.',
        explanation: '"what have you been up to?"는 근황을 묻는 대표적인 인사말입니다.'
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
        english: 'The performer knew the audience loved humor, so he [played that up during the skit].',
        answer: 'played that up during the skit',
        tokens: ['played', 'that', 'up', 'during', 'the', 'skit'],
        options: ['played', 'that', 'up', 'during', 'the', 'skit'],
        korean: '공연자는 관객들이 유머를 좋아한다는 걸 알고 콩트 도중 능청스럽게 그 점을 한껏 부각했어요.',
        explanation: '호응을 얻기 위해 특정 요소를 능청스럽게 극대화하는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The defense attorney [played that up, swept that under, gave that in, took that back] in front of the jury, emphasizing his client\'s charitable deeds.',
        answer: 'played that up',
        options: ['played that up', 'swept that under', 'gave that in', 'took that back'],
        korean: '변호인은 배심원단 앞에서 의뢰인의 자선 활동을 한껏 부각하고 강조했습니다.',
        explanation: '유리한 점을 강하게 부각하는 전략입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Rather than feeling embarrassed by his silly hat, Mark [played that up, ran away, threw it down, hid it out] and danced proudly on stage.',
        answer: 'played that up',
        options: ['played that up', 'ran away', 'threw it down', 'hid it out'],
        korean: '우스꽝스러운 모자 때문에 부끄러워하기는커녕, 마크는 오히려 그것을 능청스럽게 살려 무대에서 당당하게 춤을 췄어요.',
        explanation: '약점이나 우스꽝스러움을 유쾌하게 활용하는 태도입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Movie marketers [played that up, held that back, wiped that out, turned that off] heavily in trailers to create mystery around the villain.',
        answer: 'played that up',
        options: ['played that up', 'held that back', 'wiped that out', 'turned that off'],
        korean: '영화 마케터들은 악당을 둘러싼 신비감을 조성하기 위해 예고편에서 그 점을 대대적으로 부각했어요.',
        explanation: '마케팅에서 호기심을 유발하기 위해 강조하는 전략입니다.'
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
        english: 'Judging people solely based on their [physical appearance is often misleading].',
        answer: 'physical appearance is often misleading',
        tokens: ['physical', 'appearance', 'is', 'often', 'misleading'],
        options: ['physical', 'appearance', 'is', 'often', 'misleading'],
        korean: '단지 겉모습(외모)만을 근거로 사람을 판단하는 것은 종종 오해를 불러일으킵니다.',
        explanation: '"physical appearance"는 신체적 외모를 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The movie star made a surprise guest [appearance, disappearance, demolition, hesitation] at the local charity benefit gala.',
        answer: 'appearance',
        options: ['appearance', 'disappearance', 'demolition,', 'hesitation'],
        korean: '그 영화배우는 지역 자선 갈라 행사장에 깜짝 게스트로 출연(등장)했습니다.',
        explanation: '"make an appearance"는 행사에 "모습을 드러내다, 출연하다"라는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Despite working long exhausting shifts, she always keeps a cheerful outward [appearance, destruction, collision, isolation] for patients.',
        answer: 'appearance',
        options: ['appearance', 'destruction', 'collision', 'isolation'],
        korean: '길고 지치는 교대근무에도 불구하고, 그녀는 환자들을 위해 늘 밝은 겉모습을 유지합니다.',
        explanation: '겉으로 드러나는 모습이나 표정을 의미합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The vintage bookshelf has a rustic wooden [appearance, frequency, calculation, velocity] that complements the cozy room.',
        answer: 'appearance',
        options: ['appearance', 'frequency', 'calculation', 'velocity'],
        korean: '그 클래식 책장은 아늑한 방과 잘 어울리는 투박하고 고풍스러운 나무 외관을 지니고 있어요.',
        explanation: '사물의 외형이나 디자인을 묘사할 때도 쓰입니다.'
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
        english: 'It [turns out that we went to the same high school].',
        answer: 'turns out that we went to the same high school',
        tokens: ['turns', 'out', 'that', 'we', 'went', 'to', 'the', 'same', 'high', 'school'],
        options: ['turns', 'out', 'that', 'we', 'went', 'to', 'the', 'same', 'high', 'school'],
        korean: '알고 보니 우리 둘이 같은 고등학교를 다녔던 거였어요.',
        explanation: '우연히 밝혀진 반가운 사실을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We worried about a stormy weekend, but as it [turns out, backs up, breaks down, gives away], the weather was warm and sunny.',
        answer: 'turns out',
        options: ['turns out', 'backs up', 'breaks down', 'gives away'],
        korean: '주말에 폭풍우가 칠까 봐 걱정했는데, 알고 보니 날씨가 따뜻하고 화창했어요.',
        explanation: '예상과 달리 긍정적으로 드러난 결과입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If this scientific hypothesis [turns out, sets out, puts out, calls out] to be true, it will revolutionize clean energy production.',
        answer: 'turns out',
        options: ['turns out', 'sets out', 'puts out', 'calls out'],
        korean: '만약 이 과학적 가설이 사실로 밝혀진다면, 청정에너지 생산에 혁명을 일으킬 것입니다.',
        explanation: '가설이 사실로 입증되는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'It [turns out, holds on, gets by, looks up] that learning Korean grammar is much more enjoyable than I originally anticipated.',
        answer: 'turns out',
        options: ['turns out', 'holds on', 'gets by', 'looks up'],
        korean: '직접 해보니 한국어 문법을 배우는 것이 내가 원래 예상했던 것보다 훨씬 더 재미있더라고요.',
        explanation: '경험해보고 알게 된 사실을 전달합니다.'
      }
    ]
  },

  // 13. came across
  {
    keyExpression: 'came across',
    sentences: [
      {
        type: 'multiple-choice',
        english: 'While cleaning the dusty attic boxes, I [came across, fell behind, held up, backed off] a stack of grandfather\'s handwritten letters.',
        answer: 'came across',
        options: ['came across', 'fell behind', 'held up', 'backed off'],
        korean: '먼지 쌓인 다락방 상자들을 정리하다가 할아버지의 자필 편지 묶음을 우연히 발견했어요.',
        explanation: '"come across"는 물건이나 사람을 "우연히 발견하다/마주치다"라는 뜻입니다.'
      },
      {
        type: 'drag-and-drop',
        english: 'His sincere tone [came across as genuine and compassionate].',
        answer: 'came across as genuine and compassionate',
        tokens: ['came', 'across', 'as', 'genuine', 'and', 'compassionate'],
        options: ['came', 'across', 'as', 'genuine', 'and', 'compassionate'],
        korean: '그의 진심 어린 말투는 진실하고 따뜻하게 와닿았어요.',
        explanation: '"come across as ~"는 어떤 인상이나 느낌으로 전달되다라는 뜻입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'During the job interview, she [came across, went through, carried out, passed by] as confident without appearing arrogant.',
        answer: 'came across',
        options: ['came across', 'went through', 'carried out', 'passed by'],
        korean: '취업 면접에서 그녀는 거만해 보이지 않으면서도 당당하고 자신감 있게 비쳤습니다.',
        explanation: '면접에서 전달된 긍정적인 인상을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'We [came across, turned over, cut down, gave out] a charming family bakery tucked inside a quiet cobblestone alleyway.',
        answer: 'came across',
        options: ['came across', 'turned over', 'cut down', 'gave out'],
        korean: '우리는 한적한 자갈 골목길 안쪽에 자리 잡은 매력적인 가족 빵집을 우연히 마주쳤어요.',
        explanation: '골목을 걷다 멋진 장소를 우연히 발견한 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Sometimes plain text messages can [come across, roll away, pull through, drop out] as cold even if no offense was intended.',
        answer: 'come across',
        options: ['come across', 'roll away', 'pull through', 'drop out'],
        korean: '때로는 악의가 전혀 없더라도 문자 메시지가 차갑게 느껴질 수 있습니다.',
        explanation: '메시지가 상대방에게 특정 뉘앙스로 전달되는 경우입니다.'
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
        english: 'The abandoned warehouse [turned into a trendy community art gallery].',
        answer: 'turned into a trendy community art gallery',
        tokens: ['turned', 'into', 'a', 'trendy', 'community', 'art', 'gallery'],
        options: ['turned', 'into', 'a', 'trendy', 'community', 'art', 'gallery'],
        korean: '그 버려진 창고는 트렌디한 동네 미술관으로 탈바꿈했습니다.',
        explanation: '공간이 새로운 용도로 변모했음을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'A small misunderstanding about meeting times [turned into, pulled back, held down, kept away] a heated argument between roommates.',
        answer: 'turned into',
        options: ['turned into', 'pulled back', 'held down', 'kept away'],
        korean: '약속 시간에 대한 작은 오해가 룸메이트들 사이의 격한 말다툼으로 번지고 말았어요.',
        explanation: '작은 일이 큰 사건으로 번진 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'With consistent daily practice, her childhood hobby eventually [turned into, ran out, checked in, broke out] a thriving full-time career.',
        answer: 'turned into',
        options: ['turned into', 'ran out', 'checked in', 'broke out'],
        korean: '꾸준한 매일의 연습 덕분에, 그녀의 어린 시절 취미는 결국 성공적인 전업 직업으로 발전했습니다.',
        explanation: '취미가 본업으로 발전한 성공 스토리입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'In subzero mountain winter, dripping water icicles quickly [turned into, looked for, backed off, gave in] dangerous frozen spikes.',
        answer: 'turned into',
        options: ['turned into', 'looked for', 'backed off', 'gave in'],
        korean: '영하의 산골 겨울에는 뚝뚝 떨어지는 물고드름이 순식간에 위험한 얼음 창으로 변했습니다.',
        explanation: '자연현상으로 인해 사물이 변하는 모습입니다.'
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
        english: 'Receiving a postcard from a stranger [felt completely random and surprising].',
        answer: 'felt completely random and surprising',
        tokens: ['felt', 'completely', 'random', 'and', 'surprising'],
        options: ['felt', 'completely', 'random', 'and', 'surprising'],
        korean: '낯선 사람으로부터 엽서를 받는 것은 완전히 뜬금없고도 놀랍게 느껴졌어요.',
        explanation: '예상치 못한 뜬금없는 사건을 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Inserting a slapstick comedy scene into a serious thriller movie [felt random, looked genuine, stood firm, held true] and ruined the suspense.',
        answer: 'felt random',
        options: ['felt random', 'looked genuine', 'stood firm', 'held true'],
        korean: '진지한 스릴러 영화에 슬랩스틱 코미디 장면을 넣은 것은 뜬금없게 느껴졌고 긴장감을 깨뜨렸어요.',
        explanation: '작품의 맥락과 어울리지 않는 엉뚱한 연출입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'His sudden decision to buy a vintage unicycle definitely [felt random, seemed planned, was routine, made profit] to his family.',
        answer: 'felt random',
        options: ['felt random', 'seemed planned', 'was routine', 'made profit'],
        korean: '빈티지 외발자전거를 사겠다는 그의 갑작스러운 결정은 가족들에게 분명 뜬금없게 느껴졌어요.',
        explanation: '충동적이고 엉뚱한 행동을 바라보는 가족들의 시선입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Meeting my elementary school teacher at a gas station in another state [felt random, felt prepared, felt formal, felt scheduled] yet wonderful.',
        answer: 'felt random',
        options: ['felt random', 'felt prepared', 'felt formal', 'felt scheduled'],
        korean: '다른 주에 있는 주유소에서 초등학교 선생님을 마주친 것은 참 뜬금없고 신기하면서도 멋진 일이었어요.',
        explanation: '우연하고 뜻밖인 만남의 느낌입니다.'
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
        english: 'We had to [get in line behind fifty eager fans].',
        answer: 'get in line behind fifty eager fans',
        tokens: ['get', 'in', 'line', 'behind', 'fifty', 'eager', 'fans'],
        options: ['get', 'in', 'line', 'behind', 'fifty', 'eager', 'fans'],
        korean: '우리는 열정적인 팬 50명 뒤에 줄을 서야만 했습니다.',
        explanation: '대기열 뒤쪽에 줄을 서는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Security politely instructed all incoming concert guests to [get in line, break the ice, cut corners, drop anchor] along the metal barricade.',
        answer: 'get in line',
        options: ['get in line', 'break the ice', 'cut corners', 'drop anchor'],
        korean: '보안 요원은 입장하는 모든 콘서트 관객들에게 철제 바리케이드를 따라 줄을 서달라고 정중히 안내했습니다.',
        explanation: '안내에 따라 질서 있게 줄을 서는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'If you want to ride the popular roller coaster, prepare to [get in line, give a hand, turn a blind eye, make a scene] for at least an hour.',
        answer: 'get in line',
        options: ['get in line', 'give a hand', 'turn a blind eye', 'make a scene'],
        korean: '인기 있는 롤러코스터를 타려면 최소 한 시간 동안은 줄을 설 각오를 하세요.',
        explanation: '놀이공원에서 줄을 서는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Customers happily [got in line, gave up hope, broke down, ran away] outside the tech store on release morning.',
        answer: 'got in line',
        options: ['got in line', 'gave up hope', 'broke down', 'ran away'],
        korean: '신제품 출시 날 아침, 고객들은 전자기기 매장 밖에 기분 좋게 줄을 섰어요.',
        explanation: '신제품을 사기 위해 줄을 서는 흔한 풍경입니다.'
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
        english: 'She arrived early to be [first in line for the autograph session].',
        answer: 'first in line for the autograph session',
        tokens: ['first', 'in', 'line', 'for', 'the', 'autograph', 'session'],
        options: ['first', 'in', 'line', 'for', 'the', 'autograph', 'session'],
        korean: '그녀는 사인회에서 맨 앞줄에 서기 위해 일찍 도착했습니다.',
        explanation: '사인회에서 1등으로 줄을 선 상태입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whoever is [first in line, out of mind, under the weather, beside the point] at the ticket booth gets the front row center seats.',
        answer: 'first in line',
        options: ['first in line', 'out of mind', 'under the weather', 'beside the point'],
        korean: '매표소에서 가장 먼저 줄을 선 사람이 앞줄 정중앙 좌석을 얻게 됩니다.',
        explanation: '가장 먼저 온 사람에게 주어지는 혜택을 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The energetic grandmother was [first in line, out of place, deep in debt, high in sky] when the charity thrift shop unlocked its doors.',
        answer: 'first in line',
        options: ['first in line', 'out of place', 'deep in debt', 'high in sky'],
        korean: '그 활기찬 할머니께서는 자선 중고 매장이 문을 열었을 때 맨 1등으로 줄을 서 계셨어요.',
        explanation: '매장 개장 시 가장 앞장선 손님입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Whenever free samples are handed out at the grocery store, kids love being [first in line, last in priority, behind closed doors, under scrutiny].',
        answer: 'first in line',
        options: ['first in line', 'last in priority', 'behind closed doors', 'under scrutiny'],
        korean: '식료품점에서 무료 시식 코너가 열릴 때마다 아이들은 맨 앞에 줄 서는 것을 너무 좋아합니다.',
        explanation: '시식 코너의 첫 번째 순서를 기다리는 아이들입니다.'
      }
    ]
  },

  // 18. by the time
  {
    keyExpression: 'by the time',
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
        english: 'The rain stopped [by the time we reached the summit].',
        answer: 'by the time we reached the summit',
        tokens: ['by', 'the', 'time', 'we', 'reached', 'the', 'summit'],
        options: ['by', 'the', 'time', 'we', 'reached', 'the', 'summit'],
        korean: '우리가 정상에 도착했을 무렵에는 비가 그쳤어요.',
        explanation: '목적지에 도달했을 때 비가 그친 시점을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'All discount tickets had sold out completely [by the time, so that, in order that, despite that] I logged onto the ticketing website.',
        answer: 'by the time',
        options: ['by the time', 'so that', 'in order that', 'despite that'],
        korean: '내가 예매 웹사이트에 로그인했을 때쯤에는 이미 모든 할인 티켓이 매진되어 있었어요.',
        explanation: '특정 시점 이전에 완료된 상황을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: '[By the time, Whereby, Whereas, Even though] the ambulance reached the intersection, neighbors had safely helped the driver out.',
        answer: 'By the time',
        options: ['By the time', 'Whereby', 'Whereas', 'Even though'],
        korean: '구급차가 교차로에 도착했을 무렵에는 이웃들이 이미 운전자를 안전하게 구조해 낸 상태였어요.',
        explanation: '도착 시점의 완료된 상태를 말합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Dinner was already cold [by the time, in spite of, as if, rather than] he returned from his lengthy commute.',
        answer: 'by the time',
        options: ['by the time', 'in spite of', 'as if', 'rather than'],
        korean: '그가 긴 퇴근길에서 돌아왔을 때쯤에는 저녁 식사가 이미 식어 있었어요.',
        explanation: '귀가했을 무렵의 상황입니다.'
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
        english: 'She maintained a calm smile [throughout the stressful live broadcast].',
        answer: 'throughout the stressful live broadcast',
        tokens: ['throughout', 'the', 'stressful', 'live', 'broadcast'],
        options: ['throughout', 'the', 'stressful', 'live', 'broadcast'],
        korean: '그녀는 긴장되는 생방송 내내 차분한 미소를 잃지 않았습니다.',
        explanation: '방송 시간 전체에 걸쳐 한결같은 태도를 유지함을 뜻합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Historical stone castles are scattered [throughout, alongside, during, among] the picturesque rolling countryside of Ireland.',
        answer: 'throughout',
        options: ['throughout', 'alongside', 'during', 'among'],
        korean: '역사적인 석조 성들이 아일랜드의 그림 같은 시골 지역 곳곳에 흩어져 있습니다.',
        explanation: '공간의 "구석구석 전체에"를 뜻하는 공간적 용법입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Volunteers worked tirelessly [throughout, into, onto, off] the freezing night to distribute hot soup to homeless shelters.',
        answer: 'throughout',
        options: ['throughout', 'into', 'onto', 'off'],
        korean: '자원봉사자들은 노숙인 쉼터에 따뜻한 수프를 전달하기 위해 매서운 밤 내내 쉼 없이 일했습니다.',
        explanation: '밤새도록 지속된 헌신을 나타냅니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Her infectious laughter echoed [throughout, underneath, behind, opposite] the quiet museum gallery, making visitors smile.',
        answer: 'throughout',
        options: ['throughout', 'underneath', 'behind', 'opposite'],
        korean: '그녀의 기분 좋은 웃음소리가 조용한 박물관 갤러리 전체에 울려 퍼져 관람객들을 미소 짓게 했어요.',
        explanation: '공간 전체에 소리가 울려 퍼지는 모습입니다.'
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
        english: 'I was just [wondering if you were free for dinner] tonight.',
        answer: 'wondering if you were free for dinner',
        tokens: ['wondering', 'if', 'you', 'were', 'free', 'for', 'dinner'],
        options: ['wondering', 'if', 'you', 'were', 'free', 'for', 'dinner'],
        korean: '오늘 저녁에 혹시 식사 시간 되시는지 궁금해서요.',
        explanation: '부담 없이 조심스럽게 약속을 제안할 때 아주 자주 쓰는 정중한 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'She looked at dark rain clouds gathering overhead, [wondering if, assuring that, stating that, claiming that] she should turn back home.',
        answer: 'wondering if',
        options: ['wondering if', 'assuring that', 'stating that', 'claiming that'],
        korean: '그녀는 머리 위에 먹구름이 몰려드는 것을 보며 집으로 발길을 돌려야 할까 고민했어요.',
        explanation: '날씨를 보고 갈등하며 생각하는 상황입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Customers kept glancing toward the kitchen doors, [wondering if, knowing that, declaring why, proving that] the chef had forgotten their order.',
        answer: 'wondering if',
        options: ['wondering if', 'knowing that', 'declaring why', 'proving that'],
        korean: '손님들은 주방장이 주문을 잊어버린 것은 아닐까 궁금해하며 주방 문 쪽을 연신 힐끔거렸어요.',
        explanation: '의문을 품고 궁금해하는 모습입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'He stared at the blank journal page, [wondering if, concluding how, denying that, confirming why] his story was worth sharing with the world.',
        answer: 'wondering if',
        options: ['wondering if', 'concluding how', 'denying that', 'confirming why'],
        korean: '그는 자신의 이야기가 세상과 나눌 만한 가치가 있을까 고민하며 빈 일기장 페이지를 응시했습니다.',
        explanation: '자신의 생각을 반추하며 자문하는 순간입니다.'
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
        english: 'Everyone stood up to applaud [at the end of the theatrical play].',
        answer: 'at the end of the theatrical play',
        tokens: ['at', 'the', 'end', 'of', 'the', 'theatrical', 'play'],
        options: ['at', 'the', 'end', 'of', 'the', 'theatrical', 'play'],
        korean: '연극이 끝날 무렵 모두가 기립하여 박수를 보냈습니다.',
        explanation: '공연 종료 시점의 기립 박수를 묘사합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'Don\'t leave early because there is an important Q&A session [at the end, on the side, at the root, out of date] of the conference.',
        answer: 'at the end',
        options: ['at the end', 'on the side', 'at the root', 'out of date'],
        korean: '학술회의 마지막에 중요한 질의응답 시간이 마련되어 있으니 일찍 떠나지 마세요.',
        explanation: '행사의 마지막 순서를 안내합니다.'
      },
      {
        type: 'multiple-choice',
        english: 'There is a cozy reading nook located [at the end, in the prime, out of sight, over the head] of this hallway on the left.',
        answer: 'at the end',
        options: ['at the end', 'in the prime', 'out of sight', 'over the head'],
        korean: '이 복도 끝 좌측에 아늑한 독서 공간이 자리 잡고 있습니다.',
        explanation: '공간이나 복도의 "맨 끝"을 나타내는 표현입니다.'
      },
      {
        type: 'multiple-choice',
        english: 'The movie features a stunning plot twist [at the end, at first, in advance, ahead of time] that completely redefines the storyline.',
        answer: 'at the end',
        options: ['at the end', 'at first', 'in advance', 'ahead of time'],
        korean: '그 영화는 줄거리를 완전히 뒤바꿔놓는 충격적인 반전을 결말에 담고 있습니다.',
        explanation: '영화의 결말 부분을 뜻합니다.'
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
