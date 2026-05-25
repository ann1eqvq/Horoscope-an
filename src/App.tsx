/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { generateDailyAstrologyData } from './utils/dataGenerator';
import { getTransitPositions, calculateAstrologicalPlacements } from './utils/astroUtils';
import BirthChartCard from './components/BirthChartCard';
import DailyTarot from './components/DailyTarot';
import DailyAstroNewsComponent from './components/DailyAstroNews';
import MoonPhaseCard from './components/MoonPhaseCard';
import WeeklyHoroscope from './components/WeeklyHoroscope';
import LuckyList from './components/LuckyList';
import { BirthInfo } from './types';
import { 
  Calendar, 
  Sparkles, 
  Compass, 
  MapPin, 
  Clock, 
  User, 
  TrendingUp, 
  HelpCircle,
  Gem,
  ArrowRight,
  RefreshCw,
  X,
  Edit2,
  Save,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Birth state initialized with the user's details
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    birthDate: "2003-05-12",
    birthTime: "13:13",
    birthPlace: "台北",
    latitude: 25.03,
    longitude: 121.56
  });

  // Calculate placements dynamically based on Birth state
  const [placements, setPlacements] = useState(() => calculateAstrologicalPlacements(birthInfo));

  // Initialize targetDate to May 25, 2026 (or standard base)
  const [targetDate, setTargetDate] = useState<Date>(new Date('2026-05-25'));
  const [activeTab, setActiveTab] = useState<'daily' | 'birth' | 'weekly'>('daily');
  const [showIntro, setShowIntro] = useState(true);

  // Modal display controllers
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState(birthInfo.birthDate);
  const [tempBirthTime, setTempBirthTime] = useState(birthInfo.birthTime);
  const [tempBirthPlace, setTempBirthPlace] = useState(birthInfo.birthPlace);
  const [tempLatitude, setTempLatitude] = useState(birthInfo.latitude);
  const [tempLongitude, setTempLongitude] = useState(birthInfo.longitude);
  const [isEditingForm, setIsEditingForm] = useState(false);

  // Force re-generating astrology data when date shifts or placements are updated
  const [dailyData, setDailyData] = useState(() => generateDailyAstrologyData(targetDate, placements));
  const [transitData, setTransitData] = useState(() => getTransitPositions(targetDate.toISOString().slice(0, 10)));

  useEffect(() => {
    const nextPlacements = calculateAstrologicalPlacements(birthInfo);
    setPlacements(nextPlacements);
    setDailyData(generateDailyAstrologyData(targetDate, nextPlacements));
    setTransitData(getTransitPositions(targetDate.toISOString().slice(0, 10)));
  }, [birthInfo, targetDate]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(targetDate);
    newDate.setDate(targetDate.getDate() + days);
    setTargetDate(newDate);
  };

  const setSpecificDate = (dateStr: string) => {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      setTargetDate(parsed);
    }
  };

  // Open profile trigger to sync temp inputs
  const handleOpenProfileModal = () => {
    setTempBirthDate(birthInfo.birthDate);
    setTempBirthTime(birthInfo.birthTime);
    setTempBirthPlace(birthInfo.birthPlace);
    setTempLatitude(birthInfo.latitude);
    setTempLongitude(birthInfo.longitude);
    setIsEditingForm(false);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setBirthInfo({
      birthDate: tempBirthDate,
      birthTime: tempBirthTime,
      birthPlace: tempBirthPlace,
      latitude: Number(tempLatitude) || 25.03,
      longitude: Number(tempLongitude) || 121.56
    });
    setIsEditingForm(false);
    setShowProfileModal(false);
  };

  // Human-friendly formatted target date for display
  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${yyyy} 年 ${mm} 月 ${dd} 日 (${weekDays[d.getDay()]})`;
  };

  const handleRefreshSeed = () => {
    setDailyData(generateDailyAstrologyData(targetDate, placements));
  };

  return (
    <div className="min-h-screen bg-[#f5ecea] text-[#4a3a3b] font-sans selection:bg-[#be9f9d]/30 selection:text-[#5a4648] relative overflow-x-hidden" id="app-container">
      {/* Dynamic Stardust Background Panels */}
      <div className="absolute inset-0 bg-[radial-gradient(#be9f9d_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.22] pointer-events-none" />
      
      {/* High-End Planetary Nebulous Glass Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#be9f9d]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-[#aba1b8]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#be9f9d]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Sparkle Animation */}
      <div className="absolute top-20 left-[15%] text-[#be9f9d]/50 pointer-events-none text-sm font-mono animate-pulse-slow">✦</div>
      <div className="absolute top-1/3 right-[12%] text-[#be9f9d]/40 pointer-events-none text-xs font-mono animate-pulse-slow">✦</div>
      <div className="absolute bottom-1/4 left-[8%] text-[#aba1b8]/40 pointer-events-none text-lg font-mono animate-pulse-slow">✦</div>
      <div className="absolute bottom-1/3 right-[18%] text-[#a66a6b]/30 pointer-events-none text-sm font-mono animate-pulse-slow">★</div>

      {/* Top Banner Navigation Bar */}
      <header className="border-b border-[#eedddb] bg-white/75 backdrop-blur-xl sticky top-0 z-40 shadow-sm text-[#3a2829]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d3a9ab] to-[#bd9598] flex items-center justify-center text-white shadow-md shadow-[#eedddb]">
              <Compass className="w-5.5 h-5.5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-sans font-extrabold tracking-widest text-[#503536]">
                星座每日運勢
              </h1>
              <p className="text-[10px] text-[#503536]/65 font-mono tracking-wider uppercase">{placements.sun.sign} 個人星像儀盤</p>
            </div>
          </div>

          {/* Interactive User Profile Trigger Button */}
          <button 
            type="button"
            onClick={handleOpenProfileModal}
            className="flex items-center gap-2.5 px-4 py-2 bg-white/90 border border-[#eedddb] hover:border-[#be9f9d]/60 hover:bg-white rounded-2xl shadow-sm transition-all duration-300 cursor-pointer group text-left"
            id="profile-trigger-btn"
          >
            <div className="w-6 h-6 rounded-lg bg-[#be9f9d]/15 flex items-center justify-center text-[#9a6f71] group-hover:text-[#8a5d5f] border border-[#eedddb]/40">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-[#8a7274] font-semibold tracking-wider font-sans leading-none uppercase">星像檔案</div>
              <div className="text-xs text-[#5a4647] font-bold group-hover:text-[#8a5d5f] leading-tight mt-0.5">
                出生位置 • <span className="underline decoration-dotted underline-offset-2">{birthInfo.birthPlace}</span>
              </div>
            </div>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative">
        {/* Intro Modal or banner offering personalized salutations */}
        {showIntro && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-white border border-[#eedddb] rounded-3xl relative overflow-hidden shadow-md text-[#504041]"
          >
            <button 
              onClick={() => setShowIntro(false)}
              className="absolute top-4 right-4 text-xs text-[#8a7274] hover:text-[#504041] select-none cursor-pointer p-1 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col md:flex-row items-center gap-5">
              <span className="text-4xl animate-pulse">🌌</span>
              <div className="text-center md:text-left">
                <h3 className="text-base font-sans font-bold text-[#a66468] tracking-wider flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-4 h-4 animate-bounce" />
                  歡迎來到你的靈魂編碼星宇命盤
                </h3>
                <p className="text-sm text-[#504041] leading-relaxed mt-2 max-w-3xl">
                  親愛的朋友，我們已為你專屬解密：依據你的出生資訊：<strong>{birthInfo.birthDate.replace(/-/g, ' 年 ')} 日 {birthInfo.birthTime.replace(':', ' 時 ')} 分 ({birthInfo.birthPlace})</strong> 計算，你擁有特有的<strong>太陽{placements.sun.sign}</strong>、重視情感回饋的<strong>月亮{placements.moon.sign}</strong> 與別具氣韻的<strong>上升{placements.ascendant.sign}</strong>。此 星座每日運勢 App 會根據你選擇的日期進行星象重疊，生成今日專屬塔羅、星日日報、精密月相與幸運守護清單。可以點擊右上角個人頭像編輯隨時重算，點擊下方切換日期展開你的星煇漫遊吧！
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Date Control Deck */}
        <section className="bg-white border border-[#eedddb] rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <span className="p-2 bg-[#be9f9d]/10 text-[#a66468] rounded-2xl flex-shrink-0 border border-[#eedddb]/40">
              <Calendar className="w-5 h-5 animate-pulse" />
            </span>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-[#8a7274] tracking-widest uppercase font-mono block">運勢運作觀測基準</span>
              <strong className="text-base font-sans font-bold text-[#3a2829] mt-1 block">
                {formatDateString(targetDate)}
              </strong>
            </div>
          </div>

          {/* Stepper inputs */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center sm:justify-start">
            <div className="flex bg-[#faf6f5] rounded-xl border border-[#eedddb] p-0.5 overflow-hidden">
              <button 
                onClick={() => adjustDate(-1)}
                className="px-3.5 py-1.5 text-xs text-[#5a4647] hover:text-[#a66468] font-sans hover:bg-white active:scale-95 transition-all cursor-pointer border-r border-[#eedddb]"
              >
                ◀ 前一天
              </button>
              <button 
                onClick={() => setTargetDate(new Date('2026-05-25'))}
                className="px-3.5 py-1.5 text-xs text-[#3a2829] font-bold hover:text-[#a66468] font-sans hover:bg-white active:scale-95 transition-all cursor-pointer border-r border-[#eedddb]"
              >
                今天 (05/25)
              </button>
              <button 
                onClick={() => adjustDate(1)}
                className="px-3.5 py-1.5 text-xs text-[#5a4647] hover:text-[#a66468] font-sans hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                後一天 ▶
              </button>
            </div>

            {/* Direct date select list input */}
            <div className="flex items-center gap-2 bg-[#faf6f5] rounded-xl border border-[#eedddb] px-3 py-1">
              <span className="text-[10px] text-[#8a7274] font-sans font-semibold">自訂:</span>
              <input 
                type="date"
                min="2000-01-01"
                max="2035-12-31"
                value={targetDate.toISOString().slice(0, 10)}
                onChange={(e) => setSpecificDate(e.target.value)}
                className="bg-transparent border-none text-[#3a2829] text-xs font-mono font-bold focus:outline-none cursor-pointer focus:text-[#a66468] [color-scheme:light]"
              />
            </div>
          </div>
        </section>

        {/* Tab Selection Navigation Header Layout */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/90 p-1.5 border border-[#eedddb] rounded-2xl w-full sm:w-auto overflow-hidden shadow-sm backdrop-blur-md">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-xl font-sans font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'daily'
                  ? "bg-[#be9f9d] text-white shadow-sm border border-[#be9f9d] backdrop-blur-sm"
                  : "text-[#8a7274] hover:text-[#3a2829]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              今日能量與塔羅
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-xl font-sans font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'weekly'
                  ? "bg-[#be9f9d] text-white shadow-sm border border-[#be9f9d] backdrop-blur-sm"
                  : "text-[#8a7274] hover:text-[#3a2829]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              未來週運與法寶
            </button>
            <button
              onClick={() => setActiveTab('birth')}
              className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-xl font-sans font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'birth'
                  ? "bg-[#be9f9d] text-white shadow-sm border border-[#be9f9d] backdrop-blur-sm"
                  : "text-[#8a7274] hover:text-[#3a2829]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              先天占星本命盤
            </button>
          </div>
        </div>

        {/* Dynamic Display Panel container */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + targetDate.getTime()}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* TAB 1: DAILY ASTROLOGY & TAROT */}
              {activeTab === 'daily' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Daily Tarot draw - occupies 12 cols */}
                  <div className="lg:col-span-12">
                    <DailyTarot tarotData={dailyData.tarot} onRefresh={handleRefreshSeed} />
                  </div>

                  {/* Daily news / bulletin - occupies 7 cols on desktop */}
                  <div className="lg:col-span-7">
                    <DailyAstroNewsComponent newsData={dailyData.astroNews} />
                  </div>

                  {/* Lunar phases component - occupies 5 cols on desktop */}
                  <div className="lg:col-span-5">
                    <MoonPhaseCard moonData={dailyData.moonPhase} />
                  </div>

                  {/* Dynamic transit positions comparison panel */}
                  <div className="lg:col-span-12">
                    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 relative overflow-hidden shadow-sm text-[#504041]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#be9f9d]/5 rounded-full filter blur-2xl pointer-events-none" />
                      <h3 className="text-sm font-sans font-bold text-[#3a2829] tracking-wider flex items-center gap-1.5 uppercase mb-4 text-left">
                        <Gem className="w-4 h-4 text-[#a66468]" />
                        今日天體即時過境相位
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Sun transit */}
                        <div className="p-4 rounded-xl bg-[#faf6f5] border border-[#f0e4e2] hover:border-[#eedddb] transition-colors flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center text-xs text-[#8a7274] font-semibold mb-1">
                            <span>☉ 太陽</span>
                            <span className="text-[#a66468] font-bold">雙子座 {transitData.sun.degree}°</span>
                          </div>
                          <span className="text-xs text-[#504041] leading-normal mt-1 block">
                            過境第 {transitData.sun.house} 宮：{transitData.sun.energy}
                          </span>
                        </div>

                        {/* Moon transit */}
                        <div className="p-4 rounded-xl bg-[#faf6f5] border border-[#f0e4e2] hover:border-[#eedddb] transition-colors flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center text-xs text-[#8a7274] font-semibold mb-1">
                            <span>☽ 月亮</span>
                            <span className="text-[#bf7e82] font-bold">{transitData.moon.sign} {transitData.moon.degree}°</span>
                          </div>
                          <span className="text-xs text-[#504041] leading-normal mt-1 block">
                            過境第 {transitData.moon.house} 宮：{transitData.moon.energy}
                          </span>
                        </div>

                        {/* Venus transit */}
                        <div className="p-4 rounded-xl bg-[#faf6f5] border border-[#f0e4e2] hover:border-[#eedddb] transition-colors flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center text-xs text-[#8a7274] font-semibold mb-1">
                            <span>♀ 金星</span>
                            <span className="text-[#9677b0] font-bold">{transitData.venus.sign} {transitData.venus.degree}°</span>
                          </div>
                          <span className="text-xs text-[#504041] leading-normal mt-1 block">
                            愛情能量引：{transitData.venus.energy}
                          </span>
                        </div>

                        {/* Mercury transit */}
                        <div className="p-4 rounded-xl bg-[#faf6f5] border border-[#f0e4e2] hover:border-[#eedddb] transition-colors flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center text-xs text-[#8a7274] font-semibold mb-1">
                            <span>☿ 水星</span>
                            <span className="text-[#518b9c] font-bold">{transitData.mercury.sign} {transitData.mercury.degree}°</span>
                          </div>
                          <span className="text-xs text-[#504041] leading-normal mt-1 block">
                            思維邏輯導：{transitData.mercury.energy}
                          </span>
                        </div>

                        {/* Mars transit */}
                        <div className="p-4 rounded-xl bg-[#faf6f5] border border-[#f0e4e2] hover:border-[#eedddb] transition-colors flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center text-xs text-[#8a7274] font-semibold mb-1">
                            <span>♂ 火星</span>
                            <span className="text-[#b8615c] font-bold">{transitData.mars.sign} {transitData.mars.degree}°</span>
                          </div>
                          <span className="text-xs text-[#504041] leading-normal mt-1 block">
                            行動作戰力：{transitData.mars.energy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WEEKLY HOROSCOPE & LUCKY BENTO */}
              {activeTab === 'weekly' && (
                <div className="flex flex-col gap-8">
                  <WeeklyHoroscope weeklyData={dailyData.weeklyHoroscope} />
                  <LuckyList luckyData={dailyData.luckyItems} />
                </div>
              )}

              {/* TAB 3: NATAL CHART EXPLORER */}
              {activeTab === 'birth' && (
                <div className="flex flex-col gap-6">
                  <BirthChartCard birthInfo={birthInfo} placements={placements} />
                  
                  {/* Explanatory metadata description card */}
                  <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm text-left">
                    <h3 className="text-sm font-sans font-bold text-[#a66468] mb-3 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      上升{placements.ascendant.sign}與月亮{placements.moon.sign}在{placements.sun.sign}星曜結構中的核心奧秘
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#504041] leading-relaxed font-sans">
                      <div className="p-4 rounded-2xl bg-[#faf6f5] border border-[#f0e4e2] shadow-inner text-left">
                        <strong className="text-[#3a2829] block mb-1.5 text-xs font-bold">1. 外在透鏡：上升{placements.ascendant.sign}座落</strong>
                        這是在這個世界中外在生命展現的小面孔。即便你太陽{placements.sun.sign.replace("座","")}傾向務實或追求自我舒適圈，上升{placements.ascendant.sign}的外在特質會在不自覺中表現出得體精微。它使你在人際交接、學業及日常重整中展露細節，散發出一種令人信賴的卓越職人氣質。
                      </div>
                      <div className="p-4 rounded-2xl bg-[#faf6f5] border border-[#f0e4e2] shadow-inner text-left">
                        <strong className="text-[#3a2829] block mb-1.5 text-xs font-bold">2. 自我價值：月亮{placements.moon.sign}在第 2 宮（財帛宮）</strong>
                        月亮代表本能安全感。落在{placements.moon.sign}象徵追求美德與優雅和諧的深刻需求。在財帛宮（第 2 宮）中，這意味著你的情緒安寧與個人財務、典雅器物以及有形無形的實質回饋高度相融，特別懂得用心愛護精緻而長遠的事物。
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Astro Personal Profile Modal Overlay */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#423435]/65 backdrop-blur-md" id="profile-modal-overlay">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg bg-[#faf6f5] border border-[#eedddb] rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#be9f9d]/10 rounded-full filter blur-2xl pointer-events-none" />

              {/* Close standard cross */}
              <button 
                onClick={() => { setShowProfileModal(false); setIsEditingForm(false); }}
                className="absolute top-4 right-4 text-[#8a7274] hover:text-[#3a2829] p-1 rounded-lg hover:bg-[#be9f9d]/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#eedddb]">
                <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
                  <User className="w-4 h-4" />
                </span>
                <h2 className="text-md font-sans font-bold text-[#3a2829] tracking-wider">
                  {isEditingForm ? "修改星圖生日參數" : "個人星圖核心資料"}
                </h2>
              </div>

              {!isEditingForm ? (
                /* VIEWING MODE */
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#eedddb]">
                      <span className="text-[10px] text-[#8a7274] block font-sans">出生日期</span>
                      <strong className="text-xs text-[#3a2829] block mt-0.5 font-mono">{birthInfo.birthDate}</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#eedddb]">
                      <span className="text-[10px] text-[#8a7274] block font-sans">出生時間</span>
                      <strong className="text-xs text-[#3a2829] block mt-0.5 font-mono">{birthInfo.birthTime} <span className="text-[10px] text-[#8a7274]">(24小時制)</span></strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#eedddb] col-span-2">
                      <span className="text-[10px] text-[#8a7274] block font-sans">出生地點</span>
                      <strong className="text-xs text-[#3a2829] block mt-0.5">臺灣台北 (與歷史初始設定對齊)</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#be9f9d]/10 border border-[#eedddb] space-y-2 text-xs text-[#504041]">
                    <div className="font-bold text-[#a66468] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      當前計算得出星曜 placements：
                    </div>
                    <ul className="grid grid-cols-3 gap-2 text-[11px] font-sans">
                      <li>☉ 太陽: <strong className="text-[#3a2829]">{placements.sun.sign}</strong></li>
                      <li>☽ 月亮: <strong className="text-[#3a2829]">{placements.moon.sign}</strong></li>
                      <li>⇪ 上升: <strong className="text-[#3a2829]">{placements.ascendant.sign}</strong></li>
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingForm(true)}
                      className="flex-1 py-2.5 rounded-xl bg-[#be9f9d] hover:bg-[#ac8f8d] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#be9f9d]/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      編輯檔案資料
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#eedddb] text-[#5a4647] hover:bg-neutral-50 text-xs cursor-pointer"
                    >
                      關閉視窗
                    </button>
                  </div>
                </div>
              ) : (
                /* EDIT FORM MODE */
                <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-[#a66468] font-serif tracking-widest block mb-1">出生日期</label>
                      <input 
                        type="date"
                        required
                        value={tempBirthDate}
                        onChange={(e) => setTempBirthDate(e.target.value)}
                        className="w-full bg-white border border-[#eedddb] rounded-xl p-2.5 text-xs text-[#3a2829] focus:outline-none focus:ring-1 focus:ring-[#be9f9d] [color-scheme:light] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#a66468] font-serif tracking-widest block mb-1">出生時間</label>
                      <input 
                        type="time"
                        required
                        value={tempBirthTime}
                        onChange={(e) => setTempBirthTime(e.target.value)}
                        className="w-full bg-white border border-[#eedddb] rounded-xl p-2.5 text-xs text-[#3a2829] focus:outline-none focus:ring-1 focus:ring-[#be9f9d] [color-scheme:light] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#a66468] font-serif tracking-widest block mb-1">出生地點地區</label>
                      <input 
                        type="text"
                        required
                        value={tempBirthPlace}
                        onChange={(e) => setTempBirthPlace(e.target.value)}
                        placeholder="例如：台北"
                        className="w-full bg-white border border-[#eedddb] rounded-xl p-2.5 text-xs text-[#3a2829] focus:outline-none focus:ring-1 focus:ring-[#be9f9d]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-[#8a7274] block mb-1">精確緯度</label>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={tempLatitude}
                          onChange={(e) => setTempLatitude(Number(e.target.value))}
                          className="w-full bg-white border border-[#eedddb] rounded-xl p-2 text-xs text-[#3a2829] focus:outline-none focus:ring-1 focus:ring-[#be9f9d] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#8a7274] block mb-1">精確經度</label>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={tempLongitude}
                          onChange={(e) => setTempLongitude(Number(e.target.value))}
                          className="w-full bg-white border border-[#eedddb] rounded-xl p-2 text-xs text-[#3a2829] focus:outline-none focus:ring-1 focus:ring-[#be9f9d] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#eedddb] text-[10px] text-[#8a7274] leading-relaxed font-sans">
                    ※ 點擊儲存後，系統將自動啟動內建天文週期算法重算你的太陽落入星座、上升星位及今日塔羅與開運守護，立即呈現新配置運勢。
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#a66468] hover:bg-[#905357] text-white font-semibold text-xs hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      儲存變更並重新測算
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#eedddb] text-[#5a4647] hover:bg-neutral-100 text-xs cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Design Credits */}
      <footer className="border-t border-[#eedddb] bg-[#e6dbda]/35 py-8 text-center text-xs text-[#8a7274] mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans">
            © 2026 星座每日運勢. 客製化專屬星盤運勢尊享版。
          </p>

          {/* Stationary Back to Top Button */}
          <button 
            type="button"
            onClick={scrollToTop} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#eedddb] bg-white text-[#a66468] hover:bg-[#faf6f5] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs font-sans font-extrabold text-xs"
            id="footer-back-to-top-btn"
          >
            <ArrowUp className="w-4 h-4" />
            返回頂端
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8a7274] hover:text-[#a66468] tracking-tighter cursor-pointer">
            <span className="w-1.5 h-1.5 bg-[#a66468] rounded-full animate-ping" />
            <span>天文算法月相模組 • 專屬精確儒略歷日軌</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-[#a66468] hover:bg-[#905357] text-white shadow-md cursor-pointer z-50 transition-all border border-white/20 active:scale-95 group flex items-center justify-center"
            id="floating-back-to-top-btn"
            title="返回頂端"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
