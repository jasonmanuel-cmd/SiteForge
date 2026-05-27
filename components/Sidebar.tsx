'use client'

import Link from 'next/link'

interface SidebarProps {
  currentPath: string
  user: { firstName: string; lastName: string; role: string } | null
  account: { companyName: string } | null
  onLogout: () => void
  isDemo?: boolean
}

const NAV_ITEMS = [
  { section: 'Sales', items: [
    { href: '/crm', label: 'CRM & Pipeline', icon: '👥' },
    { href: '/estimator', label: 'AI Estimator', icon: '🔧' },
    { href: '/estimates', label: 'My Estimates', icon: '📋' },
  ]},
  { section: 'Operations', items: [
    { href: '/projects', label: 'Projects', icon: '🏗️' },
    { href: '/invoices', label: 'Invoices', icon: '📄' },
    { href: '/invoices/create', label: 'Create Invoice', icon: '✏️' },
    { href: '/rfis', label: 'RFIs', icon: '❓' },
    { href: '/change-orders', label: 'Change Orders', icon: '📝' },
  ]},
]

export default function Sidebar({ currentPath, user, account, onLogout, isDemo }: SidebarProps) {
  return (
    <aside aria-label="Main navigation" className="fixed inset-y-0 left-0 w-64 bg-sf-navy-dark text-white flex flex-col z-30">
      {/* Brand */}
      <div className="orange-strip" />
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sf-orange rounded flex items-center justify-center font-bold text-white text-sm font-heading leading-none">SF</div>
          <div>
            <div className="text-lg font-bold text-white leading-tight font-heading tracking-wide" role="presentation">SiteForge</div>
            <p className="text-[10px] text-sf-orange-light font-medium uppercase tracking-widest">Forge your operation.</p>
          </div>
        </div>
        {account?.companyName && (
          <p className="text-[11px] text-white/50 mt-2 truncate">{account.companyName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Sidebar" className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-all ${
            currentPath === '/dashboard'
              ? 'bg-sf-orange/20 text-sf-orange-light border border-sf-orange/30 font-medium'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
          {...(currentPath === '/dashboard' ? { 'aria-current': 'page' as const } : {})}
        >
          <span className="mr-3" aria-hidden="true">🏠</span> Dashboard
        </Link>

        {NAV_ITEMS.map(group => (
          <div key={group.section} role="group" aria-label={group.section}>
            <div className="px-3 py-1 text-[10px] text-white/30 uppercase tracking-widest font-medium font-heading">{group.section}</div>
            {group.items.map(item => {
              const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-sf-orange/20 text-sf-orange-light border border-sf-orange/30 font-medium'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  {...(isActive ? { 'aria-current': 'page' as const } : {})}
                >
                  <span className="mr-3" aria-hidden="true">{item.icon}</span> {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="flex items-center mb-3">
            <div className="w-9 h-9 bg-sf-orange rounded flex items-center justify-center">
              <span className="text-sm font-bold text-white">{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white leading-tight flex items-center gap-2">
                {user.firstName} {user.lastName}
                {isDemo && <span className="text-[10px] bg-sf-orange/30 text-sf-orange-light px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Demo</span>}
              </p>
              <p className="text-[11px] text-white/50 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full px-3 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 hover:text-white transition-all text-sm"
        >
          {isDemo ? 'Exit Demo' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
