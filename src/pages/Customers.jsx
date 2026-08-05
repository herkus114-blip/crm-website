import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatCurrency, formatDate } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function Customers() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Customer', { sort: '-created_date' });
  const [q, setQ] = useState('');

  const filtered = data.filter(c => !q || (c.name || '').toLowerCase().includes(q.toLowerCase()) || (c.email || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title={t('customers')} subtitle={lang === 'lt' ? 'Klientų lead’ai ir pardavimų piltuvė' : 'Customer leads & sales pipeline'} />
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
      </div>
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white uppercase">{(c.name || '?').charAt(0)}</div>
                  <div><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.phone || c.email}</p></div>
                </div>
                {c.lead_score != null && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{c.lead_score}</span>}
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                {c.interested_development_name && <p>{c.interested_development_name}</p>}
                {c.budget > 0 && <p className="font-medium text-slate-700">{formatCurrency(c.budget)}</p>}
                {c.desired_completion && <p>{lang === 'lt' ? 'Pageidaujama' : 'Desired'}: {formatDate(c.desired_completion)}</p>}
              </div>
              <div className="mt-2"><span className={cn('inline-block rounded-md px-2 py-0.5 text-[10px] font-medium', c.pipeline_stage === 'Parduota' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{c.pipeline_stage}</span></div>
              {c.gdpr_consent === false && <p className="mt-1 text-[10px] text-rose-500">{lang === 'lt' ? 'Be GDPR sutikimo' : 'No GDPR consent'}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}