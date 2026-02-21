"use client";

import { useState } from "react";

export interface ActionItem {
  id: string;
  type: "draft" | "review" | "decision" | "email";
  title: string;
  subtitle?: string;
  priority: "urgent" | "normal";
  draft?: {
    to: string;
    subject: string;
    body: string;
  };
}

interface Props {
  item: ActionItem;
  onApprove?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function ActionableItem({ item, onApprove, onDismiss }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "dismissed">("pending");

  const handleApprove = () => {
    setStatus("approved");
    onApprove?.(item.id);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleDismiss = () => {
    setStatus("dismissed");
    onDismiss?.(item.id);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (status !== "pending") return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="card card-interactive w-full p-5 text-left touch-target"
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            item.priority === "urgent" 
              ? "bg-[var(--warning)]/15" 
              : "bg-[var(--brand-primary-dim)]"
          }`}>
            {item.type === "draft" && (
              <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            )}
            {item.type === "review" && (
              <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {item.type === "decision" && (
              <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-[var(--text-primary)] leading-snug">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                {item.subtitle}
              </p>
            )}
          </div>
          <svg className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] modal-overlay flex items-end sm:items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="modal-content w-full max-w-lg max-h-[85vh] overflow-hidden fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                    {item.type === "draft" ? "Email Draft" : "Review Required"}
                  </p>
                  <h2 className="text-lg font-semibold mt-1">{item.title}</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[50vh]">
              {item.draft && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--text-tertiary)]">To:</span>
                    <span className="text-[var(--text-primary)]">{item.draft.to}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--text-tertiary)]">Subject:</span>
                    <span className="text-[var(--text-primary)]">{item.draft.subject}</span>
                  </div>
                  <div className="section-divider" />
                  <div className="draft-content">
                    {item.draft.body}
                  </div>
                </div>
              )}
              {!item.draft && item.subtitle && (
                <p className="text-[var(--text-secondary)]">{item.subtitle}</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-5 border-t border-[var(--border-subtle)] flex gap-3">
              <button 
                onClick={handleDismiss}
                className="btn-secondary flex-1"
              >
                Dismiss
              </button>
              <button 
                onClick={handleApprove}
                className="btn-primary flex-1"
              >
                {item.type === "draft" ? "Approve & Send" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
