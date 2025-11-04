'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MOCK_TWEETS } from '@/lib/mock';
import type { MockTweet } from '@/lib/mock';
import { formatDistanceToNow } from 'date-fns';
import { Search, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DISASTER_COLORS = {
  earthquake: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  wildfire: 'bg-red-500/10 text-red-400 border-red-500/20',
  flood: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hurricane: 'bg-green-500/10 text-green-400 border-green-500/20',
  other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const DISASTER_ICONS = {
  earthquake: '🌍',
  wildfire: '🔥',
  flood: '🌊',
  hurricane: '🌀',
  other: '⚠️',
};

const STATUS_COLORS = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  triaged: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  dismissed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [disasterFilter, setDisasterFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTweets = useMemo(() => {
    return MOCK_TWEETS.filter((tweet) => {
      // Search filter
      if (
        searchQuery &&
        !tweet.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tweet.city?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Disaster type filter
      if (disasterFilter !== 'all' && tweet.type !== disasterFilter) {
        return false;
      }

      // State filter
      if (stateFilter !== 'all' && tweet.state !== stateFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && tweet.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, disasterFilter, stateFilter, statusFilter]);

  // Get unique states for filter
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(MOCK_TWEETS.map((t) => t.state))).sort();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Alert Management</h1>
        <p className="text-sm text-gray-400">
          Review, triage, and manage disaster alerts from social media sources
        </p>
      </div>

      {/* Filters Bar */}
      <Card className="bg-gray-900/50 border-gray-800/40 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Disaster Type Filter */}
          <select
            value={disasterFilter}
            onChange={(e) => setDisasterFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="earthquake">Earthquake</option>
            <option value="wildfire">Wildfire</option>
            <option value="flood">Flood</option>
            <option value="hurricane">Hurricane</option>
            <option value="other">Other</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="triaged">Triaged</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredTweets.length} of {MOCK_TWEETS.length} alerts
          </span>
          {(searchQuery || disasterFilter !== 'all' || stateFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDisasterFilter('all');
                setStateFilter('all');
                setStatusFilter('all');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredTweets.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800/40 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No alerts match your filters</p>
          </Card>
        ) : (
          filteredTweets.map((tweet, index) => (
            <motion.div
              key={tweet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <TweetRow tweet={tweet} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function TweetRow({ tweet }: { tweet: MockTweet }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="bg-gray-900/50 border-gray-800/40 hover:bg-gray-900/70 transition-colors">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-2xl mt-1">{DISASTER_ICONS[tweet.type]}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`text-xs ${DISASTER_COLORS[tweet.type]}`}>
                  {tweet.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs text-gray-400 border-gray-600"
                >
                  {tweet.state}
                  {tweet.city && ` • ${tweet.city}`}
                </Badge>
                <Badge className={`text-xs ${STATUS_COLORS[tweet.status]}`}>
                  {tweet.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  {Math.round(tweet.confidence * 100)}% confidence
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(tweet.createdAt), {
                    addSuffix: true,
                  })}
                </span>

                {/* Action Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          console.log('Mark as triaged:', tweet.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Triaged
                      </button>
                      <button
                        onClick={() => {
                          console.log('Dismiss:', tweet.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-2">{tweet.text}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Source: {tweet.source}</span>
              {tweet.handle && <span>@{tweet.handle.replace('@', '')}</span>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
