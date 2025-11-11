"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

type ConfidenceHistogramProps = {
  data: Array<{ bin: number; label: string; n: number }>;
  threshold?: number;
};

export function ConfidenceHistogram({ data, threshold = 0.7 }: ConfidenceHistogramProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const thresholdBin = Math.floor(threshold * data.length);

  return (
    <div className="relative w-full h-full">
      <ResponsiveBar
        data={data}
        keys={["n"]}
        indexBy="label"
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        padding={0.1}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(d) => {
          const binNum = data.findIndex((item) => item.label === d.indexValue);
          return binNum >= thresholdBin ? "#22c55e" : "#3b82f6";
        }}
        borderRadius={2}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Confidence Range",
          legendPosition: "middle",
          legendOffset: 48,
          renderTick: (tick) => {
            // Only show every 4th tick on mobile
            if (data.length > 10 && tick.tickIndex % 4 !== 0) {
              return null;
            }
            return (
              <g transform={`translate(${tick.x},${tick.y})`}>
                <text
                  textAnchor="end"
                  dominantBaseline="central"
                  transform="rotate(-45)"
                  style={{
                    fill: "#9ca3af",
                    fontSize: 10,
                  }}
                >
                  {tick.value}
                </text>
              </g>
            );
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={false}
        enableGridY={true}
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
      {/* Threshold marker */}
      <div
        className="absolute top-6 text-xs text-green-400"
        style={{ left: `${(thresholdBin / data.length) * 100}%` }}
      >
        <div className="relative">
          <div className="absolute h-48 w-px bg-green-400/50 -left-px" />
          <div className="absolute -top-4 -left-12 whitespace-nowrap">
            Threshold: {(threshold * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
