"use client";

import { Agent, Task, formatRelativeTime } from "@/lib/supabase";

interface Props {
  agents: Agent[];
  tasks: Task[];
}

export default function AgentStatus({ agents, tasks }: Props) {
  // Match agents with their current tasks
  const agentActivity = agents.map((agent) => {
    const currentTasks = tasks.filter(
      (t) => t.to_agent === agent.agent_id && t.status === "in_progress"
    );
    const recentCompleted = tasks
      .filter((t) => t.to_agent === agent.agent_id && t.status === "completed")
      .slice(0, 1)[0];

    return {
      ...agent,
      currentTask: currentTasks[0],
      recentCompleted,
      isWorking: currentTasks.length > 0,
    };
  });

  // Sort: working agents first, then by last heartbeat
  agentActivity.sort((a, b) => {
    if (a.isWorking && !b.isWorking) return -1;
    if (!a.isWorking && b.isWorking) return 1;
    return 0;
  });

  // Group: currently working vs idle
  const workingAgents = agentActivity.filter((a) => a.isWorking);
  const idleAgents = agentActivity.filter((a) => !a.isWorking);

  return (
    <section className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <h2 className="text-lg font-semibold text-white">Agent Team</h2>
      </div>

      {/* Currently Working */}
      {workingAgents.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-1">Currently Working</p>
          <div className="space-y-2">
            {workingAgents.map((agent) => (
              <AgentCard key={agent.agent_id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* Idle / Standby */}
      {idleAgents.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-1">On Standby</p>
          <div className="grid grid-cols-2 gap-2">
            {idleAgents.map((agent) => (
              <AgentCardCompact key={agent.agent_id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface AgentWithActivity extends Agent {
  currentTask?: Task;
  recentCompleted?: Task;
  isWorking: boolean;
}

function AgentCard({ agent }: { agent: AgentWithActivity }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
            <span className="text-lg">{getAgentEmoji(agent.agent_id)}</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[hsl(218,45%,14%)] status-online" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{getAgentShortName(agent.display_name)}</p>
          <p className="text-xs text-blue-400 truncate mt-0.5">
            {agent.currentTask?.title || "Processing..."}
          </p>
          {agent.last_heartbeat && (
            <p className="text-xs text-gray-500 mt-1">
              Last seen {formatRelativeTime(agent.last_heartbeat)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentCardCompact({ agent }: { agent: AgentWithActivity }) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
            <span className="text-sm">{getAgentEmoji(agent.agent_id)}</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[hsl(218,45%,14%)] status-online" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">{getAgentShortName(agent.display_name)}</p>
          <p className="text-[10px] text-gray-500">Ready</p>
        </div>
      </div>
    </div>
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

function getAgentShortName(displayName: string): string {
  // "Intel – News & Market" -> "Intel"
  return displayName.split("–")[0].trim();
}
