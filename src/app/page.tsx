"use client";

import { useState, useEffect, Suspense, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCheck,
  ChevronRight,
  Copy,
  HeartHandshake,
  Info,
  Italic,
  Link2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Brand, Dialog, DialogHeader } from "@/components/Ui";
import { useApp } from "@/lib/store";
import type { Lead } from "@/lib/data";

function RegistrationContent() {
  const { leads, register, copy, notify } = useApp();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(
    searchParams.get("ref-code")?.toUpperCase() || "",
  );
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);
  const [registered, setRegistered] = useState<Lead | null>(null);
  const [modal, setModal] = useState<
    "about" | "privacy" | "terms" | "email" | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [referrer, setReferrer] = useState<{
    name: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    const code = referralCode.trim();
    if (code.length >= 4) {
      import("@/actions").then((m) =>
        m.lookupReferralCode(code).then((res) => setReferrer(res)),
      );
    } else {
      setReferrer(null);
    }
  }, [referralCode]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  async function continueDetails(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g., name@example.com).");
      setSubmitting(false);
      return;
    }

    const domain = email.split("@")[1]?.toLowerCase();
    const typoDomains: Record<string, string> = {
      "gmaia.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmal.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "yahooo.com": "yahoo.com",
      "yaho.co.uk": "yahoo.co.uk",
      "hotmai.com": "hotmail.com",
      "hotmal.com": "hotmail.com",
      "outloo.com": "outlook.com",
    };
    if (domain && typoDomains[domain]) {
      setError(
        `Did you mean @${typoDomains[domain]}? Please check your email.`,
      );
      setSubmitting(false);
      return;
    }

    const { checkEmailExists } = await import("@/actions");
    const exists = await checkEmailExists(email);
    if (exists) {
      setError(
        "This email is already registered. Please use a different email address.",
      );
      setSubmitting(false);
      return;
    }
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      setSubmitting(false);
      return;
    }
    setError("");
    setStep(2);
    setSubmitting(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!referralCode.trim()) {
      setWarning(true);
      return;
    }
    if (!referrer) {
      setError(
        "We couldn’t find this referral code. Please double-check it, or leave the field empty to continue without one.",
      );
      return;
    }
    finishRegistration(referralCode.trim());
  }

  async function finishRegistration(code: string | null) {
    if (submitting) return;
    setSubmitting(true);
    setWarning(false);
    const lead = await register(name, email, code);
    setRegistered(lead);
    setStep(3);
    setError("");
    setSubmitting(false);
  }

  function startAgain() {
    setName("");
    setEmail("");
    setReferralCode("");
    setRegistered(null);
    setStep(1);
    setError("");
  }

  return (
    <div className="registration-page">
      <header className="registration-header">
        <Link href="/" aria-label="De Reality Spec home">
          <Brand />
        </Link>
        <div>
          <button
            className="registration-about-link"
            onClick={() => setModal("about")}
          >
            How it works
          </button>
          <span className="header-divider" />
          <Link href="/admin/dashboard" className="admin-link">
            <LockKeyhole size={14} />
            Admin workspace
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <main className="registration-main">
        <section className="registration-story">
          <img
            src="/images/registration.jpg"
            alt="Sculptural white residential architecture with elegant curved balconies"
          />
          <div className="story-overlay" />
          <span className="story-top-label">
            <span />A COMMUNITY OF POSSIBILITIES
          </span>
          <div className="story-content">
            <div className="story-star">
              <Sparkles size={28} strokeWidth={1.3} />
            </div>
            <h1>
              A new place.
              <br />A fresh perspective.
              <br />
              <em>A shared beginning.</em>
            </h1>
            <p>
              Extraordinary opportunities start with the right connections. Your
              next chapter begins here.
            </p>
            <div className="story-divider" />
            <div className="community-proof">
              <div className="avatar-stack">
                <span>OR</span>
                <span>PB</span>
                <span>LS</span>
                <span>+</span>
              </div>
              <div>
                <strong>Good people. Real possibilities.</strong>
                <span>Be part of a growing community.</span>
              </div>
            </div>
          </div>
          <span className="story-bottom-label">
            THOUGHTFULLY CONNECTED. BEAUTIFULLY REWARDED.
          </span>
        </section>
        <section
          className={`registration-form-section ${step === 3 ? "success-form-section" : ""}`}
        >
          <div className="registration-form-wrap">
            <div
              className="registration-stepper"
              aria-label={`Registration step ${step} of 3`}
            >
              {["Your details", "Your connection", "You’re in"].map(
                (label, index) => (
                  <div
                    key={label}
                    className={`registration-step ${step === index + 1 ? "step-active" : ""} ${step > index + 1 ? "step-complete" : ""}`}
                  >
                    <span>
                      {step > index + 1 ? (
                        <Check size={12} strokeWidth={2.5} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <strong>{label}</strong>
                    {index < 2 && <i />}
                  </div>
                ),
              )}
            </div>
            {step === 1 && (
              <>
                <span className="form-eyebrow">
                  YOUR NEXT CHAPTER STARTS HERE
                </span>
                <h2>
                  A little introduction.
                  <br />A world of possibilities.
                </h2>
                <p className="registration-intro">
                  Join De Reality Spec Ltd. for thoughtfully selected real estate
                  opportunities. Let’s start with you.
                </p>
                <form onSubmit={continueDetails} className="registration-form">
                  <label className="field-label" htmlFor="full-name">
                    Full name<span>*</span>
                  </label>
                  <div className="form-input-wrap">
                    <UserRound size={17} />
                    <input
                      id="full-name"
                      autoComplete="name"
                      placeholder="Your first and last name"
                      required
                      maxLength={80}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setError("");
                      }}
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
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                    />
                  </div>
                  <p className="field-hint">
                    We’ll send your offer details and next steps here.
                  </p>
                  {error && (
                    <p className="form-error" role="alert">
                      <Info size={15} />
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="button button-primary registration-submit"
                  >
                    Let’s get started
                    <ArrowRight size={17} />
                  </button>
                </form>
                <p className="registration-terms">
                  By continuing, you agree to our{" "}
                  <button onClick={() => setModal("terms")}>
                    Terms of participation
                  </button>{" "}
                  and{" "}
                  <button onClick={() => setModal("privacy")}>
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
              </>
            )}
            {step === 2 && (
              <>
                <button
                  className="back-step"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to your details
                </button>
                <span className="form-eyebrow">
                  GREAT THINGS ARE BETTER SHARED
                </span>
                <h2>
                  Did a connection
                  <br />
                  bring you here?
                </h2>
                <p className="registration-intro">
                  Give them a little credit. Add their referral code so we can
                  connect the dots.
                </p>
                <div className="registration-review">
                  <span className="review-avatar">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <strong>{name}</strong>
                    <span>{email}</span>
                  </div>
                  <button onClick={() => setStep(1)}>Edit</button>
                </div>
                <form onSubmit={submit} className="registration-form">
                  <div className="referral-input-panel">
                    <div className="referral-input-heading">
                      <span>
                        <Link2 size={16} />
                        Your referral code
                      </span>
                      <span className="optional-badge">Optional</span>
                    </div>
                    <input
                      className="referral-code-input"
                      aria-label="Referral Code"
                      placeholder="e.g. RF3-AWZ3"
                      maxLength={8}
                      value={referralCode}
                      onChange={(event) => {
                        setReferralCode(
                          event.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9-]/g, ""),
                        );
                        setError("");
                      }}
                      autoComplete="off"
                    />
                    {referrer ? (
                      <p className="referral-match">
                        <CheckCheck size={14} />
                        You’re connected with {referrer.name}.
                      </p>
                    ) : (
                      <p>
                        Received a code from a friend? This is the place for it.
                      </p>
                    )}
                  </div>
                  <div className="no-code-note">
                    <HeartHandshake size={19} />
                    <p>
                      No code? You’re still very welcome.
                      <br />
                      <span>
                        You can join our community without a referral.
                      </span>
                    </p>
                  </div>
                  {error && (
                    <p className="form-error" role="alert">
                      <Info size={15} />
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button button-primary registration-submit"
                  >
                    {submitting
                      ? "Creating your account…"
                      : "Complete registration"}
                    <ArrowRight size={17} />
                  </button>
                </form>
                <div className="registration-trust">
                  <LockKeyhole size={14} />
                  <span>No payment required to register your interest.</span>
                </div>
              </>
            )}
            {step === 3 && registered && (
              <div className="registration-success">
                <div className="success-mark">
                  <Check size={32} strokeWidth={1.6} />
                  <span>
                    <Sparkles size={15} />
                  </span>
                </div>
                <span className="form-eyebrow">
                  A WARM WELCOME TO DE REALITY SPEC
                </span>
                <h2>
                  You’re in, {registered.name.split(" ")[0]}
                  <span className="purple-text">.</span>
                </h2>
                <p className="registration-intro">
                  Here’s to your next chapter — and the people you’ll bring
                  along for the journey.
                </p>
                <div className="success-code-card">
                  <div>
                    <Link2 size={17} />
                    <span>YOUR UNIQUE REFERRAL CODE</span>
                  </div>
                  <strong>{registered.code}</strong>
                  <button
                    onClick={() =>
                      copy(registered.code, "Your referral code is copied")
                    }
                  >
                    <Copy size={14} />
                    Copy code
                  </button>
                  <p>A little code. A whole world of connections.</p>
                </div>
                <div className="next-steps">
                  <h3>Let’s lock in your offer.</h3>
                  <div>
                    <span>1</span>
                    <p>
                      <strong>Check your inbox</strong>
                      <span>
                        Look for your confirmation email at{" "}
                        <b>{registered.email}. </b><i>Check your spam if you don't see it in your inbox</i>.
                      </span>
                    </p>
                  </div>
                  <div>
                    <span>2</span>
                    <p>
                      <strong>Confirm your interest</strong>
                      <span>
                        Follow the instructions in your email to secure the next
                        steps for your offer.
                      </span>
                    </p>
                  </div>
                  <div>
                    <span>3</span>
                    <p>
                      <strong>Share the possibilities</strong>
                      <span>
                        Invite friends with your code. Every verified referral
                        counts.
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  className="button button-primary registration-submit"
                  onClick={() =>
                    copy(
                      `${baseUrl}/?ref=${registered.code}`,
                      "Your personal referral link is copied",
                    )
                  }
                >
                  <Link2 size={16} />
                  Copy my referral link
                  <ArrowUpRight size={16} />
                </button>
                <button className="start-again-button" onClick={startAgain}>
                  Register another person
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
          <div className="registration-form-footer">
            <span>REAL ESTATE. REAL CONNECTIONS.</span>
            <span>De Reality Spec Ltd. © 2026</span>
          </div>
        </section>
      </main>
      {warning && (
        <Dialog
          title="Proceed without a referral code?"
          onClose={() => setWarning(false)}
          className="warning-dialog"
        >
          <DialogHeader
            title="A quick check before you go."
            onClose={() => setWarning(false)}
          />
          <span className="warning-feature-icon">
            <Link2 size={26} />
          </span>
          <h3>Are you sure you want to proceed without a referral code?</h3>
          <p>
            You’re welcome to join without one. If a friend invited you, adding
            their code now makes sure they receive credit for your connection.
          </p>
          <div className="warning-actions">
            <button
              className="button button-primary full-width"
              onClick={() => setWarning(false)}
            >
              Go back & add a code
              <ArrowLeft size={15} />
            </button>
            <button
              className="button button-white full-width"
              onClick={() => finishRegistration("RF3-ORG1")}
            >
              Proceed Without Code
              <ArrowRight size={15} />
            </button>
          </div>
        </Dialog>
      )}
      {modal && (
        <Dialog
          title={
            modal === "email"
              ? "Confirmation email preview"
              : modal === "about"
                ? "How it works"
                : modal === "privacy"
                  ? "Privacy policy"
                  : "Terms of participation"
          }
          onClose={() => setModal(null)}
          className={`public-info-dialog ${modal === "email" ? "email-dialog" : ""}`}
        >
          <DialogHeader
            title={
              modal === "email"
                ? "A good thing in your inbox."
                : modal === "about"
                  ? "Connections make a difference."
                  : modal === "privacy"
                    ? "Your privacy matters."
                    : "A shared understanding."
            }
            eyebrow={
              modal === "email"
                ? "CONFIRMATION EMAIL · PREVIEW"
                : "DE REALITY SPEC"
            }
            onClose={() => setModal(null)}
          />
          {modal === "about" && (
            <div className="public-info-content">
              <span className="large-feature-icon">
                <HeartHandshake size={28} />
              </span>
              <h3>A simple path to something new.</h3>
              <p>
                Register your interest in real estate opportunities and become
                part of a community built on meaningful connections.
              </p>
              <ol>
                <li>
                  <strong>Tell us a little about yourself.</strong> Your name
                  and email are all you need to begin.
                </li>
                <li>
                  <strong>Recognize your connection.</strong> Use a friend’s
                  referral code, or join without one.
                </li>
                <li>
                  <strong>Share your own possibilities.</strong> Receive a
                  personal code and invite others. Only referrals with verified
                  payments count toward your total.
                </li>
              </ol>
            </div>
          )}
          {modal === "privacy" && (
            <div className="public-info-content">
              <h3>Your privacy matters.</h3>
              <p>
                We securely store your registration details and referral relationships to provide you with the best experience. 
                Your information is safely recorded in our database and will only be used to process your registration and manage referrals.
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
                By proceeding, you agree to our terms of participation. An email confirming your interest will be sent to your provided address.
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

export default function Registration() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
      }
    >
      <RegistrationContent />
    </Suspense>
  );
}
