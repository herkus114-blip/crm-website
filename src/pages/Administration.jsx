import React from 'react';
import { ShieldAlert, UserCog, FileCheck, ScrollText, AlertTriangle } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import PageHeader from '@/components/ui-parts';

export default function Administration() {
  const { t, lang } = useApp();

  const cards = [
    { icon: UserCog, title: lang === 'lt' ? 'Naudotojai ir rolės' : 'Users & roles', desc: lang === 'lt' ? 'Kurti naudotojus, priskirti rolę (Savininkas, Direktorius, Vadybininkas, Statybos vadovas).' : 'Create users, assign role.' },
    { icon: FileCheck, title: lang === 'lt' ? 'Darbo eigų konfigūracija' : 'Workflow configuration', desc: lang === 'lt' ? 'Konfigūruoti etapus, tvirtinimo sekas, etapų šablonus.' : 'Configure stages, approval sequences, stage templates.' },
    { icon: AlertTriangle, title: lang === 'lt' ? 'Leidimų taisyklių variklis' : 'Permit rules engine', desc: lang === 'lt' ? 'Redaguoti leidimų reikalavimų taisykles, šaltinius ir galiojimo datas.' : 'Edit permit requirement rules, sources, validity.' },
    { icon: ScrollText, title: lang === 'lt' ? 'Audito žurnalas' : 'Audit log', desc: lang === 'lt' ? 'Peržiūrėti visų veiksmų istoriją. Ištrinti draudžiama.' : 'View all activity history. Deletion forbidden.' },
    { icon: ShieldAlert, title: lang === 'lt' ? 'Saugumo ir GDPR' : 'Security & GDPR', desc: lang === 'lt' ? 'MFA, sesijų laikai, laukų lygio prieiga, duomenų minimizavimas.' : 'MFA, sessions, field-level access, data minimisation.' }
  ];

  return (
    <div>
      <PageHeader title={t('administration')} subtitle={lang === 'lt' ? 'Sistemos administravimas' : 'System administration'} />
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">{t('regulatoryDisclaimer')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"><c.icon className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} /></div>
            <p className="mt-3 font-medium text-slate-900">{c.title}</p>
            <p className="mt-1 text-xs text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}