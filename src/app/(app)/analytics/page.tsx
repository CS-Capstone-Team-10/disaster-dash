'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KPIHeader } from '@/components/kpi/KPIHeader';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { Card } from '@/components/ui/card';
import { MOCK_KPI_DATA, MOCK_DISASTER_TRENDS, MOCK_METRICS } from '@/lib/mock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DISASTER_COLORS = {
  earthquake: '#f97316',
  wildfire: '#ef4444',
  flood: '#3b82f6',
  hurricane: '#22c55e',
  other: '#6b7280',
};

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('6months');

  // Prepare data for "By Type" chart
  const disastersByType = [
    { type: 'Wildfire', count: MOCK_METRICS.byDisaster.wildfire, color: DISASTER_COLORS.wildfire },
    { type: 'Flood', count: MOCK_METRICS.byDisaster.flood, color: DISASTER_COLORS.flood },
    { type: 'Hurricane', count: MOCK_METRICS.byDisaster.hurricane, color: DISASTER_COLORS.hurricane },
    { type: 'Earthquake', count: MOCK_METRICS.byDisaster.earthquake, color: DISASTER_COLORS.earthquake },
    { type: 'Other', count: MOCK_METRICS.byDisaster.other, color: DISASTER_COLORS.other },
  ].sort((a, b) => b.count - a.count);

  // Prepare data for severity breakdown
  const severityData = [
    { name: 'Critical', value: MOCK_METRICS.bySeverity.critical, color: '#dc2626' },
    { name: 'High', value: MOCK_METRICS.bySeverity.high, color: '#f97316' },
    { name: 'Medium', value: MOCK_METRICS.bySeverity.medium, color: '#eab308' },
    { name: 'Low', value: MOCK_METRICS.bySeverity.low, color: '#22c55e' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Analytics Dashboard</h1>
        <p className="text-sm text-gray-400">
          Comprehensive metrics and trends for disaster incident management
        </p>
      </div>

      {/* KPI Cards */}
      <KPIHeader
        data={MOCK_KPI_DATA}
        onRangeChange={(range) => console.log('Range changed:', range)}
      />

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disaster Trends Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <TrendChart data={MOCK_DISASTER_TRENDS} />
        </motion.div>

        {/* Incidents by Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-100">
                Incidents by Disaster Type
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Distribution across different disaster categories
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={disastersByType}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis
                  type="category"
                  dataKey="type"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {disastersByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {disastersByType.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">
                    {item.type}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Incidents by Severity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-100">
                Incidents by Severity
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Breakdown by impact severity level
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={severityData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Summary Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-100">
                {Math.round(MOCK_METRICS.resolvedPct * 100)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-100">
                {MOCK_METRICS.avgMTTRHours}h
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-100">
                {MOCK_METRICS.openIncidents}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-100">
                {MOCK_METRICS.totalIncidents}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
