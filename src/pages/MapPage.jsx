import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  'Laisva': 'bg-emerald-400',
  'Rezervuota': 'bg-amber-400',
  'Parduota': 'bg-sky-500',
  'Statoma': 'bg-indigo-500',
  'Projektuojama': 'bg-violet-400',
  'Leidimas laukia': 'bg-amber-500',
  'Užbaigta': 'bg-emerald-600',
  'Užblokuota': 'bg-rose-500',
  'Bendra teritorija': 'bg-slate-400'
};

export default function MapPage() {
  const { t, lang } = useApp();
  const plots = useEntityList('Plot', { sort: 'internal_plot_number' });
  const developments = useEntityList('Development');

  if (plots.loading) return <Loader />;

  const grid = plots.data;

  return (
    <div>
      <PageHeader title={t('map')} subtitle={lang === 'lt' ? 'Klotuvių statusų planas' : 'Plot status plan view'} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {grid.map(p => (
                <div key={p.id} className="aspect-square rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition hover:shadow-md" title={`${p.internal_plot_number} · ${p.plot_status}`}>
                  <div className={cn('h-full w-full rounded-md', STATUS_COLORS[p.plot_status] || 'bg-slate-300')} />
                  <p className="mt-1 text-center text-[9px] font-medium text-slate-600">{p.internal_plot_number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{lang === 'lt' ? 'Legenda' : 'Legend'}</p>
            <div className="space-y-1.5">
              {Object.entries(STATUS_COLORS).map(([s, c]) => (
                <div key={s} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={cn('h-3 w-3 rounded', c)} /> {s}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{lang === 'lt' ? 'Projektai' : 'Developments'}</p>
            <div className="space-y-1">
              {developments.data.map(d => (
                <p key={d.id} className="text-xs text-slate-600">{d.name} · {d.municipality}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}