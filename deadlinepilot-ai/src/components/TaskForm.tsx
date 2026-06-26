import React, { useState } from "react";
import { Plus, RefreshCcw, Calendar, Clock, AlertCircle } from "lucide-react";
import { Task } from "../types";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id">) => void;
  onLoadDefaults: () => void;
  availableHours: number;
  onAvailableHoursChange: (hours: number) => void;
}

export default function TaskForm({
  onAddTask,
  onLoadDefaults,
  availableHours,
  onAvailableHoursChange,
}: TaskFormProps) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedHours, setEstimatedHours] = useState<number>(3);
  const [importance, setImportance] = useState<"Low" | "Medium" | "High">("Medium");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Task Name is required.");
      return;
    }
    if (!deadline) {
      setError("Deadline date and time are required.");
      return;
    }
    if (estimatedHours <= 0) {
      setError("Estimated Hours must be greater than 0.");
      return;
    }

    onAddTask({
      name: name.trim(),
      deadline,
      estimatedHours,
      importance,
    });

    // Reset Form
    setName("");
    setDeadline("");
    setEstimatedHours(3);
    setImportance("Medium");
  };

  return (
    <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 backdrop-blur-sm shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-white">Add Focus Task</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Add a task to your daily schedule</p>
        </div>
        <button
          onClick={onLoadDefaults}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-150 font-mono"
          title="Reset to production sample tasks"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>Reload Sample Tasks</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="task-creation-form">
        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 font-mono">TASK NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deploy staging container, Audit database indices"
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all font-sans"
            id="task-input-name"
          />
        </div>

        {/* Form row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deadline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 font-mono">DEADLINE DATE & TIME</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-sm text-zinc-200 outline-none transition-all font-sans select-none"
                id="task-input-deadline"
              />
            </div>
          </div>

          {/* Estimated Hours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 font-mono">ESTIMATED EFFORT (HOURS)</label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours || ""}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 4.5"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl text-sm text-zinc-200 outline-none transition-all font-sans"
                id="task-input-hours"
              />
            </div>
          </div>
        </div>

        {/* Importance and Active hours Today */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Importance Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 font-mono">IMPORTANCE LEVEL</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Low", "Medium", "High"] as const).map((level) => {
                const isSelected = importance === level;
                let colorClass = "";
                if (isSelected) {
                  if (level === "High") colorClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                  else if (level === "Medium") colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                  else colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                } else {
                  colorClass = "bg-zinc-950 hover:bg-zinc-900 text-zinc-500 border-zinc-800/80 hover:text-zinc-300";
                }

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setImportance(level)}
                    className={`py-2 px-3 text-xs font-mono font-medium rounded-xl border transition-all duration-150 ${colorClass}`}
                    id={`btn-importance-${level.toLowerCase()}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Available Hours */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 font-mono">AVAILABLE HOURS TODAY</label>
            <input
              type="range"
              min="1"
              max="16"
              step="0.5"
              value={availableHours}
              onChange={(e) => onAvailableHoursChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-zinc-950 rounded-lg cursor-pointer mt-4"
              id="slider-available-hours"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>1h Min</span>
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 text-xs">
                {availableHours}h Target
              </span>
              <span>16h Max</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="font-sans font-semibold tracking-tight mt-2 w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/10 text-white text-sm rounded-xl transition-all duration-200"
          id="btn-add-task-submit"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task to Workload</span>
        </button>
      </form>
    </div>
  );
}
