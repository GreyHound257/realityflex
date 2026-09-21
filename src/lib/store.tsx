"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { avatarColors, makeSeedLeads, seedActivities, type Activity, type Lead } from './data'

interface AppState {
  leads: Lead[]
  activities: Activity[]
  notify: (message: string) => void
  setVerified: (id: string, verified: boolean) => void
  register: (name: string, email: string, referredBy: string | null) => Lead
  copy: (text: string, message?: string) => Promise<void>
  exportLeads: (items: Lead[]) => void
  adminName: string
  setAdminName: (name: string) => void
}

const AppContext = createContext<AppState | null>(null)

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch { return fallback }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [leads, setLeads] = useState<Lead[]>(makeSeedLeads)
  const [activities, setActivities] = useState<Activity[]>(seedActivities)
  const [adminName, setAdminName] = useState('Alex Morgan')
  const [toast, setToast] = useState('')

  useEffect(() => {
    setIsClient(true)
    setLeads(readStored('drs-leads-v1', makeSeedLeads()))
    setActivities(readStored('drs-activity-v1', seedActivities))
    setAdminName(readStored('drs-admin-name', 'Alex Morgan'))
  }, [])

  useEffect(() => { if (isClient) localStorage.setItem('drs-leads-v1', JSON.stringify(leads)) }, [leads, isClient])
  useEffect(() => { if (isClient) localStorage.setItem('drs-activity-v1', JSON.stringify(activities)) }, [activities, isClient])
  useEffect(() => { if (isClient) localStorage.setItem('drs-admin-name', JSON.stringify(adminName)) }, [adminName, isClient])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  function setVerified(id: string, verified: boolean) {
    const lead = leads.find(item => item.id === id)
    if (!lead) return
    setLeads(current => current.map(item => item.id === id ? { ...item, status: verified ? 'verified' : 'pending' } : item))
    const activity: Activity = { id: crypto.randomUUID(), type: verified ? 'verification' : 'update', name: lead.name, detail: verified ? 'Payment has been verified' : 'Payment verification was removed', time: 'Just now' }
    setActivities(current => [activity, ...current].slice(0, 30))
    setToast(verified ? `${lead.name} marked as payment verified` : `Payment verification removed for ${lead.name}`)
  }

  function register(name: string, email: string, referredBy: string | null) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    do {
      const random = crypto.getRandomValues(new Uint8Array(4))
      code = 'RF3-' + Array.from(random).map(n => alphabet[n % alphabet.length]).join('')
    } while (leads.some(lead => lead.code === code))
    const lead: Lead = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), referredBy, code, date: new Date().toISOString(), status: 'registered', color: avatarColors[leads.length % avatarColors.length] }
    setLeads(current => [lead, ...current])
    const activity: Activity = { id: crypto.randomUUID(), type: 'registration', name: lead.name, detail: referredBy ? 'Registered with a referral code' : 'Joined the referral program', time: 'Just now' }
    setActivities(current => [activity, ...current].slice(0, 30))
    return lead
  }

  async function copy(text: string, message = 'Copied to clipboard') {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else {
        const input = document.createElement('textarea')
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        input.remove()
      }
      setToast(message)
    } catch { setToast('Unable to access your clipboard. Please select and copy the text.') }
  }

  function exportLeads(items: Lead[]) {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
    const rows = [
      ['User Name', 'Email', 'Referral Code Used', 'Own Referral Code', 'Date Registered', 'Status'],
      ...items.map(lead => [lead.name, lead.email, lead.referredBy ?? '', lead.code, lead.date, lead.status]),
    ]
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `de-reality-spec-leads-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    setToast(`${items.length} leads exported successfully`)
  }

  return (
    <AppContext.Provider value={{ leads, activities, notify: setToast, setVerified, register, copy, exportLeads, adminName, setAdminName }}>
      {children}
      {toast && <div className="toast" role="status"><span className="toast-check"><Check size={16} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={16} /></button></div>}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
