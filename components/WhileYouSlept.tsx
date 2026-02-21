"use client";

import { Task } from "@/lib/supabase";

interface Props {
  tasks: Task[];
}

export default function WhileYouSlept({ tasks }: Props) {
  // Get tasks from the last 12 hours
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  
  const recentActivity = tasks.filter((task) => {
    const taskDate = new Date(task.created_at);
    return taskDate > twelveHoursAgo;
  });

  const completedCount = recentActivity.filter((t) => t.status === "completed").length;
  const inProgressCount = recentActivity.filter((t) => t.status === "in_progress").length;

  // Get key highlights (completed, high-value tasks)
  const highlights = recentActivity
    .filter((t) => t.status === "completed")
    .slice(0, 3)
    .map((t) => t.title);

  // If nothing happened, don't show section
  if (recentActivity.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        While you slept
      </h2>

      <div className="card p-5">
        {/* Summary sentence */}
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
          {completedCount > 0 && (
            <>
              <span className="text-[var(--success)] font-medium">{completedCount} task{completedCount !== 1 ? 's' : ''}</span>
              {' '}completed
            </>
          )}
          {completedCount > 0 && inProgressCount > 0 && ', '}
          {inProgressCount > 0 && (
            <>
              <span className="text-[var(--brand-primary)] font-medium">{inProgressCount}</span>
              {' '}in progress
            </>
          )}
          {'.'}
        </p>

        {/* Key highlights as simple list */}
        {highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <svg className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--text-secondary)]">{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
