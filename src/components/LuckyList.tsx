/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LuckyItems } from '../types';
import { 
  Palette, 
  Binary, 
  Gem, 
  Sprout, 
  Wind, 
  MapPin, 
  Clock, 
  Activity, 
  Navigation, 
  Compass, 
  Sparkles 
} from 'lucide-react';

interface LuckyListProps {
  luckyData: LuckyItems;
}

export default function LuckyList({ luckyData }: LuckyListProps) {
  const { 
    color, 
    colorHex, 
    number, 
    crystal, 
    plant, 
    scent, 
    place, 
    sport, 
    direction, 
    location, 
    timeSlot 
  } = luckyData;

  const bentoItems = [
    {
      title: "幸運色系",
      value: color,
      icon: <Palette className="w-4 h-4 text-[#a66468]" />,
      colorOverlayKey: "color",
      desc: "推薦今日穿搭、配件或屏保色系"
    },
    {
      title: "幸運數字",
      value: number.toString(),
      icon: <Binary className="w-4 h-4 text-[#a66468]" />,
      desc: "生活排序、隨時留意的幸運代碼"
    },
    {
      title: "開運水晶",
      value: crystal,
      icon: <Gem className="w-4 h-4 text-[#a66468]" />,
      desc: "淨化個人負電磁場的推薦載體"
    },
    {
      title: "守護植物",
      value: plant,
      icon: <Sprout className="w-4 h-4 text-[#a66468]" />,
      desc: "共振星象與大地之氣的生活綠植"
    },
    {
      title: "專屬香氛",
      value: scent,
      icon: <Wind className="w-4 h-4 text-[#a66468]" />,
      desc: "安撫五感、平緩呼吸的精油香調"
    },
    {
      title: "靈性場所",
      value: place,
      icon: <Compass className="w-4 h-4 text-[#a66468]" />,
      desc: "能讓你全然放慢靈魂腳步的空間"
    },
    {
      title: "和諧運動",
      value: sport,
      icon: <Activity className="w-4 h-4 text-[#a66468]" />,
      desc: "調理中樞經絡、排除情緒毒素的動作"
    },
    {
      title: "開運方位",
      value: direction,
      icon: <Navigation className="w-4 h-4 text-[#a66468]" />,
      desc: "今日出門會商、專注學習的最佳吉向"
    },
    {
      title: "幸運地點",
      value: location,
      icon: <MapPin className="w-4 h-4 text-[#a66468]" />,
      desc: "引動今日幸運遇合的物理開胃座標"
    },
    {
      title: "黃金時段",
      value: timeSlot,
      icon: <Clock className="w-4 h-4 text-[#a66468]" />,
      desc: "最易進入專注心流、許願重整的良辰"
    }
  ];

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="lucky-items-card">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 pb-6 border-b border-[#eedddb]">
        <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </span>
        <div className="text-left">
          <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">今日開運法寶清單</h2>
          <p className="text-sm text-[#8a7274] mt-0.5">每日幸運微調模組 • 對準今日最佳引力</p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 text-left">
        {bentoItems.map((item, idx) => {
          const isColor = item.colorOverlayKey === "color";
          const isNum = item.title.includes("數字");

          return (
            <div 
              key={idx}
              className="bg-[#faf6f5] border border-[#f0e4e2] rounded-2xl p-4 flex flex-col justify-between hover:border-[#eedddb] hover:bg-white transition-all duration-300 group shadow-xs"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center gap-1.5 text-[#8a7274] text-[10px] font-sans font-extrabold tracking-wider mb-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>

                {/* Display Value panel */}
                {isColor ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="w-4 h-4 rounded-full border border-[#eedddb] flex-shrink-0 shadow-inner animate-pulse"
                      style={{ backgroundColor: colorHex }}
                    />
                    <span className="text-xs font-sans font-bold text-[#3a2829] group-hover:text-[#a66468] transition-colors">
                      {item.value}
                    </span>
                  </div>
                ) : isNum ? (
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-black text-[#a66468] tracking-tighter drop-shadow-sm">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-[#8a7274]">號</span>
                  </div>
                ) : (
                  <div className="text-xs font-sans font-bold text-[#3a2829] group-hover:text-[#a66468] transition-colors leading-tight mt-1">
                    {item.value}
                  </div>
                )}
              </div>

              {/* Little detail block */}
              <p className="text-[9px] text-[#8a7274] leading-normal mt-3 border-t border-[#eedddb] pt-2 font-semibold">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
