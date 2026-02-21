import Header from "@/components/Header";
import TodaysPriorities, { DraftEmail } from "@/components/TodaysPriorities";
import WhileYouSlept from "@/components/WhileYouSlept";
import TeamStatus from "@/components/TeamStatus";
import { getAgents, getTasks, getRecentEmails } from "@/lib/supabase";

// Revalidate every 30 seconds
export const revalidate = 30;

// Hardcoded drafts for now - would come from API/file system in production
const DRAFTS: DraftEmail[] = [
  {
    id: "kendra-schultz",
    recipient: "Kendra Schultz",
    subject: "Thank you for your time at the Showcase",
    body: `Hi Kendra,

Thank you for taking the time to judge at the Duke I&E Startup Showcase this week. Your feedback on AphasiaGPT — particularly around SLP willingness-to-pay and insurance reimbursement — gave me exactly the kind of critical perspective I needed.

I'm taking that feedback seriously. We're validating pricing with SLPs on our waitlist this month before building more features.

If you'd ever like to learn more about what we're building, I'd welcome the conversation.

Best,
Stephen`,
  },
  {
    id: "rob-go",
    recipient: "Rob Go",
    subject: "Thank you for your time at the Showcase",
    body: `Hi Rob,

Thank you for judging at the Duke I&E Startup Showcase. I appreciated your questions about our go-to-market strategy and the B2B2C model.

The feedback from the panel is already shaping how we're approaching our SLP Portal launch. We're prioritizing pricing validation over feature development — getting real signal before building more.

If Nextview ever looks at healthtech or accessibility-focused startups, I'd love to stay in touch.

Best,
Stephen`,
  },
  {
    id: "joshua-miller",
    recipient: "Joshua Miller",
    subject: "Thank you for your time at the Showcase",
    body: `Hi Joshua,

Thank you for being part of the judging panel at the Duke I&E Startup Showcase. Your perspective on the clinical partnership strategy was valuable.

We're moving forward with our SLP Portal pilot, focusing on validating willingness-to-pay with the 25 SLPs on our waitlist. The feedback from judges like you helped clarify that this is the right next step.

I'd welcome any opportunity to continue the conversation.

Best,
Stephen`,
  },
];

export default async function Home() {
  // Fetch all data in parallel
  const [agents, tasks, emails] = await Promise.all([
    getAgents(),
    getTasks(),
    getRecentEmails(),
  ]);

  return (
    <main className="min-h-screen pb-24">
      <Header />
      
      <div className="max-w-lg mx-auto">
        {/* 1. Today's Priorities - What needs action */}
        <TodaysPriorities tasks={tasks} emails={emails} drafts={DRAFTS} />
        
        <div className="section-divider mx-5" />
        
        {/* 2. While You Slept - Brief summary */}
        <WhileYouSlept tasks={tasks} />
        
        <div className="section-divider mx-5" />
        
        {/* 3. Team Status - Collapsed by default */}
        <TeamStatus agents={agents} tasks={tasks} />
      </div>

      {/* Refresh button */}
      <RefreshButton />
    </main>
  );
}

function RefreshButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="/"
        className="w-14 h-14 rounded-2xl bg-[var(--brand-primary)] hover:bg-[#5eb3ff] flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/25 transition-all active:scale-95"
      >
        <svg className="w-6 h-6 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </a>
    </div>
  );
}
