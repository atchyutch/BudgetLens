'use client';
import React from 'react';

export default function BudgetBar({ id, name, total, spent, balance }) {
  const pct = Math.min((spent / total) * 100, 100).toFixed(1);

  // colour logic
  let barColor = 'bg-emerald-500';
  if (pct >= 75 && pct < 100) barColor = 'bg-amber-500';
  if (pct >= 100)            barColor = 'bg-red-600';

  return (
    <div className="w-full max-w-xl rounded-xl bg-slate-100 p-4 shadow-lg">
      {/* header */}
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Budget Name:{name}</h3>
        <h3 className="text-lg font-semibold text-slate-800">Budget Id:{id}</h3>
        <span className="text-sm text-slate-500">
          {pct}% used
        </span>
      </div>

      {/* progress track */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-300">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* figures */}
      <div className="mt-2 flex justify-between text-sm font-mono">
        <span className="text-slate-600">
          Spent&nbsp;₹{spent.toLocaleString()}
        </span>
        <span className="text-slate-600">
          Left&nbsp;₹{balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
