import { Task, AnalysisResult } from "./types";

export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    name: "Fix Stripe Webhook Production Crash",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Tomorrow
    estimatedHours: 4,
    importance: "High",
  },
  {
    id: "task-2",
    name: "Finalize SaaS Pitch Deck & Financial Model",
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16), // In 2 days
    estimatedHours: 8,
    importance: "High",
  },
  {
    id: "task-3",
    name: "Optimize Relational Database Queries & Indexes",
    deadline: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString().slice(0, 16), // In 4 days
    estimatedHours: 5,
    importance: "Medium",
  },
  {
    id: "task-4",
    name: "Refactor App Layout & Context State",
    deadline: new Date(Date.now() + 144 * 60 * 60 * 1000).toISOString().slice(0, 16), // In 6 days
    estimatedHours: 10,
    importance: "Low",
  },
];

export const SAMPLE_ANALYSIS_RESULT: AnalysisResult = {
  workloadSummary: "Your workload is heavily bottlenecked by the high-importance Stripe webhook fix due in 24 hours. However, with 6 hours of available time today, you have a solid runway to clear the critical hazards.",
  riskLevel: "Elevated",
  successProbability: 75,
  productivityScore: 84,
  highestPriorityTaskName: "Fix Stripe Webhook Production Crash",
  priorityRanking: [
    {
      taskName: "Fix Stripe Webhook Production Crash",
      priorityScore: 10,
      reason: "Critical production bug causing data mismatches. Immediate rescue needed.",
    },
    {
      taskName: "Finalize SaaS Pitch Deck & Financial Model",
      priorityScore: 8,
      reason: "High importance investor deliverable with a 48-hour hard deadline.",
    },
    {
      taskName: "Optimize Relational Database Queries & Indexes",
      priorityScore: 6,
      reason: "Medium priority performance enhancement. Can be deferred if Stripe fix overflows.",
    },
    {
      taskName: "Refactor App Layout & Context State",
      priorityScore: 3,
      reason: "Low impact internal refactor. Candidate for de-scoping if capacity tightens.",
    },
  ],
  aiDecisionLog: [
    "Decision: Prioritize Stripe Webhook Hotfix | Reason: Critical production billing crash due in 24 hours | Expected Impact: Eliminates transaction failures and protects subscription revenue.",
    "Decision: Defer App Layout Refactoring | Reason: Low business impact with a long deadline (6 days) | Expected Impact: Reclaims 10 hours of premium focus time to allocate to high-impact items.",
    "Decision: Allocate 4-Hour Morning Sprint Block | Reason: Protects developer flow and prevents task-switching fatigue | Expected Impact: Resolves high-complexity Stripe issue in a single cohesive session.",
    "Decision: Dedicate 2-Hour Afternoon Momentum Block | Reason: Pitches must be drafted before tomorrow's review | Expected Impact: Secures baseline investor slides ahead of schedule."
  ],
  personalizedRescuePlan: "To secure successful deliveries, you must protect your core focus hours today. Spend 4 of your 6 available hours today exclusively on the Stripe webhook crash to achieve a clean resolution. Do not context-switch to database optimization or refactoring until the pitch deck and Stripe crash are both resolved.",
  missionBrief: "Your current task backlog represents 27 hours of total effort with a pressing 24-hour deadline on production Stripe crashes. Our strategy concentrates early hours today strictly on hotfixing billing and outlines a deferred, de-scoped roadmap for refactoring to guarantee safety.",
  ifYouIgnoreThisPlan: "Ignoring this timeline will lead to a high probability of missing the Stripe Hotfix deadline, leading to immediate billing errors, customer support overflow, and potential churn. Postponing the Pitch Deck will also jeopardize investor readiness ahead of tomorrow's review.",
  aiConfidence: {
    percentage: 95,
    reasoning: "High confidence due to precise task durations, clear deadlines, and ample daily focus hours (6h) dedicated strictly to high-importance items."
  },
  emergencyReport: {
    biggestRisk: "Stripe production webhook crash is due in 24 hours and could result in lost subscriber payments.",
    recoveryStrategy: "Ruthlessly de-scope secondary aesthetic frontend adjustments and postpone index optimizations until Stripe billing resolves.",
    tasksToCompleteToday: ["Fix Stripe Webhook Production Crash", "SaaS Pitch Deck Outlining"],
    tasksToDelay: ["Refactor App Layout & Context State", "Optimize Relational Database Queries"],
    timeSavedHours: 15,
    expectedSuccessProbabilityAfterRescue: 92
  },
  todayActionPlan: [
    {
      timeSlot: "09:00 - 13:00",
      taskName: "Fix Stripe Webhook Production Crash",
      allocatedHours: 4,
      actionDescription: "Isolate the failing webhook payload, write tests, and deploy hotfix to staging.",
    },
    {
      timeSlot: "14:30 - 16:30",
      taskName: "Finalize SaaS Pitch Deck & Financial Model",
      allocatedHours: 2,
      actionDescription: "Draft the market sizing and slide outlining core revenue projections.",
    },
  ],
  tomorrowActionPlan: [
    {
      timeSlot: "09:00 - 13:00",
      taskName: "Finalize SaaS Pitch Deck & Financial Model",
      allocatedHours: 4,
      actionDescription: "Synthesize investor feedback, finalize slides, and export the pitch deck.",
    },
    {
      timeSlot: "14:00 - 16:00",
      taskName: "Optimize Relational Database Queries & Indexes",
      allocatedHours: 2,
      actionDescription: "Add indexes to high-traffic slow queries to resolve latency alerts.",
    },
  ],
};
