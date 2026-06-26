import React from "react";
import { PlaneTakeoff, Gauge, Compass } from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "dashboard";
  onViewChange: (view: "landing" | "dashboard") => void;
  activeTasksCount: number;
  riskLevel: "Safe" | "Elevated" | "Critical" | null;
}

export default function Navbar({
  currentView,
  onViewChange,
  activeTasksCount,
  riskLevel,
}: NavbarProps) {
  const getRiskBadgeColor = () => {
    switch (riskLevel) {
      case "Safe":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Elevated":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onViewChange("landing")}
            id="nav-logo-container"
          >
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200">
              <PlaneTakeoff className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                Deadline<span className="text-indigo-400">Pilot</span>
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wider bg-indigo-500/15 text-indigo-400 rounded border border-indigo-500/20 uppercase">
                AI
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6" id="nav-actions-container">
            <button
              onClick={() => onViewChange("landing")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans font-medium rounded-lg transition-colors duration-150 ${
                currentView === "landing"
                  ? "text-white bg-zinc-800"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="nav-btn-landing"
            >
              <Compass className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => onViewChange("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans font-medium rounded-lg transition-colors duration-150 ${
                currentView === "dashboard"
                  ? "text-white bg-zinc-800"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="nav-btn-dashboard"
            >
              <Gauge className="h-4 w-4" />
              Productivity Dashboard
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-zinc-800">
              {/* Active tasks count */}
              <div className="text-xs text-zinc-400 font-mono">
                Active Tasks: <span className="text-white font-semibold">{activeTasksCount}</span>
              </div>

              {/* Workload Risk Level badge */}
              {riskLevel && (
                <div className={`px-2 py-0.5 text-xs font-mono font-medium rounded-full ${getRiskBadgeColor()}`}>
                  {riskLevel} Risk
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
