import React, { useState } from 'react';
import { Search, FileDown } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatNumber, formatCurrency } from '@/lib/armarisUtils';
import { exportPlotPdf } from '@/lib/pdfExport';
import { cn } from '@/lib/utils';

const STATUS_BADGE = {
  'Laisva': 'bg-emerald-100 text-emerald-700',
  'Rezervuota': 'bg-amber-100 text-amber-700',
  'Parduota': 'bg-sky-100 text-sky-700',
  'Statoma': 'bg-indigo-100 text-indigo-700',
  'Projektuojama': 'bg-violet-100 text-violet-700',
  'Leidimas laukia': 'bg-amber-100 text-amber-700',
  'Užbaigta': 'bg-emerald-100 text-emerald-700',
  'Užblokuota': 'bg-rose-100 text-rose-700',
  'Bendra teritorija': 'bg-slate-100 text-slate-600'
};

export default function PlotsList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Plot', { sort: 'internal_plot_number' });
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statuses = [...new Set(data.map(p => p.plot_status).filter(Boolean))];
  const filtered = data.filter(p =>
    (!q || (p.internal_plot_number || '').toLowerCase().includes(q.toLowerCase()) || (p.cadastral_number || '').toLowerCase().includes(q.toLowerCase())) &&
    (!statusFilter || p.plot_status === statusFilter)
  );

  return (
    <div>
      <PageHeader title={t('plots')} subtitle={lang === 'lt' ? 'Visos klotuvės' : 'All plots'} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="">{lang === 'lt' ? 'Visi statusai' : 'All statuses'}</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map(p => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 dark:text-slate-100">{p.internal_plot_number}</p>
                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', STATUS_BADGE[p.plot_status] || 'bg-slate-100 text-slate-600')}>{p.plot_status}</span>
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                <p>{formatNumber(p.area_ares, 'arai')}</p>
                {p.assigned_house_model && <p className="truncate">{p.assigned_house_model}</p>}
                {p.sale_price > 0 && <p className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(p.sale_price)}</p>}
                {p.buyer_name && <p className="truncate">{p.buyer_name}</p>}
              </div>
              <button
                onClick={() => exportPlotPdf(p, lang)}
                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FileDown className="h-3 w-3" /> PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}