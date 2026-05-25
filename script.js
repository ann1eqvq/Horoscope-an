/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Grab static config loaded from config.js
const CONFIG = window.ASTROLOGY_CONFIG;

// Define default custom profile settings for Taurus (2003/05/12)
const NATAL_PLACEMENTS = {
  sun: {
    sign: "金牛座",
    degree: 21.1,
    house: 9,
    description: "太陽位於金牛座：賦予你務實、穩健與極佳的審美感知。在第 9 宮（遷移宮）中，這種力量轉化為對高維智慧、哲學、跨文化學習與精神成長的深刻追求，使你不流於盲從，而能腳踏實地探索真理。"
  },
  moon: {
    sign: "天秤座",
    degree: 17.5,
    house: 2,
    description: "月亮位於天秤座：你內心渴望和諧與心理平衡，擁有優雅的天性。在第 2 宮（財帛宮）中，這代表你的情緒安全感與物質豐盛、自我價值以及生活中的美好事物息息相關，善於以和諧的方式管理資源。"
  },
  ascendant: {
    sign: "處女座",
    degree: 14.8,
    description: "上升位於處女座：你給人的第一印象是典雅、條理分明、觀察力驚人。做事講求效率與邏輯，習慣在細部精益求精，散發精緻而內斂的智者氣質。另外，座落在此命盤關鍵頂點的上升點（Rising Sign）決定了你如何面對未知、踏實落地的生命厚實度。"
  },
  midheaven: {
    sign: "雙子座",
    degree: 11.2,
    description: "天頂（MC）位於雙子座：你在事業與社會形象中散發著最精雅的生命張力。代表此生能在世俗領域獲得卓越肯定與長遠發展的星象藍圖之軌。"
  },
  houses: []
};

// Application reactive state
const state = {
  birthInfo: {
    birthDate: "2003-05-12",
    birthTime: "13:13",
    birthPlace: "台灣台北",
    latitude: 25.03,
    longitude: 121.56
  },
  targetDate: new Date('2026-05-25'), // Starts on May 25, 2026
  activeTab: 'daily', // 'daily' | 'weekly' | 'birth'
  showIntro: true,
  showProfileModal: false,
  isEditingForm: false,

  // Modal temporary values
  tempBirthDate: "2003-05-12",
  tempBirthTime: "13:13",
  tempBirthPlace: "台灣台北",
  tempLatitude: 25.03,
  tempLongitude: 121.56,

  // Interactions
  isTarotFlipped: false,
  tarotImageError: false,

  // Charts selection
  activeMetric: 'overall', // 'overall' | 'love' | 'career' | 'wealth'
  hoveredDayIndex: null,

  // Birth wheel interaction
  activePlanet: 'sun', // 'sun' | 'moon' | 'ascendant' | 'midheaven'
};

// Pre-calculated placement cache
let placements = null;
// Today's generated daily and weekly data cache
let dailyData = null;

// Hashing algorithm for seeds
function hashString(str) {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return (hash >>> 0) || 123456789;
}

// Pseudo-random number generator
class SeededRNG {
  constructor(seedStr) {
    this.seed = hashString(seedStr);
  }
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick(arr) {
    if (arr.length === 0) return null;
    return arr[this.nextInt(0, arr.length - 1)];
  }
  pickMultiple(arr, count) {
    const shuffled = [...arr];
    const n = shuffled.length;
    const actualCount = Math.min(count, n);
    for (let i = 0; i < actualCount; i++) {
      const j = this.nextInt(i, n - 1);
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled.slice(0, actualCount);
  }
}

function getSeedForDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function safeCreateIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn("Failed to create lucide icons:", e);
    }
  }
}

// Astronomy Calculation Modules
const SIGNS_ORDER = ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"];

const SUN_ZODIAC_DATES = [
  { name: "摩羯座", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, idx: 9 },
  { name: "水瓶座", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, idx: 10 },
  { name: "雙魚座", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, idx: 11 },
  { name: "牡羊座", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, idx: 0 },
  { name: "金牛座", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, idx: 1 },
  { name: "雙子座", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, idx: 2 },
  { name: "巨蟹座", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, idx: 3 },
  { name: "獅子座", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, idx: 4 },
  { name: "處女座", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, idx: 5 },
  { name: "天秤座", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, idx: 6 },
  { name: "天蠍座", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, idx: 7 },
  { name: "射手座", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, idx: 8 },
];

const SUN_DESCRIPTIONS = {
  "牡羊座": "太陽位於牡羊座：賦予你無限的開創力量。在第 9 宮（遷移宮）中，這代表你將對生命奧義、高維知識、多元文化領域展現極高的探索熱情與無畏精神。",
  "金牛座": "太陽位於金牛座：賦予你務實、穩健與極佳的審美感知。在第 9 宮（遷移宮）中，這種力量轉化為對高維智慧、哲學、跨文化學習與精神成長的深刻追求，使你不流於盲從，而能腳踏實地探索真理。",
  "雙子座": "太陽位於雙子座：生性靈巧好奇，擅長吸納多維資源與跨域思索。在第 9 宮中則強化了你的傳播才華，樂意把深遠玄奧的高等知識用生動妙趣的方式普及眾生。",
  "巨蟹座": "太陽位於巨蟹座：情感極其細膩。在第 9 宮遷移宮中，代表你總是以溫柔的內在直覺感知宇宙秩序，將更開闊的外邦文化與智慧體系當作靈魂安居的厚實避風港。",
  "獅子座": "太陽位於獅子座：擁有宏亮的自我展示力量與天生領袖豪情。在第 9 宮中，你會帶著非凡的自信推廣個人信念或學術成就，並如豔陽般感召他人一同漫遊智慧之海。",
  "處女座": "太陽位於處女座：講究極致的邏輯分析與精準調理。在第 9 宮中，這表示你在探索神祕學或專業高深學問時，具有卓越的系統化與工匠精琢精神。",
  "天秤座": "太陽位於天秤座：追求天秤兩端的神聖和諧與人際客觀。在第 9 宮中，這驅使你熱忱擁護真理、社會正義與宏觀思想，善於從不同的心靈流派中梳理客觀大美。",
  "天蠍座": "太陽位於天蠍座：其意志無比深邃，帶有強烈的探尋本能。在第 9 宮中，代表你對於星空謎團、深層玄祕學或宇宙核心引力存在本能的穿透能力。",
  "射手座": "太陽位於射手座：這是太陽位於遷移宮的絕佳守護加冕位。你開朗樂觀，終其一生在擴張宏觀哲學、寰宇遠遊與精神文明的廣度，是天生的思想探險家。",
  "摩羯座": "太陽位於摩羯座：行事低調嚴禁、充滿大器深思。在第 9 宮中，這使你更懂得將漫長的歲月淬鍊成智慧遺產，不投機取巧，以高度耐力攀登哲理高峰。",
  "水瓶座": "太陽位於水瓶座：具備超前的革命與群體先驅直覺。在第 9 宮中，這使你對新紀元理念、星相密碼、先進太空科技或社會集體變革抱有無限宏偉的獨創觀點。",
  "雙魚座": "太陽位於雙魚座：富有至臻的靈感包容度與宇宙同理情懷。在第 9 宮中，代表你與高緯度心靈存在著自然的共振，在直覺引領下契合廣袤神妙的靈性真理。"
};

const MOON_DESCRIPTIONS = {
  "牡羊座": "月亮位於牡羊座：你的情緒本能勇敢直爽，渴望快速掌握主動。在第 2 宮財帛宮，這使你追求資財、開拓自我價值時，擁有一股自立更生的強大鬥志。",
  "金牛座": "月亮位於金牛座：精湛感官與尋求安定物質是你的安全感基石。落在財帛宮更是得理位，賦予你極佳的理財保值天賦與對精細器物的超凡鑑賞力。",
  "雙子座": "月亮位於雙子座：喜歡收集多維度資訊來維持安寧。落在財帛宮這意味著你善於透過靈活的資訊不對稱、口才思辯或多工協作來創造自我豐盛與實質回饋。",
  "巨蟹座": "月亮位於巨蟹座：情緒極富滋養力與家庭歸宿感。進入第 2 宮中，這表明你的情緒安全感強烈綁定於實體儲存、房屋、美食與自我資產價值的穩定上升。",
  "獅子座": "月亮位於獅子座：情感內核尊貴，需要獲得周遭的高度矚目。在第 2 宮中，這代表你具有慷慨大氣、追求極致工藝珍品的品味，願意為內在榮譽感精緻投資。",
  "處女座": "月亮位於處女座：內心透過縝密服務與精確調理來得到平靜。在第 2 宮中，代表你管理帳目或日常生活極其一絲不苟，對收支細微與純淨自我價值有高度追求。",
  "天秤座": "月亮位於天秤座：你內心渴望和諧與心理平衡，擁有優雅的天性。在第 2 宮（財帛宮）中，這代表你的情緒安全感與物質豐盛、自我價值以及生活中的美好事物息息相關，善於以和諧的方式管理資源。",
  "天蠍座": "月亮位於天蠍座：情緒雷達極度敏銳，帶著置之死地而後生的深刻。在第 2 宮中，代表你對資本管理或內在精神資源的使用具有驚人的穿透與掌控渴望。",
  "射手座": "月亮位於射手座：心境天生崇尚自由、寬廣且隨遇而安。在第 2 宮中，這使得你對金錢與價值持抱豐沛與樂觀的流動態度，相信天生我材必有用。",
  "摩羯座": "月亮位於摩羯座：情緒表達老成持重，自我防禦感較高。在第 2 宮中，這代表你對維持長遠穩健的理財布局、克勤克儉有著根深體固的安全要求。",
  "水瓶座": "月亮位於水瓶座：以獨特客觀的超然視角梳理私密情感。在第 2 宮中，你渴望物質資產與自我價值都擁有高度的自主產權，抗拒世俗框架束縛。",
  "雙魚座": "月亮位於雙魚座：富有寬廣溫柔的心靈想像與無私慈悲。在第 2 宮中，你追求的往往是超脫物慾的靈魂富足，對金錢資具有極高的靈性感應力與藝術療癒才華。"
};

const ASC_DESCRIPTIONS = {
  "牡羊座": "上升位於牡羊座：你給人第一印象充滿朝氣，熱情直率。處事雷厉風行，像開拓先鋒般勇氣可嘉，生命步調輕快敏捷，具有極佳的自我主張。",
  "金牛座": "上升位於金牛座：外表安詳端莊、做事悠然沉著。你給人極強的信賴感，重視身體適意感與生活秩序的和諧精緻，散發優雅迷人的優裕神采。",
  "雙子座": "上升位於雙子座：神情充滿靈巧與機敏活力。你口才流暢、求新求變，善於用風趣風雅的特質融洽氣氛，給人眼明手快、求新求變的青春形象。",
  "巨蟹座": "上升位於巨蟹座：自帶一股溫和的保護圈氣質。你親切而顧家，給人善解人意、體貼柔美的母性呵護安全感，極易與身邊環境產生柔暖聯結。",
  "獅子座": "上升位於獅子座：英姿煥發、步伐昂首闊步。你自帶聚光燈，說話沉穩宏亮，給人自信不凡、尊貴大度且講求品味的卓越氣場。",
  "處女座": "上升位於處女座：你給人的第一印象是典雅、條理分明、觀察力驚人。做事講求效率與邏輯，習慣在細部精益求精，散發精緻而內斂的智者氣質。",
  "天秤座": "上升位於天秤座：具有過人的一等優雅神采與融洽天賦。你給人親和度極高，五官協調、服飾品味雅致，散發令人如沐春風的貴族魅力。",
  "天蠍座": "上升位於天蠍座：自帶迷濛而深邃的神祕性感底色。你眼神銳利沉靜，不輕易流露私密想法，令人既著迷又敬畏，具備非比尋常的意志張力。",
  "射手座": "上升位於射手座：身板挺拔好動，雙眼綻放著幽默與探險的光點。你健談熱忱，給人陽光、不拘小節且勇於追求信念的自由旅者氣質。",
  "摩羯座": "上升位於摩羯座：外型內斂、沉雅，做事有條不紊。你散發出一股歷練老成的可信度與權威風範，在任何局勢下都能展现出山不轉路轉的堅若磐石。",
  "水瓶座": "上升位於水瓶座：神態獨特而帶點疏離的睿智。你不盲從，服飾剪裁或談吐思路充滿驚人創意與人文關懷，散發出一股令人好奇的太空極簡氣蘊。",
  "雙魚座": "上升位於雙魚座：富有深沉浪漫、柔情似水的藝術感知力。你眼神自帶一層迷霧般的柔光，舉止體貼溫煦，對外界極其敏感，是天生的夢幻美感使者。"
};

