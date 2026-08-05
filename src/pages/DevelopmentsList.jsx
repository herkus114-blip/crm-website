import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { formatNumber } from '@/lib/armarisUtils';

export default function DevelopmentsList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Development', { sort: '-created_date' });
  const [q, setQ] = useState('');

  const filtered = data.filter(d =>
    !q || (d.name || '').toLowerCase().includes(q.toLowerCase()) ||
    (d.municipality || '').toLowerCase().includes(q.toLowerCase()) ||
    (d.internal_code || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader title={t('developments')} subtitle={lang === 'lt' ? 'Visi bendruomenės projektai' : 'All community developments'} />

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t('search')}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(d => (
            <Link key={d.id} to={`/developments/${d.id}`} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{d.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{d.municipality || '—'}</p>
                </div>
                <HealthBadge health={d.health} lang={lang} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{d.lifecycle_phase || '—'}</span>
                {d.original_area_ha != null && <span>{formatNumber(d.original_area_ha, 'ha')}</span>}
                {d.planned_plots != null && <span>· {d.planned_plots} {lang === 'lt' ? 'klotuvės' : 'plots'}</span>}
                {d.planned_houses != null && <span>· {d.planned_houses} {lang === 'lt' ? 'namai' : 'houses'}</span>}
              </div>
              <div className="mt-3"><ProgressBar value={d.calculated_progress ?? d.reported_progress} calculated={d.calculated_progress} showDelta /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}