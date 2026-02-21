import Header from "@/components/Header";
import OvernightSummary from "@/components/OvernightSummary";
import NeedsAttention from "@/components/NeedsAttention";
import AgentStatus from "@/components/AgentStatus";
import RecentActivity from "@/components/RecentActivity";
import { getAgents, getTasks, getRecentEmails } from "@/lib/supabase";

// Revalidate every 30 seconds
export const revalidate = 30;

export default async function Home() {
  // Fetch all data in parallel
  const [agents, tasks, emails] = await Promise.all([
    getAgents(),
    getTasks(),
    getRecentEmails(),
  ]);

  return (
    <main className="min-h-screen pb-8">
      <Header />
      
      {/* Pull-to-refresh indicator area */}
      <div className="max-w-lg mx-auto">
        <OvernightSummary tasks={tasks} />
        
        <div className="border-t border-white/5" />
        
        <NeedsAttention tasks={tasks} emails={emails} />
        
        <div className="border-t border-white/5" />
        
        <AgentStatus agents={agents} tasks={tasks} />
        
        <div className="border-t border-white/5" />
        
        <RecentActivity tasks={tasks} />
      </div>

      {/* Refresh indicator */}
      <RefreshButton />
    </main>
  );
}

function RefreshButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="/"
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </a>
    </div>
  );
}
