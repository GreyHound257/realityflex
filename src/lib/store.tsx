"use client";

import { createContext, useContext, useEffect, useState, useTransition, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { type Activity, type Lead } from './data'
import { registerLead, verifyLead } from '@/actions'
import { useRouter } from 'next/navigation'

interface AppState {
  leads: Lead[]
  activities: Activity[]
  notify: (message: string) => void
  setVerified: (id: string, verified: boolean) => void
  register: (name: string, email: string, referredBy: string | null) => Promise<Lead>
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

export function AppProvider({ children, serverLeads, serverActivities }: { children: ReactNode, serverLeads: Lead[], serverActivities: Activity[] }) {
  const [isClient, setIsClient] = useState(false)
  const [adminName, setAdminName] = useState('Alex Morgan')
  const [toast, setToast] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    setAdminName(readStored('drs-admin-name', 'Alex Morgan'))
  }, [])

  useEffect(() => { if (isClient) localStorage.setItem('drs-admin-name', JSON.stringify(adminName)) }, [adminName, isClient])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  function setVerified(id: string, verified: boolean) {
    startTransition(async () => {
      await verifyLead(id, verified)
      setToast(verified ? `Payment verified` : `Payment verification removed`)
    })
  }

  async function register(name: string, email: string, referredBy: string | null) {
    const lead = await registerLead(name, email, referredBy)
    return lead as unknown as Lead
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
    <AppContext.Provider value={{ leads: serverLeads, activities: serverActivities, notify: setToast, setVerified, register, copy, exportLeads, adminName, setAdminName }}>
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
