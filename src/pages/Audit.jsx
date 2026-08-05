import React from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate } from '@/lib/armarisUtils';

export default function Audit() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('AuditLog', { sort: '-timestamp', limit: 100 });

  return (
    <div>
      <PageHeader title={t('audit')} subtitle={lang === 'lt' ? 'Neginčijamas veiksmų registras' : 'Immutable activity log'} />
      {loading ? <Loader /> : data.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">{t('noData')}</p>
      ) : (
        <div className="space-y-1">
          {data.map(l => (
            <div key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold uppercase text-slate-500">{(l.user || '?').charAt(0)}</span>
                <div>
                  <p className="text-sm text-slate-800"><span className="font-medium">{l.action}</span> · {l.entity_type} {l.record_title ? `· ${l.record_title}` : ''}</p>
                  <p className="text-xs text-slate-400">{l.user} ({l.user_role}){l.reason ? ` · ${l.reason}` : ''}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{formatDate(l.timestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}