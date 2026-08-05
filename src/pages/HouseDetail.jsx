import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Home as HomeIcon, Calendar, Euro, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { formatDate, formatCurrency, formatNumber, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function HouseDetail() {
  const { id } = useParams();
  const { t, lang } = useApp();
  const houses = useEntityList('House');
  const tasks = useEntityList('Task', { filter: { house_id: id } });
  const permits = useEntityList('Permit', { filter: { house_id: id } });
  const docs = useEntityList('DocumentRecord', { filter: { house_id: id } });

  const h = houses.data.find(x => x.id === id);
  if (houses.loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
  if (!h) return <p className="text-slate-500">{t('noData')}</p>;

  const specs = [
    [lang === 'lt' ? 'Modelis' : 'Model', h.house_model],
    [lang === 'lt' ? 'Klotuvė' : 'Plot', h.plot_number],
    [lang === 'lt' ? 'Adresas' : 'Address', h.address],
    [lang === 'lt' ? 'Bendras plotas' : 'Gross area', formatNumber(h.gross_area, 'm²')],
    [lang === 'lt' ? 'Naudingas plotas' : 'Useful area', formatNumber(h.useful_area, 'm²')],
    [lang === 'lt' ? 'Aukštų skaičius' : 'Floors', h.floors],
    [lang === 'lt' ? 'Miegamieji' : 'Bedrooms', h.bedrooms],
    [lang === 'lt' ? 'Vonios' : 'Bathrooms', h.bathrooms],
    [lang === 'lt' ? 'Energijos klasė' : 'Energy target', h.energy_target],
    [lang === 'lt' ? 'Pamatas' : 'Foundation', h.foundation_type],
    [lang === 'lt' ? 'Konstrukcija' : 'Structure', h.structure_type],
    [lang === 'lt' ? 'Fasadas' : 'Façade', h.facade_type],
    [lang === 'lt' ? 'Stogas' : 'Roof', h.roof_type],
    [lang === 'lt' ? 'Šildymas' : 'Heating', h.heating_system],
    [lang === 'lt' ? 'Vėdinimas' : 'Ventilation', h.ventilation_system],
  ];

  return (
    <div className="space-y-5">
      <Link to="/houses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> {t('houses')}</Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white"><HomeIcon className="h-6 w-6" /></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{lang === 'lt' ? 'Namas' : 'House'} {h.internal_house_number}</h1>
                <HealthBadge health={h.health} lang={lang} />
              </div>
              <p className="text-sm text-slate-500">{h.development_name} · {lang === 'lt' ? 'Klotuvė' : 'Plot'} {h.plot_number}</p>
            </div>
          </div>
          <div className="sm:w-64">
            <ProgressBar value={h.calculated_progress ?? h.reported_progress} calculated={h.calculated_progress} showDelta />
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3 w-3" /> {formatDate(h.planned_completion)}
            </div>
            {h.current_blocker && <p className="mt-1 text-xs text-amber-700">⚠ {h.current_blocker}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Specs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Techninės specifikacijos' : 'Specifications'}</h2>
          <dl className="space-y-2">
            {specs.map(([l, v], i) => (
              <div key={i} className="flex justify-between gap-2 text-sm border-b border-slate-50 pb-1.5">
                <dt className="text-slate-500">{l}</dt><dd className="font-medium text-slate-900 text-right">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Sales & warranty */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Pardavimai ir garantija' : 'Sales & Warranty'}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-slate-500">{t('salePrice')}</span><span className="font-semibold text-slate-900">{formatCurrency(h.sale_price)}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">{t('cost')}</span><span className="text-slate-900">{formatCurrency(h.cost)}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">{t('margin')}</span><span className={cn('font-semibold', (h.forecast_margin || 0) > 15 ? 'text-emerald-600' : 'text-amber-600')}>{h.forecast_margin != null ? `${h.forecast_margin}%` : '—'}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">{t('buyer')}</span><span className="text-slate-900">{h.customer_name || '—'}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">{lang === 'lt' ? 'Statusas' : 'Status'}</span><span className="font-medium text-slate-900">{h.sales_status}</span></div>
            <div className="mt-2 rounded-lg bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5" /> {t('warrantyEnd')}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900">{formatDate(h.warranty_end)}</p>
            </div>
          </div>
        </div>

        {/* Permit status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Leidimai ir registracija' : 'Permits & Registration'}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{t('permitStatus')}</span><span className="text-slate-900">{h.permit_status || '—'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'lt' ? 'Registracija' : 'Registration'}</span><span className="text-slate-900">{h.registration_status || '—'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'lt' ? 'Atsakingas vadovas' : 'Supervisor'}</span><span className="text-slate-900">{h.responsible_supervisor || '—'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t('constructionPhase')}</span><span className="text-slate-900">{h.current_phase || '—'}</span></div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Susijusios užduotys' : 'Related tasks'} ({tasks.data.length})</h2>
        {tasks.data.length === 0 ? <p className="text-sm text-slate-400 py-4 text-center">{t('noData')}</p> : (
          <div className="space-y-2">
            {tasks.data.slice(0, 8).map(x => (
              <div key={x.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{x.title}</p><p className="text-xs text-slate-500">{x.assignee} · {x.priority}</p></div>
                <div className="text-right"><p className={cn('text-xs', isOverdue(x.due_date) ? 'font-semibold text-rose-600' : 'text-slate-500')}>{formatDate(x.due_date)}</p><p className="text-[10px] text-slate-400">{x.status}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}