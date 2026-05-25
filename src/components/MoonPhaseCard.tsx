/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoonPhaseData } from '../types';
import { Moon, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface MoonPhaseCardProps {
  moonData: MoonPhaseData;
}

export default function MoonPhaseCard({ moonData }: MoonPhaseCardProps) {
  const { age, phaseName, phaseChinese, percentage, svgPhaseOffset, description } = moonData;

  const isWaxing = svgPhaseOffset >= 0;

  // Render a mathematically exact moon phase path
  const getMoonPath = () => {
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
        // Outer arc (right side): scale from top to bottom
        // Inner arc (crescent curve): scales back to top
        return `M ${cx} ${cy - r} 
                A ${r} ${r} 0 0 1 ${cx} ${cy + r} 
                A ${rx} ${r} 0 0 0 ${cx} ${cy - r}`;
      } else {
        // Left side is illuminated
        return `M ${cx} ${cy - r} 
                A ${r} ${r} 0 0 0 ${cx} ${cy + r} 
                A ${rx} ${r} 0 0 1 ${cx} ${cy - r}`;
      }
    } else {
      // Gibbous phases (fat lit slice)
      if (isWaxing) {
        // Right side is fully lit, left side is partially lit
        return `M ${cx} ${cy - r} 
                A ${r} ${r} 0 0 1 ${cx} ${cy + r} 
                A ${rx} ${r} 0 0 1 ${cx} ${cy - r}`;
      } else {
        // Left side is fully lit, right side is partially lit
        return `M ${cx} ${cy - r} 
                A ${r} ${r} 0 0 0 ${cx} ${cy + r} 
                A ${rx} ${r} 0 0 0 ${cx} ${cy - r}`;
      }
    }
  };

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="moon-phase-card">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
        <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
          <Moon className="w-5 h-5 animate-pulse" />
        </span>
        <div className="text-left">
          <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日月相能量</h2>
          <p className="text-sm text-[#8a7274] mt-0.5">日月交輝引潮力 • 當前日期演算法計算</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
        
        {/* Left: Dynamic Moon Graphic Sphere */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 rounded-full bg-[#ebdcd9]/30 flex items-center justify-center p-1 border border-[#eedddb] shadow-xs overflow-hidden group">
            {/* Dark Side Base Circle (The dark parts of the moon) */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              className="absolute inset-0 select-none overflow-hidden"
            >
              <defs>
                {/* Dark Moon radial shade */}
                <radialGradient id="darkMoon" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#e8dcda" />
                  <stop offset="100%" stopColor="#dad0cd" />
                </radialGradient>
                {/* Lit Moon gold-creamy glow */}
                <radialGradient id="litMoon" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fffde7" />
                  <stop offset="60%" stopColor="#fef08a" />
                  <stop offset="90%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </radialGradient>
                
                {/* Moon surface material mask to draw craters */}
                <pattern id="craterMap" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="28" cy="35" r="4" fill="#000000" fillOpacity="0.08" />
                  <circle cx="29" cy="36" r="3.2" fill="#ffffff" fillOpacity="0.04" />
                  
                  <circle cx="45" cy="22" r="6" fill="#000000" fillOpacity="0.09" />
                  <circle cx="46" cy="23" r="5" fill="#ffffff" fillOpacity="0.04" />
                  
                  <circle cx="70" cy="50" r="7.5" fill="#000000" fillOpacity="0.07" />
                  <circle cx="71" cy="51" r="6.5" fill="#ffffff" fillOpacity="0.04" />
                  
                  <circle cx="35" cy="65" r="5" fill="#000000" fillOpacity="0.08" />
                  <circle cx="60" cy="72" r="3.5" fill="#000000" fillOpacity="0.09" />
                  <circle cx="50" cy="45" r="1.5" fill="#000000" fillOpacity="0.05" />
                  
                  {/* Subtle terrain details */}
                  <path d="M 20 50 Q 23 55 25 50" stroke="#000" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
                  <path d="M 55 30 Q 58 35 62 31" stroke="#000" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
                </pattern>
              </defs>

              {/* 1. Draw shadowed base */}
              <circle cx="50" cy="50" r="45" fill="url(#darkMoon)" />
              {/* Subtle dark crater textures in shadowed area */}
              <circle cx="50" cy="50" r="45" fill="url(#craterMap)" opacity="0.3" />

              {/* 2. Draw illuminated phase portion */}
              {percentage > 1 && (
                <path 
                  d={getMoonPath()} 
                  fill="url(#litMoon)" 
                  className="transition-all duration-700"
                />
              )}

              {/* 3. Overlay Crater textures over everything so craters are visible on lit and shadow edges */}
              <circle cx="50" cy="50" r="45" fill="url(#craterMap)" pointerEvents="none" className="mix-blend-multiply opacity-80" />
              
              {/* Outer soft outline glow limit */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" strokeWidth="0.5" strokeOpacity="0.1" />
            </svg>
            
            {/* Glowing atmosphere ring */}
            <div className="absolute inset-0.5 rounded-full border border-yellow-200/5 shadow-[0_0_15px_rgba(254,240,138,0.06)] group-hover:scale-105 transition-all duration-1000 pointer-events-none" />
          </div>

          <div className="mt-3.5 text-center">
            <span className="text-sm font-sans font-extrabold text-[#a66468] tracking-wider">
              {phaseChinese}
            </span>
            <div className="text-[10px] text-[#8a7274] font-mono mt-0.5 uppercase tracking-wide font-semibold">
              {phaseName}
            </div>
          </div>
        </div>

        {/* Right: Calculations and description */}
        <div className="md:col-span-8 flex flex-col justify-center text-left">
          {/* Scientific summary */}
          <div className="grid grid-cols-3 gap-2 text-center border-b border-[#eedddb] pb-3 mb-3.5">
            <div className="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb] flex flex-col justify-center">
              <span className="text-[10px] text-[#8a7274] font-mono font-bold scale-95 origin-center">月亮年齡</span>
              <strong className="text-xs font-mono text-[#3a2829] font-bold mt-1">{age.toFixed(2)} 天</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb] flex flex-col justify-center">
              <span className="text-[10px] text-[#8a7274] font-mono font-bold scale-95 origin-center">光照比</span>
              <strong className="text-xs font-mono text-[#3a2829] font-bold mt-1">{percentage.toFixed(1)}%</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#faf6f5] border border-[#eedddb] flex flex-col justify-center">
              <span className="text-[10px] text-[#8a7274] font-mono font-bold scale-95 origin-center">黃道干擾</span>
              <strong className="text-xs font-mono text-[#a66468] font-bold mt-1">{isWaxing ? "漸盈潮汐" : "漸虧引流"}</strong>
            </div>
          </div>

          {/* Lunar explanation matching the exact calculations */}
          <div className="p-3 bg-[#fcf8f7] border border-[#eedddb] rounded-xl relative overflow-hidden">
            <p className="text-xs text-[#4a3536] leading-relaxed font-sans pl-1">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8a7274] pl-1 font-semibold">
              <Star className="w-3 h-3 text-[#a66468]" />
              <span>依據儒略曆朔望週期演算法，金牛座專用月相。</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
