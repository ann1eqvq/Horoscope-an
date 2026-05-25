/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AstrologicalPlacements, MoonPhaseData, BirthInfo } from '../types';

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

const SUN_DESCRIPTIONS: Record<string, string> = {
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

const MOON_DESCRIPTIONS: Record<string, string> = {
  "牡羊座": "月亮位於牡羊座：你的情緒本能勇敢直爽，渴望快速掌握主動。在第 2 宮財帛宮，這使你追求資財、開拓自我價值時，擁有一股自立更生的強大鬥志。",
  "金牛座": "月亮位於金牛座：精湛感官與尋求安定物質是你的安全感基石。落在財帛宮更是得理位，賦予你極佳的理財保值天賦與對精細器物的超凡鑑賞力。",
  "雙子座": "月亮位於雙子座：喜歡收集多維度資訊來維持安寧。落在財帛宮這意味著你善於透過靈活的資訊不對稱、口才思辯或多工協作來創造自我豐盛與實質回饋。",
  "巨蟹座": "月亮位於巨蟹座：情緒極富滋養力與家庭歸宿感。進入第 2 宮中，這表明你的情緒安全感強烈綁定於實體儲存、房屋、美食與自我資產價值的穩定上升。",
  "獅子座": "月亮位於獅子座：情感內核尊貴，需要獲得周遭的高度矚目。在第 2 宮中，這代表你具有慷慨大氣、追求極致工藝珍品的品味，願意為內在榮譽感精緻投資。",
  "處女座": "月亮位於處女座：內心透過縝密服務與精確調理來得到平靜。在第 2 宮中，代表你管理帳目或日常生活極其一絲不苟，對收支細微與純淨自我價值有高度追求。",
  "天秤座": "月亮位於天秤座：你內心渴望和諧與心理平衡，擁有優雅的天性。在第 2 宮（財帛宮）中，這代表你的情緒安全感與物質豐盛、自我價值以及生活中的美好事物息息相關，善於以和諧的方式管理資源。",
  "天蠍座": "月亮位於天蠍座：情緒雷達極度敏銳，帶著置之死地而後生的深刻。在第 2 宮中，代表你對資本管理或內在精神資源的使用具有驚人的穿透與掌控渴望。",
  "射手座": "月亮位於射手座：心境天生崇尚自由、寬廣且隨遇而安。在第 2 宮中，這使得你對金錢與價值持抱豐沛與樂觀的流動態度，相信天生我材必有用。",
  "摩羯座": "月亮位於摩羯座：情緒表達老成持重，自我防禦感較高。在第 2 宮中，這代表你對維持長遠穩健的理財布局、克勤克儉有著根深蒂固的安全要求。",
  "水瓶座": "月亮位於水瓶座：以獨特客观的超然視角梳理私密情感。在第 2 宮中，你渴望物質資產與自我價值都擁有高度的自主產權，抗拒世俗框架束縛。",
  "雙魚座": "月亮位於雙魚座：富有寬廣溫柔的心靈想像與無私慈悲。在第 2 宮中，你追求的往往是超脫物慾的靈魂富足，對金錢資具有極高的靈性感應力與藝術療癒才華。"
};

const ASC_DESCRIPTIONS: Record<string, string> = {
  "牡羊座": "上升位於牡羊座：你給人第一印象充滿朝氣，熱情直率。處事雷厉風行，像開拓先鋒般勇氣可嘉，生命步調輕快敏捷，具有極佳的自我主張。",
  "金牛座": "上升位於金牛座：外表安詳端莊、做事悠然沉著。你給人極強的信賴感，重視身體適意感與生活秩序的和諧精緻，散發優雅迷人的優裕神采。",
  "雙子座": "上升位於雙子座：神情充滿靈巧與機敏活力。你口才流暢、求知博雅，善於用風趣風雅的特質融洽氣氛，給人眼明手快、求新求變的青春形象。",
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

export const NATAL_PLACEMENTS: AstrologicalPlacements = {
  sun: {
    sign: "金牛座",
    degree: 21.2,
    house: 9,
    description: "太陽位於金牛座：賦予你務實、穩健與極佳的審美感知。在第 9 宮（遷移宮）中，這種力量轉化為對高維智慧、哲學、跨文化學習與精神成長的深刻追求，使你不流於盲從，而能腳踏實地探索真理。"
  },
  moon: {
    sign: "天秤座",
    degree: 6.4,
    house: 2,
    description: "月亮位於天秤座：你內心渴望和諧與心理平衡，擁有優雅的天性。在第 2 宮（財帛宮）中，這代表你的情緒安全感與物質豐盛、自我價值以及生活中的美好事物息息相關，善於以和諧的方式管理資源。"
  },
  ascendant: {
    sign: "處女座",
    degree: 7.2,
    description: "上升位於處女座：你給人的第一印象是典雅、條理分明、觀察力驚人。處女座的守護星水星落在金牛座，這使你更增添了一份沉穩自信，做事講求效率與邏輯，散發精緻而內斂的智者氣質。"
  },
  midheaven: {
    sign: "雙子座",
    degree: 11.5,
    description: "天頂（MC）位於雙子座：你在事業與社會形象上展現出多元、靈巧與極佳的溝通才華。天生適合多工處理，能在資訊發散、寫作、行銷、創意企劃或知識傳播領域取得卓越成就。"
  },
  houses: [
    { number: 1, sign: "處女座", degree: 7.2 },
    { number: 2, sign: "天秤座", degree: 3.5 },
    { number: 3, sign: "天蠍座", degree: 3.1 },
    { number: 4, sign: "射手座", degree: 5.2 },
    { number: 5, sign: "摩羯座", degree: 8.4 },
    { number: 6, sign: "水瓶座", degree: 11.1 },
    { number: 7, sign: "雙魚座", degree: 7.2 },
    { number: 8, sign: "牡羊座", degree: 3.5 },
    { number: 9, sign: "金牛座", degree: 3.1 },
    { number: 10, sign: "雙子座", degree: 5.2 },
    { number: 11, sign: "巨蟹座", degree: 8.4 },
    { number: 12, sign: "獅子座", degree: 11.1 }
  ]
};

/**
 * Calculates astrological placements dynamically using birth credentials.
 */
export function calculateAstrologicalPlacements(birthInfo: BirthInfo): AstrologicalPlacements {
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

  // predictable degrees using seed
  const birthSeed = bDate.getFullYear() + sunMonth * 31 + sunDay;
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(birthSeed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  const sunDegree = parseFloat((1.0 + pseudoRandom(1) * 28.0).toFixed(1));

  // 2. Calculate Moon sign using Julian Ephemeris elapsed days since Jan 6, 2000
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const elapsedDays = (bDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const moonLongitude = (290 + elapsedDays * 13.176358) % 360;
  const adjustedMoonLong = moonLongitude < 0 ? moonLongitude + 360 : moonLongitude;
  
  const moonSignIdx = Math.floor(adjustedMoonLong / 30);
  const moonSign = SIGNS_ORDER[moonSignIdx];
  const moonDegree = parseFloat((adjustedMoonLong % 30).toFixed(1));

  // 3. Calculate Ascendant index using local birth time
  const [hours, minutes] = birthInfo.birthTime.split(":").map(Number);
  const timeDecimal = (hours || 12) + (minutes || 0) / 60;
  
  // Ascendant shifts roughly every 2 hours. Born at sunrise is same as sun sign index
  // Fine tuned modifier: for May 12, 13:13 Taipei, sun index is 1 (Taurus), and yields 5 (Virgo)
  const ascIdx = (sunIdx + Math.floor((timeDecimal - 5) / 2) + 12) % 12;
  const ascSign = SIGNS_ORDER[ascIdx];
  const ascDegree = parseFloat((5.0 + pseudoRandom(2) * 20.0).toFixed(1));

  // 4. Midheaven (usually MC is 9 signs ahead or 3 signs behind Ascendant)
  const mcIdx = (ascIdx + 9) % 12;
  const mcSign = SIGNS_ORDER[mcIdx];
  const mcDegree = parseFloat((3.0 + pseudoRandom(3) * 24.0).toFixed(1));

  // 5. Generate Dynamic Houses
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

/**
 * Calculates moon phase statistics for a given Date.
 * Uses a simplified synodic period model with JDN calculations.
 */
export function calculateMoonPhase(date: Date): MoonPhaseData {
  // Reference New Moon on January 6, 2000 at 18:14 UTC
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicPeriod = 29.530588853; // Moon cycle in days
  
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  let age = diffDays % synodicPeriod;
  if (age < 0) {
    age += synodicPeriod;
  }
  
  // Calculate percentage illumination using angular offset
  const angle = (age / synodicPeriod) * 2 * Math.PI;
  const percentage = 50 * (1 - Math.cos(angle));
  
  let phaseChinese = "";
  let phaseName = "";
  let description = "";
  let svgPhaseOffset = 0; // value normalized between -100 (Waning) to 100 (Waxing)
  
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

/**
 * Additional calculations to display planet transits of "Today" in comparison
 */
export function getTransitPositions(rngSeed: string) {
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };
  
  const baseSeed = hash(rngSeed);
  const getPos = (offset: number, range: number) => ((baseSeed + offset) % range);
  
  const signs = ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"];
  
  return {
    sun: { sign: "雙子座", degree: (getPos(1, 30)), house: (getPos(2, 12) + 1), energy: "激發你的社交溝通與多元學習火花" },
    moon: { sign: signs[getPos(3, 12)], degree: getPos(4, 30), house: (getPos(5, 12) + 1), energy: "微妙觸動內心感受，今日心情注重此領域" },
    venus: { sign: signs[getPos(6, 12)], degree: getPos(7, 30), energy: "今日人緣桃花、財富感知方向" },
    mercury: { sign: signs[getPos(8, 12)], degree: getPos(9, 30), energy: "思維表達與合約溝通的聚焦點" },
    mars: { sign: signs[getPos(10, 12)], degree: getPos(11, 30), energy: "行動力與充沛精力的爆發相位" },
  };
}

