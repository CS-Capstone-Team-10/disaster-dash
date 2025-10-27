// src/app/(app)/live-map/page.tsx
"use client";
import dynamic from "next/dynamic";

const LiveMapImpl = dynamic(() => import("./LiveMapImpl"), { ssr: false });

export default function LiveMapPage() {
  return <LiveMapImpl />;
}