// Calculate Astrological Placements
function calculateAstrologicalPlacements(birthInfo) {
  const bDate = new Date(birthInfo.birthDate);
  if (isNaN(bDate.getTime())) {
    return NATAL_PLACEMENTS;
  }
  
  // 1. Calculate Sun sign
  const sunMonth = bDate.getMonth() + 1;
  const sunDay = bDate.getDate();
  let sunSign = "金牛座";
  let sunIdx = 1;
  
  for (const z of SUN_ZODIAC_DATES) {
    if (
      (sunMonth === z.startMonth && sunDay >= z.startDay) ||
      (sunMonth === z.endMonth && sunDay <= z.endDay)
    ) {
      sunSign = z.name;
      sunIdx = z.idx;
      break;
    }
  }
  
  const birthSeed = bDate.getFullYear() + sunMonth * 31 + sunDay;
  const pseudoRandom = (offset) => {
    const x = Math.sin(birthSeed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  const sunDegree = parseFloat((1.0 + pseudoRandom(1) * 28.0).toFixed(1));
  
  // 2. Moon Sign (Astronomical Ephemeris)
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)); // Reference new moon Jan 2000
  const elapsedDays = (bDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const moonLongitude = (290 + elapsedDays * 13.176358) % 360;
  const adjustedMoonLong = moonLongitude < 0 ? moonLongitude + 360 : moonLongitude;
  
  const moonSignIdx = Math.floor(adjustedMoonLong / 30);
  const moonSign = SIGNS_ORDER[moonSignIdx];
  const moonDegree = parseFloat((adjustedMoonLong % 30).toFixed(1));
  
  // 3. Ascendant Sign
  const parts = birthInfo.birthTime.split(":");
  const hours = Number(parts[0]) || 0;
  const minutes = Number(parts[1]) || 0;
  const timeDecimal = hours + minutes / 60;
  
  // Estimate ASC shift based on solar offset and time of day
  const ascIdx = (sunIdx + Math.floor((timeDecimal - 5) / 2) + 12) % 12;
  const ascSign = SIGNS_ORDER[ascIdx];
  const ascDegree = parseFloat((5.0 + pseudoRandom(2) * 20.0).toFixed(1));
  
  // 4. Midheaven (MC) - approximately 90 deg/3 signs ahead of ASC
  const mcIdx = (ascIdx + 9) % 12;
  const mcSign = SIGNS_ORDER[mcIdx];
  const mcDegree = parseFloat((3.0 + pseudoRandom(3) * 24.0).toFixed(1));
  
  // Outer Houses Placements Estimation
  const houses = Array.from({ length: 12 }, (_, i) => {
    const hIdx = (ascIdx + i) % 12;
    return {
      number: i + 1,
      sign: SIGNS_ORDER[hIdx],
      degree: parseFloat((3.0 + pseudoRandom(i + 10) * 10.0).toFixed(1))
    };
  });
  
  return {
    sun: {
      sign: sunSign,
      degree: sunDegree,
      house: 9,
      description: SUN_DESCRIPTIONS[sunSign] || SUN_DESCRIPTIONS["金牛座"]
    },
    moon: {
      sign: moonSign,
      degree: moonDegree,
      house: 2,
      description: MOON_DESCRIPTIONS[moonSign] || MOON_DESCRIPTIONS["天秤座"]
    },
    ascendant: {
      sign: ascSign,
      degree: ascDegree,
      description: `${ASC_DESCRIPTIONS[ascSign] || ASC_DESCRIPTIONS["處女座"]} 另外，座落在此命盤關鍵頂點的上升點（Rising Sign）決定了你如何面對未知、踏實落地的生命厚實度。`
    },
    midheaven: {
      sign: mcSign,
      degree: mcDegree,
      description: `天頂（MC）位於${mcSign}：你在事業與社會形象中散發著最精雅的生命張力。代表此生能在世俗領域獲得卓越肯定與長遠發展的星象藍圖之軌。`
    },
    houses
  };
}

// Calculate Moon Phase Illumination & Age
function calculateMoonPhase(date) {
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicPeriod = 29.530588853; // Moon cycle length in days
  
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  let age = diffDays % synodicPeriod;
  if (age < 0) {
    age += synodicPeriod;
  }
  
  const angle = (age / synodicPeriod) * 2 * Math.PI;
  const percentage = 50 * (1 - Math.cos(angle));
  
  let phaseChinese = "";
  let phaseName = "";
  let description = "";
  let svgPhaseOffset = 0;
  
  if (age < 1.0 || age > 28.53) {
    phaseChinese = "新月 (朔)";
    phaseName = "New Moon";
    svgPhaseOffset = 0;
    description = "此時月亮完全隱沒於夜空之中。新月代表「起步與種子」，最適合在此時整理思緒、許下前瞻性的心願，為接下來的循環深植根基。";
  } else if (age >= 1.0 && age < 6.38) {
    phaseChinese = "眉月 (新月微光)";
    phaseName = "Waxing Crescent";
    svgPhaseOffset = 25;
    description = "纖細的月牙在夜空一角綻放微光。這是「萌芽與行動」的時期。昨日的願景化作小小的熱情，此時最適合跨出第一步，執行具體的規劃。";
  } else if (age >= 6.38 && age < 8.38) {
    phaseChinese = "上弦月 (半月突破)";
    phaseName = "First Quarter";
    svgPhaseOffset = 50;
    description = "恰好一半明亮的明月高掛。象徵「抉擇與突破」。你可能會遭逢小小的考驗、瓶頸，這是在催促你勇敢打破舊習，做出積極的微調與決斷。";
  } else if (age >= 8.38 && age < 13.76) {
    phaseChinese = "盈凸月 (蓄勢待發)";
    phaseName = "Waxing Gibbous";
    svgPhaseOffset = 75;
    description = "月亮逐漸飽滿，幾乎全亮。此時能量處於「累積與精進」的高峰。最適合做細節上的微調，專注於即將完成的目標，維持高度專注。";
  } else if (age >= 13.76 && age < 15.76) {
    phaseChinese = "滿月 (圓滿收割)";
    phaseName = "Full Moon";
    svgPhaseOffset = 100;
    description = "皎皎明月灑落大地。能量達到最高的頂點，象徵「圓滿、顯化與感恩」。此時內心情感最為豐沛飽滿，適合大方展現成果、寬容及內省。";
  } else if (age >= 15.76 && age < 21.14) {
    phaseChinese = "虧凸月 (分享與回饋)";
    phaseName = "Waning Gibbous";
    svgPhaseOffset = -75;
    description = "滿月過後，光芒開始收斂。象徵「回饋、分享與傳播」。最適合將獲得的知識或成果傳授分享給他人，或釐清過度擴張的事物。";
  } else if (age >= 21.14 && age < 23.14) {
    phaseChinese = "下弦月 (反思與斷捨離)";
    phaseName = "Last Quarter";
    svgPhaseOffset = -50;
    description = "另一側的半月。代表「檢討、釋放與斷捨離」。適合在此階段進行財務重整、心理排毒，勇敢與不健康的人際關係、生活惡習揮別。";
  } else {
    phaseChinese = "殘月 (沉靜休養)";
    phaseName = "Waning Crescent";
    svgPhaseOffset = -25;
    description = "微弱而細窄的月影在黎明前天空閃滅。屬於「臣服、內斂與休養生息」。請靜下心來、放鬆肌肉，讓身心靈好好充電，準備迎接下一次新月的重啟。";
  }
  
  return {
    age,
    phaseName,
    phaseChinese,
    percentage,
    svgPhaseOffset,
    description
  };
}

// Render a mathematically exact moon phase path
function getMoonPath(percentage, isWaxing) {
  const r = 45;
  const cx = 50;
  const cy = 50;
  const pct = percentage / 100;
  
  // Scale horizontal radius for the inner boundary ellipse
  const rx = r * Math.abs(2 * pct - 1);
  
  // Boundary conditions
  if (percentage < 1) {
    // New Moon - Empty path
    return "";
  }
  if (percentage > 99) {
    // Full Moon - Complete circle
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
  }

  if (pct < 0.5) {
    // Crescent phases (thin lit slice)
    if (isWaxing) {
      // Right side is illuminated
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r}`;
    } else {
      // Left side is illuminated
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r}`;
    }
  } else {
    // Gibbous phases (fat lit slice)
    if (isWaxing) {
      // Right side is fully lit, left side is partially lit
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r}`;
    } else {
      // Left side is fully lit, right side is partially lit
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r}`;
    }
  }
}

// Generate Transit positions on targetDate
function getTransitPositions(rngSeed) {
  const seedNum = hashString(rngSeed);
  const getPos = (offset, range) => ((seedNum + offset) % range);
  
  return {
    sun: { sign: "雙子座", degree: (getPos(1, 30)), house: (getPos(2, 12) + 1), energy: "激發你的社交溝通與多元學習奧秘火花" },
    moon: { sign: SIGNS_ORDER[getPos(3, 12)], degree: getPos(4, 30), house: (getPos(5, 12) + 1), energy: "微妙觸動內心感受，今日心情注重此領域" },
    venus: { sign: SIGNS_ORDER[getPos(6, 12)], degree: getPos(7, 30), energy: "引導今日人際桃花、財富感知的溫馨方向" },
    mercury: { sign: SIGNS_ORDER[getPos(8, 12)], degree: getPos(9, 30), energy: "精準梳理思維表達與合約溝通的聚焦點" },
    mars: { sign: SIGNS_ORDER[getPos(10, 12)], degree: getPos(11, 30), energy: "注入飽滿行動力與充滿勇氣的熱血相位" },
  };
}

