import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue, daysFromToday } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

const PRIORITY_BADGE = {
  'Kritinė': 'bg-rose-100 text-rose-700',
  'Aukšta': 'bg-amber-100 text-amber-700',
  'Vidutinė': 'bg-sky-100 text-sky-700',
  'Žema': 'bg-slate-100 text-slate-600'
};

export default function TasksList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Task', { sort: 'due_date' });
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  const statuses = [...new Set(data.map(x => x.status).filter(Boolean))];
  const filtered = data.filter(x =>
    (!q || (x.title || '').toLowerCase().includes(q.toLowerCase()) || (x.assignee || '').toLowerCase().includes(q.toLowerCase())) &&
    (!statusFilter || x.status === statusFilter) &&
    (!onlyOverdue || (isOverdue(x.due_date) && x.status !== 'Užbaigta' && x.status !== 'Atšaukta'))
  );

  return (
    <div>
      <PageHeader title={t('tasks')} subtitle={lang === 'lt' ? 'Visų užduočių ir terminų valdymas' : 'All tasks and deadlines'} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="">{lang === 'lt' ? 'Visi statusai' : 'All statuses'}</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={onlyOverdue} onChange={e => setOnlyOverdue(e.target.checked)} className="rounded" />
          {lang === 'lt' ? 'Tik vėluojančios' : 'Only overdue'}
        </label>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-2">
          {filtered.map(x => {
            const overdue = isOverdue(x.due_date) && x.status !== 'Užbaigta' && x.status !== 'Atšaukta';
            const days = daysFromToday(x.due_date);
            return (
              <div key={x.id} className={cn('rounded-xl border bg-white p-3', overdue ? 'border-rose-200' : 'border-slate-200')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">{x.title}</p>
                      {x.is_critical && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">{lang === 'lt' ? 'Kritinė' : 'Critical'}</span>}
                      {x.escalated && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">{lang === 'lt' ? 'Eskaluota' : 'Escalated'}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{x.development_name} · {x.assignee || '—'} · {x.category || ''}</p>
                    {x.original_due_date && x.original_due_date !== x.due_date && (
                      <p className="mt-0.5 text-[10px] text-slate-400">{lang === 'lt' ? 'Pradinis terminas' : 'Original'}: {formatDate(x.original_due_date)}{x.delay_reason ? ` · ${x.delay_reason}` : ''}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', PRIORITY_BADGE[x.priority] || 'bg-slate-100 text-slate-600')}>{x.priority}</span>
                    <div className="text-right">
                      <p className={cn('text-xs', overdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>{formatDate(x.due_date)}</p>
                      <p className="text-[10px] text-slate-400">{x.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}