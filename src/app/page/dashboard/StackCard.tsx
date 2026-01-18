function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-3 mt-4">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>
      </div>
    </div>
  );
}

export default StatCard