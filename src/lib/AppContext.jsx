import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { getTranslator } from './i18n';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('lt');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('armaris_lang');
    if (stored === 'en' || stored === 'lt' || stored === 'ru') setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('armaris_lang', lang);
  }, [lang]);

  useEffect(() => {
    let mounted = true;
    base44.auth.me()
      .then((u) => { if (mounted) setUser(u); })
      .catch(() => { if (mounted) setUser(null); })
      .finally(() => { if (mounted) setLoadingUser(false); });
    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => {
    const t = getTranslator(lang);
    // Treat platform 'admin' as owner for full demo access
    const rawRole = user?.role || 'manager';
    const role = rawRole === 'admin' ? 'owner' : rawRole;
    const perms = {
      owner: { canApprove: true, canEditFinance: true, canDelete: true, canConfigure: true, canViewAll: true, canOverride: true },
      director: { canApprove: true, canEditFinance: true, canDelete: false, canConfigure: false, canViewAll: true, canOverride: false },
      manager: { canApprove: false, canEditFinance: false, canDelete: false, canConfigure: false, canViewAll: false, canOverride: false },
      supervisor: { canApprove: false, canEditFinance: false, canDelete: false, canConfigure: false, canViewAll: false, canOverride: false }
    };
    const permission = perms[role] || perms.manager;
    return { lang, setLang, t, user, role, permission, loadingUser };
  }, [lang, user, loadingUser]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}