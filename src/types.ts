/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BirthInfo {
  birthDate: string; // "2003-05-12"
  birthTime: string; // "13:13"
  birthPlace: string; // "台灣台北"
  latitude: number; // 25.03
  longitude: number; // 121.56
}

export interface AstrologicalPlacements {
  sun: { sign: string; degree: number; house: number; description: string };
  moon: { sign: string; degree: number; house: number; description: string };
  ascendant: { sign: string; degree: number; description: string };
  midheaven: { sign: string; degree: number; description: string };
  houses: { number: number; sign: string; degree: number }[];
}

export interface TarotCard {
  id: string;
  name: string;
  type: 'major' | 'minor';
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
  mysticSymbol: string;
}

export interface DailyTarotReading {
  card: TarotCard;
  isUpright: boolean;
  reading: string;
}

export interface DailyAstroNews {
  moodKeyword: string;
  moodValue: number; // 1-100%
  luckyMatchSign: string;
  unluckyMatchSign: string;
  recommendedToDos: string[];
  wisdomQuote: string;
}

export interface MoonPhaseData {
  age: number; // 0 to 29.53
  phaseName: string;
  phaseChinese: string;
  percentage: number; // illumination %
  svgPhaseOffset: number; // value for drawing
  description: string;
}

export interface WeeklyLuckTrend {
  dayName: string;
  dateStr: string;
  overall: number; // 1-100
  love: number; // 1-100
  career: number; // 1-100
  wealth: number; // 1-100
}

export interface WeeklyHoroscope {
  trend: WeeklyLuckTrend[];
  weeklyBest: string;
  weeklyBestDetails: string;
  weeklyWarning: string;
  weeklyWarningDetails: string;
}

export interface LuckyItems {
  color: string;
  colorHex: string;
  number: number;
  crystal: string;
  plant: string;
  scent: string;
  place: string;
  sport: string;
  direction: string;
  location: string;
  timeSlot: string;
}
