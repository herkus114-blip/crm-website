export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value, suffix = '') {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('lt-LT', { maximumFractionDigits: 2 }).format(value) + (suffix ? ' ' + suffix : '');
}

// DB stores YYYY-MM-DD; UI shows DD.MM.YYYY
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function daysFromToday(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateStr) {
  const days = daysFromToday(dateStr);
  return days !== null && days < 0;
}

const HEALTH_COLORS = {
  green: { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-200', labelLt: 'Pagal grafiką', labelEn: 'On track' },
  amber: { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-200', labelLt: 'Dėmesio', labelEn: 'Attention' },
  red: { bg: 'bg-rose-50', dot: 'bg-rose-500', text: 'text-rose-700', ring: 'ring-rose-200', labelLt: 'Kritinė', labelEn: 'Critical' },
  grey: { bg: 'bg-slate-100', dot: 'bg-slate-400', text: 'text-slate-600', ring: 'ring-slate-200', labelLt: 'Nepradėta', labelEn: 'Not started' },
  blue: { bg: 'bg-sky-50', dot: 'bg-sky-500', text: 'text-sky-700', ring: 'ring-sky-200', labelLt: 'Laukiama išorės', labelEn: 'Awaiting external' }
};

export function healthStyle(h) {
  return HEALTH_COLORS[h] || HEALTH_COLORS.grey;
}

export function progressColor(p) {
  if (p >= 75) return 'bg-emerald-500';
  if (p >= 40) return 'bg-sky-500';
  if (p >= 10) return 'bg-amber-500';
  return 'bg-slate-300';
}