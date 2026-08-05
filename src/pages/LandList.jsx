import React from 'react';
import { FileDown } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import { formatNumber, formatCurrency, formatDate } from '@/lib/armarisUtils';
import { exportLandPdf } from '@/lib/pdfExport';

export default function LandList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('LandParcel', { sort: '-created_date' });

  return (
    <div>
      <PageHeader title={t('land')} subtitle={lang === 'lt' ? 'Pradiniai žemės sklypai' : 'Original land parcels'} />
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {data.map(p => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{p.cadastral_number}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.address} · {p.development_name}</p>
                </div>
                <div className="text-right">
                  {p.acquisition_price > 0 && <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(p.acquisition_price)}</p>}
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(p.total_area_ha, 'ha')}</p>
                </div>
                <button
                  onClick={() => exportLandPdf(p, lang)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <FileDown className="h-3 w-3" /> PDF
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
                {[
                  [lang === 'lt' ? 'Prieiga' : 'Access', p.access_status],
                  [lang === 'lt' ? 'Komunalinė' : 'Utilities', p.utility_availability],
                  [lang === 'lt' ? 'Zonavimas' : 'Zoning', p.zoning_status],
                  [lang === 'lt' ? 'Geotechnika' : 'Geotech', p.geotechnical_status],
                  [lang === 'lt' ? 'Terminė būklė' : 'DD result', p.due_diligence_result],
                  [lang === 'lt' ? 'Savininkas' : 'Owner', p.owner]
                ].map(([l, v], i) => (
                  <div key={i}><p className="text-slate-400">{l}</p><p className="text-slate-700">{v || '—'}</p></div>
                ))}
              </div>
              {(p.protected_area || p.coastal_zone || p.cultural_heritage || p.flood_risk) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.protected_area && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">{lang === 'lt' ? 'Saugoma' : 'Protected'}</span>}
                  {p.coastal_zone && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] text-sky-700">{lang === 'lt' ? 'Pajūrio' : 'Coastal'}</span>}
                  {p.cultural_heritage && <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700">{lang === 'lt' ? 'Kultūros paveldas' : 'Heritage'}</span>}
                  {p.flood_risk && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-700">{lang === 'lt' ? 'Užtvindymas' : 'Flood'}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}