'use client';
import React, { useState } from "react";
import { useLiveTweetStream } from '@/lib/services/data-service';

const colorByType: Record<string,string> = {
  earthquake: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
  wildfire:   "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
  flood:      "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30",
  hurricane:  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  other:      "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30"
};

export default function LiveFeed() {
  // Centralized data fetching - replace with API call/WebSocket later
  const items = useLiveTweetStream();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800/40 bg-gray-100 dark:bg-gray-900/50 p-4 flex flex-col" style={{ maxHeight: '1000px' }}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Live Feed</h3>
        <span className="text-xs text-gray-600 dark:text-gray-400">{items.length} items</span>
      </div>
      <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
        {items.map(t => (
          <li key={t.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-950/50">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{t.handle}</div>
              <div className={`text-[10px] px-2 py-0.5 rounded border ${colorByType[t.disaster]}`}>
                {t.disaster}
              </div>
            </div>
            <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">{t.text}</p>
            <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400 suppressHydrationWarning">
              {t.city || t.stateId} · {mounted ? (new Date(t.timestamp)).toLocaleTimeString() : '--:--:--'} · conf {(t.confidence ?? 0).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
