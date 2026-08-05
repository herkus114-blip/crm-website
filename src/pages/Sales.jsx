import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

const STAGE_FLOW = ['Naujas lead', 'Kontaktuota', 'Kvalifikuota', 'Apsilankymas suplanuotas', 'Apsilankymas įvyko', 'Pasiūlymas išsiųstas', 'Derybos', 'Rezervacija laukiama', 'Rezervuota', 'Preliminari sutartis', 'Finansavimas laukiama', 'Notaras suplanuotas', 'Parduota'];

export default function Sales() {
  const { t, lang } = useApp();
  const reservations = useEntityList('Reservation', { sort: '-created_date' });
  const houses = useEntityList('House');
  const plots = useEntityList('Plot');

  const sold = houses.data.filter(h => h.sales_status === 'Parduota');
  const reserved = houses.data.filter(h => h.sales_status === 'Rezervuota');
  const available = plots.data.filter(p => p.plot_status === 'Laisva');

  return (
    <div>
      <PageHeader title={t('sales')} subtitle={lang === 'lt' ? 'Pardavimų piltuvė ir rezervacijos' : 'Sales funnel & reservations'} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Parduota', sold.length, 'emerald'], ['Rezervuota', reserved.length, 'amber'], ['Laisva', available.length, 'sky'], ['Rezervacijos', reservations.data.length, 'indigo']].map(([l, v, tone]) => (
          <div key={l} className={cn('rounded-xl border p-4', 'border-slate-200 bg-white')}>
            <p className="text-xs uppercase text-slate-400">{lang === 'lt' ? l : l}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">{lang === 'lt' ? 'Aktyvios rezervacijos' : 'Active reservations'}</h2>
        {reservations.loading ? <Loader /> : reservations.data.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">{t('noData')}</p>
        ) : (
          <div className="space-y-2">
            {reservations.data.map(r => {
              const expiring = isOverdue(r.expiry) && r.status === 'Aktyvi';
              return (
                <div key={r.id} className={cn('flex items-center justify-between gap-3 rounded-lg border px-3 py-2', expiring ? 'border-rose-200 bg-rose-50' : 'border-slate-100')}>
                  <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{r.customer_name}</p><p className="text-xs text-slate-500">{r.development_name}</p></div>
                  <div className="text-right">
                    {r.agreed_price > 0 && <p className="text-sm font-semibold text-slate-900">{formatDate(r.agreed_price)}</p>}
                    <p className={cn('text-xs', expiring ? 'font-semibold text-rose-600' : 'text-slate-400')}>{formatDate(r.expiry)}</p>
                  </div>
                  <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', r.status === 'Parduota' ? 'bg-emerald-100 text-emerald-700' : r.status === 'Aktyvi' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600')}>{r.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}