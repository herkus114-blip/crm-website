import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function Contractors() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Contractor', { sort: 'name' });

  return (
    <div>
      <PageHeader title={t('contractors')} subtitle={lang === 'lt' ? 'Rangovų ir tiekėjų registras' : 'Contractor & supplier register'} />
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(c => {
            const expiring = isOverdue(c.insurance_expiry);
            return (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.specialization || '—'}</p></div>
                  <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', c.status === 'Aktyvus' ? 'bg-emerald-100 text-emerald-700' : c.status === 'Neaktyvus' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700')}>{c.status}</span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {c.contact_person && <p>{c.contact_person}</p>}
                  {c.phone && <p>{c.phone}</p>}
                  {c.insurance_expiry && <p className={cn(expiring && 'font-semibold text-rose-600')}>{lang === 'lt' ? 'Draudimas' : 'Insurance'}: {formatDate(c.insurance_expiry)}</p>}
                  {c.active_contracts != null && <p>{lang === 'lt' ? 'Aktyvios sutartys' : 'Active contracts'}: {c.active_contracts}</p>}
                  {c.performance_rating != null && (
                    <div className="mt-1 flex items-center gap-1">
                      <span>{lang === 'lt' ? 'Įvertinimas' : 'Rating'}:</span>
                      <div className="flex">{[1,2,3,4,5].map(i => <span key={i} className={cn('h-2 w-2 rounded-full', i <= Math.round(c.performance_rating) ? 'bg-amber-400' : 'bg-slate-200')} />)}</div>
                      <span className="text-slate-400">{c.performance_rating}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}