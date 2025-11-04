"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card/50 border border-border/40 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-border/60 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400">
          {icon}
        </div>
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === "increase" ? "text-green-400" : "text-red-400"
          }`}
        >
          {changeType === "increase" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}
