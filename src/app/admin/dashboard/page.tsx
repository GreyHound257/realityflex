"use client";

import { useEffect, useRef, useState, Suspense } from 'react'
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Download, ExternalLink, Link2, Menu, Plus, Search, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Metrics from '@/components/Metrics'
import BuyerTable from '@/components/BuyerTable'
import ReferrerTable from '@/components/ReferrerTable'
import LeadDrawer from '@/components/LeadDrawer'
import { NetworkBanner, RecentActivity, ReferralChart, TopReferrers } from '@/components/Insights'
import { Avatar, Dialog, DialogHeader } from '@/components/Ui'
import { useApp } from '@/lib/store'
import type { Buyer } from '@/lib/data'

const pageInfo: Record<string, { name: string; title: string; description: string }> = {
  'overview': { name: 'Overview', title: 'Your network, at a glance.', description: 'Every connection counts. Here’s how your referral community is growing.' },
  'leads': { name: 'All buyers', title: 'Good people. Great possibilities.', description: 'Manage every registration, follow each connection, and keep your community moving.' },
  'referrers': { name: 'All referrers', title: 'Your trusted advocates.', description: 'Manage your referrers and see the network they are building.' },
  'referrals': { name: 'Referral network', title: 'Connections that go further.', description: 'Meet your community’s advocates and explore the networks they’re building.' },
  'verification': { name: 'Payment verification', title: 'Give every referral its credit.', description: 'Review pending payments and turn meaningful connections into verified referrals.' },
  'reports': { name: 'Reports & insights', title: 'A little perspective. A lot of potential.', description: 'Understand what’s working and find new opportunities to grow your community.' },
}

