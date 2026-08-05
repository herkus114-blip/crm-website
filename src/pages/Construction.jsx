import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/armarisUtils';

export default function Construction() {
  const { t, lang } = useApp();
  const houses = useEntityList('House', { sort: '-created_date' });
  const active = houses.data.filter(h => h.current_phase && h.current_phase !== 'Užbaigta' && h.sales_status !== 'Parduota');

  return (
    <div>
      <PageHeader title={t('construction')} subtitle={lang === 'lt' ? 'Aktyvūs statybos objektai' : 'Active construction sites'} />
      {houses.loading ? <Loader /> : active.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">{t('noData')}</p>
      ) : (
        <div className="space-y-3">
          {active.map(h => (
            <Link key={h.id} to={`/houses/${h.id}`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">{h.internal_house_number}</div>
                  <div>
                    <p className="font-medium text-slate-900">{h.house_model || (lang === 'lt' ? 'Namas' : 'House')} · {h.plot_number}</p>
                    <p className="text-xs text-slate-500">{h.development_name} · {lang === 'lt' ? 'Vadovas' : 'Supervisor'}: {h.responsible_supervisor || '—'}</p>
                  </div>
                </div>
                <HealthBadge health={h.health} lang={lang} />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="sm:col-span-2"><ProgressBar value={h.calculated_progress ?? h.reported_progress} calculated={h.calculated_progress} showDelta /></div>
                <div className="text-right text-xs text-slate-500">
                  <p>{t('constructionPhase')}: <span className="font-medium text-slate-700">{h.current_phase}</span></p>
                  <p>{lang === 'lt' ? 'Planuojama' : 'Planned'}: {formatDate(h.planned_completion)}</p>
                </div>
              </div>
              {h.current_blocker && <p className="mt-2 text-xs text-amber-700">⚠ {h.current_blocker}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}