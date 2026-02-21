"use client";

import { Task, formatRelativeTime, humanizeStatus, getStatusColor } from "@/lib/supabase";

interface Props {
  tasks: Task[];
}

export default function OvernightSummary({ tasks }: Props) {
  // Get tasks completed in the last 12 hours
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  
  const recentActivity = tasks.filter((task) => {
    const taskDate = new Date(task.created_at);
    return taskDate > twelveHoursAgo;
  });

  const completedCount = recentActivity.filter((t) => t.status === "completed").length;
  const inProgressCount = recentActivity.filter((t) => t.status === "in_progress").length;

  // Get unique agents who were active
  const activeAgents = [...new Set(recentActivity.map((t) => t.to_agent))];

  // Get top 3 highlights
  const highlights = recentActivity
    .filter((t) => t.status === "completed")
    .slice(0, 3);

  return (
    <section className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple-500 pulse-glow" />
        <h2 className="text-lg font-semibold text-white">While You Were Away</h2>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{inProgressCount}</p>
          <p className="text-xs text-gray-400">In Progress</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">{activeAgents.length}</p>
          <p className="text-xs text-gray-400">Agents Active</p>
        </div>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Highlights</p>
          <div className="space-y-3">
            {highlights.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    by {formatAgentName(task.to_agent)} · {formatRelativeTime(task.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentActivity.length === 0 && (
        <div className="card p-6 text-center">
          <p className="text-gray-400">All quiet on the overnight shift</p>
          <p className="text-xs text-gray-500 mt-1">No agent activity in the last 12 hours</p>
        </div>
      )}
    </section>
  );
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
    "dev-frontend": "Frontend Dev",
    "dev-backend": "Backend Dev",
    "dev-qa": "QA",
    thinker: "Thinker",
    connector: "Connector",
    clio: "Clio",
  };
  return nameMap[agentId] || agentId;
}
