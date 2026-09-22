"use client";

import { createContext, useContext, useEffect, useState, useTransition, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import { type Activity, type Buyer, type Referrer } from './data'
import { createReferrer, registerBuyer, verifyBuyer } from '@/actions'
import { useRouter } from 'next/navigation'

interface AppState {
  buyers: Buyer[]
  referrers: Referrer[]
  activities: Activity[]
  notify: (message: string) => void
  setVerified: (id: string, verified: boolean) => void
  createRef: (name: string, email: string, phone: string) => Promise<Referrer>
  register: (name: string, email: string, phone: string, referredBy: string | null) => Promise<Buyer>
  copy: (text: string, message?: string) => Promise<void>
  exportBuyers: (items: Buyer[]) => void
  exportReferrers: (items: Referrer[]) => void
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

export function AppProvider({ children, serverBuyers, serverReferrers, serverActivities }: { children: ReactNode, serverBuyers: Buyer[], serverReferrers: Referrer[], serverActivities: Activity[] }) {
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
      await verifyBuyer(id, verified)
      setToast(verified ? `Payment verified` : `Payment verification removed`)
    })
  }

  async function createRef(name: string, email: string, phone: string) {
    const referrer = await createReferrer(name, email, phone)
    return referrer as unknown as Referrer
  }

  async function register(name: string, email: string, phone: string, referredBy: string | null) {
    const buyer = await registerBuyer(name, email, phone, referredBy)
    return buyer as unknown as Buyer
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

  function exportBuyers(items: Buyer[]) {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
    const rows = [
      ['User Name', 'Email', 'Phone', 'Referral Code Used', 'Date Registered', 'Status'],
      ...items.map(buyer => [buyer.name, buyer.email, buyer.phone, buyer.referredBy ?? '', buyer.date, buyer.status]),
    ]
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `de-reality-spec-buyers-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    setToast(`${items.length} buyers exported successfully`)
  }

  function exportReferrers(items: Referrer[]) {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
    const rows = [
      ['Name', 'Email', 'Phone', 'Code'],
      ...items.map(referrer => [referrer.name, referrer.email, referrer.phone, referrer.code]),
    ]
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `de-reality-spec-referrers-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    setToast(`${items.length} referrers exported successfully`)
  }

  return (
    <AppContext.Provider value={{ buyers: serverBuyers, referrers: serverReferrers, activities: serverActivities, notify: setToast, setVerified, createRef, register, copy, exportBuyers, exportReferrers, adminName, setAdminName }}>
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
