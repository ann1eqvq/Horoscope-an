/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeeklyHoroscope as WeeklyHoroscopeType, WeeklyLuckTrend } from '../types';
import { AreaChart, TrendingUp, Sparkles, AlertTriangle, Trophy, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface WeeklyHoroscopeProps {
  weeklyData: WeeklyHoroscopeType;
}

export default function WeeklyHoroscope({ weeklyData }: WeeklyHoroscopeProps) {
  const { trend, weeklyBest, weeklyBestDetails, weeklyWarning, weeklyWarningDetails } = weeklyData;
  const [activeMetric, setActiveMetric] = useState<'overall' | 'love' | 'career' | 'wealth'>('overall');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Custom SVG line plotting logic
  const width = 500;
  const height = 130;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // X coordinate calculation
  const getX = (index: number) => {
    return paddingLeft + (index / (trend.length - 1)) * chartWidth;
  };

  // Y coordinate calculation (values range from 50 to 100 on the graph)
  const getY = (value: number) => {
    // scale from 50 (bottom) to 100 (top) for better visual dispersion
    const minVal = 55;
    const maxVal = 100;
    const ratio = (value - minVal) / (maxVal - minVal);
    // invert because SVG 0 is at the top
    return paddingTop + chartHeight - (ratio * chartHeight);
  };

  // Metric metadata
  const metricConfigs = {
    overall: { label: "整體運勢", color: "#b45309", glowColor: "rgba(180, 83, 9, 0.4)", textClass: "text-[#b45309]" },
    love: { label: "桃花人緣", color: "#be185d", glowColor: "rgba(190, 24, 93, 0.4)", textClass: "text-[#be185d]" },
    career: { label: "事業學業", color: "#0369a1", glowColor: "rgba(3, 105, 161, 0.4)", textClass: "text-[#0369a1]" },
    wealth: { label: "財富財帛", color: "#047857", glowColor: "rgba(4, 120, 87, 0.4)", textClass: "text-[#047857]" }
  };

  // Build the SVG path (using a smooth curve or polyline)
  const generatePath = (metric: 'overall' | 'love' | 'career' | 'wealth') => {
    const points = trend.map((day, idx) => {
      const x = getX(idx);
      const y = getY(day[metric]);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return points;
  };

  // Build the closed path for background glow gradient
  const generateAreaPath = (metric: 'overall' | 'love' | 'career' | 'wealth') => {
    const linePath = generatePath(metric);
    const firstX = getX(0);
    const lastX = getX(trend.length - 1);
    const bottomY = paddingBottom + chartHeight + paddingTop;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="bg-white border border-[#eedddb] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="weekly-horoscope-card">
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#be9f9d]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eedddb] gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#be9f9d]/10 text-[#a66468] border border-[#eedddb]/40">
              <TrendingUp className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-sans font-bold text-[#3a2829] tracking-wider">本週運勢曲線</h2>
          </div>
          <p className="text-sm text-[#8a7274] mt-1">接下來 7 天動態星象能量趨勢疊加分析</p>
        </div>

        {/* Chart Selector Buttons */}
        <div className="flex flex-wrap p-1.5 bg-[#faf6f5] rounded-xl border border-[#eedddb] self-start">
          {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-3 py-1 text-[11px] font-sans font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                activeMetric === m
                  ? "bg-[#be9f9d] text-white shadow-xs"
                  : "text-[#8a7274] hover:text-[#3a2829]"
              }`}
            >
              {metricConfigs[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left: Beautiful Customized SVG Line Chart */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="bg-[#faf6f5] border border-[#eedddb] rounded-2xl p-4 relative overflow-hidden">
            {/* Legend guide */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-[#8a7274] uppercase tracking-widest font-mono font-bold">星象能量走勢圖</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricConfigs[activeMetric].color }} />
                <span className="text-[10px] text-[#3a2829] font-sans font-extrabold">
                  {metricConfigs[activeMetric].label}平均值：
                  {(trend.reduce((sum, d) => sum + d[activeMetric], 0) / trend.length).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Custom Responsive SVG */}
            <div className="w-full relative overflow-visible">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                width="100%" 
                className="overflow-visible select-none"
              >
                <defs>
                  {/* Subtle vertical graph area glow */}
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metricConfigs[activeMetric].color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={metricConfigs[activeMetric].color} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Background Horizontal Lines */}
                {[100, 85, 70, 55].map((val) => (
                  <g key={val}>
                    <line 
                      x1={paddingLeft} 
                      y1={getY(val)} 
                      x2={width - paddingRight} 
                      y2={getY(val)} 
                      stroke="#eedddb" 
                      strokeWidth="1" 
                      strokeDasharray="4,4"
                      strokeOpacity="0.8"
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={getY(val) + 3} 
                      fill="#8a7274" 
                      className="text-[9px] font-mono font-bold text-right"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {/* Shaded area gradient under line */}
                <path 
                  d={generateAreaPath(activeMetric)} 
                  fill="url(#areaGlow)" 
                  className="transition-all duration-700"
                />

                {/* Main Glowing Line Path */}
                <path 
                  d={generatePath(activeMetric)} 
                  fill="none" 
                  stroke={metricConfigs[activeMetric].color} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-all duration-700"
                />

                {/* Hover interactions & Grid marker lines */}
                {hoveredDayIndex !== null && (
                  <line 
                    x1={getX(hoveredDayIndex)} 
                    y1={paddingTop} 
                    x2={getX(hoveredDayIndex)} 
                    y2={paddingTop + chartHeight} 
                    stroke="#eedddb" 
                    strokeWidth="1.2" 
                    strokeOpacity="0.6"
                  />
                )}

                {/* Scatter Plot Points */}
                {trend.map((day, idx) => {
                  const cx = getX(idx);
                  const cy = getY(day[activeMetric]);
                  const isHovered = hoveredDayIndex === idx;

                  return (
                    <g 
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onMouseLeave={() => setHoveredDayIndex(null)}
                    >
                      {/* Transparent wider touch circle */}
                      <circle cx={cx} cy={cy} r="14" fill="transparent" />

                      {/* Main point outer glow */}
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isHovered ? "8" : "4"} 
                        fill={metricConfigs[activeMetric].color} 
                        fillOpacity={isHovered ? "0.25" : "0.15"}
                        className="transition-all duration-200"
                      />
                      {/* Main point bubble dot */}
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isHovered ? "4" : "2.5"} 
                        fill={metricConfigs[activeMetric].color} 
                        stroke="white" 
                        strokeWidth="1" 
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}

                {/* Bottom X-Axis labels (Days of week) */}
                {trend.map((day, idx) => (
                  <text 
                    key={idx}
                    x={getX(idx)} 
                    y={height - 2} 
                    fill={hoveredDayIndex === idx ? "#a66468" : "#8a7274"} 
                    className={`text-[9px] font-sans font-extrabold transition-colors ${hoveredDayIndex === idx ? "font-black" : "font-semibold"}`}
                    textAnchor="middle"
                  >
                    {day.dayName}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Interactive Tooltip Card */}
          <div className="bg-white border border-[#eedddb] rounded-xl p-3 text-xs flex justify-between items-center mt-3 shadow-xs">
            {hoveredDayIndex !== null ? (
              <div className="flex items-center justify-between w-full animate-fade-in font-sans">
                <span className="text-[#8a7274] flex items-center gap-1">
                  📅 <strong className="text-[#3a2829] font-bold">{trend[hoveredDayIndex].dayName} ({trend[hoveredDayIndex].dateStr})</strong>：
                </span>
                <div className="flex gap-4">
                  <span className="text-[#b45309] font-extrabold">整體: {trend[hoveredDayIndex].overall}%</span>
                  <span className="text-[#be185d] font-extrabold">桃花: {trend[hoveredDayIndex].love}%</span>
                  <span className="text-[#0369a1] font-extrabold">學業: {trend[hoveredDayIndex].career}%</span>
                  <span className="text-[#047857] font-extrabold">財富: {trend[hoveredDayIndex].wealth}%</span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-[#8a7274] italic flex items-center gap-1.5 w-full justify-center py-0.5 font-semibold">
                <Eye className="w-3.5 h-3.5" /> Hover/滑鼠懸停於上方度數點，即可查看每日指標度數細節
              </p>
            )}
          </div>
        </div>

        {/* Right: Specific alerts (Best and To Avoid) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4 text-left">
          
          {/* Weekly Best (本週最佳) */}
          <div className="bg-gradient-to-r from-emerald-50 via-[#faf6f5] to-transparent border border-emerald-200 rounded-2xl p-4.5">
            <div className="flex items-center gap-1.5 text-emerald-800 font-sans font-bold text-sm mb-2">
              <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                <Trophy className="w-4 h-4" />
              </div>
              <span>本週核心開運位</span>
            </div>
            <strong className="text-xs text-emerald-950 block mb-1 font-sans font-bold">{weeklyBest}</strong>
            <p className="text-sm text-[#4a3536] leading-relaxed font-sans font-medium">
              {weeklyBestDetails}
            </p>
          </div>

          {/* Weekly Warning (本週要小心) */}
          <div className="bg-gradient-to-r from-rose-50 via-[#faf6f5] to-transparent border border-rose-200 rounded-2xl p-4.5">
            <div className="flex items-center gap-1.5 text-rose-800 font-sans font-bold text-sm mb-2">
              <div className="p-1 rounded-md bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span>本週反思避坑雷區</span>
            </div>
            <strong className="text-xs text-rose-950 block mb-1 font-sans font-bold">{weeklyWarning}</strong>
            <p className="text-sm text-[#4a3536] leading-relaxed font-sans font-medium">
              {weeklyWarningDetails}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
