import React from 'react';
import { cn } from '@/lib/utils';
import { healthStyle } from '@/lib/armarisUtils';

export default function HealthBadge({ health, label, lang = 'lt' }) {
  const s = healthStyle(health);
  const text = label || (lang === 'en' ? s.labelEn : s.labelLt);
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1', s.bg, s.text, s.ring)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {text}
    </span>
  );
}