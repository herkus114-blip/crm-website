import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { t } = useApp();
  const [dark, setDark] = useState(() => {
    if (typeof document !== 'undefined') return document.documentElement.classList.contains('dark');
    return false;
  });

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('armaris_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('armaris_theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      title={dark ? (t('lightMode') || 'Light mode') : (t('darkMode') || 'Dark mode')}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}