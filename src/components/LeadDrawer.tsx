"use client";

import { useState } from 'react'
import { ArrowDownRight, ArrowRight, BadgeCheck, CalendarDays, Check, Copy, GitFork, Info, Link2, Mail, ShieldCheck, UserPlus, UsersRound, X } from 'lucide-react'
import { formatDate } from '@/lib/data'
import { useApp } from '@/lib/store'
import { Avatar, Code, Dialog, EmptyState, StatusBadge, Toggle } from './Ui'

export default function LeadDrawer({ leadId, onClose, onSelect }: { leadId: string; onClose: () => void; onSelect: (id: string) => void }) {
  const { buyers, referrers, setVerified } = useApp()
  const lead = buyers.find(item => item.id === leadId)
  if (!lead) return null
  const parent = referrers.find(item => item.code === lead.referredBy)

  return <Dialog onClose={onClose} title={`${lead.name}'s lead details`} sheet><div className="sheet-top"><span><UsersRound size={17} />Buyer details</span><button className="icon-button" aria-label="Close buyer details" onClick={onClose}><X size={21} /></button></div><div className="sheet-scroll"><div className="lead-profile"><Avatar lead={lead} size="large" /><div><h2>{lead.name}</h2><a className="lead-email" href={`mailto:${lead.email}`}>{lead.email}<Mail size={13} /></a></div><StatusBadge status={lead.status} short /></div><div className="lead-meta"><span><CalendarDays size={14} />Joined {formatDate(lead.date)}</span><span><span className="live-dot" />Active buyer</span></div>

    <div className="lead-information"><div><span>Phone number</span><strong>{lead.phone}</strong></div><div><span>Referred by</span>{parent ? <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Avatar lead={{name: parent.name, color: 'blue'} as any} size="small" />{parent.name}</div> : <strong>Direct signup</strong>}</div><div><span>Referral code used</span>{lead.referredBy ? <Code muted>{lead.referredBy}</Code> : <strong>Not provided</strong>}</div><div><span><ShieldCheck size={15} />Payment verified</span><Toggle checked={lead.status === 'verified'} onChange={value => setVerified(lead.id, value)} label={`Verify payment for ${lead.name}`} /></div></div>

  </div><div className="sheet-footer"><button className="button button-white" onClick={onClose}>Close details</button></div></Dialog>
}
