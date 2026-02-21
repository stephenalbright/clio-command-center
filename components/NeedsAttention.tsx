"use client";

import { Task, Email, formatRelativeTime, getPriorityBadge } from "@/lib/supabase";

interface Props {
  tasks: Task[];
  emails: Email[];
}

interface AttentionItem {
  type: "task" | "email";
  id: string;
  title: string;
  subtitle: string;
  time: string;
  priority: "high" | "normal" | "low";
}

export default function NeedsAttention({ tasks, emails }: Props) {
  // Items that need Stephen's attention
  const attentionItems: AttentionItem[] = [];

  // Tasks awaiting review
  tasks
    .filter((t) => t.status === "awaiting_review")
    .forEach((task) => {
      attentionItems.push({
        type: "task",
        id: task.id,
        title: task.title,
        subtitle: `${formatAgentName(task.from_agent)} is waiting for your approval`,
        time: formatRelativeTime(task.created_at),
        priority: task.priority as "high" | "normal" | "low",
      });
    });

  // High-priority emails
  emails
    .filter((e) => e.category === "Personal/High Priority" && e.ai_action_items?.length > 0)
    .slice(0, 3)
    .forEach((email) => {
      attentionItems.push({
        type: "email",
        id: email.id,
        title: email.subject,
        subtitle: `From ${email.sender_name}`,
        time: formatRelativeTime(email.received_at),
        priority: "high",
      });
    });

  // Sort by priority (high first) then by time
  attentionItems.sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (a.priority !== "high" && b.priority === "high") return 1;
    return 0;
  });

  const count = attentionItems.length;

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${count > 0 ? "bg-amber-500 pulse-glow" : "bg-green-500"}`} />
          <h2 className="text-lg font-semibold text-white">Needs Your Attention</h2>
        </div>
        {count > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
            {count} item{count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="card p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-medium">All clear!</p>
          <p className="text-sm text-gray-400 mt-1">Nothing needs your immediate attention</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attentionItems.map((item) => {
            const badge = getPriorityBadge(item.priority);
            return (
              <div key={item.id} className="card card-hover p-4 cursor-pointer touch-target">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === "task" ? "bg-blue-500/20" : "bg-purple-500/20"
                  }`}>
                    {item.type === "task" ? (
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-white font-medium truncate">{item.title}</p>
                      {item.priority === "high" && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${badge.className}`}>
                          {badge.text}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
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
