"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Copy, HeartHandshake, Link2, Mail, ShieldCheck, Sparkles, UserRound, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Brand, Dialog, DialogHeader } from "@/components/Ui";
import { useApp } from "@/lib/store";
import type { Referrer } from "@/lib/data";

function ReferrerRegistrationContent() {
  const { createRef, copy } = useApp();
  const [mobileView, setMobileView] = useState<"story" | "form">("story");
  const [modal, setModal] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState<Referrer | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    
    try {
      const newReferrer = await createRef(name, email, phone);
      setRegistered(newReferrer);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. This email might already be registered.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopy() {
    if (!registered) return;
    const link = `${window.location.origin}/?ref=${registered.code}`;
    copy(link, "Referral link copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="registration-page">
      <header className="registration-header">
        <Brand />
        <div>
          <Link href="/" className="admin-link">
            Buyer registration
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <main className="registration-main" data-mobile-view={mobileView}>
        <section className="registration-story story-text-layout" style={{ background: "linear-gradient(135deg, #0b1a30 0%, #060e1c 100%)" }}>
          <div className="story-text-content">
            <div className="story-pill" style={{ background: "rgba(11, 102, 194, 0.2)", color: "#99ccff", border: "1px solid rgba(11, 102, 194, 0.4)" }}>
              <Sparkles size={16} style={{ color: "#4da6ff" }} />
              <span>REWARDS PROGRAM</span>
            </div>
            <h1 style={{ color: "#ffffff", fontWeight: "800", fontSize: "44px", letterSpacing: "-1.5px", marginBottom: "-12px", lineHeight: "1.1" }}>
              <span style={{ color: "#4da6ff" }}>OWN</span> & REFER
            </h1>
            <h2 style={{ fontSize: "24px", color: "rgba(255,255,255,0.9)", fontWeight: "600", letterSpacing: "-0.5px" }}>
              REFER. EARN. SHOP. CELEBRATE.
            </h2>
            <p className="story-description" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
              You already started your land ownership journey. Now help someone you know start theirs and get rewarded!
            </p>
            
            <div className="story-features">
              <div className="story-feature">
                <div className="feature-icon-box" style={{ background: "rgba(11, 102, 194, 0.15)", color: "#4da6ff" }}>
                  <BadgeCheck size={20} />
                </div>
                <div className="feature-text">
                  <strong style={{ color: "#4da6ff" }}>1 SUCCESSFUL REFERRAL</strong>
                  <span>₦20,000 Cash Reward</span>
                </div>
              </div>
              
              <div className="story-feature">
                <div className="feature-icon-box" style={{ background: "rgba(11, 102, 194, 0.15)", color: "#4da6ff" }}>
                  <BadgeCheck size={20} />
                </div>
                <div className="feature-text">
                  <strong style={{ color: "#4da6ff" }}>3 SUCCESSFUL REFERRALS</strong>
                  <span>₦70,000 Total Cash Reward + ₦20,000 Shopping Experience!</span>
                </div>
              </div>
              
              <div className="story-feature">
                <div className="feature-icon-box" style={{ background: "rgba(11, 102, 194, 0.15)", color: "#4da6ff" }}>
                  <BadgeCheck size={20} />
                </div>
                <div className="feature-text">
                  <strong style={{ color: "#4da6ff" }}>5 SUCCESSFUL REFERRALS</strong>
                  <span>₦125,000 Total Cash Reward + ₦40,000 Shopping Experience!</span>
                </div>
              </div>
            </div>
            
            <button 
              className="button button-primary mobile-only mobile-nav-btn" 
              onClick={() => {
                setMobileView("form");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Get started
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="story-text-footer">
            <span>08079058878</span>
            <span><strong style={{ opacity: 0.5, fontWeight: 400 }}>Follow us:</strong> DEREALITYSPEC</span>
          </div>
        </section>
        
        <section className={`registration-form-section ${registered ? "success-form-section" : ""}`}>
          <div className="registration-form-wrap">
            <button 
              className="mobile-back-btn mobile-only" 
              onClick={() => {
                setMobileView("story");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            {registered ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "var(--green-soft)", color: "var(--green)", marginBottom: "24px" }}>
                  <BadgeCheck size={48} />
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>You&apos;re all set, {registered.name.split(" ")[0]}!</h2>
                <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
                  You are now an official advocate for Reality Flex 3.0. Share your unique link below, and you&apos;ll earn rewards for every successful referral.
                </p>
                
                <div style={{ textAlign: "left", marginBottom: "32px" }}>
                  <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", color: "var(--muted)", marginBottom: "8px" }}>Your Personal Link</span>
                  <div className="copy-input" style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "white" }}>
                    <input 
                      readOnly 
                      value={`${window.location.origin}/?ref=${registered.code}`} 
                      style={{ flex: 1, padding: "12px 16px", border: "none", outline: "none", fontSize: "15px", background: "transparent", color: "var(--text-primary)" }}
                    />
                    <button 
                      onClick={handleCopy}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 20px", height: "100%", background: copied ? "var(--green)" : "var(--brand-primary)", color: "white", border: "none", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="info-note" style={{ textAlign: "left", marginBottom: "32px" }}>
                  <ShieldCheck size={18} />
                  <span>Anyone who registers via this link will automatically be attributed to you.</span>
                </div>

                <Link href="/" className="button button-secondary full-width" style={{ justifyContent: "center" }}>
                  Preview buyer registration page
                </Link>
              </div>
            ) : (
              <>
                <span className="form-eyebrow">
                  <HeartHandshake size={14} /> BECOME AN ADVOCATE
                </span>
                <h2>Help others start their journey.</h2>
                <p className="registration-intro">
                  Join our network of referrers. Connect people to Reality Flex 3.0 and earn exciting rewards for every successful subscription.
                </p>

                <form onSubmit={submit} className="registration-form">
                  <label className="field-label" htmlFor="full-name">
                    Full name<span>*</span>
                  </label>
                  <div className="form-input-wrap">
                    <UserRound size={17} />
                    <input
                      id="full-name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <label className="field-label" htmlFor="email-address">
                    Email address<span>*</span>
                  </label>
                  <div className="form-input-wrap">
                    <Mail size={17} />
                    <input
                      id="email-address"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <label className="field-label" htmlFor="phone-number">
                    Phone number (WhatsApp)<span>*</span>
                  </label>
                  <div className="form-input-wrap">
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#698cbb", marginRight: "4px" }}>+234</span>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      placeholder="800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="button button-primary full-width" style={{ marginTop: "24px" }} disabled={submitting}>
                    {submitting ? "Generating code..." : "Get my referral code"}
                    {!submitting && <ArrowRight size={15} />}
                  </button>
                  
                  <p className="registration-terms">
                    By continuing, you agree to our{" "}
                    <button type="button" onClick={() => setModal("terms")}>
                      Terms of participation
                    </button>{" "}
                    and{" "}
                    <button type="button" onClick={() => setModal("privacy")}>
                      Privacy policy
                    </button>
                    .
                  </p>
                  <div className="registration-trust">
                    <ShieldCheck size={16} />
                    <span>
                      A thoughtful community. Your information, protected.
                    </span>
                  </div>
                </form>
              </>
            )}
            
            <div className="registration-form-footer">
              <span>REAL ESTATE. REAL CONNECTIONS.</span>
              <span>De Reality Spec Ltd. &copy; 2026</span>
            </div>
          </div>
        </section>
      </main>

      {modal && (
        <Dialog
          title={
            modal === "privacy"
              ? "Privacy policy"
              : "Terms of participation"
          }
          onClose={() => setModal(null)}
          className="public-info-dialog"
        >
          <DialogHeader
            title={
              modal === "privacy"
                ? "Your privacy matters."
                : "A shared understanding."
            }
            eyebrow="DE REALITY SPEC"
            onClose={() => setModal(null)}
          />
          {modal === "privacy" && (
            <div className="public-info-content">
              <h3>Your privacy matters.</h3>
              <p>
                We securely store your registration details and referral relationships to provide you with the best 
experience. 
                Your information is safely recorded in our database and will only be used to process your 
registration and manage referrals.
              </p>
              <p>
                Names, email addresses, personal referral codes, and
                payment-verification states are strictly accessible only by authorized administrators.
              </p>
              <div className="info-note">
                <ShieldCheck size={17} />
                <span>
                  Your data is securely stored and authenticated.
                </span>
              </div>
            </div>
          )}
          {modal === "terms" && (
            <div className="public-info-content">
              <h3>Made for an open, fair community.</h3>
              <p>
                Registration expresses your interest and does not constitute a
                purchase, payment, or guarantee of a property offer.
              </p>
              <p>
                A valid referral code connects your registration to the person
                who invited you. Each member receives a unique code after
                registering.
              </p>
              <p>
                Referral scores count only leads whose payment has been verified
                by an administrator. Registering alone does not increase a
                referrer's verified score.
              </p>
              <p>
                By proceeding, you agree to our terms of participation. An email confirming your interest will be 
sent to your provided address.
              </p>
            </div>
          )}
          <button
            className="button button-primary full-width"
            onClick={() => setModal(null)}
          >
            Got it
            <Check size={16} />
          </button>
        </Dialog>
      )}
    </div>
  );
}

export default function ReferrerRegistration() {
  return <ReferrerRegistrationContent />;
}
