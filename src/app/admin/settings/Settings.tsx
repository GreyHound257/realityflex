"use client";

import { useState, type FormEvent } from 'react'
import { Bell, Check, ExternalLink, LockKeyhole, Mail, Settings2, ShieldCheck, UserRound } from 'lucide-react'
import Link from 'next/link'
import { Avatar, Toggle } from '@/components/Ui'
import { useApp } from '@/lib/store'

export default function Settings() {
  const { adminName, setAdminName, notify } = useApp()
  const [name, setName] = useState(adminName)
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('drs-admin-email') || 'alex@derealityspec.com'
    }
    return 'alex@derealityspec.com'
  })
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('drs-notifications') !== 'false'
    }
    return true
  })
  const [digest, setDigest] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('drs-digest') !== 'false'
    }
    return true
  })
  
  function save(event: FormEvent) {
    event.preventDefault()
    setAdminName(name.trim())
    localStorage.setItem('drs-admin-email', email)
    localStorage.setItem('drs-notifications', String(notifications))
    localStorage.setItem('drs-digest', String(digest))
    notify('Your workspace preferences have been saved')
  }
  
  return <form className="settings-layout" onSubmit={save}><div className="settings-main"><section className="settings-card"><div className="settings-section-heading"><span><UserRound size={19} /></span><div><h2>Your profile</h2><p>The person behind the connections.</p></div></div><div className="settings-avatar"><Avatar lead={{ name: name || adminName, color: 'lavender' }} size="large" /><div><strong>Workspace administrator</strong><p>Your initials are used as your profile avatar.</p></div></div><div className="settings-fields"><label>Full name<input required minLength={2} maxLength={80} value={name} onChange={event => setName(event.target.value)} /></label><label>Email address<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label></div></section><section className="settings-card"><div className="settings-section-heading"><span><Bell size={19} /></span><div><h2>Stay in the loop</h2><p>Choose the updates that matter to you.</p></div></div><div className="settings-toggle-row"><div><strong>New registration notifications</strong><p>Keep a pulse on new members joining your community.</p></div><Toggle label="New registration notifications" checked={notifications} onChange={setNotifications} /></div><div className="settings-toggle-row"><div><strong>Weekly referral summary</strong><p>A thoughtful roundup of your community’s progress.</p></div><Toggle label="Weekly referral summary" checked={digest} onChange={setDigest} /></div><div className="info-note"><Mail size={15} /><span>Preferences are saved locally. Email notifications will be available when an email service is connected.</span></div></section><div className="settings-save"><span><LockKeyhole size={14} />Your preferences are saved on this device.</span><button type="submit" className="button button-primary"><Check size={16} />Save changes</button></div></div><aside className="settings-aside"><span className="large-feature-icon"><Settings2 size={24} /></span><h3>A space built for growth.</h3><p>You’re managing the De Reality Spec referral workspace.</p><div><span>Workspace</span><strong>De Reality Spec</strong></div><div><span>Your role</span><strong><ShieldCheck size={13} />Administrator</strong></div><div><span>Environment</span><strong>Interactive demo</strong></div><Link href="/" className="button button-white full-width">Preview registration<ExternalLink size={15} /></Link><p className="settings-demo-note">This is a frontend prototype. Private access controls and email delivery are not connected to a backend.</p></aside></form>
}
