import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useEntityList } from '@/lib/useEntityList';
import PageHeader, { Loader } from '@/components/ui-parts';
import HealthBadge from '@/components/HealthBadge';
import ProgressBar from '@/components/ProgressBar';
import { formatCurrency, formatNumber, formatDate } from '@/lib/armarisUtils';
import { cn } from '@/lib/utils';

export default function HousesList() {
  const { t, lang } = useApp();
  const { data, loading } = useEntityList('House', { sort: '-created_date' });
  const [q, setQ] = useState('');
  const [devFilter, setDevFilter] = useState('');

  const developments = [...new Set(data.map(h => h.development_name).filter(Boolean))];
  const filtered = data.filter(h =>
    (!q || (h.internal_house_number || '').toLowerCase().includes(q.toLowerCase()) || (h.house_model || '').toLowerCase().includes(q.toLowerCase())) &&
    (!devFilter || h.development_name === devFilter)
  );

  return (
    <div>
      <PageHeader title={t('houses')} subtitle={lang === 'lt' ? 'Visi namai visuose projektuose' : 'All houses across developments'} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
        </div>
        <select value={devFilter} onChange={e => setDevFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="">{lang === 'lt' ? 'Visi projektai' : 'All developments'}</option>
          {developments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(h => (
            <Link key={h.id} to={`/houses/${h.id}`} className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">{h.internal_house_number}</div>
                  <div><p className="font-semibold text-slate-900">{h.house_model || (lang === 'lt' ? 'Namas' : 'House')}</p><p className="text-xs text-slate-500">{h.development_name} · {h.plot_number}</p></div>
                </div>
                <HealthBadge health={h.health} lang={lang} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div><p className="font-semibold text-slate-900">{formatNumber(h.gross_area, 'm²')}</p><p className="text-[10px] text-slate-400">{lang === 'lt' ? 'Plotas' : 'Area'}</p></div>
                <div><p className="font-semibold text-slate-900">{h.floors || '—'}</p><p className="text-[10px] text-slate-400">{lang === 'lt' ? 'Aukštų' : 'Floors'}</p></div>
                <div><p className="font-semibold text-slate-900">{h.bedrooms || '—'}</p><p className="text-[10px] text-slate-400">{lang === 'lt' ? 'Kambariai' : 'Beds'}</p></div>
              </div>
              <div className="mt-3"><ProgressBar value={h.calculated_progress ?? h.reported_progress} /></div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">{h.current_phase || '—'}</span>
                {h.sale_price > 0 && <span className="font-semibold text-slate-900">{formatCurrency(h.sale_price)}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}