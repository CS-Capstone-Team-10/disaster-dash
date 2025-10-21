'use client';
import React from "react";
import { motion } from "framer-motion";

export default function AvgMttrCard({
  valueHours = 4.2,
  targetHours = 4.0,           // needle target marker
  deltaPct = 2,
  periodLabel = "Month",
  delay = 0,
}: { valueHours?: number; targetHours?: number; deltaPct?: number; periodLabel?: string; delay?: number }) {
  // gauge config
  const min = 0, max = 12;
  const pct = Math.min(1, Math.max(0, (valueHours - min) / (max - min)));
  const targetPct = Math.min(1, Math.max(0, (targetHours - min) / (max - min)));
  const r = 90, cx = 110, cy = 110;
  const arc = (p:number) => {
    const a = Math.PI * (1 + p); // 180°..360°
    // Round to 2 decimal places to prevent hydration mismatches
    return [
      Math.round((cx + r*Math.cos(a)) * 100) / 100,
      Math.round((cy + r*Math.sin(a)) * 100) / 100
    ];
  };
  const [xEnd, yEnd] = arc(pct);
  const [xT, yT]   = arc(targetPct);

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
          <div className="text-sm text-gray-400">Average MTTR</div>
          <div className="text-3xl font-semibold mt-1">{valueHours.toFixed(1)} hours</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs rounded-md border border-gray-800 bg-gray-950 px-2 py-1">{periodLabel}</button>
          <span className="text-xs text-emerald-400">↑ {deltaPct}%</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <svg width="220" height="120" viewBox="0 0 220 120">
          {/* background arc */}
          <path d="M20,110 A90,90 0 0,1 200,110" fill="none" stroke="#1f2937" strokeWidth="14" />
          {/* colored segments: optimal / caution / critical */}
          <path d="M20,110 A90,90 0 0,1 110,110" fill="none" stroke="#10b981" strokeWidth="14" />
          <path d="M110,110 A90,90 0 0,1 165,110" fill="none" stroke="#f59e0b" strokeWidth="14" />
          <path d="M165,110 A90,90 0 0,1 200,110" fill="none" stroke="#ef4444" strokeWidth="14" />
          {/* value arc */}
          <path d={`M20,110 A90,90 0 0,1 ${xEnd},${yEnd}`} fill="none" stroke="#a78bfa" strokeWidth="6" />
          {/* target tick */}
          <line x1={xT} y1={yT} x2={xT} y2={yT-10} stroke="#f59e0b" strokeWidth="2" />
        </svg>
      </div>

      <div className="text-center text-xs text-gray-400 -mt-2">Current MTTR</div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px]">
        <span className="flex items-center gap-1 text-gray-300"><i className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Optimal</span>
        <span className="flex items-center gap-1 text-gray-300"><i className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Caution</span>
        <span className="flex items-center gap-1 text-gray-300"><i className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
      </div>
    </motion.div>
  );
}
