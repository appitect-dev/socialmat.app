"use client";

import React from 'react';

interface AnalyticsProps {
  projects: number;
  totalViews: number;
  videosProcessed: number;
  savedHours: number;
}

export function Analytics({ projects, totalViews, videosProcessed, savedHours }: AnalyticsProps) {
  const stats = [
    {
      label: 'Projects Created',
      value: projects.toLocaleString(),
      icon: '📁',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Est. Total Views',
      value: `${(totalViews / 1000).toFixed(0)}K`,
      icon: '👀',
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Videos Processed',
      value: videosProcessed.toLocaleString(),
      icon: '🎬',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'Hours Saved',
      value: savedHours.toLocaleString(),
      icon: '⏰',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
              {stat.icon}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
