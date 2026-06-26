import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import TaskForm from "./components/TaskForm";
import Dashboard from "./components/Dashboard";
import { Task, AnalysisResult } from "./types";
import { DEFAULT_TASKS, SAMPLE_ANALYSIS_RESULT } from "./sampleData";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [availableHours, setAvailableHours] = useState<number>(6);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(SAMPLE_ANALYSIS_RESULT);
  const [apiError, setApiError] = useState<{ message: string; isFallback: boolean } | null>(null);

  // Add Task
  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [taskWithId, ...prev]);
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset to default sample tasks
  const handleLoadDefaults = () => {
    setTasks(DEFAULT_TASKS);
    setAnalysisResult(SAMPLE_ANALYSIS_RESULT);
    setApiError(null);
  };

  // Trigger analysis
  const handleAnalyze = async () => {
    if (tasks.length === 0) return;
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks,
          availableHoursToday: availableHours,
          emergencyMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Failed server validation");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setApiError(null);
    } catch (err: any) {
      console.error("Failed to reach live DeadlinePilot API service:", err);
      setApiError({
        message: err.message || "To activate live AI analysis, please add GEMINI_API_KEY to your Secrets panel.",
        isFallback: false,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-white">
      {/* Background radial effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeTasksCount={tasks.length}
        riskLevel={analysisResult ? analysisResult.riskLevel : null}
      />

      {/* Main Content Areas */}
      <div className="relative z-10 flex-grow">
        {currentView === "landing" ? (
          <LandingHero onLaunchWorkspace={() => setCurrentView("dashboard")} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* SaaS Banner Alert for API Key warning if any */}
            {apiError && (
              <div className="mb-6 p-4 bg-rose-950/20 border border-rose-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-rose-900/5 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-zinc-100">DeadlinePilot AI Connection Issue</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                      {apiError.message} To authenticate and activate live <strong>Gemini 3.5-Flash</strong> analysis, go to the <strong>Settings</strong> panel, open the <strong>Secrets</strong> tab, and verify <code>GEMINI_API_KEY</code> has been populated.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setApiError(null)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] rounded-lg border border-zinc-800 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            )}

            {/* Main Application Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Sidebar Panel (4 cols) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <TaskForm
                  onAddTask={handleAddTask}
                  onLoadDefaults={handleLoadDefaults}
                  availableHours={availableHours}
                  onAvailableHoursChange={setAvailableHours}
                />
              </div>

              {/* Main Dashboard Panel (8 cols) */}
              <div className="lg:col-span-8">
                <Dashboard
                  tasks={tasks}
                  onDeleteTask={handleDeleteTask}
                  availableHours={availableHours}
                  emergencyMode={emergencyMode}
                  onToggleEmergencyMode={() => setEmergencyMode((prev) => !prev)}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  analysisResult={analysisResult}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Humble Footer */}
      <footer className="border-t border-zinc-900/80 bg-zinc-950/60 backdrop-blur-md relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            &copy; 2026 DeadlinePilot AI Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Security Protocol</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-300 cursor-pointer font-bold text-indigo-400/80">Gemini 3.5 Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
