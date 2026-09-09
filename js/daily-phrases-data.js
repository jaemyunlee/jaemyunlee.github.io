/**
 * Curated Daily English Phrases for RhyRhy English (Issue #44)
 * Real-world spoken American English expressions with native pronunciation audio.
 */
const DAILY_PHRASES = [
  {
    id: 'dp-01',
    en: "We got tickets that are pretty much in the back, the nosebleed section.",
    kr: "우리 맨 꼭대기(하늘석) 자리 티켓 예매했어.",
    mask: "nosebleed section",
    keywords: ["nosebleed section", "nosebleed"],
    explanation: "'nosebleed section'은 코피가 날 정도로 아찔하게 높은 경기장이나 공연장 맨 꼭대기 좌석(하늘석)을 유쾌하게 부르는 일상 표현입니다.",
    audio: "./lessons/lesson-01/audio/We got tickets that are pretty much in the back the nosebleed section..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-02',
    en: "The first time I heard it I didn't love it, but it did grow on me quite a lot.",
    kr: "처음 들었을 때는 별로였는데, 들을수록 점점 마음에 들더라고요.",
    mask: "grow on me",
    keywords: ["grow on me", "did grow on me"],
    explanation: "'grow on someone'은 처음엔 별로였던 사람이나 음악, 음식 등이 시간이 지나면서 점점 좋아지고 정이 들 때 쓰는 아주 자연스러운 원어민 표현입니다.",
    audio: "./lessons/lesson-01/audio/The first time I heard it I didnt love it but it did grow on me quite a lot..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-03',
    en: "Compared to what we paid in Korea for tickets, it's decent.",
    kr: "한국에서 티켓에 냈던 금액에 비하면 꽤 괜찮은 편이에요.",
    mask: "it's decent",
    keywords: ["it's decent", "decent"],
    explanation: "'decent'는 '훌륭하고 만족할 만한 수준이다', '꽤 괜찮다'는 뜻으로 가격이나 품질을 칭찬할 때 매일 쓰입니다.",
    audio: "./lessons/lesson-01/audio/Compared to what we paid in Korea for tickets its decent.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-04',
    en: "I just happened to look.",
    kr: "우연히 그냥 쳐다봤을 뿐이에요.",
    mask: "happened to look",
    keywords: ["happened to look", "happened to"],
    explanation: "'happen to [동사]'는 의도한 게 아니라 '우연히 ~하다'라는 뉘앙스를 줄 때 쓰는 필수 일상 구문입니다.",
    audio: "./lessons/lesson-01/audio/I just happened to look.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-05',
    en: "It's been a treat.",
    kr: "정말 큰 기쁨이자 특별한 즐거움이에요.",
    mask: "a treat",
    keywords: ["a treat", "been a treat"],
    explanation: "'It's a treat'는 일상에서 평소보다 특별하게 누리는 기분 좋은 경험이나 대접을 뜻합니다.",
    audio: "./lessons/lesson-02/audio/its been a treat.wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-06',
    en: "We managed to use a headlight and a battery for lights.",
    kr: "우리는 헤드라이트와 배터리로 어떻게든 조명을 켜서 썼어요.",
    mask: "managed to use",
    keywords: ["managed to use", "managed to"],
    explanation: "'manage to [동사]'는 힘든 여건 속에서도 '어떻게든 간신히 해내다'라는 뉘앙스를 담고 있습니다.",
    audio: "./lessons/lesson-02/audio/we managed to use a headlight and a battery for lights..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-07',
    en: "At least that's what I understood.",
    kr: "적어도 내가 이해한 바로는 그래요.",
    mask: "At least",
    keywords: ["At least", "at least"],
    explanation: "'At least'는 '적어도, 최소한'이라는 뜻으로 자신의 의견을 조심스럽게 전제할 때 자주 쓰입니다.",
    audio: "./lessons/lesson-01/audio/At least thats what I understood.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-08',
    en: "There was no way you were getting up to those seats.",
    kr: "그 좌석까지 당신이 올라갈 수 있는 방법은 도저히 없었죠.",
    mask: "no way",
    keywords: ["no way", "There was no way"],
    explanation: "'There is no way [주어+동사]'는 '도저히 ~할 방법이나 가능성이 없다'는 강한 부정을 나타냅니다.",
    audio: "./lessons/lesson-01/audio/there was no way you were getting up to those seats.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-09',
    en: "Now Kelly gets to enjoy it.",
    kr: "이제 켈리가 마음껏 누리고 즐길 수 있게 되었어요.",
    mask: "gets to enjoy",
    keywords: ["gets to enjoy", "gets to"],
    explanation: "'get to [동사]'는 '~할 수 있는 기회나 특권을 누리다'라는 감사하고 행복한 뉘앙스를 풍깁니다.",
    audio: "./lessons/lesson-02/audio/Now Kelly get to enjoy it..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-10',
    en: "We could only get in the creek after we got our chores done in the morning.",
    kr: "우리는 아침 집안일을 다 끝내고 나서야 개울에 들어갈 수 있었어요.",
    mask: "got our chores done",
    keywords: ["chores done", "got our chores done"],
    explanation: "'chores'는 빨래, 청소, 설거지 같은 매일 하는 집안일/허드렛일을 뜻합니다.",
    audio: "./lessons/lesson-02/audio/we could only get in the creek after we got our chores done in the morning..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-11',
    en: "And then go to the concert and spend the night.",
    kr: "그리고 콘서트에 갔다가 거기서 하룻밤 자고 오는 거지요.",
    mask: "spend the night",
    keywords: ["spend the night"],
    explanation: "'spend the night'는 호텔이나 다른 곳에서 '하룻밤을 묵다/자다'라는 뜻의 생활 밀착 표현입니다.",
    audio: "./lessons/lesson-01/audio/And then go to the concert and spend the night.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-12',
    en: "It turned out they're only going to two cities, Oakland and New Jersey.",
    kr: "알고 보니 오클랜드와 뉴저지 딱 두 도시만 가는 거더라고요.",
    mask: "turned out",
    keywords: ["turned out", "It turned out"],
    explanation: "'It turns out (that)'은 '나중에 알고 보니 ~인 것으로 밝혀지다'라는 뜻의 필수 표현입니다.",
    audio: "./lessons/lesson-01/audio/it turned out theyre only going to two citiesOakland and New Jersey.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-13',
    en: "We would play in the creek all afternoon till we were like blue-lipped.",
    kr: "우리는 입술이 파래질 때까지 오후 내내 개울에서 물놀이를 하곤 했어요.",
    mask: "blue-lipped",
    keywords: ["blue-lipped", "blue lipped"],
    explanation: "'blue-lipped'는 찬 물속에서 너무 오래 놀아 '입술이 파랗게 질린 상태'를 생생하게 묘사하는 표현입니다.",
    audio: "./lessons/lesson-02/audio/we would play in the creek all afternoon till we were like blue-lipped..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-14',
    en: "Hopefully Amy doesn't mind.",
    kr: "에이미가 신경 쓰지 않았으면(괜찮았으면) 좋겠네요.",
    mask: "doesn't mind",
    keywords: ["doesn't mind", "not mind"],
    explanation: "'mind'는 부정문이나 의문문에서 '꺼리다, 신경 쓰다'라는 뜻으로 사용됩니다.",
    audio: "./lessons/lesson-01/audio/Hopefully Amy doesnt mind..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-15',
    en: "Through the years it got added on to three times.",
    kr: "세월이 흐르면서 세 번이나 집을 덧대어 증축했지요.",
    mask: "Through the years",
    keywords: ["Through the years", "through the years"],
    explanation: "'Through the years'는 '세월이 흐르며, 여러 해에 걸쳐'라는 시간의 경과를 잔잔하게 전하는 표현입니다.",
    audio: "./lessons/lesson-02/audio/through the years it got added on to three times..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-16',
    en: "I started to like it a lot and listening to it.",
    kr: "그 노래가 점점 아주 좋아져서 계속 듣기 시작했어요.",
    mask: "started to like it",
    keywords: ["started to like it", "started to like"],
    explanation: "'start to like'는 특정 취향이나 노래에 서서히 빠져들기 시작할 때 쓰는 자연스러운 표현입니다.",
    audio: "./lessons/lesson-01/audio/I started to like it a lot and listening to it..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-17',
    en: "Our creek feeds a lake downstream.",
    kr: "우리 집 개울은 하류에 있는 호수로 물이 흘러 들어갑니다.",
    mask: "feeds a lake",
    keywords: ["feeds a lake", "feeds"],
    explanation: "강이나 개울이 호수로 '물을 공급하며 합류하다'를 표현할 때 동사 'feed'를 아주 멋지게 활용합니다.",
    audio: "./lessons/lesson-02/audio/our creek feeds a lake downstream..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-18',
    en: "Because I have a lot of assignments due Sunday.",
    kr: "일요일까지 제출해야 하는 과제가 엄청 많거든요.",
    mask: "due Sunday",
    keywords: ["due Sunday", "due"],
    explanation: "'due [날짜/시간]'은 과제나 보고서, 결제 등의 '마감 기한'을 나타내는 핵심 어휘입니다.",
    audio: "./lessons/lesson-01/audio/because I have a lot of assignments due Sunday.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-19',
    en: "They stock it like three times a year.",
    kr: "호수에 일 년에 세 번 정도 물고기를 방류해요.",
    mask: "stock it",
    keywords: ["stock it", "stock"],
    explanation: "호수나 하천에 낚시용 '물고기를 풀어놓다(방류하다)'를 영어로 'stock'이라고 합니다.",
    audio: "./lessons/lesson-02/audio/Its known for fishing. they stock it like three times a year..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-20',
    en: "So I thought it was pretty unlikely that I would get to go and find someone.",
    kr: "그래서 내가 직접 가거나 같이 갈 사람을 찾을 가능성이 아주 희박하다고 생각했어요.",
    mask: "pretty unlikely",
    keywords: ["pretty unlikely", "unlikely"],
    explanation: "'unlikely'는 어떤 일이 일어날 가능성이 낮거나 희박할 때 쓰는 고급 일상 형용사입니다.",
    audio: "./lessons/lesson-01/audio/So I thought it was pretty unlikely that I would get to go and find someone..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-21',
    en: "They had to build the house to make it level.",
    kr: "경사 없이 평평하게 맞추기 위해 집을 공들여 지어야 했어요.",
    mask: "make it level",
    keywords: ["make it level", "level"],
    explanation: "'level'은 울퉁불퉁하지 않고 '수평인, 평평한' 상태를 뜻하며 'make it level'은 수평을 맞춘다는 뜻입니다.",
    audio: "./lessons/lesson-02/audio/They had to build the house to make it level..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-22',
    en: "We have a decent view.",
    kr: "시야(전망)가 꽤 괜찮아요.",
    mask: "decent view",
    keywords: ["decent view"],
    explanation: "경기장이나 공연장, 호텔 방의 시야가 기대 이상으로 만족스러울 때 원어민들이 가장 많이 쓰는 감탄 표현입니다.",
    audio: "./lessons/lesson-01/audio/we have a decent view..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-23',
    en: "As they were getting up in age and didn't have to worry about falls anymore.",
    kr: "두 분이 연세가 드시면서 낙상 걱정을 더 이상 안 해도 되도록요.",
    mask: "getting up in age",
    keywords: ["getting up in age"],
    explanation: "'get up in age'는 단순히 'get old'라고 하기보다 '점점 나이가 지긋해지시다/연세가 드시다'를 정중하고 따뜻하게 이르는 표현입니다.",
    audio: "./lessons/lesson-02/audio/As they were getting up in age and didnt have to worry about falls anymore..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-24',
    en: "It ended up having an amazing view.",
    kr: "결국에는 정말 환상적인 뷰를 갖게 되었어요.",
    mask: "ended up having",
    keywords: ["ended up having", "ended up"],
    explanation: "'end up [동명사 -ing]'는 여러 우여곡절 끝에 '결국 ~한 결과가 되다'를 표현할 때 핵심입니다.",
    audio: "./lessons/lesson-01/audio/but they finally just put us in to one of the handicap seats which ended up having an amazing view.wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-25',
    en: "We would all have inner tubes and air mattresses.",
    kr: "우리는 모두 타이어 튜브와 에어 매트리스를 챙겨 가곤 했어요.",
    mask: "inner tubes",
    keywords: ["inner tubes", "tube"],
    explanation: "물놀이할 때 타는 고무 튜브를 미국에서는 흔히 'inner tube'라고 부릅니다.",
    audio: "./lessons/lesson-02/audio/we would all have inner tubes and air mattresses..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-26',
    en: "It seemed like everything was sold out.",
    kr: "모든 게 다 매진된 것처럼 보였어요.",
    mask: "sold out",
    keywords: ["sold out"],
    explanation: "티켓이나 상품이 '완판/매진되다'는 표현으로 일상 대화에서 필수적으로 등장합니다.",
    audio: "./lessons/lesson-01/audio/I dont know when they officially went on sale but it seemed like everything was sold..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-27',
    en: "We had to strip it all the way down to the studs.",
    kr: "벽 기둥 뼈대만 남기고 안쪽을 모조리 다 뜯어내야 했어요.",
    mask: "down to the studs",
    keywords: ["down to the studs", "studs"],
    explanation: "'studs'는 건물의 기둥/골조 뼈대를 뜻하며, 'down to the studs'는 내장재를 완전히 싹 철거했다는 생생한 표현입니다.",
    audio: "./lessons/lesson-02/audio/we had to strip it all the way down to the studs so the building would dry out and wouldnt get moldy..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-28',
    en: "Obviously Jaemyun can't go with me because someone has to watch the kids.",
    kr: "당연히 재면 씨는 아이들을 돌봐야 하니까 저랑 같이 갈 수 없지요.",
    mask: "watch the kids",
    keywords: ["watch the kids"],
    explanation: "'watch the kids'는 아이들을 단순히 쳐다보는 게 아니라 '아이들을 돌보다/봐주다'라는 일상 생활 밀착 영어입니다.",
    audio: "./lessons/lesson-01/audio/obviously Jaemyun cant go with me because someone has to watch the kids..wav",
    lessonId: "lesson-01"
  },
  {
    id: 'dp-29',
    en: "We had a spring built that was up on the hill.",
    kr: "우리는 언덕 위에 자연 샘물 저장 시설을 만들었어요.",
    mask: "a spring built",
    keywords: ["spring", "a spring built"],
    explanation: "'spring'은 계절 봄 외에도 땅속에서 맑은 물이 솟아나는 '천연 샘/샘물'을 의미합니다.",
    audio: "./lessons/lesson-02/audio/we just used buckets or bottles for water until we had a spring built that was up on the hill..wav",
    lessonId: "lesson-02"
  },
  {
    id: 'dp-30',
    en: "It's not at a weird or obstructed angle or anything.",
    kr: "이상하거나 시야가 가려지는 각도 같은 게 전혀 아니에요.",
    mask: "obstructed angle",
    keywords: ["obstructed angle", "obstructed"],
    explanation: "'obstructed'는 기둥이나 벽에 '시야가 가려진, 방해받은'이라는 뜻으로 좌석 예약 시 자주 확인하는 단어입니다.",
    audio: "./lessons/lesson-01/audio/Its not like its on the side or like at a weird or obstructed angle or anything.wav",
    lessonId: "lesson-01"
  }
];

if (typeof window !== 'undefined') {
  window.DAILY_PHRASES = DAILY_PHRASES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DAILY_PHRASES };
}
