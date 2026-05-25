/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyAstroNews, DailyTarotReading, LuckyItems, MoonPhaseData, WeeklyHoroscope, WeeklyLuckTrend, AstrologicalPlacements } from '../types';
import { calculateMoonPhase } from './astroUtils';
import { SeededRNG, getSeedForDate } from './seedUtils';
import {
  TAROT_DECK,
  MOOD_KEYWORDS,
  CONSTELLATIONS,
  RECOMMENDED_DOS_TAURUS,
  DAILY_WISDOM_QUOTES,
  CRYSTALS,
  PLANTS,
  SCENTS,
  PLACES,
  SPORTS,
  DIRECTIONS,
  LOCATIONS,
  TIME_SLOTS,
  COLORS,
  WEEKLY_BEST_POOL,
  WEEKLY_WARNING_POOL
} from '../config/astrologyData';

/**
 * Generates all customized daily data based on seed date and natal placements.
 */
export function generateDailyAstrologyData(date: Date, placements?: AstrologicalPlacements): {
  tarot: DailyTarotReading;
  astroNews: DailyAstroNews;
  moonPhase: MoonPhaseData;
  weeklyHoroscope: WeeklyHoroscope;
  luckyItems: LuckyItems;
} {
  const seed = getSeedForDate(date);
  const rng = new SeededRNG(seed);
  
  const sunSign = placements?.sun.sign || "金牛座";
  const moonSign = placements?.moon.sign || "天秤座";
  const ascSign = placements?.ascendant.sign || "處女座";

  // 1. Daily Tarot Card Draw
  const tarotCard = rng.pick(TAROT_DECK);
  const isUpright = rng.next() > 0.25; // 75% chance of upright card for encouragement
  
  // Elaborate a specific customized interpretation
  const cardInfluence = isUpright ? tarotCard.uprightMeaning : tarotCard.reversedMeaning;
  const orientationStr = isUpright ? "正位" : "逆位";
  
  // Custom interpretation based on their natal chart
  const tarotReading = `今日為你抽出的塔羅牌是【${tarotCard.name} (${orientationStr})】。${cardInfluence}\n\n這張牌深深共振了你今日的星盤：你太陽落在${sunSign}，向來有著獨特的意志力與魅力，但今日在「${tarotCard.name}」的能量引導下，此牌${orientationStr}的奧義正引領你做出內省。${
    isUpright
      ? `這是一股飽滿、順遂的支持力。它鼓勵你敞開你月亮${moonSign.replace("座", "")}的和諧特質，不要過度固步自封。若遇到瓶頸，你上升${ascSign.replace("座", "")}的細部精細與敏銳分析能幫你精確落實卡牌提示。大膽伸開雙手迎接宇宙的禮贈，尤其是在生活成長或身心修整方面，會有著顯著的正向顯化。`
      : `這暗示有些過度執念或腳步凌亂。它提醒你太陽落在${sunSign}容易有特定的固執、或是因月亮${moonSign.replace("座", "")}而顯得有些由移不決。今日切忌草率做出大筆支出或意氣用事。請發揮你上升${ascSign.replace("座", "")}「追求秩序與省思」的本能，靜下心慢下腳步，把日常繁瑣雜物與思緒理順，就能避開不必要的浮躁雷區。`
  }`;

  const tarot: DailyTarotReading = {
    card: tarotCard,
    isUpright,
    reading: tarotReading
  };

  // 2. Daily Astro News
  const moodKeyword = rng.pick(MOOD_KEYWORDS);
  const moodValue = rng.nextInt(75, 98);
  
  // pick relationship signs (ensure different from owner and each other)
  const signsFiltered = CONSTELLATIONS.filter(s => s !== sunSign);
  const luckyMatchSign = rng.pick(signsFiltered);
  const unluckyMatchSign = rng.pick(signsFiltered.filter(s => s !== luckyMatchSign));
  
  const recommendedToDos = rng.pickMultiple(RECOMMENDED_DOS_TAURUS, 3);
  const wisdomQuote = rng.pick(DAILY_WISDOM_QUOTES);

  const astroNews: DailyAstroNews = {
    moodKeyword,
    moodValue,
    luckyMatchSign,
    unluckyMatchSign,
    recommendedToDos,
    wisdomQuote
  };

  // 3. Moon Phase Data Calculation
  const moonPhase = calculateMoonPhase(date);

  // 4. Weekly Horoscope (7 Days starting from `date`)
  const trend: WeeklyLuckTrend[] = [];
  const weekDays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + i);
    const fSeed = getSeedForDate(futureDate);
    const fRng = new SeededRNG(fSeed);
    
    const dayIndex = futureDate.getDay();
    const dayLabel = weekDays[dayIndex];
    const dateStr = `${futureDate.getMonth() + 1}/${futureDate.getDate()}`;
    
    // Calculate values stable to each day's seed
    trend.push({
      dayName: i === 0 ? "今日" : dayLabel,
      dateStr,
      overall: fRng.nextInt(70, 95),
      love: fRng.nextInt(65, 96),
      career: fRng.nextInt(70, 97),
      wealth: fRng.nextInt(68, 98)
    });
  }

  const bestChoice = rng.pick(WEEKLY_BEST_POOL);
  const warningChoice = rng.pick(WEEKLY_WARNING_POOL);

  const weeklyHoroscope: WeeklyHoroscope = {
    trend,
    weeklyBest: bestChoice.best,
    weeklyBestDetails: bestChoice.details,
    weeklyWarning: warningChoice.warning,
    weeklyWarningDetails: warningChoice.details
  };

  // Helper function to remove redundant parenthetical descriptions
  const cleanParentheses = (str: string): string => {
    return str.replace(/\s*[\(\（][^\)\）]*[\)\）]/g, "").trim();
  };

  // 5. Lucky Items List
  const colorObj = rng.pick(COLORS);
  const number = rng.nextInt(1, 99);
  const crystal = rng.pick(CRYSTALS);
  const plant = rng.pick(PLANTS);
  const scent = rng.pick(SCENTS);
  const place = rng.pick(PLACES);
  const sport = rng.pick(SPORTS);
  const direction = rng.pick(DIRECTIONS);
  const location = rng.pick(LOCATIONS);
  const timeSlot = rng.pick(TIME_SLOTS);

  const luckyItems: LuckyItems = {
    color: colorObj.name,
    colorHex: colorObj.hex,
    number,
    crystal: cleanParentheses(crystal),
    plant: cleanParentheses(plant),
    scent: cleanParentheses(scent),
    place: cleanParentheses(place),
    sport: cleanParentheses(sport),
    direction: cleanParentheses(direction),
    location: cleanParentheses(location),
    timeSlot: cleanParentheses(timeSlot)
  };

  return {
    tarot,
    astroNews,
    moonPhase,
    weeklyHoroscope,
    luckyItems
  };
}
