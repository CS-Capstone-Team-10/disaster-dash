'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/dashboard/StatsCard';
import LiveFeed from '@/components/dashboard/LiveFeed';
import { TrendChart } from '@/components/dashboard/TrendChart';
import UsStateChoropleth from '@/components/UsStateChoropleth';
import { useDashboardData } from '@/lib/services/data-service';
import type { Disaster } from '@/types/disaster';
import { AlertTriangle, Users, MapPin, TrendingUp } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const [disaster, setDisaster] = useState<Disaster>('all');

  // Centralized data fetching - replace with API call later
  const { incidents, stateAggregations, trends, metrics } = useDashboardData();

  // Calculate stats from incidents
  const stats = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return {
        activeDisasters: 0,
        postsAnalyzed: 0,
        affectedAreas: 0,
        alertLevel: 'Medium',
      };
    }

    const activeDisasters = new Set(incidents.map(t => `${t.type}-${t.state}`)).size;
    const postsAnalyzed = incidents.length;
    const affectedAreas = new Set(incidents.map(t => `${t.city || 'Unknown'}, ${t.state}`)).size;
    const highConfidenceCount = incidents.filter(t => t.confidence >= 0.8).length;
    const alertLevel = highConfidenceCount / postsAnalyzed > 0.3 ? 'High' : 'Medium';

    return {
      activeDisasters,
      postsAnalyzed,
      affectedAreas,
      alertLevel,
    };
  }, [incidents]);

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h2 className="font-semibold text-gray-100">US Disaster Heatmap</h2>
              <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                <DropdownMenu
                  value={disaster}
                  onChange={(value) => setDisaster(value as Disaster)}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "earthquake", label: "Earthquake" },
                    { value: "wildfire", label: "Wildfire" },
                    { value: "flood", label: "Flood" },
                    { value: "hurricane", label: "Hurricane" },
                    { value: "other", label: "Other" }
                  ]}
                  className="w-full sm:w-40"
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">{metrics?.windowLabel || 'Last 24h'}</span>
              </div>
            </div>
            <UsStateChoropleth
              data={stateAggregations}
              disaster={disaster}
              timeWindowLabel={metrics?.windowLabel || 'Last 24h'}
              height={450}
              onStateClick={(id) => console.log('state clicked', id)}
            />
          </div>

          <TrendChart data={trends} />
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
