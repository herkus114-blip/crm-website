import React, { useState } from 'react';
import { Search, Upload, AlertTriangle, FileDown } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, isOverdue } from '@/lib/armarisUtils';
import { exportDocumentPdf } from '@/lib/pdfExport';
import { cn } from '@/lib/utils';

export default function Documents() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('DocumentRecord', { sort: '-created_date' });
  const [q, setQ] = useState('');

  const filtered = data.filter(d => !q || (d.title || '').toLowerCase().includes(q.toLowerCase()) || (d.document_number || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title={t('documents')} subtitle={lang === 'lt' ? 'Dokumentų valdymas ir versijos' : 'Document management & versioning'}>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
          <Upload className="h-4 w-4" /> {lang === 'lt' ? 'Įkelti' : 'Upload'}
        </button>
      </PageHeader>
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
      </div>
      {loading ? <Loader /> : (
        <div className="space-y-2">
          {filtered.map(d => {
            const expiring = isOverdue(d.expiry_date);
            return (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{d.title}</p>
                      {expiring && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{d.document_type} · {d.development_name || '—'} · v.{d.version || '1'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportDocumentPdf(d, lang)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <FileDown className="h-3 w-3" /> PDF
                    </button>
                    <div className="text-right">
                      <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', d.status === 'Patvirtinta' || d.status === 'Galutinis' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>{d.status}</span>
                      {d.expiry_date && <p className={cn('mt-0.5 text-xs', expiring ? 'font-semibold text-rose-600' : 'text-slate-400')}>{formatDate(d.expiry_date)}</p>}
                    </div>
                  </div>
                </div>
                {d.issuing_authority && <p className="mt-1 text-xs text-slate-400">{d.issuing_authority}{d.external_reference ? ` · ${d.external_reference}` : ''}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}