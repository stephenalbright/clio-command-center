"use client";

import ActionableItem, { ActionItem } from "./ActionableItem";
import { Task, Email } from "@/lib/supabase";

interface Props {
  tasks: Task[];
  emails: Email[];
  drafts: DraftEmail[];
}

export interface DraftEmail {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  context?: string;
}

export default function TodaysPriorities({ tasks, emails, drafts }: Props) {
  // Build action items from various sources
  const actionItems: ActionItem[] = [];

  // Add drafts ready for review
  drafts.forEach((draft) => {
    actionItems.push({
      id: `draft-${draft.id}`,
      type: "draft",
      title: `Email to ${draft.recipient}`,
      subtitle: draft.subject,
      priority: "normal",
      draft: {
        to: draft.recipient,
        subject: draft.subject,
        body: draft.body,
      },
    });
  });

  // Add tasks awaiting review
  tasks
    .filter((t) => t.status === "awaiting_review")
    .forEach((task) => {
      actionItems.push({
        id: `task-${task.id}`,
        type: "review",
        title: task.title,
        subtitle: task.description?.slice(0, 100),
        priority: task.priority === "high" ? "urgent" : "normal",
      });
    });

  // High-priority emails needing response
  emails
    .filter((e) => e.category === "Personal/High Priority" && e.ai_action_items?.length > 0)
    .slice(0, 2)
    .forEach((email) => {
      actionItems.push({
        id: `email-${email.id}`,
        type: "decision",
        title: `Reply to ${email.sender_name}`,
        subtitle: email.subject,
        priority: "urgent",
      });
    });

  const count = actionItems.length;

  const handleApprove = (id: string) => {
    console.log("Approved:", id);
    // TODO: Integrate with actual send/approve APIs
  };

  const handleDismiss = (id: string) => {
    console.log("Dismissed:", id);
    // TODO: Persist dismissals
  };

  return (
    <section className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Today&apos;s Priorities
        </h2>
        {count > 0 && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] rounded-full">
            {count}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--success)]/15 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-medium text-lg">You&apos;re all caught up</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Nothing needs your attention right now</p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {actionItems.map((item) => (
            <ActionableItem 
              key={item.id} 
              item={item}
              onApprove={handleApprove}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </section>
  );
}
