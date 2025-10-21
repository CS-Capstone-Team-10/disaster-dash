'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_usaLow from "@amcharts/amcharts5-geodata/usaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import type { Disaster, StateDisasterDatum } from "@/types/disaster";

type Props = {
  data: StateDisasterDatum[];          // one row per state
  disaster: Disaster;                  // which metric to visualize
  onStateClick?: (stateId: string) => void;
  timeWindowLabel?: string;            // e.g., "Last 24h"
  height?: number | string;            // default 560
};

// simple per-disaster color ramps (start→end)
const DISASTER_COLORS: Record<Disaster, [number, number]> = {
  all:        [0xB3E5FC, 0x0288D1],   // light blue → deep blue
  earthquake: [0xFFE0B2, 0xE65100],   // sand → burnt orange
  wildfire:   [0xFFCDD2, 0xB71C1C],   // pink → red
  flood:      [0xBBDEFB, 0x0D47A1],   // light blue → navy
  hurricane:  [0xC8E6C9, 0x1B5E20],   // pale green → dark green
  other:      [0xD1C4E9, 0x4527A0],   // lavender → purple
};

export default function UsStateChoropleth({
  data,
  disaster,
  onStateClick,
  timeWindowLabel,
  height = 560,
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);

  // derive chart rows: {id, value}
  const seriesData = useMemo(() => {
    return data.map(d => {
      const value = disaster === "all"
        ? (typeof d.total === "number"
            ? d.total
            : Object.values(d.byType ?? {}).reduce((a, b) => a + (b ?? 0), 0))
        : (d.byType?.[disaster] ?? 0);
      return { id: d.id, value };
    });
  }, [data, disaster]);

  const [startColor, endColor] = DISASTER_COLORS[disaster];

  useEffect(() => {
    if (!divRef.current) return;

    // dispose old root (hot reload safety)
    if (rootRef.current) rootRef.current.dispose();

    const root = am5.Root.new(divRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoAlbersUsa(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        layout: root.horizontalLayout
      })
    );

    const series = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_usaLow,
        valueField: "value",
        calculateAggregates: true,
      })
    );

    series.mapPolygons.template.setAll({
      tooltipText: "{name}: {value.formatNumber('#,###')}",
      interactive: true,
      strokeOpacity: 0.75,
      strokeWidth: 0.8
    });

    // hover & click
    series.mapPolygons.template.states.create("hover", {
      stroke: am5.color(0xffffff),
      strokeWidth: 1.2,
      shadowColor: am5.color(0x000000),
      shadowBlur: 3,
    });

    if (onStateClick) {
      series.mapPolygons.template.events.on("click", (ev) => {
        const id = ev.target.dataItem?.get("id");
        if (id) onStateClick(id);
      });
    }

    // heat colors
    series.set("heatRules", [{
      target: series.mapPolygons.template,
      dataField: "value",
      min: am5.color(startColor),
      max: am5.color(endColor),
      key: "fill"
    }]);

    // legend
    const legend = chart.children.push(am5.HeatLegend.new(root, {
      orientation: "vertical",
      startColor: am5.color(startColor),
      endColor: am5.color(endColor),
      startText: "Low",
      endText: "High",
      stepCount: 5,
      paddingLeft: 12,
      paddingTop: 12
    }));

    // Color the legend labels to match the gradient
    legend.startLabel.setAll({
      fill: am5.color(startColor),
      fontWeight: "600"
    });
    legend.endLabel.setAll({
      fill: am5.color(endColor),
      fontWeight: "600"
    });

    series.events.on("datavalidated", () => {
      legend.set("startValue", series.getPrivate("valueLow"));
      legend.set("endValue", series.getPrivate("valueHigh"));
    });

    series.mapPolygons.template.events.on("pointerover", (ev) => {
      const v = ev.target.dataItem?.get("value");
      if (v != null) legend.showValue(v);
    });

    // title / subtitle (optional)
    const label = root.container.children.push(
      am5.Label.new(root, {
        x: 0, y: 0,
        text: `US Disaster Heatmap — ${disaster.toUpperCase()}${timeWindowLabel ? ` · ${timeWindowLabel}` : ''}`,
        fontSize: 14, fill: am5.color(0x444444), paddingLeft: 12, paddingTop: 8
      })
    );
    label.setAll({ clickable: false });

    // initial data
    series.data.setAll(seriesData);

    return () => {
      root.dispose();
      rootRef.current = null;
    };
    // init only once; dynamic updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update data or colors when props change
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chart = root.container.children.getIndex(0) as am5map.MapChart;
    const series = chart.series.getIndex(0) as am5map.MapPolygonSeries;
    const legend = chart.children.getIndex(1) as am5.HeatLegend;

    // update palette
    series.set("heatRules", [{
      target: series.mapPolygons.template,
      dataField: "value",
      min: am5.color(startColor),
      max: am5.color(endColor),
      key: "fill"
    }]);

    // update legend colors
    if (legend) {
      legend.setAll({
        startColor: am5.color(startColor),
        endColor: am5.color(endColor)
      });

      // update label colors (check if labels exist)
      if (legend.startLabel) {
        legend.startLabel.set("fill", am5.color(startColor));
      }
      if (legend.endLabel) {
        legend.endLabel.set("fill", am5.color(endColor));
      }
    }

    // refresh data
    series.data.setAll(seriesData);
  }, [seriesData, startColor, endColor]);

  return (
    <div style={{ width: "100%", height }}>
      <div ref={divRef} style={{ width: "100%", height: "100%" }} />
      <div className="text-[10px] text-gray-500 pt-1 pl-1">© amCharts</div>
    </div>
  );
}
