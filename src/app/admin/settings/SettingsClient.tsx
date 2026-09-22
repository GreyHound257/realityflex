"use client";

import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronRight, CircleHelp, Menu, Search, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Settings from './Settings'
import { Avatar, Dialog, DialogHeader } from '@/components/Ui'

export default function SettingsClient({ admin, activities = [] }: { admin: any, activities: any[] }) {
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [popover, setPopover] = useState<'notifications' | null>(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [modal, setModal] = useState<'help' | null>(null)

  useEffect(() => {
    function keyboard(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])

  function globalSearch(value: string) {
    setQuery(value)
    router.push(`/admin/dashboard?tab=leads`)
  }

  const adminName = admin?.name || "System Admin";

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onHelp={() => setModal('help')} />
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <Menu size={21} />
            </button>
            <div className="breadcrumb">
              <span>Workspace</span><ChevronRight size={13} /><strong>Settings</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={16} />
              <input ref={searchRef} aria-label="Search workspace" placeholder="Search anything..." value={query} onChange={event => globalSearch(event.target.value)} />
              <kbd>⌘ K</kbd>
            </label>
            <span className="topbar-separator" />
            <button className="icon-button notification-button" aria-label="View notifications" aria-expanded={popover === 'notifications'} onClick={() => { setPopover(popover === 'notifications' ? null : 'notifications'); setNotificationsRead(true) }}>
              <Bell size={19} />
              {!notificationsRead && <span />}
            </button>
            <button className="topbar-profile" aria-label="Open profile settings">
              <Avatar lead={{ name: adminName, color: 'lavender' }} size="small" />
            </button>
          </div>
          {popover === 'notifications' && (
            <>
              <div className="popover-scrim" onClick={() => setPopover(null)} />
              <div className="notifications-popover">
                <div className="popover-heading">
                  You’re in the loop<span className="count-pill">{activities.length} updates</span>
                </div>
                {activities.map(activity => (
                  <div className="notification-item" key={activity.id}>
                    <span className={`activity-icon activity-${activity.type}`}>
                      {activity.type === 'verification' ? <ShieldCheck size={14} /> : <span />}
                    </span>
                    <div>
                      <strong>{activity.name}</strong>
                      <p>{activity.detail}</p>
                      <small>{new Date(activity.time).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
                <button className="notification-view-all" onClick={() => { router.push('/admin/dashboard?tab=overview'); setPopover(null) }}>
                  View all activity<ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </header>
        <main className="main-content">
          <section className="page-heading">
            <div>
              <span className="page-eyebrow">SETTINGS</span>
              <h1>Make this space your own.</h1>
              <p>A few thoughtful settings to keep your referral workspace running smoothly.</p>
            </div>
          </section>
          
          <Settings initialAdmin={admin} />

          <footer className="workspace-footer">
            <span><span className="live-dot" />Live Production<span className="footer-divider">·</span>Secured Database</span>
            <span>De Reality Spec Ltd.</span>
          </footer>
        </main>
      </div>
      
      {modal === 'help' && (
        <Dialog title="Your workspace, made simple" onClose={() => setModal(null)} className="help-dialog">
          <DialogHeader title="Your workspace, made simple." eyebrow="A LITTLE GUIDANCE" onClose={() => setModal(null)} />
          <div className="help-steps">
            <div><span>01</span><div><h3>Manage Affiliates</h3><p>Create referrer profiles for your affiliates. They will receive an auto-generated unique code.</p></div></div>
            <div><span>02</span><div><h3>Track Buyers</h3><p>Buyers use these codes at registration. You can track exactly how many buyers each referrer brings in.</p></div></div>
            <div><span>03</span><div><h3>Verify Payments</h3><p>Switch on “Payment verified” after confirming a buyer's payment. This locks in the referral.</p></div></div>
          </div>
          <button className="button button-primary full-width" onClick={() => setModal(null)}>Let’s get growing<ChevronRight size={16} /></button>
        </Dialog>
      )}
    </div>
  )
}