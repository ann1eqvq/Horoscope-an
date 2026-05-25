/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AstrologicalPlacements, BirthInfo } from '../types';
import { Sparkles, Compass, Star, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BirthChartCardProps {
  birthInfo: BirthInfo;
  placements: AstrologicalPlacements;
}

export default function BirthChartCard({ birthInfo, placements }: BirthChartCardProps) {
  const [activePlanet, setActivePlanet] = useState<'sun' | 'moon' | 'ascendant' | 'midheaven' | null>('sun');

  // Astrological constants for plotting the wheel
  const signs = [
    { name: "牡羊", start: 0, color: "text-red-300" },
    { name: "金牛", start: 30, color: "text-amber-200" },
    { name: "雙子", start: 60, color: "text-sky-200" },
    { name: "巨蟹", start: 90, color: "text-slate-300" },
    { name: "獅子", start: 120, color: "text-yellow-200" },
    { name: "處女", start: 150, color: "text-emerald-300" },
    { name: "天秤", start: 180, color: "text-pink-300" },
    { name: "天蠍", start: 210, color: "text-purple-300" },
    { name: "射手", start: 240, color: "text-orange-200" },
    { name: "摩羯", start: 270, color: "text-stone-300" },
    { name: "水瓶", start: 300, color: "text-indigo-300" },
    { name: "雙魚", start: 330, color: "text-cyan-300" }
  ];

  const getDegreeOnWheel = (signName: string, degree: number) => {
    const idx = ["牡羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "水瓶", "雙魚"].findIndex(n => signName.startsWith(n));
    return (idx >= 0 ? idx : 0) * 30 + degree;
  };

  const sunAngle = getDegreeOnWheel(placements.sun.sign, placements.sun.degree);
  const moonAngle = getDegreeOnWheel(placements.moon.sign, placements.moon.degree);
  const ascAngle = getDegreeOnWheel(placements.ascendant.sign, placements.ascendant.degree);
  const mcAngle = getDegreeOnWheel(placements.midheaven.sign, placements.midheaven.degree);

  // Placements angles on the 360 wheel
  const wheelPlacements = [
    { key: 'sun', label: `太陽${placements.sun.sign}`, deg: sunAngle, sign: placements.sun.sign, house: placements.sun.house, d: `${placements.sun.degree}°` },
    { key: 'moon', label: `月亮${placements.moon.sign}`, deg: moonAngle, sign: placements.moon.sign, house: placements.moon.house, d: `${placements.moon.degree}°` },
    { key: 'ascendant', label: `上升${placements.ascendant.sign}`, deg: ascAngle, sign: placements.ascendant.sign, house: 1, d: `${placements.ascendant.degree}°` },
    { key: 'midheaven', label: `天頂${placements.midheaven.sign}`, deg: mcAngle, sign: placements.midheaven.sign, house: 10, d: `${placements.midheaven.degree}°` }
  ];

  const getCoordinates = (angle: number, radius: number, cx = 150, cy = 150) => {
    // Convert to radians (and offset by -90 deg to align 0° to Left/Top)
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="birth-chart-card">
      {/* Background Star Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#eedddb] gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">先天個人占星出生盤</h2>
          </div>
          <p className="text-sm text-[#8a7274] mt-1">
            資料歸檔：{birthInfo.birthDate.replace(/-/g, '年')} {birthInfo.birthTime} • {birthInfo.birthPlace}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold shadow-xs">
            ☉ 太陽：{placements.sun.sign}
          </span>
          <span className="px-3 py-1 bg-[#fff1f2] text-[#f43f5e] border border-rose-200 rounded-full font-bold shadow-xs">
            ☽ 月亮：{placements.moon.sign}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold shadow-xs">
            ⇪ 上升：{placements.ascendant.sign}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left: Star Wheel Drawing */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-[300px] h-[300px] bg-[#faf6f5] rounded-full border border-[#eedddb] shadow-xs p-2 flex items-center justify-center">
            
            {/* SVG ASTRO WHEEL */}
            <svg width="290" height="290" className="absolute select-none transform rotate-0 transition-transform duration-1000">
              {/* Outer boundary circles */}
              <circle cx="145" cy="145" r="140" fill="none" stroke="#eedddb" strokeOpacity="1" strokeWidth="1.5" />
              <circle cx="145" cy="145" r="115" fill="none" stroke="#eedddb" strokeOpacity="0.5" strokeWidth="1" />
              <circle cx="145" cy="145" r="90" fill="none" stroke="#be9f9d" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2,3" />
              <circle cx="145" cy="145" r="10" fill="white" stroke="#be9f9d" strokeOpacity="1" strokeWidth="1.5" />

              {/* Signs slices lines & text */}
              {signs.map((s, idx) => {
                const startCoord = getCoordinates(s.start, 140, 145, 145);
                const endCoord = getCoordinates(s.start, 115, 145, 145);
                const textCoord = getCoordinates(s.start + 15, 126, 145, 145);
                
                return (
                  <g key={s.name}>
                    <line 
                      x1={startCoord.x} 
                      y1={startCoord.y} 
                      x2={endCoord.x} 
                      y2={endCoord.y} 
                      stroke="#eedddb" 
                      strokeWidth="1" 
                      strokeOpacity="0.8"
                    />
                    <text 
                      x={textCoord.x} 
                      y={textCoord.y} 
                      fill="#8a7274" 
                      className="text-[10px] font-sans font-extrabold tracking-tighter text-center select-none"
                      textAnchor="middle" 
                      dominantBaseline="middle"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}

              {/* House division lines */}
              {[0, 60, 120, 180, 240, 300].map((angle) => {
                const p1 = getCoordinates(angle, 115, 145, 145);
                const p2 = getCoordinates(angle + 180, 115, 145, 145);
                return (
                  <line 
                    key={angle}
                    x1={p1.x} 
                    y1={p1.y} 
                    x2={p2.x} 
                    y2={p2.y} 
                    stroke="#eedddb" 
                    strokeWidth="1" 
                    strokeOpacity="0.3" 
                  />
                );
              })}

              {/* Aspect Lines */}
              <path 
                d={`M ${getCoordinates(sunAngle, 90, 145, 145).x} ${getCoordinates(sunAngle, 90, 145, 145).y} 
                    L ${getCoordinates(moonAngle, 90, 145, 145).x} ${getCoordinates(moonAngle, 90, 145, 145).y}`}
                stroke="#db2777" 
                strokeWidth="1.2" 
                strokeOpacity="0.6"
                strokeDasharray="2,2"
              />
              <path 
                d={`M ${getCoordinates(ascAngle, 90, 145, 145).x} ${getCoordinates(ascAngle, 90, 145, 145).y} 
                    L ${getCoordinates(mcAngle, 90, 145, 145).x} ${getCoordinates(mcAngle, 90, 145, 145).y}`}
                stroke="#059669" 
                strokeWidth="1.2" 
                strokeOpacity="0.6"
              />

              {/* Render the Placements Glowing Points */}
              {wheelPlacements.map((p) => {
                const pt = getCoordinates(p.deg, 100, 145, 145);
                const isSelected = activePlanet === p.key;
                
                let ptColor = "#b45309"; // sun
                if (p.key === 'moon') ptColor = "#be185d";
                if (p.key === 'ascendant') ptColor = "#047857";
                if (p.key === 'midheaven') ptColor = "#0369a1";

                return (
                  <g key={p.key} className="cursor-pointer" onClick={() => setActivePlanet(p.key as any)}>
                    {isSelected && (
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="12" 
                        fill="none" 
                        stroke={ptColor} 
                        strokeWidth="10" 
                        className="animate-ping-slow"
                        strokeOpacity="0.1"
                      />
                    )}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="7" 
                      fill="transparent" 
                      stroke={ptColor} 
                      strokeWidth="1.5" 
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                    />
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="4" 
                      fill={ptColor} 
                    />
                    <text 
                      x={getCoordinates(p.deg, 80, 145, 145).x} 
                      y={getCoordinates(p.deg, 80, 145, 145).y + 1} 
                      fill={isSelected ? "#3a2829" : "#8a7274"}
                      className="text-[10px] font-sans font-black select-none text-center"
                      textAnchor="middle" 
                      dominantBaseline="middle"
                    >
                      {p.key === 'sun' ? '☉' : p.key === 'moon' ? '☽' : p.key === 'ascendant' ? 'ASC' : 'MC'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Central Badge */}
            <div className="absolute flex flex-col items-center justify-center p-2 rounded-full bg-white border border-[#eedddb] text-center w-22 h-22 select-none shadow-xs">
              <Star className="w-4 h-4 text-[#be9f9d] mb-0.5 animate-pulse" />
              <span className="text-[10px] text-[#8a7274] font-mono tracking-tight font-bold">{birthInfo.birthTime}</span>
              <span className="text-[10px] text-[#a66468] font-sans font-extrabold mt-0.5 uppercase tracking-wider truncate max-w-[70px]">
                {birthInfo.birthPlace}
              </span>
            </div>
          </div>
          <span className="text-[#8a7274] text-[10px] font-sans font-bold mt-3">※ 點擊星盤上的標識點 (☉, ☽, ASC, MC) 可切換下方詳細解析</span>
        </div>

        {/* Right: Placements Interactive Descriptions */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between">
          <div>
            {/* Quick selectors */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {wheelPlacements.map((p) => {
                const isSelected = activePlanet === p.key;
                let activeClass = "border-amber-300 bg-amber-50 text-amber-800 shadow-xs font-bold";
                let inactiveClass = "border-[#eedddb] text-[#8a7274] bg-[#faf6f5] hover:bg-white";
                
                if (p.key === 'moon') {
                  activeClass = "border-rose-300 bg-rose-50 text-rose-800 shadow-xs font-bold";
                } else if (p.key === 'ascendant') {
                  activeClass = "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs font-bold";
                } else if (p.key === 'midheaven') {
                  activeClass = "border-sky-300 bg-sky-50 text-sky-800 shadow-xs font-bold";
                }

                return (
                  <button
                    key={p.key}
                    onClick={() => setActivePlanet(p.key as any)}
                    className={`py-2.5 px-1 border rounded-xl text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      isSelected ? activeClass : inactiveClass
                    }`}
                  >
                    <span className="text-base font-bold mb-0.5">
                      {p.key === 'sun' ? '☉' : p.key === 'moon' ? '☽' : p.key === 'ascendant' ? 'ASC' : 'MC'}
                    </span>
                    <span className="text-[11px] font-sans tracking-tight font-bold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Placements Panel */}
            <div className="bg-[#faf6f5] border border-[#eedddb] rounded-2xl p-4 min-h-[140px] relative overflow-hidden shadow-xs text-left">
              <AnimatePresence mode="wait">
                {activePlanet && (
                  <motion.div
                    key={activePlanet}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        activePlanet === 'sun' ? 'bg-amber-500' : activePlanet === 'moon' ? 'bg-pink-500' : activePlanet === 'ascendant' ? 'bg-emerald-500' : 'bg-sky-500'
                      }`} />
                      <h3 className="text-sm font-sans font-bold text-[#3a2829]">
                        {activePlanet === 'sun' && "太陽（Sun）— 核心自我、意志與使命"}
                        {activePlanet === 'moon' && "月亮（Moon）— 情緒渴望、安全感與本能"}
                        {activePlanet === 'ascendant' && "上升（Ascendant）— 人生面具、第一印象與氣質"}
                        {activePlanet === 'midheaven' && "天頂（Midheaven）— 社會形象、志向與成就"}
                      </h3>
                    </div>
                    {/* Position details */}
                    <div className="flex gap-4 mb-3 text-xs text-[#8a7274] font-semibold">
                      <span>星座: <strong className="text-[#3a2829] font-bold">{placements[activePlanet].sign}</strong></span>
                      <span>精確度度數: <strong className="text-[#3a2829] font-bold">{placements[activePlanet].degree}°</strong></span>
                      {'house' in placements[activePlanet] && (
                        <span>宮位: <strong className="text-[#3a2829] font-bold">第 {placements[activePlanet].house} 宮</strong></span>
                      )}
                    </div>
                    {/* Description Text */}
                    <p className="text-sm text-[#4a3536] leading-relaxed font-sans font-medium">
                      {placements[activePlanet].description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Golden Synthesis of Natal */}
          <div className="mt-4 p-4 rounded-2xl bg-[#fcf8f7] border border-[#eedddb] text-left shadow-xs">
            <h4 className="text-sm font-sans font-extrabold text-[#a66468] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4" />
              占星金三角融合解析 (Astro Synthesis)
            </h4>
            <p className="text-xs text-[#4a3536] leading-relaxed font-sans font-medium font-bold">
              你是擁有獨特定力與稟賦的<strong>{placements.sun.sign}</strong>，內心深處蘊藏著名譽與物資豐饒的優雅力量（月亮{placements.moon.sign.replace("座", "")}），在外界交流、處事方面則展現出做事精細、條理分明的獨特風範（上升{placements.ascendant.sign.replace("座", "")}）。這組黃金金三角賦予你「精敏於細節，耕耘於長遠」的完美特質。在精神探索的遷移宮引導下，你可以隨時將日常感悟沉降成深刻的人生哲學。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
