'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import UsStateChoropleth from '@/components/UsStateChoropleth';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MOCK_STATE_DATA, MOCK_TWEETS } from '@/lib/mock';
import type { Disaster } from '@/types/disaster';
import { formatDistanceToNow } from 'date-fns';

const DISASTER_COLORS = {
  earthquake: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  wildfire: 'bg-red-500/10 text-red-400 border-red-500/20',
  flood: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hurricane: 'bg-green-500/10 text-green-400 border-green-500/20',
  other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function LiveMapPage() {
  const [disasterType, setDisasterType] = useState<Disaster>('all');
  const [timeWindow, setTimeWindow] = useState('24h');

  const recentEvents = useMemo(() => {
    return MOCK_TWEETS
      .filter((tweet) => disasterType === 'all' || tweet.type === disasterType)
      .slice(0, 10);
  }, [disasterType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Live Disaster Map</h1>
        <p className="text-sm text-gray-400">
          Real-time visualization of disaster events across the United States
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Disaster Type:</label>
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value as Disaster)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Disasters</option>
            <option value="earthquake">Earthquake</option>
            <option value="wildfire">Wildfire</option>
            <option value="flood">Flood</option>
            <option value="hurricane">Hurricane</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Time Window:</label>
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Main Content: Map + Recent Events */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map Section */}
        <motion.div
          className="xl:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-100">
                US State Disaster Heatmap
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Color intensity shows incident density by state
              </p>
            </div>
            <div style={{ minHeight: '560px' }}>
              <UsStateChoropleth
                data={MOCK_STATE_DATA}
                disaster={disasterType}
                timeWindowLabel={`Last ${timeWindow}`}
                height={560}
                onStateClick={(id) => console.log('State clicked:', id)}
              />
            </div>
          </Card>
        </motion.div>

        {/* Recent Events Sidebar */}
        <motion.div
          className="xl:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Recent Events
            </h3>
            <div className="space-y-3 max-h-[560px] overflow-y-auto">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Badge
                      className={`text-xs ${DISASTER_COLORS[event.type]}`}
                    >
                      {event.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-400 border-gray-600"
                    >
                      {event.state}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                    {event.text}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {event.city || event.state}
                    </span>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(event.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
