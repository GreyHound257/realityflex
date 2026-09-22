export type LeadStatus = 'verified' | 'pending' | 'registered'

export interface Referrer {
  id: string
  name: string
  email: string
  phone: string
  code: string
}

export interface Buyer {
  id: string
  name: string
  email: string
  phone: string
  referredBy: string | null
  date: string
  status: LeadStatus
  color: string
}

export type Lead = Buyer // For compatibility with older code if needed, but we should migrate fully

export interface Activity {
  id: string
  type: 'registration' | 'verification' | 'update'
  name: string
  detail: string
  time: string
}



export const DEMO_TODAY = '2026-09-21'
export const avatarColors = ['lavender', 'peach', 'blue', 'rose', 'mint', 'sand']

export function initials(name: string) {
  return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export function formatDate(date: string, compact = false) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', ...(compact ? {} : { year: 'numeric' }) }).format(new Date(date))
}

export function matchesPeriod(lead: Lead, period: string) {
  if (period === 'All time') return true
  if (period === 'Last 7 days') return lead.date.slice(0, 10) >= '2026-09-15' && lead.date.slice(0, 10) <= DEMO_TODAY
  return lead.date.slice(0, 7) === DEMO_TODAY.slice(0, 7)
}

export const statusLabels: Record<LeadStatus, string> = { verified: 'Payment Verified', pending: 'Pending Payment', registered: 'Registered' }
