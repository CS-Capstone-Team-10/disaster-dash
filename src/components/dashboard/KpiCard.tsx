'use client';
import React from "react";

export default function KpiCard({
  title, value, delta, children
}: { title: string; value: string; delta?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        {!!delta && <span className="text-xs text-emerald-400">{delta}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