// Aggregate All Daily & Weekly Data using Hashed Seed
function generateDailyAstrologyData(date, placementsObj) {
  const seedStr = getSeedForDate(date);
  const rng = new SeededRNG(seedStr);
  
  // 1. Tarot reading
  const tarotCard = rng.pick(CONFIG.TAROT_DECK);
  const isUpright = rng.nextInt(0, 10) < 8; // 80% upright rate
  let reading = isUpright ? tarotCard.uprightMeaning : tarotCard.reversedMeaning;
  
  const dailyTarot = {
    card: tarotCard,
    isUpright,
    reading: `今日抽取到了【${tarotCard.name}${isUpright ? '• 正位' : '• 逆位'}】。這張牌顯示：${reading} 配合你命盤中位於第 9 宮的太陽金牛及上升處女之特質，建議你今日行事保持克制、注重細節整理。`
  };
  
  // 2. News Matching
  const moodKeyword = rng.pick(CONFIG.MOOD_KEYWORDS);
  const moodValue = rng.nextInt(75, 98);
  
  // Filter out own sun sign for dynamic matches
  const filteredSigns = SIGNS_ORDER.filter(s => s !== placementsObj.sun.sign);
  const luckyMatchSign = rng.pick(filteredSigns);
  const unluckyMatchSign = rng.pick(filteredSigns.filter(s => s !== luckyMatchSign));
  
  const recommendedToDos = rng.pickMultiple(CONFIG.RECOMMENDED_DOS_TAURUS, 3);
  const wisdomQuote = rng.pick(CONFIG.DAILY_WISDOM_QUOTES);
  
  const dailyAstroNews = {
    moodKeyword,
    moodValue,
    luckyMatchSign,
    unluckyMatchSign,
    recommendedToDos,
    wisdomQuote
  };
  
  // 3. Moon Phase
  const moonPhase = calculateMoonPhase(date);
  
  // 4. Weekly Trend (Calculated for 7 days starting from targetDate)
  const trend = [];
  const daysOfWeek = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(date);
    currentDay.setDate(date.getDate() + i);
    const daySeed = getSeedForDate(currentDay);
    const dayRng = new SeededRNG(daySeed);
    
    const dayName = daysOfWeek[currentDay.getDay()];
    const dateStr = `${String(currentDay.getMonth() + 1).padStart(2, "0")}/${String(currentDay.getDate()).padStart(2, "0")}`;
    
    trend.push({
      dayName: i === 0 ? "今天" : dayName,
      dateStr,
      overall: dayRng.nextInt(60, 98),
      love: dayRng.nextInt(55, 96),
      career: dayRng.nextInt(62, 98),
      wealth: dayRng.nextInt(50, 97)
    });
  }
  
  const weeklyBestItem = rng.pick(CONFIG.WEEKLY_BEST_POOL);
  const weeklyWarningItem = rng.pick(CONFIG.WEEKLY_WARNING_POOL);
  
  const weeklyHoroscope = {
    trend,
    weeklyBest: weeklyBestItem.best,
    weeklyBestDetails: weeklyBestItem.details,
    weeklyWarning: weeklyWarningItem.warning,
    weeklyWarningDetails: weeklyWarningItem.details
  };
  
  // 5. Daily Lucky Items
  const luckyData = {
    color: rng.pick(CONFIG.COLORS).name,
    colorHex: rng.pick(CONFIG.COLORS).hex,
    number: rng.nextInt(1, 99),
    crystal: rng.pick(CONFIG.CRYSTALS),
    plant: rng.pick(CONFIG.PLANTS),
    scent: rng.pick(CONFIG.SCENTS),
    place: rng.pick(CONFIG.PLACES),
    sport: rng.pick(CONFIG.SPORTS),
    direction: rng.pick(CONFIG.DIRECTIONS),
    location: rng.pick(CONFIG.LOCATIONS),
    timeSlot: rng.pick(CONFIG.TIME_SLOTS)
  };
  
  return {
    dailyTarot,
    dailyAstroNews,
    moonPhase,
    weeklyHoroscope,
    luckyData,
    transits: getTransitPositions(seedStr)
  };
}

// Recalculates both natal and daily forecasting values
function recalculateDailyData() {
  state.tarotImageError = false;
  dailyData = generateDailyAstrologyData(state.targetDate, placements);
}

