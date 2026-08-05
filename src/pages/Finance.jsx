import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import StatCard from '@/components/StatCard';
import { formatCurrency } from '@/lib/armarisUtils';

export default function Finance() {
  const { t, lang } = useApp();
  const houses = useEntityList('House');
  const developments = useEntityList('Development');

  const stats = useMemo(() => {
    const totalCost = houses.data.reduce((s, h) => s + (h.cost || 0), 0);
    const totalRevenue = houses.data.reduce((s, h) => s + (h.sale_price || 0), 0);
    const soldRevenue = houses.data.filter(h => h.sales_status === 'Parduota').reduce((s, h) => s + (h.sale_price || 0), 0);
    const avgMargin = houses.data.length ? houses.data.reduce((s, h) => s + (h.forecast_margin || 0), 0) / houses.data.length : 0;
    return { totalCost, totalRevenue, soldRevenue, avgMargin, projectedProfit: totalRevenue - totalCost };
  }, [houses.data]);

  if (houses.loading) return <Loader />;

  return (
    <div>
      <PageHeader title={t('finance')} subtitle={lang === 'lt' ? 'Projektų išlaidų ir pajamų valdymas' : 'Project cost & revenue control'} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label={lang === 'lt' ? 'Numanomos pajamos' : 'Projected revenue'} value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} tone="emerald" />
        <StatCard label={lang === 'lt' ? 'Visos išlaidos' : 'Total cost'} value={formatCurrency(stats.totalCost)} icon={Wallet} tone="amber" />
        <StatCard label={lang === 'lt' ? 'Atpažintos pajamos' : 'Recognised revenue'} value={formatCurrency(stats.soldRevenue)} icon={TrendingUp} tone="sky" />
        <StatCard label={lang === 'lt' ? 'Numanomas pelnas' : 'Projected profit'} value={formatCurrency(stats.projectedProfit)} sub={`vid. marža ${stats.avgMargin.toFixed(1)}%`} icon={stats.projectedProfit >= 0 ? TrendingUp : TrendingDown} tone={stats.projectedProfit >= 0 ? 'emerald' : 'rose'} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Namų pelningumas' : 'House profitability'}</h2>
        <div className="space-y-2">
          {houses.data.map(h => {
            const margin = h.sale_price && h.cost ? ((h.sale_price - h.cost) / h.sale_price) * 100 : h.forecast_margin || 0;
            return (
              <div key={h.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{lang === 'lt' ? 'Namas' : 'House'} {h.internal_house_number}</p><p className="text-xs text-slate-500">{h.development_name}</p></div>
                <div className="flex items-center gap-4 text-right">
                  <div><p className="text-xs text-slate-400">{t('cost')}</p><p className="text-sm text-slate-700">{formatCurrency(h.cost)}</p></div>
                  <div><p className="text-xs text-slate-400">{t('salePrice')}</p><p className="text-sm text-slate-700">{formatCurrency(h.sale_price)}</p></div>
                  <div className="w-16"><p className="text-xs text-slate-400">{t('margin')}</p><p className={`text-sm font-semibold ${margin >= 15 ? 'text-emerald-600' : 'text-amber-600'}`}>{margin.toFixed(1)}%</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}