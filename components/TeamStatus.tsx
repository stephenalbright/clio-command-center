"use client";

import { useState } from "react";
import { Agent, Task } from "@/lib/supabase";

interface Props {
  agents: Agent[];
  tasks: Task[];
}

export default function TeamStatus({ agents, tasks }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active agents
  const workingAgents = agents.filter((agent) => {
    const hasTasks = tasks.some(
      (t) => t.to_agent === agent.agent_id && t.status === "in_progress"
    );
    return hasTasks;
  });

  const activeCount = workingAgents.length;
  const totalCount = agents.length;

  return (
    <section className="px-5 py-4">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 touch-target"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Team Status
          </h2>
          <span className="text-sm text-[var(--text-tertiary)]">
            {activeCount} of {totalCount} active
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="collapsible-inner">
          <div className="pt-3 pb-2">
            {/* Active Agents */}
            {workingAgents.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                  Currently Working
                </p>
                <div className="space-y-2">
                  {workingAgents.map((agent) => {
                    const currentTask = tasks.find(
                      (t) => t.to_agent === agent.agent_id && t.status === "in_progress"
                    );
                    return (
                      <div key={agent.agent_id} className="card p-4 flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/20 to-purple-500/20 flex items-center justify-center">
                            <span className="text-lg">{getAgentEmoji(agent.agent_id)}</span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--success)] border-2 border-[#16213e]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {getAgentName(agent.display_name)}
                          </p>
                          {currentTask && (
                            <p className="text-xs text-[var(--brand-primary)] truncate mt-0.5">
                              {currentTask.title}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standby Agents (compact grid) */}
            {agents.length > workingAgents.length && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                  On Standby
                </p>
                <div className="flex flex-wrap gap-2">
                  {agents
                    .filter((a) => !workingAgents.includes(a))
                    .map((agent) => (
                      <div 
                        key={agent.agent_id} 
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)]"
                      >
                        <span className="text-sm">{getAgentEmoji(agent.agent_id)}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {getAgentName(agent.display_name)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getAgentEmoji(agentId: string): string {
  const emojiMap: Record<string, string> = {
    intel: "🔍",
    outreach: "🤝",
    ops: "📋",
    content: "✍️",
    strategy: "🎯",
    security: "🔐",
    finance: "💰",
    "dev-frontend": "🎨",
    "dev-backend": "⚙️",
    "dev-qa": "🧪",
    thinker: "🧠",
    connector: "🔗",
    clio: "📊",
  };
  return emojiMap[agentId] || "🤖";
}

function getAgentName(displayName: string): string {
  return displayName.split("–")[0].trim();
}