// Renders the taurus golden box at the top
function renderIntro() {
  const container = document.getElementById('intro-panel-container');
  if (!container) return;
  
  if (!state.showIntro) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="bg-[#faf6f5] border border-[#f0e4e2] rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xs animate-fade-in text-left">
      <!-- absolute decorative sparkles -->
      <div class="absolute top-4 right-4 text-[#be9f9d]/60 cursor-pointer hover:text-[#a66468] transition-colors" onclick="app.onToggleIntro(false)" title="關閉提示">
        <i data-lucide="x" class="w-5 h-5"></i>
      </div>
      
      <div class="flex items-start gap-4">
        <span class="p-3 bg-[#a66468]/10 text-[#a66468] rounded-2xl flex-shrink-0 mt-1 border border-[#eedddb]/40">
          <i data-lucide="sparkles" class="w-6 h-6 animate-pulse"></i>
        </span>
        <div>
          <h2 class="text-base font-sans font-extrabold text-[#3a2829] tracking-wide">
            金牛座黃金三角 • 專屬精密星像儀盤
          </h2>
          <p class="text-xs text-[#8a7274] leading-relaxed mt-1 md:max-w-4xl font-sans">
            歡迎使用個人化的星盤運勢。系統已為您鎖定出生盤為 <strong>${state.birthInfo.birthDate.replace(/-/g, '/')}（太陽 ${placements.sun.sign} • 月亮 ${placements.moon.sign} • 上升 ${placements.ascendant.sign}）</strong>。
            我們以此神聖的先天印記，動態交互對齊當日過境星體，透過高精度儒略曆演算法，微調出今日專屬塔羅、月相能量與本週運勢曲線。
          </p>
          <div class="mt-4 flex items-center gap-3">
            <button 
              type="button"
              onclick="app.onOpenProfileModal()"
              class="px-4 py-1.5 bg-[#a66468]/10 text-[#a66468] font-sans font-extrabold text-xs rounded-xl hover:bg-[#a66468] hover:text-white transition-all cursor-pointer shadow-xs border border-[#eedddb]/40"
            >
              修改出生檔案
            </button>
            <span class="text-[10px] text-[#8a7274] font-mono tracking-wider">
              LAT: ${state.birthInfo.latitude.toFixed(2)}° • LNG: ${state.birthInfo.longitude.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
  safeCreateIcons();
}

// Render Date Deck Info
function renderDateDeck() {
  const textEl = document.getElementById('current-formatted-target-date');
  const inputEl = document.getElementById('target-date-input');
  
  if (textEl && inputEl) {
    const daysArr = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    const yyyy = state.targetDate.getFullYear();
    const mm = String(state.targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(state.targetDate.getDate()).padStart(2, "0");
    const dayName = daysArr[state.targetDate.getDay()];
    
    textEl.innerHTML = `${yyyy} 年 ${mm} 月 ${dd} 日 (${dayName})`;
    inputEl.value = `${yyyy}-${mm}-${dd}`;
  }
}

// Renders Tab header buttons with correct active design states
function renderTabs() {
  const holder = document.getElementById('tab-headers-holder');
  if (!holder) return;
  
  const tabs = [
    { id: 'daily', label: '今日星象報物錄', icon: 'sparkles' },
    { id: 'weekly', label: '本週運勢曲線輪廓', icon: 'trending-up' },
    { id: 'birth', label: '先天命盤軌道分佈', icon: 'compass' }
  ];
  
  holder.innerHTML = tabs.map((tab) => {
    const isAct = state.activeTab === tab.id;
    const activeClass = "bg-[#be9f9d] text-white font-extrabold shadow-sm";
    const inactiveClass = "text-[#8a7274] hover:text-[#503536] font-semibold hover:bg-[#faf6f5]";
    
    return `
      <button
        onclick="app.onTabChange('${tab.id}')"
        class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-xs transition-all duration-300 cursor-pointer ${
          isAct ? activeClass : inactiveClass
        }"
      >
        <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
        <span>${tab.label}</span>
      </button>
    `;
  }).join('');
  
  safeCreateIcons();
}

// Renders the specific Tab Contents
function renderActiveTabContent() {
  const holder = document.getElementById('tab-contents-holder');
  if (!holder) return;
  
  holder.className = "animate-fade-in";
  
  // Guard placements and dailyData
  if (!placements) {
    placements = calculateAstrologicalPlacements(state.birthInfo);
  }
  if (!dailyData) {
    recalculateDailyData();
  }
  
  try {
    if (state.activeTab === 'daily') {
      renderDailyTab(holder);
    } else if (state.activeTab === 'weekly') {
      renderWeeklyTab(holder);
    } else if (state.activeTab === 'birth') {
      renderBirthTab(holder);
    }
  } catch (e) {
    console.error("Error rendering active tab content:", e);
    holder.innerHTML = `
      <div class="bg-white border border-[#eedddb] rounded-3xl p-8 text-center max-w-xl mx-auto my-8">
        <strong class="text-sm font-sans font-extrabold text-[#a66468] block">星盤軌道能量解析受干涉</strong>
        <p class="text-xs text-[#8a7274] mt-2 font-medium">請點擊其他分頁或嘗試重整，以重新引導您的精密天宮印記。</p>
        <p class="text-[9px] text-[#be9f9d] font-mono mt-3 text-left border-t border-[#eedddb]/40 pt-2 leading-normal">
          Diagnostic details: ${e.message}
        </p>
      </div>
    `;
  }
  
  safeCreateIcons();
}

// --- TAB RENDERING METHODS ---

// RENDERS THE DAILY FORECASTS TAB
function renderDailyTab(holder) {
  const { dailyAstroNews, dailyTarot, moonPhase, transits } = dailyData;
  
  holder.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      <!-- Left: Column containing News & Transit details -->
      <div class="lg:col-span-8 flex flex-col gap-8">
        
        <!-- Daily Astro News Card -->
        <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute -top-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <!-- Header -->
          <div class="flex items-center gap-3 pb-6 border-b border-[#eedddb]">
            <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <i data-lucide="sparkles" class="w-5 h-5 animate-pulse"></i>
            </span>
            <div>
              <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日星象指南</h2>
              <p class="text-sm text-[#8a7274] mt-0.5">個人星盤當日能量分析</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
            <!-- Left sub: Mood meter and Social compatibility matchings -->
            <div class="md:col-span-5 flex flex-col justify-between gap-5">
              <!-- Mood Indicator -->
              <div class="p-4 bg-[#faf6f5] border border-[#eedddb] rounded-2xl">
                <span class="text-[10px] text-[#8a7274] tracking-widest uppercase font-mono block">今日心智氣場脈象</span>
                <strong class="text-lg font-sans font-extrabold text-[#a66468] mt-1.5 block">
                  ${dailyAstroNews.moodKeyword}
                </strong>
                <!-- Progress Line -->
                <div class="w-full bg-[#ebdcd9] h-2 rounded-full overflow-hidden mt-3">
                  <div class="bg-[#a66468] h-full transition-all duration-1000" style="width: ${dailyAstroNews.moodValue}%"></div>
                </div>
                <span class="text-[10px] text-[#8a7274] font-mono mt-1.5 block">光譜協調係數值: ${dailyAstroNews.moodValue}%</span>
              </div>
              
              <!-- Social compatibility matches -->
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span class="text-[10px] text-emerald-800 font-sans font-extrabold">和諧引力座</span>
                  <strong class="text-sm text-emerald-950 font-bold block mt-1">${dailyAstroNews.luckyMatchSign}</strong>
                </div>
                <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span class="text-[10px] text-rose-800 font-sans font-extrabold">張力磨礪座</span>
                  <strong class="text-sm text-rose-950 font-bold block mt-1">${dailyAstroNews.unluckyMatchSign}</strong>
                </div>
              </div>
            </div>
            
            <!-- Right sub: Dynamic Recommended To-dos & Quotes -->
            <div class="md:col-span-7 flex flex-col justify-between gap-5 border-t md:border-t-0 md:border-l border-[#eedddb] pt-6 md:pt-0 md:pl-6">
              <div>
                <span class="text-[10px] text-[#8a7274] tracking-widest uppercase font-mono block">黃金開運法寶指引 (宜)</span>
                <ul class="mt-2 text-xs text-[#4a3536] space-y-2.5 font-medium">
                  ${dailyAstroNews.recommendedToDos.map((todo) => `
                    <li class="flex items-start gap-2 leading-relaxed">
                      <span class="text-[#a66468] font-bold mt-0.5">✦</span>
                      <span>${todo}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              
              <!-- Wisdom quote -->
              <div class="p-3.5 bg-[#fcf8f7] border border-[#eedddb] rounded-xl relative overflow-hidden">
                <p class="text-xs text-[#4a3536] italic leading-relaxed font-sans font-medium pl-1">
                  「 ${dailyAstroNews.wisdomQuote} 」
                </p>
                <span class="text-[9px] text-[#8a7274] font-sans font-bold text-right block mt-2 pr-1">— 靈魂啟迪光環指針</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Moon Phase Card -->
        <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="moon-phase-card">
          <!-- Dynamic Moon Graphics loaded dynamically via Javascript -->
        </div>

        <!-- Transit Celestial Alignment Panel -->
        <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div class="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
            <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <i data-lucide="compass" class="w-5 h-5"></i>
            </span>
            <div>
              <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">星體軌道</h2>
              <p class="text-sm text-[#8a7274] mt-0.5">當日過境星象天宮度數觀測</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 pt-6 text-left">
            <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
              <strong class="text-xs text-[#a66468] block">☉ 太陽過境</strong>
              <div class="text-xs text-[#3a2829] font-bold font-mono mt-1">${transits.sun.sign} ${transits.sun.degree}°</div>
              <p class="text-[10px] text-[#8a7274] mt-2 font-semibold border-t border-[#eedddb] pt-1.5">${transits.sun.energy}</p>
            </div>
            <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
              <strong class="text-xs text-[#a66468] block">☽ 月亮過境</strong>
              <div class="text-xs text-[#3a2829] font-bold font-mono mt-1">${transits.moon.sign} ${transits.moon.degree}°</div>
              <p class="text-[10px] text-[#8a7274] mt-2 font-semibold border-t border-[#eedddb] pt-1.5">${transits.moon.energy}</p>
            </div>
            <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
              <strong class="text-xs text-[#a66468] block">♀ 金星過境</strong>
              <div class="text-xs text-[#3a2829] font-bold font-mono mt-1">${transits.venus.sign} ${transits.venus.degree}°</div>
              <p class="text-[10px] text-[#8a7274] mt-2 font-semibold border-t border-[#eedddb] pt-1.5">${transits.venus.energy}</p>
            </div>
            <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
              <strong class="text-xs text-[#a66468] block">☿ 水星過境</strong>
              <div class="text-xs text-[#3a2829] font-bold font-mono mt-1">${transits.mercury.sign} ${transits.mercury.degree}°</div>
              <p class="text-[10px] text-[#8a7274] mt-2 font-semibold border-t border-[#eedddb] pt-1.5">${transits.mercury.energy}</p>
            </div>
            <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
              <strong class="text-xs text-[#a66468] block">♂ 火星過境</strong>
              <div class="text-xs text-[#3a2829] font-bold font-mono mt-1">${transits.mars.sign} ${transits.mars.degree}°</div>
              <p class="text-[10px] text-[#8a7274] mt-2 font-semibold border-t border-[#eedddb] pt-1.5">${transits.mars.energy}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Right: Column containing Tarot Card flipping interactive component -->
      <div class="lg:col-span-4" id="tarot-section-container">
        <!-- Re-rendered via isolated method -->
      </div>
    </div>
  `;
  
  // Render sub elements in micro-containers
  renderTarotSection();
  renderMoonPhaseCard();
}

// RENDERS THE DYNAMIC INTERACTIVE TAROT CARD
function renderTarotSection() {
  const container = document.getElementById('tarot-section-container');
  if (!container) return;
  
  const { dailyTarot } = dailyData;
  const card = dailyTarot.card;
  
  container.innerHTML = `
    <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[500px]">
      <div>
        <div class="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
          <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </span>
          <div class="text-left">
            <h2 class="text-xl font-sans font-bold text-[#3a2829]">今日守護占卜牌</h2>
            <p class="text-xs text-[#8a7274] mt-0.5">點擊塔羅牌面即可翻轉牌象解析</p>
          </div>
        </div>

        <!-- Interactive 3D Card Area -->
        <div class="py-8 flex justify-center">
          <div 
            class="relative w-[184px] h-[312px] cursor-pointer perspect-1000 group transition-transform duration-300 hover:scale-[1.03]"
            onclick="app.onToggleTarotFlip()"
          >
            <div 
              class="absolute inset-0 w-full h-full rounded-2xl shadow-md border border-[#eedddb] transform-style-3d transition-transform duration-[750ms] overflow-visible"
              style="transform: ${state.isTarotFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}"
            >
              
              <!-- CARD BACK (Face up default, isTarotFlipped === false) -->
              <div class="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#ebe1df] via-[#e5d4d2] to-[#dbc2bf] p-3 flex flex-col justify-between items-center backface-hidden z-20 select-none border-2 border-white/60">
                <div class="w-full h-full border border-[#be9f9d]/40 rounded-xl p-2.5 flex flex-col justify-between items-center bg-[#f7ebe9]">
                  <span class="text-xs text-[#be9f9d]/80 font-mono font-bold">★ ASTROLOGY ★</span>
                  <div class="w-20 h-20 rounded-full border border-[#ebdcd9] flex items-center justify-center p-1 bg-white/50 relative">
                    <i data-lucide="compass" class="w-9 h-9 text-[#a66a6b]/30 animate-spin-slow"></i>
                    <div class="absolute inset-2 rounded-full border border-[#a66a6b]/10 animate-pulse"></div>
                  </div>
                  <span class="text-xs text-[#be9f9d]/80 font-mono font-bold">★ TAURUS 2003 ★</span>
                </div>
              </div>

              <!-- CARD FRONT (Flipped, rotated 180 deg) -->
              <div 
                class="absolute inset-0 w-full h-full rounded-2xl bg-white p-3 flex flex-col justify-between items-center backface-hidden select-none border-2 border-[#eedddb]"
                style="transform: rotateY(180deg)"
              >
                <div class="w-full h-full border border-[#eedddb] rounded-xl overflow-hidden flex flex-col justify-between bg-[#fafaf9] p-3">
                  <div class="flex items-center justify-between text-[#8a7274] font-mono text-[9px] font-bold border-b border-[#eedddb]/40 pb-1.5">
                    <span>${card.mysticSymbol} MAJOR ARCANA</span>
                    <span>No.${card.id.split('_')[0]}</span>
                  </div>

                  <!-- Image frame -->
                  <div class="relative flex-1 w-full my-2.5 rounded-lg overflow-hidden bg-[#e0d6d5]">
                    ${state.tarotImageError 
                      ? `<div class="absolute inset-0 flex flex-col items-center justify-between p-4 text-center bg-gradient-to-b from-[#1e1112] via-[#3a2022] to-[#1e1112] border border-[#eedddb]/35 relative overflow-hidden select-none">
                           <div class="absolute inset-0 opacity-40 bg-[radial-gradient(white_1.2px,transparent_1.2px)] [background-size:12px_12px] pointer-events-none"></div>
                           <div class="absolute top-1/4 left-1/4 w-24 h-24 bg-[#be9f9d]/20 rounded-full filter blur-xl animate-pulse pointer-events-none"></div>
                           
                           <span class="text-[8px] text-[#eedddb]/60 uppercase tracking-widest font-mono pointer-events-none">ASTRA TAROT</span>
                           
                           <div class="w-14 h-14 rounded-full border border-[#eedddb]/30 flex items-center justify-center bg-[#be9f9d]/5 relative z-10 shadow-inner">
                             <span class="text-4xl text-[#eedddb] drop-shadow-[0_0_8px_rgba(238,221,219,0.5)] font-mono select-none pointer-events-none">${card.mysticSymbol}</span>
                           </div>
                           
                           <div class="z-10 pointer-events-none">
                             <strong class="text-[11px] text-[#eedddb] block tracking-wide font-sans">${card.name.split(' ')[0]}</strong>
                             <span class="text-[8px] text-[#eedddb]/60 block font-mono mt-0.5">${card.id.toUpperCase()}</span>
                           </div>
                         </div>`
                      : `<img 
                           src="${card.imageUrl}" 
                           alt="${card.name}" 
                           onerror="app.onTarotImageError()"
                           referrerpolicy="no-referrer"
                           class="w-full h-full object-cover select-none pointer-events-none" 
                         />`
                    }
                    <!-- Position indicator flag -->
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold ${
                      dailyTarot.isUpright ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    } transform ${dailyTarot.isUpright ? 'rotate-0' : 'rotate-180'}">
                      ${dailyTarot.isUpright ? '正位' : '逆位'}
                    </span>
                  </div>

                  <div class="text-center font-sans">
                    <strong class="text-xs text-[#3a2829] block tracking-wide font-black">${card.name}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Descriptions Card text -->
        <div class="p-4 bg-[#faf6f5] rounded-2xl border border-[#eedddb] text-left">
          <p class="text-xs text-[#4a3536] leading-relaxed font-sans font-medium" id="tarot-explanation-box">
            ${state.isTarotFlipped 
              ? dailyTarot.reading 
              : "※ 請點擊前方牌背覆蓋的塔羅。神妙的引力波隨機數與儒略曆演算種子，正等待您的指尖觸發，翻牌閱讀今日靈魂守護指引。"
            }
          </p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="grid grid-cols-2 gap-3 mt-4">
        <button 
          onclick="app.onToggleTarotFlip()"
          class="py-2 px-4 rounded-xl text-xs text-center border bg-white border-[#ebdcd9] text-[#a66468] hover:bg-[#faf6f5] transition-all cursor-pointer font-sans font-bold"
        >
          ${state.isTarotFlipped ? "翻回牌背" : "翻轉塔羅"}
        </button>
        <button 
          onclick="app.onRefreshTarot()"
          class="py-2 px-4 rounded-xl text-xs text-center border border-white bg-[#a66468] text-white hover:bg-[#94575b] transition-all cursor-pointer font-sans font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          換牌重抽
        </button>
      </div>
    </div>
  `;
  safeCreateIcons();
}

// RENDERS THE MATHEMATICAL MOON PHASE CARD
function renderMoonPhaseCard() {
  const container = document.getElementById('moon-phase-card');
  if (!container) return;
  
  const { moonPhase } = dailyData;
  const isWaxing = moonPhase.svgPhaseOffset >= 0;
  const moonPath = getMoonPath(moonPhase.percentage, isWaxing);
  
  container.className = "bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden text-left";
  container.innerHTML = `
    <div class="absolute -top-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>

    <!-- Header -->
    <div class="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
      <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
        <i data-lucide="moon" class="w-5 h-5 animate-pulse"></i>
      </span>
      <div>
        <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日月相能量</h2>
        <p class="text-sm text-[#8a7274] mt-0.5">日月交輝引潮力 • 當前日期演算法計算</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
      
      <!-- Left: SVG Moon Graphic Sphere -->
      <div class="md:col-span-4 flex flex-col items-center justify-center">
        <div class="relative w-28 h-28 rounded-full bg-[#ebdcd9]/30 flex items-center justify-center p-1 border border-[#eedddb] overflow-hidden group">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            class="absolute inset-0 select-none overflow-hidden"
          >
            <defs>
              <radialGradient id="darkMoon" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stop-color="#e8dcda" />
                <stop offset="100%" stop-color="#dad0cd" />
              </radialGradient>
              <radialGradient id="litMoon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fffde7" />
                <stop offset="60%" stop-color="#fef08a" />
                <stop offset="90%" stop-color="#eab308" />
                <stop offset="100%" stop-color="#ca8a04" />
              </radialGradient>
              
              <pattern id="craterMap" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="28" cy="35" r="4" fill="#000000" fill-opacity="0.08" />
                <circle cx="29" cy="36" r="3.2" fill="#ffffff" fill-opacity="0.04" />
                
                <circle cx="45" cy="22" r="6" fill="#000000" fill-opacity="0.09" />
                <circle cx="46" cy="23" r="5" fill="#ffffff" fill-opacity="0.04" />
                
                <circle cx="70" cy="50" r="7.5" fill="#000000" fill-opacity="0.07" />
                <circle cx="71" cy="51" r="6.5" fill="#ffffff" fill-opacity="0.04" />
                
                <circle cx="35" cy="65" r="5" fill="#000000" fill-opacity="0.08" />
                <circle cx="60" cy="72" r="3.5" fill="#000000" fill-opacity="0.09" />
                <circle cx="50" cy="45" r="1.5" fill="#000000" fill-opacity="0.05" />
                
                <path d="M 20 50 Q 23 55 25 50" stroke="#000" stroke-width="0.5" stroke-opacity="0.1" fill="none" />
                <path d="M 55 30 Q 58 35 62 31" stroke="#000" stroke-width="0.5" stroke-opacity="0.08" fill="none" />
              </pattern>
            </defs>

            <!-- Draw shadow base -->
            <circle cx="50" cy="50" r="45" fill="url(#darkMoon)" />
            <circle cx="50" cy="50" r="45" fill="url(#craterMap)" opacity="0.3" />

            <!-- Draw illuminated phase part -->
            ${moonPhase.percentage > 1 ? `
              <path 
                d="${moonPath}" 
                fill="url(#litMoon)" 
                class="transition-all duration-700"
              />
            ` : ''}

            <!-- Overlay Craters over everything -->
            <circle cx="50" cy="50" r="45" fill="url(#craterMap)" style="mix-blend-mode: multiply;" class="opacity-80 pointer-events-none" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" stroke-width="0.5" stroke-opacity="0.1" />
          </svg>
          
          <!-- Outer Atmos glow -->
          <div class="absolute inset-0.5 rounded-full border border-yellow-200/5 shadow-[0_0_15px_rgba(254,240,138,0.06)] group-hover:scale-105 transition-all duration-1000 pointer-events-none"></div>
        </div>

        <div class="mt-3 text-center">
          <strong class="text-sm font-sans font-extrabold text-[#a66468] tracking-wider block">
            ${moonPhase.phaseChinese}
          </strong>
          <span class="text-[10px] text-[#8a7274] font-mono mt-0.5 uppercase tracking-wide font-bold block">
            ${moonPhase.phaseName}
          </span>
        </div>
      </div>

      <!-- Right: Numeric details and descriptive text -->
      <div class="md:col-span-8 flex flex-col justify-center text-left">
        <div class="grid grid-cols-3 gap-2 text-center border-b border-[#eedddb] pb-3 mb-3.5">
          <div class="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb]">
            <span class="text-[10px] text-[#8a7274] font-mono font-bold block scale-95 origin-center">月亮年齡</span>
            <strong class="text-xs font-mono text-[#3a2829] font-black mt-1 block">${moonPhase.age.toFixed(2)} 天</strong>
          </div>
          <div class="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb]">
            <span class="text-[10px] text-[#8a7274] font-mono font-bold block scale-95 origin-center">光照比</span>
            <strong class="text-xs font-mono text-[#3a2829] font-black mt-1 block">${moonPhase.percentage.toFixed(1)}%</strong>
          </div>
          <div class="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb]">
            <span class="text-[10px] text-[#8a7274] font-mono font-bold block scale-95 origin-center">黃道干擾</span>
            <strong class="text-xs font-mono text-[#a66468] font-black mt-1 block">${isWaxing ? "漸盈潮汐" : "漸虧引流"}</strong>
          </div>
        </div>

        <div class="p-3 bg-[#fcf8f7] border border-[#eedddb] rounded-xl relative overflow-hidden">
          <p class="text-xs text-[#4a3536] leading-relaxed font-sans pr-1">
            ${moonPhase.description}
          </p>
          <div class="mt-3 flex items-center gap-1.5 text-[10px] text-[#8a7274] pl-1 font-semibold">
            <i data-lucide="star" class="w-3 h-3 text-[#a66468]"></i>
            <span>依據儒略曆朔望週期演算法，金牛座專用月相。</span>
          </div>
        </div>
      </div>

    </div>
  `;
  safeCreateIcons();
}

// RENDERS THE WEEKLY FORECASTS TAB
function renderWeeklyTab(holder) {
  const { weeklyHoroscope, luckyData } = dailyData;
  const { trend } = weeklyHoroscope;
  
  // Custom SVG configurations for the graph plotting
  const width = 500;
  const height = 130;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const getX = (idx) => paddingLeft + (idx / 6) * chartWidth;
  const getY = (val) => {
    const minVal = 55;
    const maxVal = 100;
    const ratio = (val - minVal) / (maxVal - minVal);
    return paddingTop + chartHeight - (ratio * chartHeight);
  };
  
  // Metric configurations keys
  const metricConfigs = {
    overall: { label: "整體運勢", color: "#b45309", bg: "rgba(180, 83, 9, 0.4)" },
    love: { label: "桃花人緣", color: "#be185d", bg: "rgba(190, 24, 93, 0.4)" },
    career: { label: "事業學業", color: "#0369a1", bg: "rgba(3, 105, 161, 0.4)" },
    wealth: { label: "財富財帛", color: "#047857", bg: "rgba(4, 120, 87, 0.4)" }
  };
  
  const curMetric = state.activeMetric;
  const metricColor = metricConfigs[curMetric].color;
  
  // SVG points list generator
  const points = trend.map((day, idx) => `${getX(idx)} ${getY(day[curMetric])}`);
  const linePath = `M ${points.join(' L ')}`;
  const bottomY = paddingTop + chartHeight;
  const areaPath = `${linePath} L ${getX(6)} ${bottomY} L ${getX(0)} ${bottomY} Z`;
  const averageValue = (trend.reduce((sum, d) => sum + d[curMetric], 0) / trend.length).toFixed(0);
  
  // Bento display array configs
  const bentoItems = [
    { title: "幸運色系", value: luckyData.color, icon: "palette", isColor: true, colorHex: luckyData.colorHex, desc: "推薦今日穿搭、配件或屏保色系" },
    { title: "幸運數字", value: luckyData.number, icon: "binary", isNum: true, desc: "生活排序、隨時留意的幸運代碼" },
    { title: "開運水晶", value: luckyData.crystal, icon: "gem", desc: "淨化個人負電磁場的推薦載體" },
    { title: "守護植物", value: luckyData.plant, icon: "sprout", desc: "共振星象與大地之氣的生活綠植" },
    { title: "專屬香氛", value: luckyData.scent, icon: "wind", desc: "安撫五感、平緩呼吸的精油香調" },
    { title: "靈性場所", value: luckyData.place, icon: "compass", desc: "能讓你全然放慢靈魂腳步的空間" },
    { title: "和諧運動", value: luckyData.sport, icon: "activity", desc: "調理中樞經絡、排除情緒毒素的動作" },
    { title: "開運方位", value: luckyData.direction, icon: "navigation", desc: "今日出門會商、專注學習的最佳吉向" },
    { title: "幸運地點", value: luckyData.location, icon: "map-pin", desc: "引動今日幸運遇合的物理開胃座標" },
    { title: "黃金時段", value: luckyData.timeSlot, icon: "clock", desc: "最易進入專注心流、許願重整的良辰" }
  ];

  holder.innerHTML = `
    <!-- Weekly trend chart card -->
    <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden mb-8 text-left">
      <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eedddb] gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <i data-lucide="trending-up" class="w-5 h-5 animate-pulse"></i>
            </span>
            <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">本週運勢曲線</h2>
          </div>
          <p class="text-sm text-[#8a7274] mt-1">接下來 7 天動態星象能量趨勢疊加分析</p>
        </div>

        <!-- Metric selectors list -->
        <div class="flex flex-wrap p-1.5 bg-[#faf6f5] rounded-xl border border-[#eedddb] self-start shadow-xs">
          ${Object.keys(metricConfigs).map((k) => `
            <button
               onclick="app.onMetricChange('${k}')"
               class="px-3.5 py-1 text-[11px] font-sans font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                 state.activeMetric === k 
                   ? 'bg-[#be9f9d] text-white shadow-xs' 
                   : 'text-[#8a7274] hover:text-[#3a2829]'
               }"
            >
              ${metricConfigs[k].label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        <!-- Left Sub: Gorgeous SVG Area Line Chart -->
        <div class="lg:col-span-6 flex flex-col justify-between">
          <div class="bg-[#faf6f5] border border-[#eedddb] rounded-2xl p-4 relative overflow-hidden">
            <!-- legend metadata -->
            <div class="flex items-center justify-between mb-3 text-left">
              <span class="text-[9px] text-[#8a7274] uppercase tracking-widest font-mono font-bold">星相流走勢圖面</span>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${metricColor}"></span>
                <span class="text-[10px] text-[#3a2829] font-sans font-extrabold">
                  ${metricConfigs[curMetric].label} 7日均值：${averageValue}%
                </span>
              </div>
            </div>

            <!-- SVG Wrapper -->
            <div class="w-full overflow-visible relative">
              <svg viewBox="0 0 ${width} ${height}" width="100%" class="overflow-visible select-none">
                <defs>
                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${metricColor}" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="${metricColor}" stop-opacity="0" />
                  </linearGradient>
                </defs>

                <!-- Grid Horizontal guideline lines -->
                ${[100, 85, 70, 55].map((val) => `
                  <g>
                    <line 
                      x1="${paddingLeft}" 
                      y1="${getY(val)}" 
                      x2="${width - paddingRight}" 
                      y2="${getY(val)}" 
                      stroke="#eedddb" 
                      stroke-width="1" 
                      stroke-dasharray="4,4" 
                      stroke-opacity="0.8" 
                    />
                    <text 
                      x="${paddingLeft - 8}" 
                      y="${getY(val) + 3}" 
                      fill="#8a7274" 
                      class="text-[9px] font-mono font-bold text-right" 
                      text-anchor="end"
                    >
                      ${val}
                    </text>
                  </g>
                `).join('')}

                <!-- Shaded area beneath line -->
                <path d="${areaPath}" fill="url(#chartAreaGradient)" class="transition-all duration-700" />
                
                <!-- Main glowing curve path -->
                <path 
                  d="${linePath}" 
                  fill="none" 
                  stroke="${metricColor}" 
                  stroke-width="2.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="transition-all duration-700" 
                />

                <!-- Vertical mouse indicator line -->
                ${state.hoveredDayIndex !== null ? `
                  <line 
                    x1="${getX(state.hoveredDayIndex)}" 
                    y1="${paddingTop}" 
                    x2="${getX(state.hoveredDayIndex)}" 
                    y2="${bottomY}" 
                    stroke="#eedddb" 
                    stroke-width="1.2" 
                    stroke-opacity="0.6" 
                  />
                ` : ''}

                <!-- Anchor points and interactive mouse triggers -->
                ${trend.map((day, dIdx) => {
                  const cx = getX(dIdx);
                  const cy = getY(day[curMetric]);
                  const isHovered = state.hoveredDayIndex === dIdx;
                  
                  return `
                    <g class="cursor-pointer">
                      <!-- Inner dot background glow -->
                      <circle 
                        cx="${cx}" 
                        cy="${cy}" 
                        r="${isHovered ? 8 : 4.5}" 
                        fill="${metricColor}" 
                        fill-opacity="${isHovered ? 0.25 : 0.15}" 
                        class="transition-all duration-200" 
                      />
                      <!-- Standard anchor point dot -->
                      <circle 
                        cx="${cx}" 
                        cy="${cy}" 
                        r="${isHovered ? 4.5 : 2.5}" 
                        fill="${metricColor}" 
                        stroke="white" 
                        stroke-width="1.2" 
                        class="transition-all duration-200" 
                      />
                      <!-- Invisible wide cursor hover boundary -->
                      <circle 
                        cx="${cx}" 
                        cy="${cy}" 
                        r="14" 
                        fill="transparent" 
                        onmouseover="app.onHoverChartDay(${dIdx})" 
                        onmouseout="app.onHoverChartDay(null)" 
                      />
                    </g>
                  `;
                }).join('')}

                <!-- Axis Dates labels -->
                ${trend.map((day, dIdx) => `
                  <text 
                    x="${getX(dIdx)}" 
                    y="${height - 2}" 
                    fill="${state.hoveredDayIndex === dIdx ? '#a66468' : '#8a7274'}" 
                    class="text-[9px] font-sans font-extrabold transition-colors ${state.hoveredDayIndex === dIdx ? 'font-black' : 'font-semibold'}" 
                    text-anchor="middle"
                  >
                    ${day.dayName}
                  </text>
                `).join('')}

              </svg>
            </div>
          </div>

          <!-- Dynamic Tooltip Details Container -->
          <div class="bg-white border border-[#eedddb] rounded-xl p-3 text-xs flex justify-between items-center mt-3 shadow-xs" id="chart-tooltip-container">
             <!-- Tooltip text rendered on hovering -->
          </div>
        </div>

        <!-- Right Sub: Warnings & Auspices summary cards -->
        <div class="lg:col-span-6 flex flex-col justify-between gap-5 text-left">
          
          <!-- Best Core aspects -->
          <div class="bg-gradient-to-r from-emerald-50 via-[#faf6f5] to-transparent border border-emerald-200 rounded-2xl p-4.5">
            <div class="flex items-center gap-2 text-emerald-800 font-sans font-extrabold text-sm mb-2.5">
              <div class="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <i data-lucide="trophy" class="w-4 h-4"></i>
              </div>
              <span>本週核心開運位</span>
            </div>
            <strong class="text-xs text-emerald-950 block mb-1 font-sans font-extrabold">${weeklyHoroscope.weeklyBest}</strong>
            <p class="text-sm text-[#4a3536] leading-relaxed font-sans font-medium">
              ${weeklyHoroscope.weeklyBestDetails}
            </p>
          </div>

          <!-- Warning雷區 aspects -->
          <div class="bg-gradient-to-r from-rose-50 via-[#faf6f5] to-transparent border border-rose-200 rounded-2xl p-4.5">
            <div class="flex items-center gap-2 text-rose-800 font-sans font-extrabold text-sm mb-2.5">
              <div class="p-1.5 rounded-md bg-rose-100 text-rose-700">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
              <span>本週反思避坑雷區</span>
            </div>
            <strong class="text-xs text-rose-950 block mb-1 font-sans font-extrabold">${weeklyHoroscope.weeklyWarning}</strong>
            <p class="text-sm text-[#4a3536] leading-relaxed font-sans font-medium">
              ${weeklyHoroscope.weeklyWarningDetails}
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- Bento Grid Opening Assets -->
    <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden text-left" id="lucky-items-card">
      <div class="absolute -top-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <!-- Header -->
      <div class="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
        <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
          <i data-lucide="sparkles" class="w-5 h-5 animate-pulse"></i>
        </span>
        <div>
          <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日開運法寶清單</h2>
          <p class="text-sm text-[#8a7274] mt-0.5">每日幸運微調模組 • 對準今日最佳引力</p>
        </div>
      </div>

      <!-- Bento Grid cells block -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 text-left">
         ${bentoItems.map((cell) => {
           let innerCellDisplay = '';
           const displayValue = String(cell.value).replace(/\s*[\(（][^）\)]*[\)）]/g, '').trim();
           
           if (cell.isColor) {
             innerCellDisplay = `
               <div class="flex items-center gap-2 mt-1">
                 <span 
                   class="w-4 h-4 rounded-full border border-[#eedddb] flex-shrink-0 shadow-inner animate-pulse inline-block" 
                   style="background-color: ${cell.colorHex}"
                 ></span>
                 <strong class="text-xs font-sans font-bold text-[#3a2829] group-hover:text-[#a66468] transition-colors">
                   ${displayValue}
                 </strong>
               </div>
             `;
           } else if (cell.isNum) {
             innerCellDisplay = `
               <div class="flex items-baseline gap-1 mt-1">
                  <span class="text-2xl font-mono font-black text-[#a66468] tracking-tighter drop-shadow-sm">${displayValue}</span>
                  <span class="text-[10px] text-[#8a7274]">號</span>
               </div>
             `;
           } else {
             innerCellDisplay = `
               <div class="text-xs font-sans font-bold text-[#3a2829] group-hover:text-[#a66468] transition-colors leading-tight mt-1">
                 ${displayValue}
               </div>
             `;
           }

           return `
             <div class="bg-[#faf6f5] border border-[#f0e4e2] rounded-2xl p-4 flex flex-col justify-between hover:border-[#eedddb] hover:bg-white transition-all duration-300 group shadow-xs">
                <div>
                  <div class="flex items-center gap-1.5 text-[#8a7274] text-[10px] font-sans font-extrabold tracking-wider mb-2">
                     <i data-lucide="${cell.icon}" class="w-4 h-4 text-[#a66468]"></i>
                     <span>${cell.title}</span>
                  </div>
                  ${innerCellDisplay}
                </div>
                <p class="text-[9px] text-[#8a7274] leading-normal mt-3 border-t border-[#eedddb] pt-2 font-semibold">
                   ${cell.desc}
                </p>
             </div>
           `;
         }).join('')}
      </div>
    </div>
  `;
  
  // Render default chart tooltip
  renderChartTooltip();
  safeCreateIcons();
}

// Draw the specific indicator tooltip state
function renderChartTooltip() {
  const tooltipContainer = document.getElementById('chart-tooltip-container');
  if (!tooltipContainer) return;
  
  const idx = state.hoveredDayIndex;
  const trend = dailyData.weeklyHoroscope.trend;
  
  if (idx !== null && trend[idx]) {
    const d = trend[idx];
    tooltipContainer.innerHTML = `
      <div class="flex items-center justify-between w-full animate-fade-in font-sans">
        <span class="text-[#8a7274] flex items-center gap-1.5">
          📅 <strong class="text-[#3a2829] font-bold">${d.dayName} (${d.dateStr})指數度數</strong>：
        </span>
        <div class="flex gap-4">
          <span class="text-[#b45309] font-extrabold">整體: ${d.overall}%</span>
          <span class="text-[#be185d] font-extrabold">桃花: ${d.love}%</span>
          <span class="text-[#0369a1] font-extrabold">學業: ${d.career}%</span>
          <span class="text-[#047857] font-extrabold">財富: ${d.wealth}%</span>
        </div>
      </div>
    `;
  } else {
    tooltipContainer.innerHTML = `
      <p class="text-[10px] text-[#8a7274] italic flex items-center gap-1.5 w-full justify-center py-0.5 font-bold">
        <i data-lucide="eye" class="w-3.5 h-3.5"></i> Hover/滑鼠懸停於上方度數點，即可查看每日指標度數細節
      </p>
    `;
    safeCreateIcons();
  }
}

// RENDERS THE BIRTH ASTRO CHART WHEEL TAB
function renderBirthTab(holder) {
  holder.innerHTML = `
    <div class="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden text-left" id="birth-chart-card">
      <div class="absolute -top-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <!-- Header block -->
      <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#eedddb] gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <i data-lucide="compass" class="w-5 h-5 animate-spin-slow"></i>
            </span>
            <h2 class="text-xl font-sans font-bold text-[#3a2829] tracking-wider">先天個人占星出生盤</h2>
          </div>
          <p class="text-sm text-[#8a7274] mt-1">
            資料歸檔：${state.birthInfo.birthDate.replace(/-/g, '年')} ${state.birthInfo.birthTime} • ${state.birthInfo.birthPlace}
          </p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-extrabold shadow-xs">
            ☉ 太陽：${placements.sun.sign}
          </span>
          <span class="px-3 py-1 bg-[#fff1f2] text-[#f43f5e] border border-rose-200 rounded-full font-extrabold shadow-xs">
            ☽ 月亮：${placements.moon.sign}
          </span>
          <span class="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-extrabold shadow-xs">
            ⇪ 上升：${placements.ascendant.sign}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        <!-- Left: Concentric circles SVG Astrology wheel drawing frame -->
        <div class="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center" id="birth-wheel-holder">
           <!-- Rendered via isolated renderAstroWheel dynamic drawer -->
        </div>

        <!-- Right: Placements interactive annotations list -->
        <div class="lg:col-span-12 xl:col-span-7 flex flex-col justify-between" id="birth-placements-details-holder">
           <!-- Rendered via isolated renderBirthChartDetails dynamic drawer -->
        </div>

      </div>

    </div>
  `;
  
  // Call children micro drawers
  renderAstroWheel();
  renderBirthChartDetails();
}

// Core drawing formula for natal circles
function getWheelCoordinates(angle, radius, cx = 145, cy = 145) {
  // Convert angle offset by 90 to place Aries (0 deg) to Left-Top
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}

function getDegreeOnWheel(signName, degree) {
  const normName = signName.slice(0, 2);
  const idx = ["牡羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "水瓶", "雙魚"].findIndex(n => n.startsWith(normName));
  return (idx >= 0 ? idx : 0) * 30 + degree;
}

// Isolated drawing method for astrology circular wheel SVG of birth positions
function renderAstroWheel() {
  const holder = document.getElementById('birth-wheel-holder');
  if (!holder) return;
  
  const signs = [
    { name: "牡羊", start: 0 }, { name: "金牛", start: 30 }, { name: "雙子", start: 60 },
    { name: "巨蟹", start: 90 }, { name: "獅子", start: 120 }, { name: "處女", start: 150 },
    { name: "天秤", start: 180 }, { name: "天蠍", start: 210 }, { name: "射手", start: 240 },
    { name: "摩羯", start: 270 }, { name: "水瓶", start: 300 }, { name: "雙魚", start: 330 }
  ];

  const sunAngle = getDegreeOnWheel(placements.sun.sign, placements.sun.degree);
  const moonAngle = getDegreeOnWheel(placements.moon.sign, placements.moon.degree);
  const ascAngle = getDegreeOnWheel(placements.ascendant.sign, placements.ascendant.degree);
  const mcAngle = getDegreeOnWheel(placements.midheaven.sign, placements.midheaven.degree);
  
  const wheelPlacements = [
    { key: 'sun', label: `太陽${placements.sun.sign}`, deg: sunAngle, color: "#b45309", icon: '☉' },
    { key: 'moon', label: `月亮${placements.moon.sign}`, deg: moonAngle, color: "#be185d", icon: '☽' },
    { key: 'ascendant', label: `上升${placements.ascendant.sign}`, deg: ascAngle, color: "#047857", icon: 'ASC' },
    { key: 'midheaven', label: `天頂${placements.midheaven.sign}`, deg: mcAngle, color: "#0369a1", icon: 'MC' }
  ];

  holder.innerHTML = `
    <div class="relative w-[300px] h-[300px] bg-[#faf6f5] rounded-full border border-[#eedddb] shadow-xs p-2 flex items-center justify-center">
      <svg width="290" height="290" class="absolute select-none transform rotate-0 transition-transform duration-1000">
        
        <!-- Outer Concentric framework boundaries -->
        <circle cx="145" cy="145" r="140" fill="none" stroke="#eedddb" stroke-width="1.5" />
        <circle cx="145" cy="145" r="115" fill="none" stroke="#eedddb" stroke-opacity="0.5" stroke-width="1" />
        <circle cx="145" cy="145" r="90" fill="none" stroke="#be9f9d" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="2,3" />
        <circle cx="145" cy="145" r="10" fill="white" stroke="#be9f9d" stroke-width="1.5" />

        <!-- Draw astrological slices lines & text labels -->
        ${signs.map((s) => {
          const startCoord = getWheelCoordinates(s.start, 140);
          const endCoord = getWheelCoordinates(s.start, 115);
          const textCoord = getWheelCoordinates(s.start + 15, 126);
          
          return `
            <g>
              <line 
                x1="${startCoord.x}" 
                y1="${startCoord.y}" 
                x2="${endCoord.x}" 
                y2="${endCoord.y}" 
                stroke="#eedddb" 
                stroke-width="1" 
                stroke-opacity="0.8" 
              />
              <text 
                x="${textCoord.x}" 
                y="${textCoord.y}" 
                fill="#8a7274" 
                class="text-[10px] font-sans font-extrabold tracking-tighter" 
                text-anchor="middle" 
                dominant-baseline="middle"
              >
                ${s.name}
              </text>
            </g>
          `;
        }).join('')}

        <!-- Diagonal Houses boundary lines representation -->
        ${[0, 60, 120, 180, 240, 300].map((angle) => {
          const p1 = getWheelCoordinates(angle, 115);
          const p2 = getWheelCoordinates(angle + 180, 115);
          return `
            <line 
              x1="${p1.x}" 
              y1="${p1.y}" 
              x2="${p2.x}" 
              y2="${p2.y}" 
              stroke="#eedddb" 
              stroke-width="1" 
              stroke-opacity="0.3" 
            />
          `;
        }).join('')}

        <!-- Aspect Intercept line indicators -->
        <!-- Sun with Moon (Pink Dotted line) -->
        <path 
          d="M ${getWheelCoordinates(sunAngle, 90).x} ${getWheelCoordinates(sunAngle, 90).y} 
             L ${getWheelCoordinates(moonAngle, 90).x} ${getWheelCoordinates(moonAngle, 90).y}" 
          stroke="#db2777" 
          stroke-width="1.2" 
          stroke-opacity="0.6" 
          stroke-dasharray="2,2" 
        />
        <!-- ASC with MC (Emerald Solid line) -->
        <path 
          d="M ${getWheelCoordinates(ascAngle, 90).x} ${getWheelCoordinates(ascAngle, 90).y} 
             L ${getWheelCoordinates(mcAngle, 90).x} ${getWheelCoordinates(mcAngle, 90).y}" 
          stroke="#059669" 
          stroke-width="1.2" 
          stroke-opacity="0.6" 
        />

        <!-- Active Glowing placement dots -->
        ${wheelPlacements.map((p) => {
          const pt = getWheelCoordinates(p.deg, 100);
          const isSel = state.activePlanet === p.key;
          const labelPt = getWheelCoordinates(p.deg, 80);
          
          return `
            <g class="cursor-pointer" onclick="app.onSelectProfilePlanet('${p.key}')">
              ${isSel ? `
                <circle 
                  cx="${pt.x}" 
                  cy="${pt.y}" 
                  r="12" 
                  fill="none" 
                  stroke="${p.color}" 
                  stroke-width="10" 
                  class="animate-ping-slow" 
                  stroke-opacity="0.1" 
                />
              ` : ''}
              <circle 
                cx="${pt.x}" 
                cy="${pt.y}" 
                r="7" 
                fill="transparent" 
                stroke="${p.color}" 
                stroke-width="1.5" 
                stroke-opacity="${isSel ? 0.9 : 0.4}" 
              />
              <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="${p.color}" />
              <text 
                x="${labelPt.x}" 
                y="${labelPt.y + 1}" 
                fill="${isSel ? '#3a2829' : '#8a7274'}" 
                class="text-[10px] font-sans font-black text-center" 
                text-anchor="middle" 
                dominant-baseline="middle"
              >
                ${p.icon}
              </text>
            </g>
          `;
        }).join('')}

      </svg>

      <!-- Center information details bubble -->
      <div class="absolute flex flex-col items-center justify-center p-2 rounded-full bg-white border border-[#eedddb] text-center w-22 h-22 select-none shadow-xs">
        <i data-lucide="star" class="w-4 h-4 text-[#be9f9d] mb-0.5 animate-pulse"></i>
        <strong class="text-[10px] text-[#8a7274] font-mono tracking-tight block">${state.birthInfo.birthTime}</strong>
        <span class="text-[10px] text-[#a66468] font-sans font-extrabold mt-0.5 uppercase tracking-wider truncate max-w-[70px] block">
           ${state.birthInfo.birthPlace}
        </span>
      </div>
    </div>
    <span class="text-[#8a7274] text-[10px] font-sans font-bold mt-3">※ 點擊星盤上的標識點 (☉, ☽, ASC, MC) 可切換下方詳細解析</span>
  `;
  safeCreateIcons();
}

// Isolated drawing method for natal details descriptions (Right side of Birth tab)
function renderBirthChartDetails() {
  const container = document.getElementById('birth-placements-details-holder');
  if (!container) return;
  
  const p = placements[state.activePlanet];
  const title = state.activePlanet === 'sun' ? '太陽 (Sun)' 
    : state.activePlanet === 'moon' ? '月亮 (Moon)'
    : state.activePlanet === 'ascendant' ? '上升 (Ascendant)'
    : '天頂 (Midheaven)';
    
  const keyDetails = state.activePlanet === 'sun' ? '太陽（Sun）— 核心自我、意志與使命'
    : state.activePlanet === 'moon' ? '月亮（Moon）— 情緒渴望、安全感與本能'
    : state.activePlanet === 'ascendant' ? '上升（Ascendant）— 人生面具、第一印象與氣質'
    : '天頂（Midheaven）— 社會形象、志向與成就';

  const housesDetails = 'house' in p ? `宮位: <strong class="text-[#3a2829] font-bold">第 ${p.house} 宮</strong>` : '';

  container.className = "lg:col-span-12 xl:col-span-7 flex flex-col justify-between text-left";
  container.innerHTML = `
    <div>
      <!-- Planet buttons selectors -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        ${[
          { key: 'sun', label: `太陽${placements.sun.sign}`, icon: '☉', c: 'border-amber-300 bg-amber-50 text-amber-800' },
          { key: 'moon', label: `月亮${placements.moon.sign}`, icon: '☽', c: 'border-rose-300 bg-rose-50 text-rose-800' },
          { key: 'ascendant', label: `上升${placements.ascendant.sign}`, icon: 'ASC', c: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
          { key: 'midheaven', label: `天頂${placements.midheaven.sign}`, icon: 'MC', c: 'border-sky-300 bg-sky-50 text-sky-800' }
        ].map((item) => {
          const isAct = state.activePlanet === item.key;
          const styleClasses = isAct ? `${item.c} shadow-xs font-bold` : 'border-[#eedddb] text-[#8a7274] bg-[#faf6f5] hover:bg-white';
          
          return `
            <button 
              onclick="app.onSelectProfilePlanet('${item.key}')"
              class="py-2.5 px-1 border rounded-xl text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${styleClasses}"
            >
              <strong class="text-base font-extrabold mb-0.5 block">${item.icon}</strong>
              <span class="text-[11px] font-sans tracking-tight font-bold">${item.label}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Detailed text box -->
      <div class="bg-[#faf6f5] border border-[#eedddb] rounded-2xl p-4 min-h-[140px] relative overflow-hidden shadow-xs text-left animate-fade-in">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2.5 h-2.5 rounded-full inline-block ${
            state.activePlanet === 'sun' ? 'bg-amber-500' 
            : state.activePlanet === 'moon' ? 'bg-pink-500'
            : state.activePlanet === 'ascendant' ? 'bg-emerald-500'
            : 'bg-sky-500'
          }"></span>
          <h3 class="text-xs sm:text-xs font-sans font-bold text-[#3a2829]">
            ${keyDetails}
          </h3>
        </div>
        <div class="flex gap-4 mb-3 text-xs text-[#8a7274] font-semibold">
          <span>星座: <strong class="text-[#3a2829] font-bold">${p.sign}</strong></span>
          <span>精確度度數: <strong class="text-[#3a2829] font-bold">${p.degree}°</strong></span>
          ${housesDetails}
        </div>
        <p class="text-xs sm:text-xs text-[#4a3536] leading-relaxed font-sans font-medium">
          ${p.description}
        </p>
      </div>

    </div>

    <!-- Golden synthesis card panel -->
    <div class="mt-4 p-4 rounded-2xl bg-[#fcf8f7] border border-[#eedddb] text-left shadow-xs">
      <h4 class="text-sm font-sans font-extrabold text-[#a66468] flex items-center gap-1.5 mb-1.5">
        <i data-lucide="sparkles" class="w-4 h-4"></i>
        占星金三角融合解析 (Astro Synthesis)
      </h4>
      <p class="text-xs text-[#4a3536] leading-relaxed font-sans font-semibold font-bold">
        你是擁有獨特定力與稟賦的<strong>${placements.sun.sign}</strong>，內心深處蘊藏著名譽與物資豐饒的優雅力量（月亮${placements.moon.sign.replace("座", "")}），在外界交流、處事方面則展現出做事精細、條理分明的獨特風範（上升${placements.ascendant.sign.replace("座", "")}）。這組黃金金三角賦予你「精敏於細節，耕耘於長遠」的完美特質。在精神探索的遷移宮引導下，你可以隨時將日常感悟沉降成深刻的人生哲學之塔。
      </p>
    </div>
  `;
  safeCreateIcons();
}

// --- PROFILE MODAL CONTROLLERS ---

// Renders profile viewing vs editing mode
function renderProfileModal() {
  renderProfileModalContent();
}

function renderProfileModalContent() {
  const container = document.getElementById('profile-modal-content-container');
  if (!container) return;
  
  if (state.isEditingForm) {
    container.innerHTML = `
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#eedddb] mb-5 text-left">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-[#a66468]/15 text-[#a66468] border border-[#eedddb]/40">
            <i data-lucide="edit" class="w-4 h-4"></i>
          </span>
          <h3 class="text-lg font-sans font-black text-[#3a2829]">修改個人先天星像檔案</h3>
        </div>
        <button onclick="app.onCloseProfileModal()" class="text-[#8a7274] hover:text-[#3a2829] cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Edit Form block -->
      <form onsubmit="app.onSaveProfile(event)" class="space-y-4 text-xs font-sans">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col text-left">
            <label class="text-[#8a7274] font-bold mb-1">出生日期</label>
            <input 
              type="date" 
              id="edit-birth-date" 
              value="${state.tempBirthDate}" 
              required
              class="bg-white border border-[#eedddb] rounded-xl px-3 py-2.5 text-[#3a2829] font-mono focus:outline-none focus:border-[#a66468] [color-scheme:light]"
            />
          </div>
          <div class="flex flex-col text-left">
            <label class="text-[#8a7274] font-bold mb-1">出生精確時間</label>
            <input 
              type="time" 
              id="edit-birth-time" 
              value="${state.tempBirthTime}" 
              required
              class="bg-white border border-[#eedddb] rounded-xl px-3 py-2.5 text-[#3a2829] font-mono focus:outline-none focus:border-[#a66468] [color-scheme:light]"
            />
          </div>
        </div>

        <div class="flex flex-col text-left">
          <label class="text-[#8a7274] font-bold mb-1">出生城市 / 國家地區</label>
          <input 
            type="text" 
            id="edit-birth-place" 
            value="${state.tempBirthPlace}" 
            required
            placeholder="例如: 台灣台北"
            class="bg-white border border-[#eedddb] rounded-xl px-3 py-2.5 text-[#3a2829] focus:outline-none focus:border-[#a66468]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3 pb-2">
          <div class="flex flex-col text-left">
            <label class="text-[#8a7274] font-bold mb-1">地球地理緯度 (Latitude)</label>
            <input 
              type="number" 
              id="edit-birth-latitude" 
              value="${state.tempLatitude}" 
              step="any"
              required
              class="bg-white border border-[#eedddb] rounded-xl px-3 py-2.5 text-[#3a2829] font-mono focus:outline-none focus:border-[#a66468]"
            />
          </div>
          <div class="flex flex-col text-left">
            <label class="text-[#8a7274] font-bold mb-1">地球地理經度 (Longitude)</label>
            <input 
              type="number" 
              id="edit-birth-longitude" 
              value="${state.tempLongitude}" 
              step="any"
              required
              class="bg-white border border-[#eedddb] rounded-xl px-3 py-2.5 text-[#3a2829] font-mono focus:outline-none focus:border-[#a66468]"
            />
          </div>
        </div>

        <p class="text-[10px] text-[#8a7274] italic leading-normal border-t border-[#eedddb] pt-3 text-left font-semibold">
          ※ 提示：地理經緯度將用於精確矯正上升（ASC）及各宮位分位點，讓黃金金三角交互過境預測分析更具有天文可靠性。
        </p>

        <!-- Footer actions -->
        <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-[#eedddb]">
          <button 
            type="button"
            onclick="app.onToggleProfileEditMode(false)"
            class="px-4 py-2 bg-transparent text-[#8a7274] border border-[#ebdcd9] rounded-xl hover:bg-[#faf6f5] transition-all cursor-pointer font-bold"
          >
            取消修改
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-[#a66468] text-white hover:bg-[#925558] rounded-xl transition-all cursor-pointer font-extrabold shadow-sm"
          >
            儲存重算盤軌
          </button>
        </div>
      </form>
    `;
  } else {
    // Standard Viewing Mode
    container.innerHTML = `
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#eedddb] mb-5 text-left">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-[#a66265]/15 text-[#a66468] border border-[#eedddb]/40">
            <i data-lucide="user" class="w-4 h-4"></i>
          </span>
          <h3 class="text-lg font-sans font-black text-[#3a2829]">尊屬先天占星檔案卡</h3>
        </div>
        <button onclick="app.onCloseProfileModal()" class="text-[#8a7274] hover:text-[#3a2829] cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Information values cells list -->
      <div class="space-y-4 text-xs font-sans">
        <div class="grid grid-cols-2 gap-3 text-left">
          <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
            <span class="text-[10px] text-[#8a7274] font-bold block">先天出生日期</span>
            <strong class="text-sm font-mono text-[#3a2829] mt-1 block">${state.birthInfo.birthDate}</strong>
          </div>
          <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
            <span class="text-[10px] text-[#8a7274] font-bold block">精確出生時刻</span>
            <strong class="text-sm font-mono text-[#3a2829] mt-1 block">${state.birthInfo.birthTime} (地方時)</strong>
          </div>
        </div>

        <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl text-left">
          <span class="text-[10px] text-[#8a7274] font-bold block">出生省市國家</span>
          <strong class="text-sm text-[#3a2829] mt-1 block">${state.birthInfo.birthPlace}</strong>
        </div>

        <div class="grid grid-cols-2 gap-3 text-left">
          <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
            <span class="text-[10px] text-[#8a7274] font-bold block">觀測坐標緯度</span>
            <strong class="text-sm font-mono text-[#3a2829] mt-1 block">${state.birthInfo.latitude}° N</strong>
          </div>
          <div class="p-3 bg-[#faf6f5] border border-[#f0e4e2] rounded-xl">
            <span class="text-[10px] text-[#8a7274] font-bold block">觀測坐標經度</span>
            <strong class="text-sm font-mono text-[#3a2829] mt-1 block">${state.birthInfo.longitude}° E</strong>
          </div>
        </div>

        <!-- Natal summary triangle elements -->
        <div class="p-4 bg-[#fcf8f7] border border-[#eedddb] rounded-2xl text-left">
          <div class="text-xs text-[#a66468] font-black tracking-widest uppercase mb-2">★ 先天占星核心三端頂點 (Natal Core) ★</div>
          <div class="grid grid-cols-3 gap-2.5 text-center my-2.5">
             <div class="p-1.5 rounded-lg bg-amber-50 text-amber-900 font-extrabold border border-amber-200">
               ☉ 太陽金牛
             </div>
             <div class="p-1.5 rounded-lg bg-rose-50 text-rose-900 font-extrabold border border-rose-200">
               ☽ 月亮天秤
             </div>
             <div class="p-1.5 rounded-lg bg-emerald-50 text-emerald-900 font-extrabold border border-emerald-200">
               ⇪ 上升處女
             </div>
          </div>
          <p class="text-[11px] text-[#8a7274] leading-relaxed font-semibold">
            此黃金金三角決定了您踏實、優雅而條理分明的基本命理輪廓。如需在其他日期進行天體干涉運算，可點擊下方進行修改。
          </p>
        </div>

        <!-- Footer actions view mode -->
        <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-[#eedddb]">
          <button 
            type="button"
            onclick="app.onCloseProfileModal()"
            class="px-4 py-2 bg-transparent text-[#8a7274] border border-[#ebdcd9] rounded-xl hover:bg-[#faf6f5] transition-all cursor-pointer font-bold"
          >
            關閉面卡
          </button>
          <button 
            type="button"
            onclick="app.onToggleProfileEditMode(true)"
            class="px-4 py-2 bg-[#a66468] text-white hover:bg-[#925558] rounded-xl transition-all cursor-pointer font-extrabold shadow-sm flex items-center gap-1"
          >
            <i data-lucide="edit" class="w-3.5 h-3.5"></i>
            修改檔案檔案
          </button>
        </div>
      </div>
    `;
  }
  safeCreateIcons();
}

// Update Top level Header Placements metadata
function renderHeaderPlacements() {
  const subText = document.getElementById('header-subtitle-placements');
  const triggerText = document.getElementById('trigger-btn-place');
  
  if (subText) {
    subText.innerHTML = `太陽${placements.sun.sign} • 月亮${placements.moon.sign} • 上升${placements.ascendant.sign}`;
  }
  if (triggerText) {
    triggerText.innerHTML = state.birthInfo.birthPlace;
  }
}

// --- INITIALIZE BOOT PROCESS ---

// Global App reference block for html onclick bindings
window.app = {
  onTabChange(tab) {
    state.activeTab = tab;
    if (tab === 'daily') {
      state.isTarotFlipped = false;
    }
    renderTabs();
    renderActiveTabContent();
  },
  
  onAdjustDate(days) {
    const newDate = new Date(state.targetDate);
    newDate.setDate(state.targetDate.getDate() + days);
    state.targetDate = newDate;
    
    recalculateDailyData();
    renderDateDeck();
    renderActiveTabContent();
  },
  
  onTodayDate() {
    state.targetDate = new Date('2026-05-25');
    
    recalculateDailyData();
    renderDateDeck();
    renderActiveTabContent();
  },
  
  onSpecificDate(dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      state.targetDate = parsed;
      
      recalculateDailyData();
      renderDateDeck();
      renderActiveTabContent();
    }
  },
  
  onToggleTarotFlip() {
    state.isTarotFlipped = !state.isTarotFlipped;
    renderTarotSection();
  },
  
  onRefreshTarot() {
    state.isTarotFlipped = false;
    recalculateDailyData();
    // Micro wait to allow card flip transition back before rendering newly drawn card
    setTimeout(() => {
      renderTarotSection();
    }, 150);
  },
  
  onTarotImageError() {
    state.tarotImageError = true;
    renderTarotSection();
  },
  
  onMetricChange(metric) {
    state.activeMetric = metric;
    renderWeeklySection();
  },
  
  onHoverChartDay(idx) {
    state.hoveredDayIndex = idx;
    renderChartTooltip();
  },
  
  onSelectProfilePlanet(planet) {
    state.activePlanet = planet;
    if (state.activeTab === 'birth') {
      renderAstroWheel();
      renderBirthChartDetails();
    }
  },
  
  onOpenProfileModal() {
    state.tempBirthDate = state.birthInfo.birthDate;
    state.tempBirthTime = state.birthInfo.birthTime;
    state.tempBirthPlace = state.birthInfo.birthPlace;
    state.tempLatitude = state.birthInfo.latitude;
    state.tempLongitude = state.birthInfo.longitude;
    state.isEditingForm = false;
    state.showProfileModal = true;
    
    renderProfileModal();
    const overlay = document.getElementById('profile-modal-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  },
  
  onCloseProfileModal() {
    state.showProfileModal = false;
    state.isEditingForm = false;
    
    const overlay = document.getElementById('profile-modal-overlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  },
  
  onToggleProfileEditMode(isEdit) {
    state.isEditingForm = isEdit;
    renderProfileModalContent();
  },
  
  onSaveProfile(e) {
    e.preventDefault();
    state.birthInfo.birthDate = document.getElementById('edit-birth-date').value;
    state.birthInfo.birthTime = document.getElementById('edit-birth-time').value;
    state.birthInfo.birthPlace = document.getElementById('edit-birth-place').value;
    state.birthInfo.latitude = parseFloat(document.getElementById('edit-birth-latitude').value) || 25.03;
    state.birthInfo.longitude = parseFloat(document.getElementById('edit-birth-longitude').value) || 121.56;
    
    // Recalculate placements based on newly customized profile values
    placements = calculateAstrologicalPlacements(state.birthInfo);
    recalculateDailyData();
    
    // Refresh templates
    renderHeaderPlacements();
    renderIntro();
    renderActiveTabContent();
    
    // Close modal
    this.onCloseProfileModal();
  },
  
  onToggleIntro(show) {
    state.showIntro = show;
    renderIntro();
  },
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Listen scroll events to toggle floating back-to-top button
window.addEventListener('scroll', () => {
  const btn = document.getElementById('floating-back-to-top-btn');
  if (btn) {
    if (window.scrollY > 400) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  }
});

// Shortcut alias of weekly render block
function renderWeeklySection() {
  const holder = document.getElementById('tab-contents-holder');
  if (holder) {
    renderWeeklyTab(holder);
  }
}

// MAIN PAGE LOADER BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
  // 1. Estimate natal profile positions
  placements = calculateAstrologicalPlacements(state.birthInfo);
  // 2. Build targetDate forecasts indices
  recalculateDailyData();
  
  // 3. Draw entire app DOM templates
  renderHeaderPlacements();
  renderIntro();
  renderDateDeck();
  renderTabs();
  renderActiveTabContent();
  
  // 4. Initialise Lucide SVGs
  safeCreateIcons();
});
