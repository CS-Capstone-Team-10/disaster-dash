'use client';

import NewPosts from "@/components/tabs/NewPosts";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DisasterGlobe, generateMockData } from "@/components/globe";

export default function Home() {
  const mockData = generateMockData();

  return (
    <>
      <div className="flex-col h-screen">
        <div className="h-1/12 items-center p-4">
          <h1 className="text-4xl font-bold text-center">Dashboard Title</h1>
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
              <TabsTrigger value="popular">Heatmap</TabsTrigger>
              <TabsTrigger value="trending">Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="newPosts">
              <Card className="w-full h-full flex items-center justify-center p-4">
                <NewPosts />
              </Card>
            </TabsContent>
            <TabsContent value="popular">
              <Card className="w-full h-full p-0 overflow-hidden">
                <DisasterGlobe
                  data={mockData}
                  timeWindowLabel="Last 24h"
                  colorScheme="blues"
                  autoRotate={true}
                  rotationSpeed={0.005}
                  onRegionClick={(regionId) => console.log('Clicked:', regionId)}
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
