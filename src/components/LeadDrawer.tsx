"use client";

import { useState } from 'react'
import { ArrowDownRight, ArrowRight, BadgeCheck, CalendarDays, Check, Copy, GitFork, Info, Link2, Mail, ShieldCheck, UserPlus, UsersRound, X } from 'lucide-react'
import { formatDate } from '@/lib/data'
import { useApp } from '@/lib/store'
import { Avatar, Code, Dialog, EmptyState, StatusBadge, Toggle } from './Ui'

export default function LeadDrawer({ leadId, onClose, onSelect }: { leadId: string; onClose: () => void; onSelect: (id: string) => void }) {
  const { leads, setVerified, copy } = useApp()
  const [tab, setTab] = useState<'all' | 'verified' | 'pending'>('all')
  const lead = leads.find(item => item.id === leadId)
  if (!lead) return null
  const referrals = leads.filter(item => item.referredBy === lead.code)
  const verified = referrals.filter(item => item.status === 'verified')
  const parent = leads.find(item => item.code === lead.referredBy)
  const filtered = referrals.filter(item => tab === 'all' || (tab === 'verified' ? item.status === 'verified' : item.status !== 'verified'))
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${lead.code}` : ''

  return <Dialog onClose={onClose} title={`${lead.name}'s lead details`} sheet><div className="sheet-top"><span><UsersRound size={17} />Lead details</span><button className="icon-button" aria-label="Close lead details" onClick={onClose}><X size={21} /></button></div><div className="sheet-scroll"><div className="lead-profile"><Avatar lead={lead} size="large" /><div><h2>{lead.name}</h2><a className="lead-email" href={`mailto:${lead.email}`}>{lead.email}<Mail size={13} /></a></div><StatusBadge status={lead.status} short /></div><div className="lead-meta"><span><CalendarDays size={14} />Joined {formatDate(lead.date)}</span><span><span className="live-dot" />Active lead</span></div>
    <div className="own-code-box"><div><span className="eyebrow">PERSONAL REFERRAL CODE</span><strong>{lead.code}</strong></div><button className="button button-white button-small" onClick={() => copy(lead.code, 'Referral code copied')}><Copy size={14} />Copy code</button></div>
    <div className="referral-score-card"><span className="score-icon"><BadgeCheck size={23} /></span><div><span>Total Referral Count</span><strong>{verified.length}<small>verified referrals</small></strong></div><div className="score-decoration"><GitFork size={72} strokeWidth={1} /></div></div><div className="score-explainer"><Info size={14} /><span>Only payment-verified referrals count toward this total.</span></div>
    <div className="lead-information"><div><span>Referred by</span>{parent ? <button onClick={() => { onSelect(parent.id); setTab('all') }}><Avatar lead={parent} size="small" />{parent.name}<ArrowRight size={13} /></button> : <strong>Direct signup</strong>}</div><div><span>Referral code used</span>{lead.referredBy ? <Code muted>{lead.referredBy}</Code> : <strong>Not provided</strong>}</div><div><span><ShieldCheck size={15} />Payment verified</span><Toggle checked={lead.status === 'verified'} onChange={value => setVerified(lead.id, value)} label={`Verify payment for ${lead.name}`} /></div></div>
    <div className="referred-title"><div><h3>Referral network <span className="count-pill">{referrals.length}</span></h3><p>Every connection starts with a conversation.</p></div><GitFork size={19} /></div><div className="drawer-tabs" role="tablist" aria-label="Referred user status">{(['all', 'verified', 'pending'] as const).map(item => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'all' ? 'All referrals' : item === 'verified' ? 'Verified' : 'Unverified'} <span>{item === 'all' ? referrals.length : item === 'verified' ? verified.length : referrals.length - verified.length}</span></button>)}</div>
    <div className="referral-list">{filtered.map(referred => <div className="referred-user" key={referred.id}><span className="connection-line"><ArrowDownRight size={15} /></span><Avatar lead={referred} size="small" /><button className="referred-user-name" onClick={() => { onSelect(referred.id); setTab('all') }}><strong>{referred.name}</strong><span>{referred.email}</span></button><div className="referral-verification"><span className={referred.status === 'verified' ? 'is-verified' : ''}>{referred.status === 'verified' ? <><Check size={11} /> Payment verified</> : 'Verify payment'}</span><Toggle checked={referred.status === 'verified'} onChange={value => setVerified(referred.id, value)} label={`Payment verified for ${referred.name}`} /></div></div>)}{filtered.length === 0 && <EmptyState title={referrals.length ? 'No referrals in this view' : 'A new network starts here'} description={referrals.length ? 'Choose another tab to see more connections.' : 'Share this lead’s referral link to start building their network.'} />}</div>
    <div className="referral-drawer-note"><UserPlus size={18} /><p>One link. More possibilities.<br /><span>Share {lead.name.split(' ')[0]}’s link to grow their referral network.</span></p></div>
  </div><div className="sheet-footer"><button className="button button-white" onClick={onClose}>Close details</button><button className="button button-primary" onClick={() => copy(shareLink, 'Personal referral link copied')}><Link2 size={16} />Copy referral link</button></div></Dialog>
}
