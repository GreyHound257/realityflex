"use client";

import { useState } from 'react'
import { Bell, Check, ExternalLink, LockKeyhole, Mail, Settings2, ShieldCheck, UserRound } from 'lucide-react'
import Link from 'next/link'
import { Avatar, Toggle } from '@/components/Ui'
import { updateAdminSettings } from '@/actions' // Adjust path if needed

export default function Settings({ initialAdmin }: { initialAdmin: any }) {
  const [name, setName] = useState(initialAdmin?.name || '')
  const [email, setEmail] = useState(initialAdmin?.email || '')
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [digest, setDigest] = useState(true)

  async function handleAction(formData: FormData) {
    const adminId = initialAdmin?.id || "master-admin-id"; 
    await updateAdminSettings(adminId, formData);
    setPassword(''); 
    alert('Your workspace preferences have been saved securely to the database');
  }
  
  return (
    <form className="settings-layout" action={handleAction}>
      <div className="settings-main">
        <section className="settings-card">
          <div className="settings-section-heading">
            <span><UserRound size={19} /></span>
            <div>
              <h2>Your profile</h2>
              <p>The person behind the connections.</p>
            </div>
          </div>
          <div className="settings-avatar">
            <Avatar lead={{ name: name, color: 'lavender' }} size="large" />
            <div>
              <strong>Workspace administrator</strong>
              <p>Your initials are used as your profile avatar.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label>Full name
              <input name="name" required minLength={2} maxLength={80} value={name} onChange={event => setName(event.target.value)} />
            </label>
            <label>Email address
              <input name="email" type="email" required value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            <label>New Password
              <input name="newPassword" type="password" placeholder="Leave blank to keep current password" value={password} onChange={event => setPassword(event.target.value)} />
            </label>
          </div>
        </section>
        
        <section className="settings-card">
          <div className="settings-section-heading">
            <span><Bell size={19} /></span>
            <div>
              <h2>Stay in the loop</h2>
              <p>Choose the updates that matter to you.</p>
            </div>
          </div>
          <div className="settings-toggle-row">
            <div>
              <strong>New registration notifications</strong>
              <p>Keep a pulse on new members joining your community.</p>
            </div>
            <Toggle label="New registration notifications" checked={notifications} onChange={setNotifications} />
          </div>
          <div className="settings-toggle-row">
            <div>
              <strong>Weekly referral summary</strong>
              <p>A thoughtful roundup of your community’s progress.</p>
            </div>
            <Toggle label="Weekly referral summary" checked={digest} onChange={setDigest} />
          </div>
          <div className="info-note">
            <Mail size={15} />
            <span>UI preferences remain local. Profile details are saved to the database.</span>
          </div>
        </section>
        
        <div className="settings-save">
          <span><LockKeyhole size={14} />Your profile is encrypted and saved securely.</span>
          <button type="submit" className="button button-primary">
            <Check size={16} />Save changes
          </button>
        </div>
      </div>
      
      <aside className="settings-aside">
        <span className="large-feature-icon"><Settings2 size={24} /></span>
        <h3>A space built for growth.</h3>
        <p>You’re managing the De Reality Spec referral workspace.</p>
        <div><span>Workspace</span><strong>De Reality Spec</strong></div>
        <div><span>Your role</span><strong><ShieldCheck size={13} />Administrator</strong></div>
        <div><span>Environment</span><strong>Live Production</strong></div>
        <Link href="/" className="button button-white full-width">Preview registration<ExternalLink size={15} /></Link>
      </aside>
    </form>
  )
}