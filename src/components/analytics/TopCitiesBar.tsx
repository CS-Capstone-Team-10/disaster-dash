"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

type TopCitiesBarProps = {
  data: Array<{ cityState: string; count: number }>;
};

export function TopCitiesBar({ data }: TopCitiesBarProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveBar
      data={data}
      keys={["count"]}
      indexBy="cityState"
      layout="horizontal"
      margin={{ top: 10, right: 20, bottom: 40, left: 140 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors="#3b82f6"
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Incidents",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableGridY={false}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#fff"
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
          legend: {
            text: {
              fill: "#9ca3af",
              fontSize: 12,
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
