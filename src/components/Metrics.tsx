"use client";

import { ArrowUpRight, BadgeCheck, Clock3, GitFork, UsersRound } from 'lucide-react'
import { useApp } from '@/lib/store'
import { matchesPeriod } from '@/lib/data'

function Sparkline({ kind, color }: { kind: number; color: string }) {
  const paths = ['M2 38L10 32L18 35L26 24L34 29L42 20L50 24L58 14L66 18L74 8L82 11L92 2', 'M2 38L10 36L18 29L26 32L34 20L42 24L50 17L58 20L66 9L74 14L82 6L92 3', 'M2 20L10 27L18 21L26 31L34 25L42 32L50 18L58 25L66 14L74 19L82 9L92 13', 'M2 37L10 35L18 29L26 31L34 21L42 26L50 20L58 13L66 17L74 7L82 10L92 2']
  const path = paths[kind]
  return <svg className="sparkline" width="94" height="45" viewBox="0 0 94 45" aria-hidden="true"><defs><linearGradient id={`spark-${kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".17" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs><path d={`${path}L92 45L2 45Z`} fill={`url(#spark-${kind})`} /><path d={path} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
}

export default function Metrics({ period = 'This month' }: { period?: string }) {
  const { leads } = useApp()
  const scoped = leads.filter(lead => matchesPeriod(lead, period))
  const referred = scoped.filter(lead => lead.referredBy)
  const verified = referred.filter(lead => lead.status === 'verified').length
  const pending = scoped.filter(lead => lead.status === 'pending').length
  const conversion = referred.length ? (verified / referred.length * 100).toFixed(1) : '0'
  const metrics = [
    { label: 'Total registered leads', value: scoped.length.toLocaleString(), icon: UsersRound, color: '#8b71d7', change: '18.1%', foot: 'vs. last month', type: 'neutral' },
    { label: 'Total Verified Referrals', value: verified.toLocaleString(), icon: BadgeCheck, color: '#8862d8', change: '24.6%', foot: 'vs. last month', type: 'featured' },
    { label: 'Pending payments', value: pending.toLocaleString(), icon: Clock3, color: '#d4ab63', change: null, foot: 'Awaiting verification', type: 'amber' },
    { label: 'Referral conversion', value: `${conversion}%`, icon: GitFork, color: '#63a591', change: '8.2%', foot: 'vs. last month', type: 'green' },
  ]
  return <section className="metrics-grid" aria-label="Referral program metrics">{metrics.map((metric, index) => <article key={metric.label} className={`metric-card metric-${metric.type}`}><div className="metric-top"><span>{metric.label}</span><span className="metric-icon"><metric.icon size={17} strokeWidth={1.7} /></span></div><div className="metric-middle"><strong>{metric.value}</strong><Sparkline kind={index} color={metric.color} /></div><div className="metric-foot">{metric.change && <span className="trend-badge"><ArrowUpRight size={12} strokeWidth={2.5} />{metric.change}</span>}{!metric.change && <span className="tiny-amber-dot" />}<span>{metric.foot}</span></div></article>)}</section>
}
