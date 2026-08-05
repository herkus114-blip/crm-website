import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Mountain, Grid3x3, Home as HomeIcon, BadgeCheck, AlertTriangle,
  ListChecks, ShieldAlert, TrendingUp, MapPin, Clock
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import StatCard from '@/components/StatCard';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { formatDate, daysFromToday, isOverdue, formatCurrency, formatNumber } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { t, lang, role } = useApp();
  const developments = useEntityList('Development', { sort: '-created_date' });
  const houses = useEntityList('House', { sort: '-created_date' });
  const plots = useEntityList('Plot', { sort: '-created_date' });
  const tasks = useEntityList('Task', { sort: '-due_date' });
  const permits = useEntityList('Permit', { sort: '-created_date' });
  const approvals = useEntityList('Approval', { filter: { status: { $in: ['Laukiama Direktoriaus', 'Laukiama Savininko'] } }, sort: '-submitted_date' });
  const risks = useEntityList('Risk', { filter: { status: 'Atvira' }, sort: '-risk_score' });

  const loading = developments.loading || houses.loading;

  const stats = useMemo(() => {
    const activeDev = developments.data.filter(d => d.lifecycle_phase !== 'Užbaigta');
    const totalLand = activeDev.reduce((s, d) => s + (d.original_area_ha || 0), 0);
    const plannedPlots = activeDev.reduce((s, d) => s + (d.planned_plots || 0), 0);
    const plannedHouses = activeDev.reduce((s, d) => s + (d.planned_houses || 0), 0);
    const underConstruction = houses.data.filter(h => h.current_phase && h.current_phase !== 'Užbaigta' && h.sales_status !== 'Parduota');
    const completed = houses.data.filter(h => h.sales_status === 'Parduota' || h.current_phase === 'Užbaigta');
    const sold = houses.data.filter(h => h.sales_status === 'Parduota');
    const overdueTasks = tasks.data.filter(x => isOverdue(x.due_date) && x.status !== 'Užbaigta' && x.status !== 'Atšaukta');
    const overduePermits = permits.data.filter(p => isOverdue(p.statutory_response_date) && p.status !== 'Patvirtinta' && p.status !== 'Uždaryta');
    const criticalRisks = risks.data.filter(r => r.severity === 'Kritinė' || r.severity === 'Aukšta');
    return { activeDev, totalLand, plannedPlots, plannedHouses, underConstruction, completed, sold, overdueTasks, overduePermits, criticalRisks };
  }, [developments.data, houses.data, tasks.data, permits.data, risks.data]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isOwner = role === 'owner';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isOwner ? (lang === 'lt' ? 'Savininko skydelis' : 'Owner Dashboard') : (lang === 'lt' ? 'Skydelis' : 'Dashboard')}
        </h1>
        <p className="text-sm text-slate-500">
          {lang === 'lt' ? 'Visų projektų, leidimų ir tvirtinimų gyvas vaizdas.' : 'Live view of all developments, permits and approvals.'}
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label={t('activeDevelopments')} value={stats.activeDev.length} icon={Building2} tone="indigo" onClick={() => {}} />
        <StatCard label={t('totalLand')} value={formatNumber(stats.totalLand, 'ha')} icon={Mountain} tone="emerald" />
        <StatCard label={t('plannedPlots')} value={stats.plannedPlots} icon={Grid3x3} tone="sky" />
        <StatCard label={t('plannedHouses')} value={stats.plannedHouses} icon={HomeIcon} tone="slate" />
        <StatCard label={t('housesUnderConstruction')} value={stats.underConstruction.length} icon={HomeIcon} tone="amber" />
        <StatCard label={t('housesSold')} value={stats.sold.length} icon={TrendingUp} tone="emerald" />
      </div>

      {/* Alerts row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/approvals">
          <StatCard label={t('pendingApprovals')} value={approvals.data.length} sub={lang === 'lt' ? 'laukia sprendimo' : 'awaiting decision'} icon={BadgeCheck} tone="amber" />
        </Link>
        <Link to="/tasks">
          <StatCard label={t('overdueTasks')} value={stats.overdueTasks.length} sub={lang === 'lt' ? 'vėluoja' : 'overdue'} icon={ListChecks} tone="rose" />
        </Link>
        <Link to="/permits">
          <StatCard label={lang === 'lt' ? 'Vėluojantys leidimai' : 'Overdue permits'} value={stats.overduePermits.length} sub={lang === 'lt' ? 'atsakymų laukiama' : 'awaiting response'} icon={Clock} tone="rose" />
        </Link>
        <Link to="/reports">
          <StatCard label={t('criticalRisks')} value={stats.criticalRisks.length} sub={lang === 'lt' ? 'atviros rizikos' : 'open risks'} icon={ShieldAlert} tone="rose" />
        </Link>
      </div>

      {/* Development health cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{t('allDevelopments')}</h2>
          <Link to="/developments" className="text-sm font-medium text-slate-500 hover:text-slate-900">{t('viewAll')} →</Link>
        </div>
        {stats.activeDev.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">{t('noData')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.activeDev.map(d => {
              const dHouses = houses.data.filter(h => h.development_id === d.id);
              const dTasks = tasks.data.filter(x => x.development_id === d.id && x.status !== 'Užbaigta');
              const overdueD = dTasks.filter(x => isOverdue(x.due_date));
              return (
                <Link
                  key={d.id}
                  to={`/developments/${d.id}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 group-hover:text-slate-700">{d.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" /> {d.municipality || '—'}
                      </p>
                    </div>
                    <HealthBadge health={d.health} lang={lang} />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{d.lifecycle_phase || '—'}</span>
                    {d.original_area_ha && <span className="text-xs text-slate-400">{formatNumber(d.original_area_ha, 'ha')}</span>}
                  </div>

                  <div className="mt-3">
                    <ProgressBar value={d.calculated_progress ?? d.reported_progress} calculated={d.calculated_progress} showDelta />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                      <p className="text-sm font-semibold tabular-nums text-slate-900">{dHouses.length}</p>
                      <p className="text-[10px] uppercase text-slate-400">{t('houses')}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                      <p className="text-sm font-semibold tabular-nums text-slate-900">{dTasks.length}</p>
                      <p className="text-[10px] uppercase text-slate-400">{t('tasks')}</p>
                    </div>
                    <div className="rounded-lg bg-rose-50 px-2 py-1.5">
                      <p className="text-sm font-semibold tabular-nums text-rose-700">{overdueD.length}</p>
                      <p className="text-[10px] uppercase text-rose-400">{lang === 'lt' ? 'vėluoja' : 'late'}</p>
                    </div>
                  </div>

                  {d.top_blocker && (
                    <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-2">{d.top_blocker}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Approvals + risks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{t('pendingApprovals')}</h2>
            <Link to="/approvals" className="text-sm text-slate-500 hover:text-slate-900">{t('viewAll')} →</Link>
          </div>
          {approvals.data.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">{t('noData')}</p>
          ) : (
            <div className="space-y-2">
              {approvals.data.slice(0, 5).map(a => (
                <Link key={a.id} to="/approvals" className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.record_type} · {a.requester}</p>
                  </div>
                  <div className="text-right">
                    {a.amount > 0 && <p className="text-sm font-semibold tabular-nums text-slate-900">{formatCurrency(a.amount)}</p>}
                    <p className={cn('text-xs', isOverdue(a.deadline) ? 'text-rose-600 font-medium' : 'text-slate-400')}>
                      {formatDate(a.deadline)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">{lang === 'lt' ? 'Rizikų registras' : 'Risk Register'}</h2>
            <Link to="/reports" className="text-sm text-slate-500 hover:text-slate-900">{t('viewAll')} →</Link>
          </div>
          {risks.data.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">{t('noData')}</p>
          ) : (
            <div className="space-y-2">
              {risks.data.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.category} · {r.development_name}</p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
                    r.severity === 'Kritinė' && 'bg-rose-100 text-rose-700',
                    r.severity === 'Aukšta' && 'bg-amber-100 text-amber-700',
                    r.severity === 'Vidutinė' && 'bg-sky-100 text-sky-700',
                    r.severity === 'Žema' && 'bg-slate-100 text-slate-600'
                  )}>{r.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}