'use client';

import React, { useMemo, useState } from "react";
import NewPosts from "@/components/tabs/NewPosts";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UsStateChoropleth from "@/components/UsStateChoropleth";
import { MOCK_STATE_DATA } from "@/data/stateMockData";
import type { Disaster } from "@/types/disaster";

export default function Home() {
  const [disaster, setDisaster] = useState<Disaster>("all");
  const data = useMemo(() => MOCK_STATE_DATA, []);

  return (
    <>
      <div className="flex-col h-screen">
        <div className="h-1/12 items-center p-4">
          <h1 className="text-4xl font-bold text-center">Disaster Dashboard</h1>
        </div>
        <div className="flex h-11/12 w-screen gap-4 p-4">
          <Card className="flex flex-col items-center max-w-md p-4 justify-between">
            <div className="flex flex-col items-center">
              <Button className="w-fit mb-4">Sidebar Button 1</Button>
              <Button className="w-fit mb-4">Sidebar Button 2</Button>
              <Button className="w-fit mb-4">Sidebar Button 3</Button>
              <Button className="w-fit mb-4">Sidebar Button 4</Button>
            </div>
            <AnimatedThemeToggler />
          </Card>
          <Tabs defaultValue="newPosts" className="w-full">
            <TabsList>
              <TabsTrigger value="newPosts">New Posts</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="trending">Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="newPosts">
              <Card className="w-full h-full flex items-center justify-center p-4">
                <NewPosts />
              </Card>
            </TabsContent>
            <TabsContent value="heatmap">
              <Card className="w-full h-full p-4 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold">US Disaster Heatmap</h2>
                  <label className="text-sm text-gray-600">Disaster Type:</label>
                  <select
                    value={disaster}
                    onChange={(e) => setDisaster(e.target.value as Disaster)}
                    className="border rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="all">All Disasters</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="flood">Flood</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="text-sm text-gray-500">Last 24h</span>
                </div>
                <UsStateChoropleth
                  data={data}
                  disaster={disaster}
                  timeWindowLabel="Last 24h"
                  onStateClick={(id) => console.log("Clicked state:", id)}
                  height={600}
                />
              </Card>
            </TabsContent>
            <TabsContent value="trending">
              <Card className="w-full h-full flex items-center justify-center p-4">
                <p className="text-2xl">Charts Content Area</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
