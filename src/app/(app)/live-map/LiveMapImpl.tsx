// src/app/(app)/live-map/LiveMapImpl.tsx
"use client";

import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, useMap } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import { useDisasterIncidents } from '@/lib/services/data-service';
import { aggregatePostsToCityCounts, CityPoint, postsForCity } from "@/lib/geo/aggregate";
import { BskyPost } from "@/types/post";

// Fit bounds helper
function UsaFitBounds({ points }: { points: { lat: number; lon: number }[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (!points.length) return;
    const b = L.latLngBounds(points.map(p => [p.lat, p.lon] as [number, number]));
    map.fitBounds(b.pad(0.2), { animate: true });
  }, [points, map]);
  return null;
}

// Numeric badge icon
function makeCountIcon(count: number) {
  const size = 26;
  return new DivIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:9999px;
        background:linear-gradient(180deg,#22D3EE,#0EA5E9);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:700;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.25);
        border:1px solid rgba(255,255,255,0.15);
        transform: translateY(-6px);
      ">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Center modal "bubble" with blur backdrop
function CenterModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[min(900px,92vw)] max-h-[80vh] overflow-hidden
                   rounded-2xl border border-white/10 bg-gray-900 shadow-2xl"
        role="dialog" aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full
                       hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh] p-4">{children}</div>
      </div>
    </div>
  );
}

function TweetRow({ p }: { p: BskyPost }) {
  const badge: Record<string, string> = {
    earthquake: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    wildfire: "bg-red-500/20 text-red-300 border border-red-500/30",
    flood: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    hurricane: "bg-green-500/20 text-green-300 border border-green-500/30",
    other: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  };
  const badgeClass = badge[p.disaster_type as keyof typeof badge] || badge.other;

  const rel = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const mins = Math.round((Date.now() - new Date(p.post_created_at).getTime()) / 60000);
  const relText = mins < 60 ? rel.format(-mins, "minute") : rel.format(-Math.round(mins / 60), "hour");

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-white/10 bg-gray-800/50 hover:bg-gray-800/70 transition">
      <div className={`h-6 shrink-0 rounded-full px-2 text-xs font-semibold flex items-center ${badge}`}>
        {p.disaster_type}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-200">
          <span className="font-medium">{p.location}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-gray-400">{relText}</span>
        </div>
        <div className="text-sm mt-1 text-gray-300">{p.post_text}</div>
      </div>
      <div className="text-xs text-gray-400 self-start">
        {(p.confidence * 100).toFixed(0)}%
      </div>
    </div>
  );
}

export default function LiveMapImpl() {
  // Centralized data fetching - replace with API call later
  const { data: posts } = useDisasterIncidents();
  const points = useMemo(() => aggregatePostsToCityCounts(posts), [posts]);

  const [openCity, setOpenCity] = useState<{ city: string; state: string } | null>(null);
  const cityPosts = useMemo(
    () => (openCity ? postsForCity(posts, openCity.city, openCity.state) : []),
    [openCity, posts]
  );

  const max = useMemo(() => Math.max(1, ...points.map((p: CityPoint) => p.count)), [points]);
  const radius = (v: number) => Math.min(30, Math.max(6, (v / max) * 24 + 6));

  return (
    <div className="w-full h-[calc(100vh-88px)] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 relative z-0">
      <MapContainer center={[37.8, -96]} zoom={4} scrollWheelZoom style={{ width: "100%", height: "100%", zIndex: 0 }}>
        {/* Free tiles (no token) */}
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
        />

        <UsaFitBounds points={points} />

        {points.map((p) => (
          <React.Fragment key={`${p.city}-${p.state}`}>
            {/* Glowing circle for density */}
            <CircleMarker
              center={[p.lat, p.lon]}
              radius={radius(p.count)}
              pathOptions={{
                color: "rgba(34,211,238,0.9)",       // border
                weight: 2,
                fillColor: "rgba(14,165,233,0.45)",   // fill
                fillOpacity: 0.45,
              }}
              eventHandlers={{
                click: () => setOpenCity({ city: p.city, state: p.state }),
              }}
            />

            {/* Numeric badge marker (clickable) */}
            <Marker
              position={[p.lat, p.lon]}
              icon={makeCountIcon(p.count)}
              eventHandlers={{ click: () => setOpenCity({ city: p.city, state: p.state }) }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {openCity && (
        <CenterModal
          title={`${openCity.city}, ${openCity.state}`}
          subtitle={`${cityPosts.length} detected incident${cityPosts.length === 1 ? "" : "s"} • Last 24h`}
          onClose={() => setOpenCity(null)}
        >
          <div className="flex flex-col gap-3">
            {cityPosts.map(p => <TweetRow key={p.id} p={p} />)}
            {cityPosts.length === 0 && (
              <div className="text-sm text-gray-400">No tweets for this city.</div>
            )}
          </div>
        </CenterModal>
      )}
    </div>
  );
}
