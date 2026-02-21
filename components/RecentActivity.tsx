"use client";

import React from "react";
import { Task, formatRelativeTime, humanizeStatus, getStatusColor } from "@/lib/supabase";

interface Props {
  tasks: Task[];
}

export default function RecentActivity({ tasks }: Props) {
  // Get last 10 tasks
  const recentTasks = tasks.slice(0, 10);

  return (
    <section className="px-4 py-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-2">
        {recentTasks.map((task, index) => (
          <div
            key={task.id}
            className="card p-3 flex items-center gap-3"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatusBg(task.status)}`}>
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{task.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${getStatusColor(task.status)}`}>
                  {humanizeStatus(task.status)}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">
                  {formatAgentName(task.to_agent)}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(task.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentTasks.length === 0 && (
        <div className="card p-6 text-center">
          <p className="text-gray-400">No recent activity</p>
        </div>
      )}
    </section>
  );
}

function getStatusBg(status: string): string {
  const bgMap: Record<string, string> = {
    in_progress: "bg-blue-500/20",
    completed: "bg-green-500/20",
    awaiting_review: "bg-amber-500/20",
    pending: "bg-gray-500/20",
    failed: "bg-red-500/20",
  };
  return bgMap[status] || "bg-gray-500/20";
}

function getStatusIcon(status: string): React.ReactNode {
  switch (status) {
    case "completed":
      return (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "in_progress":
      return (
        <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    case "awaiting_review":
      return (
        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "failed":
      return (
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

function formatAgentName(agentId: string): string {
  const nameMap: Record<string, string> = {
    intel: "Intel",
    outreach: "Outreach",
    ops: "Ops",
    content: "Content",
    strategy: "Strategy",
    security: "Security",
    finance: "Finance",
    "dev-frontend": "Frontend",
    "dev-backend": "Backend",
    "dev-qa": "QA",
    thinker: "Thinker",
    connector: "Connector",
    clio: "Clio",
  };
  return nameMap[agentId] || agentId;
}
