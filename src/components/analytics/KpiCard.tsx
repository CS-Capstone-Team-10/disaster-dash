"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

type KpiCardProps = {
  title: string;
  value: number | string;
  delta?: number;
  sparklineData?: Array<{ x: string; y: number }>;
  format?: (v: number) => string;
};

export function KpiCard({
  title,
  value,
  delta,
  sparklineData,
  format = (v) => v.toString(),
}: KpiCardProps) {
  const deltaColor =
    delta === undefined || delta === 0
      ? "text-muted-foreground"
      : delta > 0
      ? "text-green-400"
      : "text-red-400";

  const deltaIcon =
    delta === undefined || delta === 0 ? (
      <Minus className="w-3 h-3" />
    ) : delta > 0 ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );

  return (
    <div className="bg-card/50 border border-border/40 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">
            {typeof value === "number" ? format(value) : value}
          </p>
          {delta !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${deltaColor}`}>
              {deltaIcon}
              <span>{Math.abs(delta).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-12">
            <ResponsiveLine
              data={[{ id: "spark", data: sparklineData.map((d) => ({ x: d.x, y: d.y })) }]}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              curve="monotoneX"
              enableGridX={false}
              enableGridY={false}
              enablePoints={false}
              enableArea={true}
              areaOpacity={0.2}
              colors={["#3b82f6"]}
              lineWidth={2}
              isInteractive={false}
              theme={{
                background: "transparent",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
