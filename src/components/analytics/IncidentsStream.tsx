"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveStream = dynamic(
  () => import("@nivo/stream").then((m) => m.ResponsiveStream),
  { ssr: false }
);

type StreamDataPoint = {
  x: string;
  earthquake: number;
  wildfire: number;
  flood: number;
  hurricane: number;
  other: number;
};

type IncidentsStreamProps = {
  data: StreamDataPoint[];
};

const COLORS = {
  earthquake: "#f97316",
  wildfire: "#ef4444",
  flood: "#3b82f6",
  hurricane: "#22c55e",
  other: "#a855f7",
};

export function IncidentsStream({ data }: IncidentsStreamProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const keys = ["earthquake", "wildfire", "flood", "hurricane", "other"];

  return (
    <ResponsiveStream
      data={data}
      keys={keys}
      margin={{ top: 20, right: 110, bottom: 50, left: 50 }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        format: (value) => {
          const d = new Date(value);
          return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      offsetType="silhouette"
      colors={(d) => COLORS[d.id as keyof typeof COLORS] || "#999"}
      fillOpacity={0.85}
      borderColor={{ theme: "background" }}
      enableGridX={false}
      enableGridY={true}
      curve="catmullRom"
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          translateX: 100,
          itemWidth: 80,
          itemHeight: 20,
          itemTextColor: "#9ca3af",
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
      theme={{
        background: "transparent",
        text: {
          fill: "#9ca3af",
          fontSize: 11,
        },
        axis: {
          domain: {
            line: {
              stroke: "#374151",
              strokeWidth: 1,
            },
          },
          ticks: {
            line: {
              stroke: "#374151",
              strokeWidth: 1,
            },
            text: {
              fill: "#9ca3af",
            },
          },
        },
        grid: {
          line: {
            stroke: "#374151",
            strokeWidth: 0.5,
          },
        },
        tooltip: {
          container: {
            background: "#1f2937",
            color: "#f3f4f6",
            fontSize: "12px",
            borderRadius: "8px",
            border: "1px solid #374151",
          },
        },
      }}
    />
  );
}
