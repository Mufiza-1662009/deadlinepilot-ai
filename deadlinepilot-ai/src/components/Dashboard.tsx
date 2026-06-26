import React from "react";
import {
  Trash2,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Flame,
  Info,
  Terminal,
  Activity,
  HeartHandshake,
  Gauge,
  Sparkles,
  TrendingUp,
  Target,
  Brain,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Task, AnalysisResult } from "../types";

interface DashboardProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  availableHours: number;
  emergencyMode: boolean;
  onToggleEmergencyMode: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
}

export default function Dashboard({
  tasks,
  onDeleteTask,
  availableHours,
  emergencyMode,
  onToggleEmergencyMode,
  onAnalyze,
  isAnalyzing,
  analysisResult,
}: DashboardProps) {
  // Format Date safely
  const formatDeadline = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Get status color for importance levels
  const getImportanceBadge = (importance: Task["importance"]) => {
    switch (importance) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Low":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
  };

  // Compute standard baseline metrics to display even before first analysis
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  
  // Calculate default / current states
  const currentProbability = analysisResult 
    ? analysisResult.successProbability 
    : tasks.length > 0 
      ? Math.max(15, Math.min(95, Math.round((availableHours * 2.5 / totalHours) * 100))) 
      : 100;

  const currentRisk: "Safe" | "Elevated" | "Critical" = analysisResult
    ? analysisResult.riskLevel
    : tasks.length === 0
      ? "Safe"
      : currentProbability < 50
        ? "Critical"
        : currentProbability < 80
          ? "Elevated"
          : "Safe";

  const currentProdScore = analysisResult
    ? analysisResult.productivityScore
    : tasks.length > 0
      ? Math.max(20, Math.min(98, Math.round(95 - (totalHours * 1.8) + (availableHours * 2.2))))
      : 100;

  const currentHighestTask = analysisResult
    ? analysisResult.highestPriorityTaskName
    : tasks.length > 0
      ? [...tasks].sort((a, b) => {
          if (a.importance === "High" && b.importance !== "High") return -1;
          if (b.importance === "High" && a.importance !== "High") return 1;
          return a.estimatedHours - b.estimatedHours;
        })[0]?.name
      : "No critical tasks";

  // Get dynamic color scheme based on risk level
  const getRiskScheme = (risk: "Safe" | "Elevated" | "Critical") => {
    switch (risk) {
      case "Safe":
        return {
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          glow: "shadow-emerald-500/5",
          accent: "from-emerald-500 to-teal-500",
          badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        };
      case "Elevated":
        return {
          text: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          glow: "shadow-amber-500/5",
          accent: "from-amber-500 to-orange-500",
          badge: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
        };
      case "Critical":
        return {
          text: "text-rose-400",
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          glow: "shadow-rose-500/5",
          accent: "from-rose-500 to-red-500",
          badge: "bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse"
        };
    }
  };

  const activeRiskScheme = getRiskScheme(currentRisk);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. MISSION CONTROL PREMIUM DASHBOARD */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 p-6 shadow-2xl relative overflow-hidden" id="mission-control">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Gauge className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-bold tracking-wider text-indigo-400 uppercase">Live Dashboard</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white tracking-tight mt-1">Mission Control • Live AI Assessment</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleEmergencyMode}
              className={`px-4 py-2 text-xs font-sans font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                emergencyMode
                  ? "bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
              }`}
              id="mission-control-emergency-trigger"
            >
              <Flame className={`h-3.5 w-3.5 ${emergencyMode ? "animate-bounce text-white" : "text-rose-500"}`} />
              <span>Emergency Rescue Mode: {emergencyMode ? "Active" : "Ready"}</span>
            </button>

            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || tasks.length === 0}
              className={`px-5 py-2 text-xs font-sans font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${
                tasks.length === 0
                  ? "bg-zinc-900 text-zinc-600 border border-zinc-800/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25"
              }`}
              id="mission-control-analyze-trigger"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Analyze & Rescue</span>
            </button>
          </div>
        </div>

        {/* Bento Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {/* Card 1: Total Workload */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Workload Status</span>
              <Activity className="h-4 w-4 text-indigo-400 opacity-80 shrink-0" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl lg:text-xl xl:text-2xl 2xl:text-4xl font-mono font-bold text-white tracking-tight leading-none">{totalHours}h</div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1">Total estimated hours</p>
            </div>
          </div>

          {/* Card 2: Focus available */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Available Focus Hours</span>
              <Clock className="h-4 w-4 text-emerald-400 opacity-80 shrink-0" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl lg:text-xl xl:text-2xl 2xl:text-4xl font-mono font-bold text-white tracking-tight leading-none">{availableHours}h</div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1">Available hours today</p>
            </div>
          </div>

          {/* Card 3: Completion Prob */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Completion Probability</span>
              <TrendingUp className="h-4 w-4 text-violet-400 opacity-80 shrink-0" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl lg:text-xl xl:text-2xl 2xl:text-4xl font-mono font-bold text-white tracking-tight leading-none">{currentProbability}%</div>
              <div className="w-full bg-zinc-900 rounded-full h-1 mt-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${currentProbability}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Card 4: Deadline Risk */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Deadline Risk</span>
              <ShieldAlert className="h-4 w-4 text-rose-400 opacity-80 shrink-0" />
            </div>
            <div className="mt-3 flex flex-col justify-end h-full">
              <div>
                <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md inline-block max-w-full truncate ${activeRiskScheme.badge}`}>
                  {currentRisk}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1.5">Deadline pressure</p>
            </div>
          </div>

          {/* Card 5: Productivity Score */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Productivity Score</span>
              <Target className="h-4 w-4 text-amber-400 opacity-80 shrink-0" />
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl lg:text-xl xl:text-2xl 2xl:text-4xl font-mono font-bold text-white tracking-tight leading-none">{currentProdScore}/100</div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1">Focus efficiency</p>
            </div>
          </div>

          {/* Card 6: Highest Priority Task */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between group hover:border-zinc-800 transition-all duration-150 col-span-2 sm:col-span-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-display text-zinc-400 font-bold uppercase tracking-wider truncate">Highest Priority Task</span>
              <Zap className="h-4 w-4 text-amber-500 opacity-80 shrink-0" />
            </div>
            <div className="mt-3 overflow-hidden">
              <div className="text-xs font-semibold text-zinc-200 truncate leading-snug">{currentHighestTask}</div>
              <p className="text-[9px] text-zinc-500 font-sans mt-1">Highest priority item</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EMERGENCY RESCUE INTERFACE MODE */}
      {emergencyMode && (
        <div className="bg-gradient-to-br from-rose-950/20 via-zinc-950 to-zinc-950 rounded-2xl border-2 border-rose-500/50 p-6 shadow-2xl relative overflow-hidden animate-pulse-slow">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shrink-0">
              <Flame className="h-6 w-6 animate-bounce" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">EMERGENCY RESCUE ACTIVATED</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-rose-500/20 text-rose-300 font-mono rounded uppercase animate-ping">CRITICAL DEADLINE PRESSURES</span>
              </div>
              <h3 className="text-lg font-display font-black text-white mt-1">🚨 Emergency Rescue Activated</h3>
              
              {analysisResult?.emergencyReport ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-900 pt-4 font-sans text-sm">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="font-mono text-xs text-rose-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> Biggest Risk:
                      </h4>
                      <p className="text-zinc-200 mt-1 leading-relaxed">
                        {analysisResult.emergencyReport.biggestRisk}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-mono text-xs text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" /> Recovery Strategy:
                      </h4>
                      <p className="text-zinc-300 mt-1 leading-relaxed">
                        {analysisResult.emergencyReport.recoveryStrategy}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 bg-zinc-950/50 p-4 rounded-xl border border-rose-500/10 justify-between min-w-0">
                    <div className="grid grid-cols-2 gap-3 min-w-0">
                      <div className="min-w-0">
                        <span className="text-[10px] font-display font-bold tracking-wider text-zinc-400 uppercase block truncate">Est. Time Saved</span>
                        <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400 mt-1 tracking-tight truncate">
                          +{analysisResult.emergencyReport.timeSavedHours} Hours
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-display font-bold tracking-wider text-zinc-400 uppercase block truncate">Est. Success Rate</span>
                        <div className="text-lg sm:text-xl font-mono font-bold text-indigo-400 mt-1 tracking-tight truncate">
                          {analysisResult.emergencyReport.expectedSuccessProbabilityAfterRescue}%
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-3 min-w-0">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5">TARGET SCHEDULE:</span>
                      <div className="flex flex-col gap-1.5 text-xs min-w-0">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-zinc-300 font-medium font-mono shrink-0">Tasks to Finish Today:</span>
                          <span className="text-zinc-400 truncate max-w-full sm:max-w-xs">{analysisResult.emergencyReport.tasksToCompleteToday.join(", ")}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span className="text-zinc-400 font-medium font-mono shrink-0">Tasks to Delay:</span>
                          <span className="text-zinc-500 line-through truncate max-w-full sm:max-w-xs">{analysisResult.emergencyReport.tasksToDelay.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-300/80 mt-2 leading-relaxed">
                  The emergency rescue mode has been armed. Click the "Analyze & Rescue" button to analyze risk margins, plan de-scoped items, and draft your recovery strategy.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Board Layout: Tasks lists & Form/Result panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left pane: Active workload list (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-white tracking-tight">Workload Backlog</h2>
              <p className="text-xs text-zinc-500 mt-1">Currently active deadlines configured in your planner</p>
            </div>
            <span className="text-xs font-mono bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded-md border border-zinc-700/60">
              {tasks.length} Active Tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-zinc-900/60 rounded-full border border-zinc-800/80">
                <ShieldAlert className="h-6 w-6 text-zinc-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-zinc-300">Workload Backlog Empty</h3>
                <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
                  Add tasks with deadlines using the creation form to analyze your deadline risk.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-900/20 hover:bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-800 rounded-xl p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 mt-0.5 group-hover:text-indigo-400 group-hover:border-indigo-500/25 transition-all shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-semibold text-sm text-zinc-100 leading-snug break-words">
                        {task.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          {formatDeadline(task.deadline)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline" />
                        <span className="font-mono text-zinc-500">
                          Effort: <strong className="text-zinc-300">{task.estimatedHours}h</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-zinc-800/50 pt-3 sm:pt-0">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full ${getImportanceBadge(task.importance)}`}>
                      {task.importance} Importance
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/15 transition-all duration-150"
                      title="Remove task"
                      id={`btn-delete-task-${task.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right pane: Analysis Results / Instructions (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-6 min-w-0">
          
          {/* 5. BETTER LOADING EXPERIENCE WITH PULSING SKELETON CARDS */}
          {isAnalyzing ? (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl min-h-[420px]" id="loading-deck">
              <div className="flex flex-col gap-2 border-b border-zinc-800/60 pb-4">
                <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                  <Activity className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">AI ANALYSIS COMPUTATION</span>
                </div>
                <h3 className="font-display font-bold text-white text-base">
                  DeadlinePilot AI is analyzing your workload...
                </h3>
              </div>

              {/* Animated skeleton lines representing simulated workload analysis scans */}
              <div className="flex flex-col gap-4">
                {/* Skeleton 1 */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900/80 animate-pulse">
                  <div className="h-3.5 w-1/3 bg-zinc-800 rounded-md mb-2.5" />
                  <div className="h-2.5 w-4/5 bg-zinc-800 rounded-md" />
                </div>
                {/* Skeleton 2 */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900/80 animate-pulse [animation-delay:200ms]">
                  <div className="h-3.5 w-1/4 bg-zinc-800 rounded-md mb-2.5" />
                  <div className="h-2.5 w-2/3 bg-zinc-800 rounded-md" />
                </div>
                {/* Skeleton 3 */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900/80 animate-pulse [animation-delay:400ms]">
                  <div className="h-3.5 w-1/2 bg-zinc-800 rounded-md mb-2.5" />
                  <div className="h-2.5 w-5/6 bg-zinc-800 rounded-md" />
                </div>
              </div>

              <div className="w-full bg-zinc-950 rounded-lg p-3 border border-zinc-900 text-left font-mono text-[10px] text-zinc-500 mt-auto">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Terminal className="h-3 w-3" />
                  <span>AI_SCHEDULING_LOG</span>
                </div>
                <div className="opacity-80 animate-pulse">{"Evaluating priority margins..."}</div>
                <div className="opacity-40 mt-1">{"[AI strategy engine analyzing deadlines...]"}</div>
              </div>
            </div>
          ) : analysisResult ? (
            
            /* 4. REDESIGNED PREMIUM AI RESULT CARDS */
            <div className="flex flex-col gap-6">
              {/* Mission Brief */}
              {analysisResult.missionBrief && (
                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">MISSION BRIEF</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                    {analysisResult.missionBrief}
                  </p>
                </div>
              )}

              {/* Core metrics box */}
              <div className={`bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 rounded-2xl border p-6 backdrop-blur-sm shadow-xl flex flex-col gap-5 ${activeRiskScheme.border}`}>
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${activeRiskScheme.text}`} />
                    <span className="text-xs font-mono font-bold uppercase text-zinc-300">AI ANALYSIS REPORT</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-full ${activeRiskScheme.badge}`}>
                    {analysisResult.riskLevel} Risk State
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 items-start">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold tracking-tight text-zinc-100">
                      {analysisResult.successProbability}% Success Rate
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">Completion Probability</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden mt-1.5 border border-zinc-800/50">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${activeRiskScheme.accent} transition-all duration-300`}
                      style={{ width: `${analysisResult.successProbability}%` }}
                    />
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900/80">
                  <span className="text-[9px] font-mono font-semibold text-zinc-500 tracking-wider uppercase block mb-1">AI VERDICT</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {analysisResult.workloadSummary}
                  </p>
                </div>

                {/* AI Confidence Profile */}
                {analysisResult.aiConfidence && (
                  <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-semibold text-zinc-500 tracking-wider uppercase block">AI CONFIDENCE PROFILE</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {analysisResult.aiConfidence.percentage}% Confident
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans italic">
                      "{analysisResult.aiConfidence.reasoning}"
                    </p>
                  </div>
                )}
              </div>

              {/* Personalized Rescue recommendation */}
              <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 backdrop-blur-sm shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <HeartHandshake className="h-4 w-4 shrink-0" />
                  <h3 className="font-display font-bold text-sm text-zinc-200">Personalized Rescue Plan</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/60">
                  {analysisResult.personalizedRescuePlan}
                </p>
              </div>

              {/* If You Ignore This Plan */}
              {analysisResult.ifYouIgnoreThisPlan && (
                <div className="bg-rose-950/15 rounded-2xl border border-rose-500/20 p-6 backdrop-blur-sm shadow-xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
                    <h3 className="font-display font-bold text-sm text-zinc-200">If You Ignore This Plan</h3>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed font-sans bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/60">
                    {analysisResult.ifYouIgnoreThisPlan}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900/15 border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-inner min-h-[300px]">
              <div className="p-3 bg-zinc-950 rounded-xl text-indigo-400 border border-indigo-500/10">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-zinc-400">No Analysis Generated</h3>
                <p className="text-zinc-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                  Your workloads must be passed through the analyzer. Adjust your Available Hours or engage Emergency rescue mode, then press "Analyze & Rescue".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Schedules Block (Full Width bottom segment) */}
      {analysisResult && !isAnalyzing && (
        <div className="mt-4 flex flex-col gap-6">
          <div className="border-t border-zinc-900 pt-8 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-zinc-100">AI Schedule Planner</h2>
              <p className="text-xs text-zinc-500 mt-1">Direct hourly block allocations recommended to satisfy your timelines</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono bg-zinc-900/60 px-3 py-1 rounded-lg border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Optimized Action Schedule</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's schedule */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 rounded-2xl border border-zinc-800 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-indigo-500/15 text-indigo-400 rounded-lg">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-indigo-400">TODAY'S FOCUS ACTION PLAN</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-950/60 px-2 py-0.5 rounded border border-zinc-900">
                  Focus Window: {availableHours} hours
                </span>
              </div>

              {analysisResult.todayActionPlan.length === 0 ? (
                <p className="text-zinc-500 text-xs italic p-4 text-center">No specific activities scheduled for today. Focus on buffer generation.</p>
              ) : (
                <div className="flex flex-col gap-3.5 min-w-0">
                  {analysisResult.todayActionPlan.map((block, idx) => (
                    <div key={idx} className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/80 flex flex-col sm:flex-row gap-3 justify-between items-start hover:bg-zinc-950/80 transition-all duration-150 min-w-0">
                      <div className="flex flex-col gap-1 flex-grow min-w-0">
                        <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest font-bold">{block.timeSlot}</span>
                        <h4 className="text-sm font-semibold text-zinc-200 truncate">{block.taskName}</h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed break-words">{block.actionDescription}</p>
                      </div>
                      <span className="shrink-0 bg-zinc-900/60 text-indigo-300 font-mono text-xs px-2.5 py-1 rounded border border-zinc-850 font-medium font-mono">
                        {block.allocatedHours}h Block
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tomorrow's schedule */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 rounded-2xl border border-zinc-800 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-violet-500/15 text-violet-400 rounded-lg">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-violet-400">TOMORROW'S FOCUS ACTION PLAN</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-950/60 px-2 py-0.5 rounded border border-zinc-900">
                  Next Day Focus
                </span>
              </div>

              {analysisResult.tomorrowActionPlan.length === 0 ? (
                <p className="text-zinc-500 text-xs italic p-4 text-center">Buffer allocation. Maintain standard project operational speeds.</p>
              ) : (
                <div className="flex flex-col gap-3.5 min-w-0">
                  {analysisResult.tomorrowActionPlan.map((block, idx) => (
                    <div key={idx} className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/80 flex flex-col sm:flex-row gap-3 justify-between items-start hover:bg-zinc-950/80 transition-all duration-150 min-w-0">
                      <div className="flex flex-col gap-1 flex-grow min-w-0">
                        <span className="text-violet-400 font-mono text-[10px] uppercase tracking-widest font-bold">{block.timeSlot}</span>
                        <h4 className="text-sm font-semibold text-zinc-200 truncate">{block.taskName}</h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed break-words">{block.actionDescription}</p>
                      </div>
                      <span className="shrink-0 bg-zinc-900/60 text-violet-300 font-mono text-xs px-2.5 py-1 rounded border border-zinc-850 font-medium font-mono">
                        {block.allocatedHours}h Block
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            
            {/* Priority ranking deck */}
            <div className="lg:col-span-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 shadow-lg flex flex-col gap-4 min-w-0">
              <div className="border-b border-zinc-800/60 pb-3 flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-zinc-400">PRIORITY TIMELINE SEQUENCE</span>
                <span className="text-[10px] font-mono text-zinc-500">AI Prioritization</span>
              </div>

              <div className="flex flex-col gap-3">
                {analysisResult.priorityRanking.map((ranking, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-900/80 hover:border-zinc-800 transition-colors min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-extrabold text-indigo-400 shrink-0">
                      0{idx + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-zinc-200 truncate">{ranking.taskName}</h4>
                        <span className="text-[10px] font-mono text-amber-400 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                          {ranking.priorityScore}/10 Impact
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{ranking.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ADVANCED AI DECISION LOG REASONING CARD */}
            <div className="lg:col-span-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 shadow-xl flex flex-col gap-4 min-w-0" id="ai-decision-log">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-zinc-300">AI DECISION LOG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-500">AI DECISION LOG</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 flex-grow">
                {analysisResult.aiDecisionLog && analysisResult.aiDecisionLog.length > 0 ? (
                  analysisResult.aiDecisionLog.map((logLine, idx) => {
                    const parts = logLine.split("|");
                    const isStructured = parts.length >= 2;

                    if (isStructured) {
                      const decisionPart = parts[0]?.trim() || "";
                      const reasonPart = parts[1]?.trim() || "";
                      const impactPart = parts[2]?.trim() || "";

                      const cleanDecision = decisionPart.replace(/^decision:\s*/i, "");
                      const cleanReason = reasonPart.replace(/^reason:\s*/i, "");
                      const cleanImpact = impactPart.replace(/^(expected\s+)?impact:\s*/i, "");

                      return (
                        <div key={idx} className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex gap-3 hover:bg-zinc-950 transition-colors min-w-0">
                          <div className="mt-1 shrink-0">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                              <Brain className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          <div className="flex-grow flex flex-col gap-2 text-xs min-w-0">
                            {cleanDecision && (
                              <div className="min-w-0">
                                <span className="font-mono text-[9px] text-indigo-400 uppercase font-bold tracking-wider block">Decision</span>
                                <p className="text-zinc-200 mt-0.5 leading-relaxed font-sans break-words">{cleanDecision}</p>
                              </div>
                            )}
                            {cleanReason && (
                              <div className="min-w-0">
                                <span className="font-mono text-[9px] text-amber-400 uppercase font-bold tracking-wider block">Reason</span>
                                <p className="text-zinc-400 mt-0.5 leading-relaxed font-sans break-words">{cleanReason}</p>
                              </div>
                            )}
                            {cleanImpact && (
                              <div className="min-w-0">
                                <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold tracking-wider block">Expected Impact</span>
                                <p className="text-zinc-350 mt-0.5 leading-relaxed font-sans break-words">{cleanImpact}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Check if it's high priority or postponed task to add beautiful context indicators
                    const isHigh = logLine.toLowerCase().includes("prioritized") || logLine.toLowerCase().includes("critical");
                    const isPostponed = logLine.toLowerCase().includes("postponed") || logLine.toLowerCase().includes("deferred");
                    
                    return (
                      <div key={idx} className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-900 flex gap-3 hover:bg-zinc-950 transition-colors min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {isHigh ? (
                            <div className="p-1 bg-rose-500/10 rounded text-rose-400 border border-rose-500/20">
                              <Zap className="h-3 w-3" />
                            </div>
                          ) : isPostponed ? (
                            <div className="p-1 bg-amber-500/10 rounded text-amber-400 border border-amber-500/20">
                              <Clock className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="p-1 bg-indigo-500/10 rounded text-indigo-400 border border-indigo-500/20">
                              <ShieldCheck className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans break-words">
                            {logLine}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 italic p-4 text-center">No decision traces logged. Run a workload analysis.</p>
                )}
              </div>

              {/* Secondary shell logger representation for rich tech-forward style */}
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-900/80 font-mono text-[9px] text-zinc-500 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-emerald-400" />
                  <span className="text-zinc-600">STDOUT:</span>
                  <span className="text-zinc-400 select-all">deadline_pilot_ai.sh</span>
                </div>
                <span className="text-emerald-400">ANALYSIS_COMPLETE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
