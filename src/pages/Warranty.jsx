import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function Warranty() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('WarrantyCase', { sort: '-created_date' });

  const open = data.filter(c => c.status !== 'Uždaryta');

  return (
    <div>
      <PageHeader title={t('warranty')} subtitle={lang === 'lt' ? 'Garantinių atvejų valdymas' : 'Warranty case management'} />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Atviros', open.length, 'amber'], ['Skubios', open.filter(c => c.emergency).length, 'rose'], ['Remontuojamos', open.filter(c => c.status === 'Remontuojama').length, 'sky'], ['Uždarytos', data.filter(c => c.status === 'Uždaryta').length, 'emerald']].map(([l, v, tone]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase text-slate-400">{l}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{v}</p>
          </div>
        ))}
      </div>
      {loading ? <Loader /> : (
        <div className="space-y-2">
          {data.map(c => {
            const overdue = isOverdue(c.response_deadline) && c.status !== 'Uždaryta';
            return (
              <div key={c.id} className={cn('rounded-xl border bg-white p-4', overdue ? 'border-rose-200' : 'border-slate-200')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{c.case_id} · {c.category}</p>
                      {c.emergency && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">{lang === 'lt' ? 'SKUBI' : 'EMERGENCY'}</span>}
                    </div>
                    <p className="text-xs text-slate-500">{lang === 'lt' ? 'Namas' : 'House'} {c.house_number} · {c.development_name} · {c.customer_name}</p>
                    {c.description && <p className="mt-1 text-sm text-slate-600">{c.description}</p>}
                  </div>
                  <div className="text-right">
                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', c.status === 'Uždaryta' ? 'bg-emerald-100 text-emerald-700' : overdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')}>{c.status}</span>
                    <p className={cn('mt-1 text-xs', overdue ? 'font-semibold text-rose-600' : 'text-slate-400')}>{formatDate(c.response_deadline)}</p>
                  </div>
                </div>
                {c.responsible_contractor && <p className="mt-2 text-xs text-slate-500">{lang === 'lt' ? 'Rangovas' : 'Contractor'}: {c.responsible_contractor}{c.cost > 0 ? ` · ${c.cost} €` : ''}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}