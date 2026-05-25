/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DailyTarotReading } from '../types';
import { Sparkles, RefreshCw, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyTarotProps {
  tarotData: DailyTarotReading;
  onRefresh: () => void;
}

export default function DailyTarot({ tarotData, onRefresh }: DailyTarotProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { card, isUpright, reading } = tarotData;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="daily-tarot-card">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#eedddb]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日塔囉</h2>
          </div>
          <p className="text-sm text-[#8a7274] mt-1">奧秘宇宙能量投射 • 點擊卡牌翻轉解析</p>
        </div>
        <button
          onClick={() => {
            setIsFlipped(false);
            setTimeout(() => {
              onRefresh();
              setImageError(false);
            }, 150);
          }}
          className="p-2 rounded-full border border-[#eedddb] text-[#5a4647] hover:text-[#3a2829] bg-neutral-50 hover:bg-[#faf5f4] active:scale-95 transition-all duration-300 group cursor-pointer"
          title="重新抽牌"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 pt-6 items-center">
        {/* Card stage with 3D Perspective */}
        <div className="w-[180px] h-[300px] flex-shrink-0 cursor-pointer perspect-1000 select-none pb-4" onClick={handleFlip}>
          <motion.div
            className="relative w-full h-full transform-style-3d duration-500"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {/* CARD BACK SIDE (Visible initially) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#ebdcd9] via-[#fdfbfb] to-[#ebdcd9] border-2 border-[#d5bcba] p-4 flex flex-col items-center justify-between shadow-md overflow-hidden"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "translateZ(1px)" }}
            >
              {/* Background elegant starry pattern */}
              <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none bg-[radial-gradient(#be9f9d_1.2px,transparent_1.2px)] [background-size:12px_12px]" />
              <div className="absolute w-full h-full inset-0 border-[3px] border-white/40 rounded-xl pointer-events-none m-0.5" />
              
              {/* Gold border container */}
              <div className="border border-[#be9f9d]/30 w-full h-full rounded-xl flex flex-col items-center justify-between p-3">
                <span className="text-[10px] tracking-widest text-[#a66468] font-mono font-bold">TAROT CARDS</span>
                
                {/* Mystic symbol/seal in back center */}
                <div className="w-16 h-16 rounded-full border border-[#be9f9d]/40 flex items-center justify-center bg-white/80 shadow-sm relative group-hover:scale-105 transition-transform">
                  <div className="absolute w-12 h-12 rounded-full border border-dashed border-[#be9f9d]/30 animate-spin-slow" />
                  <span className="text-3xl">🔮</span>
                </div>
                
                <span className="text-[10px] tracking-widest text-[#a66468] font-mono font-bold">ASTROLOGY</span>
              </div>
            </div>

            {/* CARD FRONT SIDE (Visible after flip, rotated 180 deg) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-2xl bg-white border-2 border-[#d5bcba] flex flex-col shadow-lg overflow-hidden"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(1px)" }}
            >
              {/* Image Frame with fail safe */}
              <div className="relative h-[65%] w-full bg-[#faf6f5] border-b border-[#eedddb] overflow-hidden flex items-center justify-center">
                {!imageError ? (
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  /* Exquisite artistic Morandi alignment fallback card design */
                  <div className="w-full h-full bg-gradient-to-b from-[#fbf8f7] to-[#ebdcd9] flex flex-col items-center justify-center p-4">
                    <span className="text-4xl filter drop-shadow-sm mb-2">{card.mysticSymbol}</span>
                    <span className="text-[11px] font-mono tracking-widest text-[#a66468] font-bold uppercase">MYSTICAL KEY</span>
                    <span className="text-xs text-[#8a7274] font-medium mt-1">{card.id.replace('_', ' ')}</span>
                  </div>
                )}
                {/* Gradient shade overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5" />
                
                {/* Card ID Code Indicator */}
                <span className="absolute bottom-2 left-3 bg-white/90 border border-[#eedddb] text-[9px] font-mono font-bold text-[#a66468] px-2 py-0.5 rounded-full uppercase shadow-xs">
                  No.{card.id.split('_')[0]}
                </span>
                {/* Mystic Glyph */}
                <span className="absolute top-2 right-3 text-2xl select-none opacity-90 hover:scale-110 transition-transform">
                  {card.mysticSymbol}
                </span>
              </div>

              {/* Title & Meaning Panel */}
              <div className="h-[35%] w-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-white to-[#faf6f5] border-t border-[#eedddb]/50">
                <h3 className="text-sm font-sans font-extrabold text-[#3a2829] tracking-wider truncate max-w-[150px]">
                  {card.name}
                </h3>
                <div className={`mt-1.5 flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-sans font-bold select-none ${
                  isUpright 
                    ? "bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]" 
                    : "bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]"
                }`}>
                  {isUpright ? (
                    <>
                      <ArrowUp className="w-3 h-3" />
                      <span>正位</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3 h-3" />
                      <span>逆位</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text descriptions and analysis */}
        <div className="flex-1 flex flex-col justify-between self-stretch text-left">
          <div className="bg-[#fcf8f7] border border-[#eedddb] rounded-2xl p-5 min-h-[190px] shadow-xs">
            {isFlipped ? (
              <div className="animate-fade-in text-left">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#eedddb]">
                  <h3 className="text-sm font-sans font-bold text-[#a66468]">牌意核心與占星能量轉譯</h3>
                </div>
                <p className="text-sm text-[#4a3536] leading-relaxed font-sans whitespace-pre-line pl-0.5 text-left" style={{ wordBreak: 'break-word' }}>
                  {reading}
                </p>
              </div>
            ) : (
              <div className="h-[180px] flex flex-col items-center justify-center text-center p-4">
                <span className="p-3 bg-white border border-[#eedddb] rounded-full text-2xl mb-3 animate-pulse shadow-xs">
                  🔮
                </span>
                <h3 className="text-[#3a2829] text-sm font-sans font-bold tracking-wide">
                  點擊翻轉塔羅，啟明星指引
                </h3>
                <p className="text-xs text-[#8a7274] mt-1.5 max-w-sm leading-relaxed">
                  今日隨機選定一張塔羅牌，並完全針對金牛座今日的星體干涉給予命盤契合指引。
                </p>
                <button
                  onClick={handleFlip}
                  className="mt-4 px-5 py-1.5 rounded-full bg-[#be9f9d] hover:bg-[#ac8f8d] text-white text-xs font-sans font-bold tracking-wider active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  翻開今日指引
                </button>
              </div>
            )}
          </div>

          {/* Supportive note */}
          {isFlipped && (
            <div className="mt-4 p-3 border border-[#eedddb] rounded-xl bg-white flex gap-2.5 items-start text-left">
              <AlertCircle className="w-4 h-4 text-[#a66468] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#8a7274] leading-relaxed">
                提示：塔羅牌義能激活大腦中高階心智的共鳴。正位或逆位與主觀好壞無關，而代表能量的顯化軌跡，請隨心體察今日帶來的和諧開悟。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
