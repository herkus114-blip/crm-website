import React from 'react';
import { cn } from '@/lib/utils';
import { progressColor } from '@/lib/armarisUtils';

export default function ProgressBar({ value = 0, calculated, showDelta = false, className }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full transition-all', progressColor(v))} style={{ width: `${v}%` }} />
        {showDelta && calculated !== undefined && calculated !== value && (
          <div
            className="absolute top-0 h-full w-px bg-slate-800/60"
            style={{ left: `${Math.max(0, Math.min(100, calculated))}%` }}
            title={`Calc: ${calculated}%`}
          />
        )}
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
        <span className="tabular-nums">{Math.round(v)}%</span>
        {showDelta && calculated !== undefined && Math.abs((calculated || 0) - (value || 0)) > 5 && (
          <span className="text-amber-600">{calculated > value ? '▲' : '▼'} {Math.round(calculated)}%</span>
        )}
      </div>
    </div>
  );
}