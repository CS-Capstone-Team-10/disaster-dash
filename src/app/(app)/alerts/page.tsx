'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDisasterIncidents } from '@/lib/services/data-service';
import type { BskyPost } from '@/types/post';
import { formatDistanceToNow } from 'date-fns';
import { Search, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DropdownMenu, CustomDropdownMenu } from '@/components/ui/dropdown-menu';

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

  // Centralized data fetching - replace with API call later
  const { data: BskyPosts } = useDisasterIncidents();

  const filteredTweets = useMemo(() => {
    return BskyPosts.filter((post) => {
      // Search filter
      if (
        searchQuery &&
        !post.post_text.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.location?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Disaster type filter
      if (disasterFilter !== 'all' && post.disaster_type?.toLowerCase() !== disasterFilter) {
        return false;
      }

      // State filter
      if (stateFilter !== 'all' && post.location?.toLowerCase() !== stateFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && post.is_disaster) {
        return false;
      }

      return true;
    });
  }, [BskyPosts, searchQuery, disasterFilter, stateFilter, statusFilter]);

  // Get unique states for filter
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(BskyPosts.map((t) => t.location))).sort();
  }, [BskyPosts]);

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
          <DropdownMenu
            value={disasterFilter}
            onChange={setDisasterFilter}
            placeholder="All Types"
            options={[
              { value: "all", label: "All Types" },
              { value: "earthquake", label: "Earthquake" },
              { value: "wildfire", label: "Wildfire" },
              { value: "flood", label: "Flood" },
              { value: "hurricane", label: "Hurricane" },
              { value: "other", label: "Other" }
            ]}
          />

          {/* State Filter */}
          <DropdownMenu
            value={stateFilter}
            onChange={setStateFilter}
            placeholder="All States"
            options={[
              { value: "all", label: "All States" },
              ...uniqueStates.map((state) => ({
                value: state,
                label: state
              }))
            ]}
          />

          {/* Status Filter */}
          <DropdownMenu
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            options={[
              { value: "all", label: "All Status" },
              { value: "new", label: "New" },
              { value: "triaged", label: "Triaged" },
              { value: "dismissed", label: "Dismissed" }
            ]}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredTweets.length} of {BskyPosts.length} alerts
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
          filteredTweets.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <TweetRow post={post} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function TweetRow({ post }: { post: BskyPost }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800/40 hover:bg-gray-900/70 transition-colors">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-2xl mt-1">{DISASTER_ICONS[post.disaster_type as keyof typeof DISASTER_ICONS]}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`text-xs ${DISASTER_COLORS[post.disaster_type as keyof typeof DISASTER_COLORS]}`}>
                  {post.disaster_type}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs text-gray-400 border-gray-600"
                >
                  {post.location}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(post.post_created_at), {
                    addSuffix: true,
                  })}
                </span>

                {/* Action Menu */}
                <CustomDropdownMenu
                  align="right"
                  trigger={
                    <button className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                  items={[
                    {
                      icon: <CheckCircle className="w-3.5 h-3.5" />,
                      label: "Mark Triaged",
                      onClick: () => console.log('Mark as triaged:', post.id)
                    },
                    {
                      icon: <XCircle className="w-3.5 h-3.5" />,
                      label: "Dismiss",
                      onClick: () => console.log('Dismiss:', post.id)
                    }
                  ]}
                />
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-2">{post.post_text}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Source: {post.post_author}</span>
              {post.post_author && <span>@{post.post_author.replace('@', '')}</span>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
