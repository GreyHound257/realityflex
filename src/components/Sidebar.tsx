"use client";

import { ArrowUpRight, ChartNoAxesCombined, ChevronDown, CircleHelp, ExternalLink, GitFork, LayoutDashboard, Settings2, ShieldCheck, Sparkles, UsersRound, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { Avatar, Brand } from './Ui'

export default function Sidebar({ open, onClose, onHelp }: { open: boolean; onClose: () => void; onHelp: () => void }) {
  const { leads, adminName } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'overview'
  const pending = leads.filter(lead => lead.status === 'pending').length
  
  const items = [
    { path: '/admin/dashboard', tab: 'overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/dashboard?tab=leads', tab: 'leads', label: 'All leads', icon: UsersRound, count: leads.length },
    { path: '/admin/dashboard?tab=referrals', tab: 'referrals', label: 'Referral network', icon: GitFork },
    { path: '/admin/dashboard?tab=verification', tab: 'verification', label: 'Payment verification', icon: ShieldCheck, dot: pending > 0 },
    { path: '/admin/dashboard?tab=reports', tab: 'reports', label: 'Reports & insights', icon: ChartNoAxesCombined },
  ]

  return <>
    {open && <div className="sidebar-scrim" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand /><button className="icon-button mobile-close" aria-label="Close menu" onClick={onClose}><X size={20} /></button></div>
      <button className="workspace-switch" onClick={() => { router.push('/admin/settings'); onClose() }}><span className="workspace-icon" style={{ paddingRight: 0 }}><img src="/images/logo.png" alt="Workspace icon" width={18} height={18} /></span><span><strong>Referral workspace</strong><small>Admin portal</small></span><ChevronDown size={15} /></button>
      <div className="nav-group-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">
        {items.map(({ path, tab, label, icon: Icon, count, dot }) => {
          const isActive = pathname === '/admin/dashboard' && currentTab === tab
          return (
            <Link key={path} href={path} onClick={onClose} className={`nav-item ${isActive ? 'nav-active' : ''}`}>
              <Icon size={19} strokeWidth={1.7} />
              <span>{label}</span>
              {count !== undefined && <span className="nav-count">{count}</span>}
              {dot && <span className="nav-notification-dot" />}
            </Link>
          )
        })}
      </nav>
      <div className="nav-group-label tools-label">MANAGE</div>
      <nav className="main-nav" aria-label="Workspace tools">
        <Link href="/" className="nav-item">
          <ExternalLink size={18} strokeWidth={1.7} />
          <span>Registration page</span>
          <ArrowUpRight size={14} className="nav-end-icon" />
        </Link>
        <Link href="/admin/settings" onClick={onClose} className={`nav-item ${pathname === '/admin/settings' ? 'nav-active' : ''}`}>
          <Settings2 size={19} strokeWidth={1.7} />
          <span>Settings</span>
        </Link>
      </nav>
      <div className="sidebar-bottom">
        <div className="grow-card">
          <div className="grow-icon"><Sparkles size={18} /></div>
          <h3>Good things grow together.</h3>
          <p>Share your registration page.<br />Build a stronger network.</p>
          <Link href="/">Preview registration <ArrowUpRight size={15} /></Link>
          <span className="grow-decoration" />
        </div>
        <button className="help-link" onClick={onHelp}>
          <CircleHelp size={18} />
          <span>Help & getting started</span>
          <ArrowUpRight size={14} />
        </button>
        <button className="profile-button" onClick={() => { router.push('/admin/settings'); onClose() }}>
          <Avatar lead={{ name: adminName, color: 'lavender' }} size="small" />
          <span><strong>{adminName}</strong><small>Workspace administrator</small></span>
          <ChevronDown size={15} />
        </button>
      </div>
    </aside>
  </>
}
