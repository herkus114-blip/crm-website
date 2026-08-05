import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, AlertTriangle, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { formatDate, formatNumber, formatCurrency, daysFromToday, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'overview', lt: 'Apžvalga', en: 'Overview' },
  { key: 'land', lt: 'Žemė', en: 'Land' },
  { key: 'plots', lt: 'Klotuvės', en: 'Plots' },
  { key: 'houses', lt: 'Namai', en: 'Houses' },
  { key: 'permits', lt: 'Leidimai', en: 'Permits' },
  { key: 'tasks', lt: 'Užduotys', en: 'Tasks' },
  { key: 'risks', lt: 'Rizikos', en: 'Risks' },
  { key: 'documents', lt: 'Dokumentai', en: 'Documents' }
];

export default function DevelopmentDetail() {
  const { id } = useParams();
  const { t, lang } = useApp();
  const [tab, setTab] = useState('overview');
  const developments = useEntityList('Development');
  const land = useEntityList('LandParcel', { filter: { development_id: id } });
  const plots = useEntityList('Plot', { filter: { development_id: id } });
  const houses = useEntityList('House', { filter: { development_id: id } });
  const permits = useEntityList('Permit', { filter: { development_id: id } });
  const tasks = useEntityList('Task', { filter: { development_id: id } });
  const risks = useEntityList('Risk', { filter: { development_id: id } });
  const docs = useEntityList('DocumentRecord', { filter: { development_id: id } });

  const dev = developments.data.find(d => d.id === id);

  if (developments.loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
  if (!dev) return <p className="text-slate-500">{t('noData')}</p>;

  return (
    <div className="space-y-5">
      <Link to="/developments" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> {t('developments')}
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dev.name}</h1>
              <HealthBadge health={dev.health} lang={lang} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" />{dev.address || dev.municipality || '—'} · {dev.internal_code || ''}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{dev.lifecycle_phase}</span>
              {dev.original_area_ha != null && <span>{formatNumber(dev.original_area_ha, 'ha')}</span>}
              <span>· {dev.planned_plots} {lang === 'lt' ? 'klotuvės' : 'plots'}</span>
              <span>· {dev.planned_houses} {lang === 'lt' ? 'namai' : 'houses'}</span>
            </div>
          </div>
          <div className="sm:w-64">
            <ProgressBar value={dev.calculated_progress ?? dev.reported_progress} calculated={dev.calculated_progress} showDelta />
            {dev.next_milestone && (
              <p className="mt-2 text-xs text-slate-500"><Calendar className="mr-1 inline h-3 w-3" />{dev.next_milestone}</p>
            )}
            {dev.top_blocker && (
              <p className="mt-1 flex items-start gap-1 text-xs text-amber-700"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />{dev.top_blocker}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map(tb => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={cn('rounded-t-lg px-3 py-2 text-sm font-medium transition-colors', tab === tb.key ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-700')}
          >
            {lang === 'lt' ? tb.lt : tb.en}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: lang === 'lt' ? 'Planavimo statusas' : 'Planning', v: dev.planning_status },
            { label: lang === 'lt' ? 'Infrastruktūra' : 'Infrastructure', v: dev.infrastructure_status },
            { label: lang === 'lt' ? 'Statyba' : 'Construction', v: dev.construction_status },
            { label: lang === 'lt' ? 'Pardavimai' : 'Sales', v: dev.sales_status },
            { label: lang === 'lt' ? 'Atsakingas direktorius' : 'Director', v: dev.responsible_director },
            { label: lang === 'lt' ? 'Atsakingas vadybininkas' : 'Manager', v: dev.responsible_manager },
            { label: lang === 'lt' ? 'Rizikos balas' : 'Risk score', v: dev.risk_score ?? '—' },
            { label: lang === 'lt' ? 'Planuojama užbaigti' : 'Planned completion', v: formatDate(dev.planned_completion_date) }
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{s.v || '—'}</p>
            </div>
          ))}
          {dev.description && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{lang === 'lt' ? 'Aprašymas' : 'Description'}</p>
              <p className="mt-1 text-sm text-slate-700">{dev.description}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'land' && <LandTab data={land.data} loading={land.loading} t={t} />}
      {tab === 'plots' && <PlotsTab data={plots.data} loading={plots.loading} t={t} lang={lang} />}
      {tab === 'houses' && <HousesTab data={houses.data} loading={houses.loading} t={t} lang={lang} />}
      {tab === 'permits' && <PermitsTab data={permits.data} loading={permits.loading} t={t} lang={lang} />}
      {tab === 'tasks' && <TasksTab data={tasks.data} loading={tasks.loading} t={t} lang={lang} />}
      {tab === 'risks' && <RisksTab data={risks.data} loading={risks.loading} t={t} lang={lang} />}
      {tab === 'documents' && <DocsTab data={docs.data} loading={docs.loading} t={t} lang={lang} />}
    </div>
  );
}

function LandTab({ data, loading, t }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-3">
      {data.map(p => (
        <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{p.cadastral_number}</p>
              <p className="text-xs text-slate-500">{p.address} · {formatNumber(p.total_area_ha, 'ha')}</p>
            </div>
            <div className="text-right">
              {p.acquisition_price > 0 && <p className="font-semibold text-slate-900">{formatCurrency(p.acquisition_price)}</p>}
              <p className="text-xs text-slate-500">{p.due_diligence_result}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[['Prieiga', p.access_status], ['Komunalinė', p.utility_availability], ['Zonavimas', p.zoning_status], ['Geotechnika', p.geotechnical_status]].map(([l, v], i) => (
              <div key={i}><p className="text-slate-400">{l}</p><p className="text-slate-700">{v || '—'}</p></div>
            ))}
          </div>
          {(p.protected_area || p.coastal_zone || p.cultural_heritage || p.flood_risk) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.protected_area && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">Saugoma</span>}
              {p.coastal_zone && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] text-sky-700">Pajūrio</span>}
              {p.cultural_heritage && <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700">Kultūros paveldas</span>}
              {p.flood_risk && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-700">Užtvindymo rizika</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function statusBadge(status) {
  const map = {
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
  return map[status] || 'bg-slate-100 text-slate-600';
}

function PlotsTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map(p => (
        <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900">{p.internal_plot_number}</p>
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', statusBadge(p.plot_status))}>{p.plot_status}</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <p>{formatNumber(p.area_ares, 'arai')}{p.cadastral_number ? ` · ${p.cadastral_number}` : ''}</p>
            <p>{lang === 'lt' ? 'Modelis' : 'Model'}: {p.assigned_house_model || '—'}</p>
            {p.sale_price > 0 && <p className="font-medium text-slate-700">{formatCurrency(p.sale_price)}</p>}
            {p.buyer_name && <p>{t('buyer')}: {p.buyer_name}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function HousesTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-2">
      {data.map(h => (
        <Link key={h.id} to={`/houses/${h.id}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">{h.internal_house_number}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-900">{h.house_model || (lang === 'lt' ? 'Namas' : 'House')} · {h.plot_number || ''}</p>
            <p className="text-xs text-slate-500">{formatNumber(h.gross_area, 'm²')} · {h.floors} a. · {h.current_phase || '—'}</p>
          </div>
          <div className="hidden w-40 sm:block"><ProgressBar value={h.calculated_progress ?? h.reported_progress} /></div>
          <HealthBadge health={h.health} lang={lang} />
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </Link>
      ))}
    </div>
  );
}

function PermitsTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-2">
      {data.map(p => {
        const overdue = isOverdue(p.statutory_response_date) && p.status !== 'Patvirtinta';
        return (
          <Link key={p.id} to="/permits" className="block rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{p.approval_type}</p>
                <p className="text-xs text-slate-500">{p.category} · {p.authority || p.utility_provider || '—'}</p>
              </div>
              <div className="text-right">
                <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', p.status === 'Patvirtinta' ? 'bg-emerald-100 text-emerald-700' : overdue ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600')}>{p.status}</span>
                {p.validation_status !== 'Validuota' && <p className="mt-1 text-[10px] text-amber-600">⚠ {t('requiresValidation')}</p>}
              </div>
            </div>
            {p.external_application_number && <p className="mt-1 text-xs text-slate-400">{lang === 'lt' ? 'Ref.' : 'Ref.'} {p.external_application_number}</p>}
          </Link>
        );
      })}
    </div>
  );
}

function TasksTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  const open = data.filter(x => x.status !== 'Užbaigta' && x.status !== 'Atšaukta');
  if (!open.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-2">
      {open.slice(0, 20).map(x => {
        const overdue = isOverdue(x.due_date);
        return (
          <div key={x.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{x.title}</p>
              <p className="text-xs text-slate-500">{x.assignee || '—'} · {x.priority}</p>
            </div>
            <div className="text-right">
              <p className={cn('text-xs', overdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>{formatDate(x.due_date)}</p>
              <p className="text-[10px] text-slate-400">{x.status}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RisksTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-2">
      {data.map(r => (
        <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-start justify-between gap-3">
            <div><p className="font-medium text-slate-900">{r.title}</p><p className="text-xs text-slate-500">{r.category}</p></div>
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', r.severity === 'Kritinė' ? 'bg-rose-100 text-rose-700' : r.severity === 'Aukšta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600')}>{r.severity}</span>
          </div>
          {r.mitigation && <p className="mt-2 text-xs text-slate-600">{r.mitigation}</p>}
        </div>
      ))}
    </div>
  );
}

function DocsTab({ data, loading, t, lang }) {
  if (loading) return <Loader />;
  if (!data.length) return <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>;
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-900">{d.title}</p><p className="text-xs text-slate-500">{d.document_type} · v.{d.version || '1'}</p></div>
          <div className="text-right"><p className="text-xs text-slate-500">{formatDate(d.issue_date)}</p><p className="text-[10px] text-slate-400">{d.status}</p></div>
        </div>
      ))}
    </div>
  );
}

function Loader() {
  return <div className="flex h-32 items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
}