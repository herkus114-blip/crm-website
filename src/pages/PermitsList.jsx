import React, { useState } from 'react';
import { Search, AlertTriangle, ExternalLink, ShieldAlert } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

const STATUS_BADGE = {
  'Patvirtinta': 'bg-emerald-100 text-emerald-700',
  'Pateikta': 'bg-sky-100 text-sky-700',
  'Nagrinėjama': 'bg-amber-100 text-amber-700',
  'Gauti pastabymų': 'bg-amber-100 text-amber-700',
  'Atmesta': 'bg-rose-100 text-rose-700',
  'Sustabdyta': 'bg-rose-100 text-rose-700',
  'Reikalingas pataisymas': 'bg-amber-100 text-amber-700',
};

export default function PermitsList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('Permit', { sort: '-created_date' });
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
  const filtered = data.filter(p =>
    (!q || (p.approval_type || '').toLowerCase().includes(q.toLowerCase()) || (p.external_application_number || '').toLowerCase().includes(q.toLowerCase()) || (p.authority || '').toLowerCase().includes(q.toLowerCase())) &&
    (!cat || p.category === cat) &&
    (!onlyOverdue || (isOverdue(p.statutory_response_date) && p.status !== 'Patvirtinta'))
  );

  return (
    <div>
      <PageHeader title={t('permitInbox')} subtitle={lang === 'lt' ? 'Centrinis leidimų ir tvirtinimų registras' : 'Central permit & approval register'} />

      {showDisclaimer && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-xs leading-relaxed text-amber-800">{t('regulatoryDisclaimer')}</p>
              <button onClick={() => setShowDisclaimer(false)} className="mt-1 text-xs font-medium text-amber-700 underline">{lang === 'lt' ? 'Uždaryti' : 'Dismiss'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="">{lang === 'lt' ? 'Visos kategorijos' : 'All categories'}</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={onlyOverdue} onChange={e => setOnlyOverdue(e.target.checked)} className="rounded" />
          {lang === 'lt' ? 'Tik vėluojantys' : 'Only overdue'}
        </label>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-2">
          {filtered.map(p => {
            const overdue = isOverdue(p.statutory_response_date) && p.status !== 'Patvirtinta';
            return (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{p.approval_type}</p>
                      {p.blocking && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                    </div>
                    <p className="text-xs text-slate-500">{p.category} · {p.development_name}</p>
                    <p className="text-xs text-slate-400">{p.authority || p.utility_provider || '—'} {p.municipality ? `· ${p.municipality}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', STATUS_BADGE[p.status] || 'bg-slate-100 text-slate-600')}>{p.status}</span>
                    {p.validation_status !== 'Validuota' && <p className="mt-1 text-[10px] font-medium text-amber-600">⚠ {t('requiresValidation')}</p>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {p.external_application_number && <span>{lang === 'lt' ? 'Ref.' : 'Ref.'} <span className="font-medium text-slate-700">{p.external_application_number}</span></span>}
                  <span>{lang === 'lt' ? 'Pateikta' : 'Submitted'}: {formatDate(p.application_date)}</span>
                  <span className={cn(overdue && 'font-semibold text-rose-600')}>{lang === 'lt' ? 'Atsakymo terminas' : 'Response'}: {formatDate(p.statutory_response_date)}</span>
                  {p.external_link && <a href={p.external_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:underline">{lang === 'lt' ? 'Nuoroda' : 'Link'} <ExternalLink className="h-3 w-3" /></a>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}