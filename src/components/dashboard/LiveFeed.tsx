'use client';
import React, { useEffect, useState } from "react";
import { ClassifiedTweet } from "@/types/incidents";
import { MOCK_CLASSIFIED_TWEETS, subscribeToTweetStream, startMockTweetPump } from "@/lib/mock";

const colorByType: Record<string,string> = {
  earthquake: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  wildfire:   "bg-red-500/20 text-red-300 border-red-500/30",
  flood:      "bg-sky-500/20 text-sky-300 border-sky-500/30",
  hurricane:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  other:      "bg-violet-500/20 text-violet-300 border-violet-500/30"
};

export default function LiveFeed() {
  const [items, setItems] = useState<ClassifiedTweet[]>(MOCK_CLASSIFIED_TWEETS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    startMockTweetPump();
    return subscribeToTweetStream((t) => {
      setItems((prev) => [t, ...prev].slice(0, 50));
    });
  }, []);

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 flex flex-col" style={{ maxHeight: '1000px' }}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-semibold text-foreground">Live Feed</h3>
        <span className="text-xs text-muted-foreground">{items.length} items</span>
      </div>
      <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
        {items.map(t => (
          <li key={t.id} className="p-3 rounded-xl border border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm text-foreground">{t.handle}</div>
              <div className={`text-[10px] px-2 py-0.5 rounded border ${colorByType[t.disaster]}`}>
                {t.disaster}
              </div>
            </div>
            <p className="text-sm mt-1 text-foreground">{t.text}</p>
            <div className="mt-2 text-[11px] text-muted-foreground suppressHydrationWarning">
              {t.city || t.stateId} · {mounted ? (new Date(t.timestamp)).toLocaleTimeString() : '--:--:--'} · conf {(t.confidence ?? 0).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
