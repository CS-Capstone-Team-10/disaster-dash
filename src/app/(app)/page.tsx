'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/dashboard/StatsCard';
import LiveFeed from '@/components/dashboard/LiveFeed';
import { TrendChart } from '@/components/dashboard/TrendChart';
import UsStateChoropleth from '@/components/UsStateChoropleth';
import { MOCK_STATE_DATA, MOCK_DISASTER_TRENDS, MOCK_METRICS } from '@/lib/mock';
import { MOCK_TWEETS } from '@/lib/mock/tweets';
import type { Disaster } from '@/types/disaster';
import { AlertTriangle, Users, MapPin, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [disaster, setDisaster] = useState<Disaster>('all');
  const m = useMemo(() => MOCK_METRICS, []);
  const stateAgg = useMemo(() => MOCK_STATE_DATA, []);

  // Calculate stats from MOCK_TWEETS
  const stats = useMemo(() => {
    const activeDisasters = new Set(MOCK_TWEETS.map(t => `${t.type}-${t.state}`)).size;
    const postsAnalyzed = MOCK_TWEETS.length;
    const affectedAreas = new Set(MOCK_TWEETS.map(t => `${t.city}, ${t.state}`)).size;
    const highConfidenceCount = MOCK_TWEETS.filter(t => t.confidence >= 0.8).length;
    const alertLevel = highConfidenceCount / postsAnalyzed > 0.3 ? 'High' : 'Medium';

    return {
      activeDisasters,
      postsAnalyzed,
      affectedAreas,
      alertLevel,
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Active Disasters"
          value={stats.activeDisasters.toString()}
          change="+12%"
          changeType="increase"
          icon={<AlertTriangle className="w-5 h-5" />}
          delay={0.1}
        />
        <StatsCard
          title="Posts Analyzed"
          value={stats.postsAnalyzed.toLocaleString()}
          change="+8.3%"
          changeType="increase"
          icon={<Users className="w-5 h-5" />}
          delay={0.2}
        />
        <StatsCard
          title="Affected Areas"
          value={stats.affectedAreas.toString()}
          change="-5.2%"
          changeType="decrease"
          icon={<MapPin className="w-5 h-5" />}
          delay={0.3}
        />
        <StatsCard
          title="Alert Level"
          value={stats.alertLevel}
          change="+15%"
          changeType="increase"
          icon={<TrendingUp className="w-5 h-5" />}
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl border border-gray-800/40 bg-gray-900/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-semibold text-gray-100">US Disaster Heatmap</h2>
              <select
                value={disaster}
                onChange={(e) => setDisaster(e.target.value as Disaster)}
                className="border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
              >
                <option value="all">All</option>
                <option value="earthquake">Earthquake</option>
                <option value="wildfire">Wildfire</option>
                <option value="flood">Flood</option>
                <option value="hurricane">Hurricane</option>
                <option value="other">Other</option>
              </select>
              <span className="text-xs text-gray-400">{m.windowLabel}</span>
            </div>
            <UsStateChoropleth
              data={stateAgg}
              disaster={disaster}
              timeWindowLabel={m.windowLabel}
              height={450}
              onStateClick={(id) => console.log('state clicked', id)}
            />
          </div>

          <TrendChart data={MOCK_DISASTER_TRENDS} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <LiveFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}
