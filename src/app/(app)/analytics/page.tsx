"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_TWEETS } from "@/lib/mock/tweets";
import {
  filterTweets,
  splitCurrentVsPrev,
  percentChange,
  seriesIncidentsOverTimeByType,
  topCities,
  confidenceHistogram,
  statusByType,
  sparklineData,
  type WindowKey,
  type Disaster,
} from "@/lib/analytics/aggregations";
import { KpiCard } from "@/components/analytics/KpiCard";
import { IncidentsStream } from "@/components/analytics/IncidentsStream";
import { TopCitiesBar } from "@/components/analytics/TopCitiesBar";
import { ConfidenceHistogram } from "@/components/analytics/ConfidenceHistogram";
import { StatusStackedByType } from "@/components/analytics/StatusStackedByType";

export default function AnalyticsPage() {
  const [window, setWindow] = useState<WindowKey>("24h");
  const [disasterType, setDisasterType] = useState<Disaster | "all">("all");
  const [minConfidence, setMinConfidence] = useState(0.5);

  // Filter tweets based on current selections
  const filtered = useMemo(
    () =>
      filterTweets(MOCK_TWEETS, {
        window,
        type: disasterType,
        minConf: minConfidence,
      }),
    [window, disasterType, minConfidence]
  );

  // Split current vs previous for KPI deltas
  const { current, previous } = useMemo(
    () => splitCurrentVsPrev(MOCK_TWEETS, window),
    [window]
  );

  // Apply same filters to current and previous
  const currentFiltered = useMemo(
    () =>
      current.filter(
        (t) =>
          (disasterType === "all" || t.type === disasterType) &&
          t.confidence >= minConfidence
      ),
    [current, disasterType, minConfidence]
  );

  const previousFiltered = useMemo(
    () =>
      previous.filter(
        (t) =>
          (disasterType === "all" || t.type === disasterType) &&
          t.confidence >= minConfidence
      ),
    [previous, disasterType, minConfidence]
  );

  // KPI calculations
  const totalIncidents = currentFiltered.length;
  const prevTotalIncidents = previousFiltered.length;
  const totalDelta = percentChange(totalIncidents, prevTotalIncidents);

  const openIncidents = currentFiltered.filter((t) => t.status !== "dismissed").length;
  const prevOpenIncidents = previousFiltered.filter((t) => t.status !== "dismissed").length;
  const openDelta = percentChange(openIncidents, prevOpenIncidents);

  const highConfidence = currentFiltered.filter((t) => t.confidence >= minConfidence).length;
  const highConfPct = currentFiltered.length > 0 ? (highConfidence / currentFiltered.length) * 100 : 0;

  const prevHighConfidence = previousFiltered.filter((t) => t.confidence >= minConfidence).length;
  const prevHighConfPct = previousFiltered.length > 0 ? (prevHighConfidence / previousFiltered.length) * 100 : 0;
  const confDelta = highConfPct - prevHighConfPct;

  // Top type
  const typeCounts = currentFiltered.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topType =
    Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  // Chart data
  const streamData = useMemo(() => seriesIncidentsOverTimeByType(filtered, window), [filtered, window]);
  const topCitiesData = useMemo(() => topCities(filtered, 10), [filtered]);
  const histogramData = useMemo(() => confidenceHistogram(filtered, 20), [filtered]);
  const statusData = useMemo(() => statusByType(filtered), [filtered]);
  const sparkData = useMemo(() => sparklineData(currentFiltered, window, 12), [currentFiltered, window]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Analytics Dashboard</h1>
        <p className="text-sm text-gray-400">
          Comprehensive metrics and insights from disaster incident data
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Window */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Time Window</label>
            <select
              value={window}
              onChange={(e) => setWindow(e.target.value as WindowKey)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Disaster Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Disaster Type</label>
            <select
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value as Disaster | "all")}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="earthquake">Earthquake</option>
              <option value="wildfire">Wildfire</option>
              <option value="flood">Flood</option>
              <option value="hurricane">Hurricane</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Confidence Threshold */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Confidence Threshold: {(minConfidence * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>95%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Incidents"
          value={totalIncidents}
          delta={totalDelta}
          sparklineData={sparkData}
        />
        <KpiCard
          title="Open Incidents"
          value={openIncidents}
          delta={openDelta}
        />
        <KpiCard
          title="High Confidence"
          value={`${highConfPct.toFixed(1)}%`}
          delta={confDelta}
        />
        <KpiCard
          title="Top Type"
          value={topType.charAt(0).toUpperCase() + topType.slice(1)}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents Over Time */}
        <div className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Incidents Over Time (by Type)
          </h2>
          <div className="h-80">
            <IncidentsStream data={streamData} />
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Top Cities
          </h2>
          <div className="h-80">
            <TopCitiesBar data={topCitiesData} />
          </div>
        </div>

        {/* Confidence Histogram */}
        <div className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Confidence Distribution
          </h2>
          <div className="h-80">
            <ConfidenceHistogram data={histogramData} threshold={minConfidence} />
          </div>
        </div>

        {/* Status by Type */}
        <div className="bg-gray-900/50 border border-gray-800/40 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Triage Status by Type
          </h2>
          <div className="h-80">
            <StatusStackedByType data={statusData} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
