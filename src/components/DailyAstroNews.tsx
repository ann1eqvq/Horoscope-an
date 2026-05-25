/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyAstroNews } from '../types';
import { Quote, Sparkles, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyAstroNewsProps {
  newsData: DailyAstroNews;
}

export default function DailyAstroNewsComponent({ newsData }: DailyAstroNewsProps) {
  const { moodKeyword, moodValue, luckyMatchSign, unluckyMatchSign, recommendedToDos, wisdomQuote } = newsData;

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden h-full flex flex-col justify-between" id="daily-astro-news-card">
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
          <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]">
            <Quote className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日星之日報</h2>
            <p className="text-sm text-[#8a7274] mt-0.5">每日金牛座即時氣像與心靈寫真</p>
          </div>
        </div>

        {/* Content Structure */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 text-left">
          
          {/* Mood Meter & Social Matching */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Mood Key Card */}
            <div className="bg-[#fcf8f7] border border-[#eedddb] rounded-2xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-[11px] text-[#8a7274] tracking-wider font-sans font-bold">今日心情狀態</span>
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="text-lg font-sans font-bold text-[#3a2829] tracking-wider">{moodKeyword}</span>
                <span className="text-2xl font-mono font-black text-[#a66468]">{moodValue}%</span>
              </div>
              
              {/* Custom styled progress bar */}
              <div className="w-full bg-[#f0e4e2] rounded-full h-2 mt-3.5 overflow-hidden border border-[#eedddb]/50">
                <motion.div 
                  className="bg-gradient-to-r from-[#c8a2a5] to-[#ebdcd9] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${moodValue}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Social Compatibility Markers */}
            <div className="bg-[#fcf8f7] border border-[#eedddb] rounded-2xl p-4 flex flex-col gap-3">
              <span className="text-[11px] text-[#8a7274] tracking-wider font-sans font-bold">引力磁場契合</span>
              
              <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                {/* Lucky sign */}
                <div className="flex items-center gap-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="p-1 rounded-lg bg-emerald-100/80 text-emerald-600">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800/80">今日宜接觸</div>
                    <div className="font-extrabold text-emerald-950 font-sans mt-0.5">{luckyMatchSign}</div>
                  </div>
                </div>

                {/* Unlucky sign */}
                <div className="flex items-center gap-2.5 p-2 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="p-1 rounded-lg bg-rose-100/80 text-rose-600">
                    <ThumbsDown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-800/80">今日不宜接觸</div>
                    <div className="font-extrabold text-rose-950 font-sans mt-0.5">{unluckyMatchSign}</div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#8a7274] leading-relaxed pl-0.5 pt-1">
                ※ 宜接觸代表理念相容度高，不宜接觸代表今日彼此核心相位有微弱摩擦，合作或深入溝通需保持耐心。
              </p>
            </div>

          </div>

          {/* Right: Recommended items and daily quote */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            {/* Recommended ToDos */}
            <div className="bg-[#fcf8f7] border border-[#eedddb] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-1.5 mb-3.5">
                <Sparkles className="w-4 h-4 text-[#a66468]" />
                <span className="text-sm font-sans font-bold text-[#3a2829] tracking-wider">今日推薦三件事</span>
              </div>
              
              <div className="flex flex-col gap-3">
                {recommendedToDos.map((todo, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-[#4a3536] items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-white border border-[#eedddb] text-[#a66468] flex items-center justify-center font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed pt-0.5 font-sans font-medium hover:text-[#3a2829] transition-colors">{todo}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Daily Wisdom Note Card */}
      <div className="mt-6 pt-4 border-t border-[#eedddb] p-4 rounded-2xl bg-[#faf5f4] relative overflow-hidden text-left">
        <Heart className="absolute right-4 bottom-2.5 w-20 h-20 text-[#a66468]/5 rotate-12 select-none pointer-events-none" />
        <div className="flex items-start gap-3">
          <Quote className="w-4 h-4 text-[#a66468]/60 transform rotate-180 flex-shrink-0 mt-1" />
          <div>
            <span className="text-[11px] text-[#a66468] font-sans font-bold tracking-widest block mb-1">給今天的你小語</span>
            <p className="text-sm text-[#4a3536] italic font-semibold leading-relaxed font-sans pl-0.5">
              {wisdomQuote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
