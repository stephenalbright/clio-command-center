const SUPABASE_URL = "https://zgdjxqaainynovabvprb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZGp4cWFhaW55bm92YWJ2cHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTM4MjcsImV4cCI6MjA2MjM4OTgyN30.nm6e9Ojlwf_PwrcngGWEzaRbZB1eMazlEn_xVNCr-Y4";

export interface Agent {
  agent_id: string;
  display_name: string;
  status: string;
  last_heartbeat: string | null;
  skills: string[];
}

export interface Task {
  id: string;
  created_at: string;
  from_agent: string;
  to_agent: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  result: string | null;
  completed_at: string | null;
}

export interface Email {
  id: string;
  subject: string;
  sender_name: string;
  sender_email: string;
  received_at: string;
  category: string;
  ai_summary: string;
  ai_action_items: string[];
}

async function supabaseFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    next: { revalidate: 30 }, // Cache for 30 seconds
  });
  
  if (!res.ok) {
    throw new Error(`Supabase fetch failed: ${res.status}`);
  }
  
  return res.json();
}

export async function getAgents(): Promise<Agent[]> {
  return supabaseFetch<Agent[]>("agent_registry?select=*&order=display_name.asc");
}

export async function getTasks(): Promise<Task[]> {
  return supabaseFetch<Task[]>("agent_tasks?select=*&order=created_at.desc&limit=50");
}

export async function getImportantEmails(): Promise<Email[]> {
  return supabaseFetch<Email[]>(
    "email_intel?select=*&category=neq.Automated/Receipt&category=neq.FYI/Newsletter&order=received_at.desc&limit=10"
  );
}

export async function getRecentEmails(): Promise<Email[]> {
  return supabaseFetch<Email[]>(
    "email_intel?select=*&order=received_at.desc&limit=20"
  );
}

// Helper to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Translate task statuses to human-readable
export function humanizeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    in_progress: "Working on it",
    completed: "Done",
    awaiting_review: "Needs your review",
    pending: "Queued",
    failed: "Hit a snag",
  };
  return statusMap[status] || status;
}

// Get status color class
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    in_progress: "text-blue-400",
    completed: "text-green-400",
    awaiting_review: "text-amber-400",
    pending: "text-gray-400",
    failed: "text-red-400",
  };
  return colorMap[status] || "text-gray-400";
}

// Get priority badge
export function getPriorityBadge(priority: string): { text: string; className: string } {
  const badges: Record<string, { text: string; className: string }> = {
    high: { text: "Urgent", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    normal: { text: "Normal", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    low: { text: "Low", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  };
  return badges[priority] || badges.normal;
}
