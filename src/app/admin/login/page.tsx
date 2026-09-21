"use client";
import { useState, useEffect, FormEvent } from 'react'
import { Brand } from '@/components/Ui'
import { login, setupAdmin, checkNeedsSetup } from '@/actions/auth'
import { ArrowRight, ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [needsSetup, setNeedsSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    checkNeedsSetup().then(res => {
      setNeedsSetup(res)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    if (needsSetup && name.trim().length < 2) {
      setError('Name is required.')
      setSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      
      if (needsSetup) {
        formData.append('name', name)
        const res = await setupAdmin(formData)
        if (res?.error) setError(res.error)
      } else {
        const res = await login(formData)
        if (res?.error) setError(res.error)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="registration-page">
      <header className="registration-header">
        <Link href="/" aria-label="De Reality Spec home">
          <Brand />
        </Link>
        <div>
          <Link href="/" className="admin-link">
            <ArrowLeft size={14} />
            Back to registration
          </Link>
        </div>
      </header>
      <main className="registration-main">
        <section className="registration-story">
          <img src="/images/registration.jpg" alt="Architectural visual" style={{ filter: 'brightness(0.6)' }} />
          <div className="story-overlay" style={{ background: 'linear-gradient(to top, rgba(14, 79, 171, 0.9), transparent)' }} />
          <span className="story-top-label"><span />RESTRICTED ACCESS</span>
          <div className="story-content">
            <div className="story-star"><ShieldCheck size={28} strokeWidth={1.3} /></div>
            <h1>Secure.<br />Managed.<br /><em>Workspace.</em></h1>
            <p>De Reality Spec administrative portal. Authorized personnel only.</p>
            <div className="story-divider" />
            <div className="community-proof">
              <div>
                <strong>Operational Control.</strong>
                <span>Manage connections and verify records.</span>
              </div>
            </div>
          </div>
          <span className="story-bottom-label">SYSTEM AND NETWORK ADMINISTRATION.</span>
        </section>
        <section className="registration-form-section">
          <div className="registration-form-wrap">
            <div className="registration-stepper">
              <div className="registration-step step-active">
                <span><LockKeyhole size={14} /></span>
                <strong>{needsSetup ? 'Initial Setup' : 'Admin Login'}</strong>
              </div>
            </div>
            
            <span className="form-eyebrow">SECURE WORKSPACE</span>
            <h2>{needsSetup ? 'Create Master Account' : 'Welcome back'}</h2>
            <p className="registration-intro">
              {needsSetup 
                ? 'Your database is empty. Create the first administrator account.'
                : 'Enter your credentials to access the De Reality Spec admin workspace.'}
            </p>

            <form onSubmit={handleSubmit} className="registration-form">
              {needsSetup && (
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="form-input-wrap">
                    <input
                      id="name"
                      autoComplete="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <div className="form-input-wrap">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="form-input-wrap">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && <p className="form-error" style={{ color: 'var(--red)' }}>{error}</p>}
              
              <button 
                type="submit" 
                disabled={submitting} 
                className="button button-primary registration-submit"
                style={{ marginTop: '1rem' }}
              >
                {submitting 
                  ? 'Verifying...' 
                  : (needsSetup ? 'Create Admin' : 'Sign in to workspace')}
                <ArrowRight size={17} />
              </button>
            </form>
            
            <div className="registration-trust" style={{ marginTop: '2rem' }}>
              <ShieldCheck size={14} />
              <span>Restricted access area. Activities are logged.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
