import React from 'react';
import { FileBarChart, Download, FileText } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';

const REPORTS = [
  'Savininko portfelio ataskaita', 'Projekto būsenos ataskaita', 'Bendruomenės progreso ataskaita', 'Namo progreso ataskaita',
  'Leidimų ataskaita', 'Vėluojančių leidimų ataskaita', 'Statybos programa', 'Kritinio kelio ataskaita',
  'Rangovo veiklos ataskaita', 'Defektų ataskaita', 'Biudžeto vs faktas', 'Pinigų srautų prognozė',
  'Namų pelningumo ataskaita', 'Klotuvių ir namų pardavimai', 'Klientų piltuvė', 'Rezervacijų galiojimas',
  'Garantijos ataskaita', 'Rizikos registras', 'Dokumentų galiojimas', 'Naudotojų aktyvumo ir audito ataskaita'
];

export default function Reports() {
  const { t, lang } = useApp();
  const developments = useEntityList('Development');
  const houses = useEntityList('House');
  const permits = useEntityList('Permit');
  const tasks = useEntityList('Task');

  if (developments.loading) return <Loader />;

  return (
    <div>
      <PageHeader title={t('reports')} subtitle={lang === 'lt' ? 'Ataskaitų katalogas' : 'Reports catalogue'} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><FileText className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{r}</p><p className="text-xs text-slate-400">{lang === 'lt' ? 'Ekranas · Excel · PDF' : 'Screen · Excel · PDF'}</p></div>
            </div>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800">
              <Download className="h-3.5 w-3.5" /> {lang === 'lt' ? 'Generuoti' : 'Generate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}