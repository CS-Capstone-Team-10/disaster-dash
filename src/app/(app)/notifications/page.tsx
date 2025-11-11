'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotificationHistory } from '@/lib/services/data-service';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Webhook, CheckCircle, XCircle, Clock } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export default function NotificationsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhooks/disasters');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [disasterTypeFilter, setDisasterTypeFilter] = useState('all');
  const [frequency, setFrequency] = useState('realtime');

  // Centralized data fetching - replace with API call later
  const { data: MOCK_NOTIFICATION_HISTORY, loading } = useNotificationHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Notification Settings</h1>
        <p className="text-sm text-gray-400">
          Configure notification channels and review delivery history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Channels */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notification Channels
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure how you want to receive disaster alerts
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Channel */}
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-100">Email Notifications</h3>
                      <p className="text-xs text-gray-400">Receive alerts via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {emailEnabled && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value="alerts@example.com"
                      disabled
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300 placeholder-gray-500"
                      placeholder="Enter email address"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This is a placeholder. Configuration is disabled in this demo.
                    </p>
                  </div>
                )}
              </div>

              {/* Webhook Channel */}
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Webhook className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-100">Webhook Integration</h3>
                      <p className="text-xs text-gray-400">Send alerts to a webhook URL</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={webhookEnabled}
                      onChange={(e) => setWebhookEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {webhookEnabled && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      disabled
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-300 placeholder-gray-500"
                      placeholder="https://api.example.com/webhook"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This is a placeholder. Configuration is disabled in this demo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-800/40 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Notification History
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Recent notification delivery logs
              </p>
            </div>

            <div className="space-y-3">
              {MOCK_NOTIFICATION_HISTORY.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {notification.channel === 'Email' ? (
                        <Mail className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Webhook className="w-4 h-4 text-green-400" />
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300"
                      >
                        {notification.channel}
                      </Badge>
                    </div>

                    {notification.status === 'Delivered' ? (
                      <Badge className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Delivered
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-red-500/10 text-red-400 border-red-500/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{notification.summary}</p>

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.sentAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Additional Settings Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Notification Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-100 mb-2">Severity Filter</h3>
              <p className="text-xs text-gray-400 mb-3">
                Only notify for specific severity levels
              </p>
              <div className="opacity-50 pointer-events-none">
                <DropdownMenu
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  options={[
                    { value: "all", label: "All Severities" },
                    { value: "critical", label: "Critical" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" }
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-100 mb-2">Disaster Types</h3>
              <p className="text-xs text-gray-400 mb-3">
                Filter notifications by disaster type
              </p>
              <div className="opacity-50 pointer-events-none">
                <DropdownMenu
                  value={disasterTypeFilter}
                  onChange={setDisasterTypeFilter}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "earthquake", label: "Earthquake" },
                    { value: "wildfire", label: "Wildfire" },
                    { value: "flood", label: "Flood" },
                    { value: "hurricane", label: "Hurricane" },
                    { value: "other", label: "Other" }
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-100 mb-2">Frequency</h3>
              <p className="text-xs text-gray-400 mb-3">
                How often to send notification batches
              </p>
              <div className="opacity-50 pointer-events-none">
                <DropdownMenu
                  value={frequency}
                  onChange={setFrequency}
                  options={[
                    { value: "realtime", label: "Real-time" },
                    { value: "hourly", label: "Hourly Digest" },
                    { value: "daily", label: "Daily Digest" },
                    { value: "weekly", label: "Weekly Digest" }
                  ]}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Additional preferences are disabled in this demo
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
