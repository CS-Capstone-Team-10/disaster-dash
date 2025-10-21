'use client';

import React, { useMemo, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import Sparkline from "@/components/ui/Sparkline";
import LiveFeed from "@/components/dashboard/LiveFeed";
import UsStateChoropleth from "@/components/UsStateChoropleth";
import { initialMetrics } from "@/data/mock";
import type { Disaster } from "@/types/incidents";

// helper: derive map data from live counts by state (mock placeholder)
import type { StateDisasterDatum } from "@/types/disaster";
function mockStateAgg(): StateDisasterDatum[] {
  // example minimal set; wire this to your real aggregations later
  return [
    { id: "US-CA", byType: { wildfire: 72, earthquake: 44, flood: 6 }, total: 122 },
    { id: "US-TX", byType: { flood: 48, hurricane: 22, other: 15 }, total: 85 },
    { id: "US-FL", byType: { hurricane: 41, flood: 18, other: 7 }, total: 66 },
    { id: "US-NY", byType: { other: 42, flood: 12 }, total: 54 },
    { id: "US-WA", byType: { wildfire: 12, flood: 13 }, total: 25 },
  ];
}

export default function Home() {
  const [disaster, setDisaster] = useState<Disaster>("all");
  const m = useMemo(() => initialMetrics, []);
  const stateAgg = useMemo(() => mockStateAgg(), []);

  return (
    <main className="p-5 md:p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">BlueSky Crisis — Overview</h1>
          <p className="text-sm text-gray-400">Track incidents and see live classified tweets.</p>
        </div>
        <div className="text-sm text-gray-400">{m.windowLabel}</div>
      </header>

      {/* Top KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Total Incidents" value={m.totalIncidents.toString()} delta="+4%">
          <Sparkline values={m.trendTotals} />
        </KpiCard>

        <KpiCard title="Average MTTR" value={`${m.avgMTTRHours.toFixed(1)} hours`} delta="+2%">
          <div className="h-28 flex items-center justify-center">
            <div className="text-xs text-gray-400">Current MTTR</div>
          </div>
        </KpiCard>

        <KpiCard title="Open Incidents" value={m.openIncidents.toString()} delta="-2%">
          <div className="text-xs text-gray-400 mt-1">
            {Math.round(m.resolvedPct * 100)}% resolved
          </div>
        </KpiCard>
      </section>

      {/* Map + Live Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-gray-800/40 bg-gray-900/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-semibold">US Heatmap</h2>
            <select
              value={disaster}
              onChange={(e) => setDisaster(e.target.value as Disaster)}
              className="border rounded px-2 py-1 text-sm bg-gray-950 border-gray-800"
            >
              <option value="all">All</option>
              <option value="earthquake">Earthquake</option>
              <option value="wildfire">Wildfire</option>
              <option value="flood">Flood</option>
              <option value="hurricane">Hurricane</option>
              <option value="other">Other</option>
            </select>
            <span className="text-xs text-gray-500">{m.windowLabel}</span>
          </div>
          <UsStateChoropleth
            data={stateAgg}
            disaster={disaster}
            timeWindowLabel={m.windowLabel}
            height={520}
            onStateClick={(id) => console.log("state clicked", id)}
          />
        </div>

        <div className="lg:col-span-1">
          <LiveFeed />
        </div>
      </section>
    </main>
  );
}
