import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatDate, formatCurrency, isOverdue } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

export default function ApprovalsList() {
  const { t, lang, role, permission } = useApp();
  const { data, loading, reload } = useEntityList('Approval', { filter: { status: { $in: ['Laukiama Direktoriaus', 'Laukiama Savininko'] } }, sort: '-submitted_date' });
  const [acting, setActing] = useState(null);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const canDecide = (a) => {
    if (role === 'owner') return true;
    if (role === 'director' && a.status === 'Laukiama Direktoriaus') return true;
    return false;
  };

  const decide = async (approval, decision) => {
    if (!comment && decision !== 'Patvirtinta') {
      setActing({ ...approval, decision, needComment: true });
      return;
    }
    setBusy(true);
    try {
      const newStatus = decision === 'Patvirtinta' ? 'Patvirtinta'
        : decision === 'Atmesta' ? 'Atmesta'
        : decision === 'Grąžinta taisyti' ? 'Grąžinta taisyti'
        : 'Paprašyta info';
      await base44.entities.Approval.update(approval.id, {
        status: newStatus,
        approver: role,
        approval_date: new Date().toISOString().slice(0, 10),
        decision_comment: comment || ''
      });
      await base44.entities.AuditLog.create({
        action: decision,
        entity_type: 'Approval',
        record_id: approval.id,
        record_title: approval.title,
        user: role,
        user_role: role,
        new_value: newStatus,
        reason: comment || ''
      });
      setComment('');
      setActing(null);
      reload();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title={t('approvals')} subtitle={lang === 'lt' ? 'Laukiantys tvirtinimai ir sprendimai' : 'Pending approvals and decisions'} />

      {loading ? <Loader /> : data.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-400">{lang === 'lt' ? 'Nėra laukiančių tvirtinimų' : 'No pending approvals'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(a => {
            const overdue = isOverdue(a.deadline);
            const can = canDecide(a);
            return (
              <div key={a.id} className={cn('rounded-xl border bg-white p-4 shadow-sm', overdue ? 'border-rose-200' : 'border-slate-200')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{a.title}</p>
                      <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', a.status === 'Laukiama Savininko' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700')}>{a.status}</span>
                      {a.threshold_exceeded && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">{lang === 'lt' ? 'Viršija ribą' : 'Over threshold'}</span>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{a.record_type} · {a.development_name}</p>
                    {a.reason && <p className="mt-1 text-sm text-slate-600">{a.reason}</p>}
                    <p className="mt-1 text-xs text-slate-400">{lang === 'lt' ? 'Pateikė' : 'Requester'}: {a.requester} ({a.requester_role}) · {formatDate(a.submitted_date)}</p>
                    {a.risk_if_delayed && <p className="mt-1 text-xs text-amber-700">⚠ {a.risk_if_delayed}</p>}
                  </div>
                  <div className="text-right">
                    {a.amount > 0 && <p className="font-semibold text-slate-900">{formatCurrency(a.amount)}</p>}
                    <p className={cn('text-xs', overdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>{formatDate(a.deadline)}</p>
                  </div>
                </div>

                {acting?.id === a.id ? (
                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    {(acting.needComment) && <p className="mb-2 text-xs text-rose-600">{lang === 'lt' ? 'Būtinas komentaras atmetant/grąžinant' : 'Comment required for reject/return'}</p>}
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={lang === 'lt' ? 'Komentaras / priežastis…' : 'Comment / reason…'} rows={2} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button disabled={busy} onClick={() => decide(a, 'Patvirtinta')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{t('approve')}</button>
                      <button disabled={busy} onClick={() => decide(a, 'Atmesta')} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50">{t('reject')}</button>
                      <button disabled={busy} onClick={() => decide(a, 'Grąžinta taisyti')} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50">{t('returnForCorrection')}</button>
                      <button disabled={busy} onClick={() => decide(a, 'Paprašyta info')} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50">{t('requestInformation')}</button>
                      <button onClick={() => { setActing(null); setComment(''); }} className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100">{t('cancel')}</button>
                    </div>
                  </div>
                ) : can ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => { setActing(a); setComment(''); }} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800">{lang === 'lt' ? 'Spręsti' : 'Decide'}</button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">{lang === 'lt' ? 'Neturite teisės spręsti' : 'You cannot decide this'}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}