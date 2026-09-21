"use client";
import { useState, useEffect, FormEvent } from 'react'
import { Brand } from '@/components/Ui'
import { login, setupAdmin, checkNeedsSetup } from '@/actions/auth'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'

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
    
    if (needsSetup) {
      if (name.trim().length < 2) {
        setError('Name is required.')
        setSubmitting(false)
        return
      }
      const res = await setupAdmin(name, email, password)
      if (res?.error) setError(res.error)
    } else {
      const res = await login(email, password)
      if (res?.error) setError(res.error)
    }
    setSubmitting(false)
  }

  if (loading) return null

  return (
    <div className="registration-page">
      <header className="registration-header">
        <Brand />
      </header>
      <main className="registration-main" style={{ justifyContent: 'center' }}>
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
                  <input
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
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
