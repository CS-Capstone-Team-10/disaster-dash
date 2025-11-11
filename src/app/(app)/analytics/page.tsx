"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDisasterIncidents } from "@/lib/services/data-service";
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
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export default function AnalyticsPage() {
  const [window, setWindow] = useState<WindowKey>("24h");
  const [disasterType, setDisasterType] = useState<Disaster | "all">("all");
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [mounted, setMounted] = useState(false);

  // Centralized data fetching - replace with API call later
  const { data: MOCK_TWEETS, loading } = useDisasterIncidents();

  // Prevent hydration mismatch by only calculating after client mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter tweets based on current selections
  const filtered = useMemo(
    () =>
      mounted ? filterTweets(MOCK_TWEETS, {
        window,
        type: disasterType,
        minConf: minConfidence,
      }) : [],
    [mounted, window, disasterType, minConfidence]
  );

  // Split current vs previous for KPI deltas
  const { current, previous } = useMemo(
    () => mounted ? splitCurrentVsPrev(MOCK_TWEETS, window) : { current: [], previous: [] },
    [mounted, window]
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
  const streamData = useMemo(() => mounted ? seriesIncidentsOverTimeByType(filtered, window) : [], [mounted, filtered, window]);
  const topCitiesData = useMemo(() => mounted ? topCities(filtered, 10) : [], [mounted, filtered]);
  const histogramData = useMemo(() => mounted ? confidenceHistogram(filtered, 20) : [], [mounted, filtered]);
  const statusData = useMemo(() => mounted ? statusByType(filtered) : [], [mounted, filtered]);
  const sparkData = useMemo(() => mounted ? sparklineData(currentFiltered, window, 12) : [], [mounted, currentFiltered, window]);

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
          <DropdownMenu
            label="Time Window"
            value={window}
            onChange={(value) => setWindow(value as WindowKey)}
            options={[
              { value: "1h", label: "Last Hour" },
              { value: "24h", label: "Last 24 Hours" },
              { value: "7d", label: "Last 7 Days" }
            ]}
          />

          {/* Disaster Type */}
          <DropdownMenu
            label="Disaster Type"
            value={disasterType}
            onChange={(value) => setDisasterType(value as Disaster | "all")}
            options={[
              { value: "all", label: "All Types" },
              { value: "earthquake", label: "Earthquake" },
              { value: "wildfire", label: "Wildfire" },
              { value: "flood", label: "Flood" },
              { value: "hurricane", label: "Hurricane" },
              { value: "other", label: "Other" }
            ]}
          />

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
