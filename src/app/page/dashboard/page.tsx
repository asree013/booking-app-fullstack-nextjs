'use client';

import StatCard from "./StackCard";

export default function DashboardPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h2>
            <p className="text-slate-500">Welcome back, here is what's happening today.</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Revenue" value="$45,231.89" change="+20.1%" />
          <StatCard title="Active Users" value="2,350" change="+180.1%" />
          <StatCard title="Active Projects" value="12" change="+3%" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[400px] flex items-center justify-center text-slate-400 italic">
          Chart / Data Table Placeholder
        </div>
      </div>
    </div>
  );
}

