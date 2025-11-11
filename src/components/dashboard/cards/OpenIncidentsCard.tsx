'use client';
import React from "react";
import { motion } from "framer-motion";

export default function OpenIncidentsCard({
  open = 45,
  total = 300,
  deltaPct = -2,
  periodLabel = "Month",
  sideTrend = [70,72,74,73,75,78,80], // mini right sparkline (% resolved)
  delay = 0,
}: { open?: number; total?: number; deltaPct?: number; periodLabel?: string; sideTrend?: number[]; delay?: number }) {
  const resolved = Math.max(0, total - open);
  const pctResolved = total ? Math.round((resolved/total)*100) : 0;

  // donut geometry
  const size = 120, stroke = 14, r = (size - stroke)/2, c = Math.PI*2*r;
  const openFrac = total ? open/total : 0;
  const openLen = c * openFrac;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-gray-800/40 bg-gray-900/50 p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">Open Incidents</div>
          <div className="text-3xl font-semibold mt-1">{open}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs rounded-md border border-gray-800 bg-gray-950 px-2 py-1">{periodLabel}</button>
          <span className={`text-xs ${deltaPct >= 0 ? 'text-emerald-400':'text-rose-400'}`}>
            {deltaPct >= 0 ? '↑' : '↓'} {Math.abs(deltaPct)}%
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[auto_1fr] gap-4 items-center">
        {/* donut */}
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size/2} cy={size/2} r={r} stroke="#1f2937" strokeWidth={stroke} fill="none" />
            <circle
              cx={size/2} cy={size/2} r={r}
              stroke="#3b82f6" strokeWidth={stroke} fill="none"
              strokeDasharray={`${openLen} ${c-openLen}`} strokeDashoffset="25"
              transform={`rotate(-90 ${size/2} ${size/2})`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <div className="text-xs text-gray-400">Total incidents</div>
              <div className="text-lg font-semibold">{total}</div>
            </div>
          </div>
        </div>

        {/* right stats */}
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-300">{pctResolved}% resolved</span>
            <span className="ml-auto text-[11px] text-gray-500">Open {open}</span>
          </div>
          {/* mini trend */}
          <MiniSparkline values={sideTrend} />
        </div>
      </div>
    </motion.div>
  );
}

function MiniSparkline({values}:{values:number[]}) {
  const w=160,h=40,p=4;
  const min=Math.min(...values), max=Math.max(...values);
  const x=(i:number)=>p+(i/(values.length-1))*(w-p*2);
  const y=(v:number)=>h-p-((v-min)/Math.max(1,(max-min)))*(h-p*2);
  const path=values.map((v,i)=>`${i===0?'M':'L'} ${x(i)},${y(v)}`).join(' ');
  return (
    <svg width={w} height={h} className="mt-2">
      <path d={path} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
