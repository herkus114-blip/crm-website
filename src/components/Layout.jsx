import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Map, Mountain, Grid3x3, Home as HomeIcon,
  FileText, Hammer, ListChecks, BadgeCheck, FolderOpen, HardHat,
  Euro, TrendingUp, Users, ShieldCheck, FileBarChart, Settings,
  ScrollText, Menu, X, Globe, ChevronDown, LogOut
} from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/developments', icon: Building2, key: 'developments', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/map', icon: Map, key: 'map', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/land', icon: Mountain, key: 'land', roles: ['owner', 'director', 'manager'] },
  { to: '/plots', icon: Grid3x3, key: 'plots', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/houses', icon: HomeIcon, key: 'houses', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/permits', icon: FileText, key: 'permits', roles: ['owner', 'director', 'manager'] },
  { to: '/construction', icon: Hammer, key: 'construction', roles: ['owner', 'director', 'supervisor'] },
  { to: '/tasks', icon: ListChecks, key: 'tasks', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/approvals', icon: BadgeCheck, key: 'approvals', roles: ['owner', 'director', 'manager'] },
  { to: '/documents', icon: FolderOpen, key: 'documents', roles: ['owner', 'director', 'manager', 'supervisor'] },
  { to: '/contractors', icon: HardHat, key: 'contractors', roles: ['owner', 'director', 'manager'] },
  { to: '/finance', icon: Euro, key: 'finance', roles: ['owner', 'director'] },
  { to: '/sales', icon: TrendingUp, key: 'sales', roles: ['owner', 'director', 'manager'] },
  { to: '/customers', icon: Users, key: 'customers', roles: ['owner', 'director', 'manager'] },
  { to: '/warranty', icon: ShieldCheck, key: 'warranty', roles: ['owner', 'director', 'manager'] },
  { to: '/reports', icon: FileBarChart, key: 'reports', roles: ['owner', 'director'] },
  { to: '/audit', icon: ScrollText, key: 'audit', roles: ['owner', 'director'] },
  { to: '/administration', icon: Settings, key: 'administration', roles: ['owner'] }
];

export default function Layout() {
  const { t, lang, setLang, user, role, permission } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const items = NAV.filter(n => n.roles.includes(role));

  const handleLogout = () => {
    base44.auth.logout?.('/login');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-slate-900">{t('appName')}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">{t('appTagline')}</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {items.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
              <span className="truncate">{t(key)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6 text-slate-700" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {['lt', 'en'].map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={cn('flex w-full items-center px-3 py-1.5 text-sm hover:bg-slate-50', lang === l ? 'font-semibold text-slate-900' : 'text-slate-600')}
                    >
                      {l === 'lt' ? 'Lietuvių' : 'English'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white uppercase">
                {(user?.full_name || user?.email || 'U').charAt(0)}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">{user?.full_name || (lang === 'lt' ? 'Savininkas' : 'Owner')}</p>
                <p className="text-[10px] text-slate-500">{t(role)}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" title={t('cancel')}>
              <LogOut className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}