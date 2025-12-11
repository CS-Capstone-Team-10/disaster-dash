'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDisasterIncidents } from '@/lib/services/data-service';
import type { BskyPost } from '@/types/post';
import { formatDistanceToNow } from 'date-fns';
import { Search, MoreVertical, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DropdownMenu, CustomDropdownMenu } from '@/components/ui/dropdown-menu';

const DISASTER_COLORS = {
  earthquake: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  wildfire: 'bg-red-500/10 text-red-400 border-red-500/20',
  flood: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hurricane: 'bg-green-500/10 text-green-400 border-green-500/20',
  other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const STATUS_COLORS = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  triaged: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  dismissed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const PAGE_SIZE = 20;

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [disasterFilter, setDisasterFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all data once
  const { data: allBskyPosts, loading } = useDisasterIncidents();

  // Apply filters first, before pagination
  const filteredTweets = useMemo(() => {
    return allBskyPosts.filter((post) => {
      // Search filter
      if (
        searchQuery &&
        !post.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
  }, [allBskyPosts, searchQuery, disasterFilter, stateFilter, statusFilter]);

  // Calculate pagination values based on filtered results
  const totalFiltered = filteredTweets.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);

  // Paginate the filtered results
  const paginatedTweets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredTweets.slice(startIndex, endIndex);
  }, [filteredTweets, currentPage]);

  // Get unique states for filter (from all data)
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(allBskyPosts.map((t) => t.location))).sort();
  }, [allBskyPosts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, disasterFilter, stateFilter, statusFilter]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

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
            Showing {paginatedTweets.length} of {totalFiltered} filtered alerts ({allBskyPosts.length} total)
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
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card className="bg-gray-900/50 border-gray-800/40 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              
              {/* Previous Page */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {generatePageNumbers(currentPage, totalPages).map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum as number)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>
              
              {/* Next Page */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Last Page */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              {totalFiltered} filtered alerts
            </div>
          </div>
        </Card>
      )}
      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="bg-gray-900/50 border-gray-800/40 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-400">Loading alerts...</p>
          </Card>
        ) : paginatedTweets.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800/40 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No alerts match your filters</p>
          </Card>
        ) : (
          paginatedTweets.map((post, index) => (
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

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;
  
  if (!showEllipsis) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
}

function TweetRow({ post }: { post: BskyPost }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800/40 hover:bg-gray-900/70 transition-colors">
      <div className="p-4">
        <div className="flex items-start gap-4">
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

            <p className="text-sm text-gray-300 mb-2">{post.summary}</p>

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
