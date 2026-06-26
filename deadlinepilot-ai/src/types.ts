export interface Task {
  id: string;
  name: string;
  deadline: string; // ISO date/time format YYYY-MM-DDTHH:MM
  estimatedHours: number;
  importance: "Low" | "Medium" | "High";
}

export interface PriorityRanking {
  taskName: string;
  priorityScore: number;
  reason: string;
}

export interface ActionBlock {
  timeSlot: string;
  taskName: string;
  allocatedHours: number;
  actionDescription: string;
}

export interface AnalysisResult {
  workloadSummary: string;
  riskLevel: "Safe" | "Elevated" | "Critical";
  successProbability: number;
  priorityRanking: PriorityRanking[];
  aiDecisionLog: string[];
  personalizedRescuePlan: string;
  todayActionPlan: ActionBlock[];
  tomorrowActionPlan: ActionBlock[];
  productivityScore: number;
  highestPriorityTaskName: string;
  emergencyReport?: {
    biggestRisk: string;
    recoveryStrategy: string;
    tasksToCompleteToday: string[];
    tasksToDelay: string[];
    timeSavedHours: number;
    expectedSuccessProbabilityAfterRescue: number;
  };
  missionBrief?: string;
  ifYouIgnoreThisPlan?: string;
  aiConfidence?: {
    percentage: number;
    reasoning: string;
  };
}
