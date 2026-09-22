"use client";

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronRight, X } from 'lucide-react'
import { initials, statusLabels, type Lead, type LeadStatus } from '@/lib/data'

export function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><img src="/images/logo.png" alt="De Reality Spec Logo" width={31} height={33} /></span><span>De Reality Spec Ltd<span className="brand-period">.</span></span></div>
}

export function Avatar({ lead, size = 'normal' }: { lead: Pick<Lead, 'name' | 'color'>; size?: 'small' | 'normal' | 'large' }) {
  return <span className={`avatar avatar-${lead.color} avatar-${size}`}>{initials(lead.name)}</span>
}

export function StatusBadge({ status, short = false }: { status: LeadStatus; short?: boolean }) {
  return <span className={`status-badge status-${status}`}><span className="status-dot" />{short ? status === 'verified' ? 'Verified' : status === 'pending' ? 'Pending' : 'Registered' : statusLabels[status]}</span>
}

export function Code({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <span className={`referral-code ${muted ? 'code-muted' : ''}`}>{children}</span>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" className={`toggle ${checked ? 'toggle-checked' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span>{checked && <Check size={10} strokeWidth={3} />}</span></button>
}

export function Dialog({ children, onClose, title, className = '', sheet = false }: { children: ReactNode; onClose: () => void; title: string; className?: string; sheet?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex="0"]') ?? []).filter(el => !el.hasAttribute('disabled'))
    focusable()[0]?.focus()
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current()
      if (event.key === 'Tab') {
        const elements = focusable()
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); previous?.focus() }
  }, [])

  const portalContent = <div className={`dialog-backdrop ${sheet ? 'sheet-backdrop' : ''}`} onClick={onClose}><div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`${sheet ? 'detail-sheet' : 'dialog'} ${className}`} onClick={event => event.stopPropagation()}>{children}</div></div>
  return typeof document !== 'undefined' ? createPortal(portalContent, document.body) : null
}

export function DialogHeader({ eyebrow, title, onClose }: { eyebrow?: string; title: string; onClose: () => void }) {
  return <div className="dialog-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>
}

export function EmptyState({ title = 'No leads found', description = 'Try a different search or adjust your filters.', onReset }: { title?: string; description?: string; onReset?: () => void }) {
  return <div className="empty-state"><div className="empty-orbit"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></div><h3>{title}</h3><p>{description}</p>{onReset && <button className="text-button" onClick={onReset}>Clear filters <ChevronRight size={15} /></button>}</div>
}
