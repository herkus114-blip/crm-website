import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ label, value, sub, icon: Icon, tone = 'slate', onClick }) {
  const tones = {
    slate: 'from-slate-50 to-slate-100 text-slate-900',
    emerald: 'from-emerald-50 to-emerald-100 text-emerald-900',
    amber: 'from-amber-50 to-amber-100 text-amber-900',
    rose: 'from-rose-50 to-rose-100 text-rose-900',
    sky: 'from-sky-50 to-sky-100 text-sky-900',
    indigo: 'from-indigo-50 to-indigo-100 text-indigo-900'
  };
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br p-4 text-left shadow-sm transition-all',
        tones[tone],
        onClick && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold tabular-nums">{value}</p>
          {sub && <p className="mt-0.5 truncate text-xs text-slate-500">{sub}</p>}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 ring-1 ring-black/5">
            <Icon className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
          </div>
        )}
      </div>
    </button>
  );
}