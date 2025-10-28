"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

type StatusStackedByTypeProps = {
  data: Array<{ type: string; new: number; triaged: number; dismissed: number }>;
};

const STATUS_COLORS = {
  new: "#3b82f6",
  triaged: "#eab308",
  dismissed: "#6b7280",
};

export function StatusStackedByType({ data }: StatusStackedByTypeProps) {
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
      keys={["new", "triaged", "dismissed"]}
      indexBy="type"
      margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(d) => STATUS_COLORS[d.id as keyof typeof STATUS_COLORS] || "#999"}
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -15,
        legend: "Disaster Type",
        legendPosition: "middle",
        legendOffset: 42,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#fff"
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 80,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 12,
          itemTextColor: "#9ca3af",
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