function DashboardContent() {
  const { buyers, activities, adminName, copy, exportBuyers, createRef } = useApp()
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  
  const currentTab = searchParams.get('tab') || 'overview'
  const page = pageInfo[currentTab] || pageInfo['overview']
  const isOverview = currentTab === 'overview'
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('This month')
  const [popover, setPopover] = useState<'date' | 'notifications' | null>(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [modal, setModal] = useState<'share' | 'help' | 'activity' | 'create-referrer' | null>(null)
  const [registrationUrl, setRegistrationUrl] = useState('')
  const [newRefName, setNewRefName] = useState('')
  const [newRefEmail, setNewRefEmail] = useState('')
  const [newRefPhone, setNewRefPhone] = useState('')
  const [creatingRef, setCreatingRef] = useState(false)

  useEffect(() => {
    setRegistrationUrl(`${window.location.origin}/?ref=RF3-ORG1`)
  }, [])

  async function handleCreateReferrer(e: React.FormEvent) {
    e.preventDefault()
    setCreatingRef(true)
    await createRef(newRefName, newRefEmail, newRefPhone)
    setCreatingRef(false)
    setModal(null)
    setNewRefName('')
    setNewRefEmail('')
    setNewRefPhone('')
  }

  useEffect(() => {
    function keyboard(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [])

  function selectLead(buyer: Buyer) { setSelectedLeadId(buyer.id) }
  function globalSearch(value: string) {
    setQuery(value)
    if (!['overview', 'leads', 'verification', 'referrers'].includes(currentTab)) {
      router.push('/admin/dashboard?tab=leads')
    }
  }

  return <div className="app-shell"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onHelp={() => setModal('help')} /><div className="workspace"><header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={13} /><strong>{page.name}</strong></div></div><div className="topbar-actions"><label className="global-search"><Search size={16} /><input ref={searchRef} aria-label="Search workspace" placeholder="Search anything..." value={query} onChange={event => globalSearch(event.target.value)} /><kbd>⌘ K</kbd></label><span className="topbar-separator" /><button className="icon-button notification-button" aria-label="View notifications" aria-expanded={popover === 'notifications'} onClick={() => { setPopover(popover === 'notifications' ? null : 'notifications'); setNotificationsRead(true) }}><Bell size={19} />{!notificationsRead && <span />}</button><button className="topbar-profile" aria-label="Open profile settings" onClick={() => router.push('/admin/settings')}><Avatar lead={{ name: adminName, color: 'lavender' }} size="small" /></button></div>
    {popover === 'notifications' && <><div className="popover-scrim" onClick={() => setPopover(null)} /><div className="notifications-popover"><div className="popover-heading">You’re in the loop<span className="count-pill">{activities.length} updates</span></div>{activities.slice(0, 4).map(activity => <div className="notification-item" key={activity.id}><span className={`activity-icon activity-${activity.type}`}>{activity.type === 'verification' ? <Check size={14} /> : <Plus size={14} />}</span><div><strong>{activity.name}</strong><p>{activity.detail}</p><small>{activity.time}</small></div></div>)}<button className="notification-view-all" onClick={() => { setModal('activity'); setPopover(null) }}>View all activity<ArrowRight size={14} /></button></div></>}
  </header>
  <main className="main-content"><section className="page-heading"><div><span className="page-eyebrow">{isOverview ? 'WORKSPACE OVERVIEW' : page.name.toUpperCase()}</span><h1>{page.title}</h1><p>{page.description}</p></div><div className="heading-actions"><div className="date-picker-container"><button className="button button-white date-button" onClick={() => setPopover(popover === 'date' ? null : 'date')} aria-expanded={popover === 'date'}><CalendarDays size={16} /><span>{period}</span><ChevronDown size={13} /></button>{popover === 'date' && <><div className="popover-scrim" onClick={() => setPopover(null)} /><div className="date-popover"><span className="popover-caption">REGISTRATION PERIOD</span>{['This month', 'Last 7 days', 'All time'].map(option => <button key={option} className={period === option ? 'selected' : ''} onClick={() => { setPeriod(option); setPopover(null) }}>{option}{period === option && <Check size={15} />}</button>)}<p>September 2026 production workspace</p></div></>}</div><button className="button button-white export-button" onClick={() => exportBuyers(buyers.filter(buyer => (period !== 'Last 7 days' || new Date(buyer.date) >= new Date('2026-09-15')) && (!query || `${buyer.name} ${buyer.email} ${buyer.phone}`.toLowerCase().includes(query.toLowerCase()))))}><Download size={16} /><span>Export</span></button><button className="button button-primary invite-button" onClick={() => setModal('create-referrer')}><Plus size={17} /><span>Create Referrer</span></button></div></section>
    <Metrics period={period} />
    {(isOverview || currentTab === 'leads' || currentTab === 'verification') && <BuyerTable key={`${currentTab}-${period}`} onSelect={selectLead} query={query} onQueryChange={setQuery} period={period} initialStatus={currentTab === 'verification' ? 'pending' : 'all'} />}
    {currentTab === 'referrers' && <ReferrerTable query={query} onQueryChange={setQuery} />}
    {isOverview && <div className="insights-grid"><TopReferrers onSelect={selectLead} onViewAll={() => router.push('/admin/dashboard?tab=referrals')} /><RecentActivity onViewAll={() => setModal('activity')} /></div>}
    {currentTab === 'referrals' && <><div className="network-page-grid"><TopReferrers expanded onSelect={selectLead} /><div className="network-side-card"><span className="large-feature-icon"><Sparkles size={26} /></span><span className="eyebrow">PEOPLE MAKE THE DIFFERENCE</span><h2>A small introduction.<br />A bigger opportunity.</h2><p>Every verified referral is a connection worth celebrating. Give your community the tools to keep growing.</p><div className="network-rule"><Check size={16} />Unique referral codes for every lead</div><div className="network-rule"><Check size={16} />Transparent, verified referral scores</div><div className="network-rule"><Check size={16} />One connected community</div><button className="button button-primary" onClick={() => setModal('share')}>Share registration page<ArrowUpRight size={16} /></button></div></div><NetworkBanner onInvite={() => setModal('share')} /></>}
    {currentTab === 'reports' && <><ReferralChart /><div className="insights-grid"><TopReferrers onSelect={selectLead} onViewAll={() => router.push('/admin/dashboard?tab=referrals')} /><RecentActivity onViewAll={() => setModal('activity')} /></div></>}
    {(currentTab === 'leads' || currentTab === 'verification') && <NetworkBanner onInvite={() => setModal('share')} />}
    <footer className="workspace-footer"><span><span className="live-dot" />Live Production<span className="footer-divider">·</span>Secured Database</span><span>Meaningful connections. Real possibilities.</span></footer>
  </main></div>
  {selectedLeadId && <LeadDrawer leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} onSelect={setSelectedLeadId} />}
  {modal === 'share' && <Dialog title="Invite your next great connection" onClose={() => setModal(null)} className="share-dialog"><DialogHeader title="Good things start with a share." eyebrow="GROW YOUR COMMUNITY" onClose={() => setModal(null)} /><div className="share-illustration"><span><Link2 size={30} /></span><i /><i /><i /></div><p className="dialog-description">Invite someone to take the next step. Share your registration page and let the connections begin.</p><label className="field-label" htmlFor="registration-url">Your registration page</label><div className="copy-input"><input id="registration-url" value={registrationUrl} readOnly /><button aria-label="Copy registration link" onClick={() => copy(registrationUrl, 'Registration link copied')}><Link2 size={17} /></button></div><div className="info-note"><ShieldCheck size={16} /><span>Every new member receives a unique, shareable referral code.</span></div><div className="dialog-actions"><Link className="button button-white" href="/"><ExternalLink size={16} />Preview page</Link><button className="button button-primary" onClick={() => copy(registrationUrl, 'Registration link copied')}><Link2 size={16} />Copy invite link</button></div></Dialog>}
  {modal === 'help' && <Dialog title="Your workspace, made simple" onClose={() => setModal(null)} className="help-dialog"><DialogHeader title="Your workspace, made simple." eyebrow="A LITTLE GUIDANCE" onClose={() => setModal(null)} /><div className="help-steps"><div><span>01</span><div><h3>Welcome your community</h3><p>Share the registration page. Leads can sign up with a referral code or choose to continue without one.</p></div></div><div><span>02</span><div><h3>Follow the connections</h3><p>Select any lead to see their personal referral code, referrer, and the people they’ve introduced.</p></div></div><div><span>03</span><div><h3>Verify. Credit. Grow.</h3><p>Switch on “Payment verified” after confirming a lead’s payment. Their referrer’s score updates instantly.</p></div></div></div><div className="info-note"><CircleHelp size={17} /><span>This system is live and securely connected to the backend. Real email delivery, payments, and secure authentication are fully operational.</span></div><button className="button button-primary full-width" onClick={() => setModal(null)}>Let’s get growing<ArrowRight size={16} /></button></Dialog>}
  {modal === 'activity' && <Dialog title="Workspace activity" onClose={() => setModal(null)} className="activity-dialog"><DialogHeader title="Every little milestone." eyebrow="WORKSPACE ACTIVITY" onClose={() => setModal(null)} /><RecentActivity expanded /></Dialog>}
  {modal === 'create-referrer' && <Dialog title="Create New Referrer" onClose={() => setModal(null)} className="create-referrer-dialog"><DialogHeader title="Add a new advocate." eyebrow="CREATE REFERRER" onClose={() => setModal(null)} />
    <form onSubmit={handleCreateReferrer} className="registration-form" style={{ marginTop: '20px' }}>
      <label className="field-label" htmlFor="ref-name">Full name<span>*</span></label>
      <div className="form-input-wrap"><input id="ref-name" placeholder="Name" required value={newRefName} onChange={e => setNewRefName(e.target.value)} /></div>
      <label className="field-label" htmlFor="ref-email">Email address<span>*</span></label>
      <div className="form-input-wrap"><input id="ref-email" type="email" placeholder="Email" required value={newRefEmail} onChange={e => setNewRefEmail(e.target.value)} /></div>
      <label className="field-label" htmlFor="ref-phone">Phone number<span>*</span></label>
      <div className="form-input-wrap"><input id="ref-phone" type="tel" placeholder="Phone" required value={newRefPhone} onChange={e => setNewRefPhone(e.target.value)} /></div>
      <button type="submit" disabled={creatingRef} className="button button-primary" style={{ marginTop: '15px' }}>{creatingRef ? 'Creating...' : 'Create Referrer'}</button>
    </form>
  </Dialog>}
  </div>
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
