'use client';
import React from "react";
import { motion } from "framer-motion";

type Point = { date: string; value: number }; // ISO date, count

export default function TotalIncidentsCard({
  data, // sorted by date asc
  deltaPct = 4,
  periodLabel = "Month",
  delay = 0,
}: { data: Point[]; deltaPct?: number; periodLabel?: string; delay?: number }) {
  const total = data.at(-1)?.value ?? 0;
  const w = 260, h = 90, pad = 6;
  const vals = data.map(d => d.value);
  const vMin = Math.min(...vals), vMax = Math.max(...vals);
  // Round coordinates to prevent hydration mismatches
  const x = (i:number) => Math.round((pad + (i/(data.length-1)) * (w - pad*2)) * 100) / 100;
  const y = (v:number) => Math.round((h - pad - ((v - vMin) / Math.max(1,(vMax - vMin))) * (h - pad*2)) * 100) / 100;
  const dAttr = data.map((p,i)=>`${i===0?'M':'L'} ${x(i)},${y(p.value)}`).join(' ');
  const bottomTicks = [0, Math.floor((data.length-1)/2), data.length-1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-gray-800/40 bg-gray-900/50 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">Total Incidents</div>
          <div className="text-3xl font-semibold mt-1">{total}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs rounded-md border border-gray-800 bg-gray-950 px-2 py-1">{periodLabel}</button>
          <span className="text-xs text-emerald-400">↑ {deltaPct}%</span>
        </div>
      </div>

      <div className="mt-3">
        <svg width={w} height={h} className="w-full">
          {/* line */}
          <path d={dAttr} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
          {/* gradient fill */}
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path
            d={`${dAttr} L ${x(data.length-1)},${h-pad} L ${x(0)},${h-pad} Z`}
            fill="url(#g)" opacity={0.6}
          />
        </svg>
        {/* bottom axis ticks & labels */}
        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
          {bottomTicks.map(i => (
            <span key={i}>{new Date(data[i].date).toLocaleDateString(undefined,{month:'short', day:'2-digit'})}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
