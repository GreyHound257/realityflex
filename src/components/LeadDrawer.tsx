"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Copy,
  GitFork,
  Info,
  Link2,
  Mail,
  ShieldCheck,
  UserPlus,
  UsersRound,
  X,
  ChevronRight
} from "lucide-react";
import { formatDate } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Avatar, Code, Dialog, EmptyState, StatusBadge, Toggle } from "./Ui";

export default function LeadDrawer({
  leadId,
  onClose,
  onSelect,
}: {
  leadId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const { buyers, referrers, setVerified, copy } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  
  const buyer = buyers.find((item) => item.id === leadId);
  const referrer = referrers.find((item) => item.id === leadId);

  if (!buyer && !referrer) return null;

  const lead = buyer || referrer;
  const isBuyer = !!buyer;
  const isReferrer = !!referrer;

  // Buyer-specific logic
  const parent = buyer ? referrers.find((item) => item.code === buyer.referredBy) : null;

  // Referrer-specific logic
  const children = referrer ? buyers.filter((item) => item.referredBy === referrer.code) : [];
  const verifiedChildren = children.filter((child) => child.status === "verified");

  return (
    <Dialog onClose={onClose} title={`${lead!.name}'s details`} sheet>
      <div className="sheet-top">
        <span>
          <UsersRound size={17} />
          {isBuyer ? "Buyer details" : "Referrer details"}
        </span>
        <button
          className="icon-button"
          aria-label="Close details"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>
      
      <div className="sheet-scroll">
        <div className="lead-profile">
          <Avatar lead={lead as any} size="large" />
          <div>
            <h2>{lead!.name}</h2>
            <a className="lead-email" href={`mailto:${lead!.email}`}>
              {lead!.email}
              <Mail size={13} />
            </a>
          </div>
          {isBuyer && <StatusBadge status={buyer.status} short />}
        </div>
        
        <div className="lead-meta">
          {isBuyer && (
            <>
              <span>
                <CalendarDays size={14} />
                Joined {formatDate(buyer.date)}
              </span>
              <span>
                <span className="live-dot" />
                Active buyer
              </span>
            </>
          )}
          {isReferrer && (
            <>
              <span>
                <GitFork size={14} />
                {children.length} total referrals
              </span>
              <span>
                <BadgeCheck size={14} style={{ color: "var(--green)" }} />
                {verifiedChildren.length} verified
              </span>
            </>
          )}
        </div>

        <div className="lead-information">
          <div>
            <span>Phone number</span>
            <strong>{lead!.phone}</strong>
          </div>
          
          {isReferrer && (
            <>
              <div>
                <span>Referral code</span>
                <Code>{referrer.code}</Code>
              </div>
              <div>
                <span>Referral link</span>
                <button 
                  className="text-button" 
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: 0 }}
                  onClick={() => {
                    copy(`${window.location.origin}/?ref=${referrer.code}`, 'Referral link copied');
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                >
                  {copiedLink ? <Check size={14} style={{ color: "var(--green)" }} /> : <Copy size={14} />}
                  <span style={{ fontSize: "14px", fontWeight: 600, color: copiedLink ? "var(--green)" : "inherit" }}>
                    {copiedLink ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>
            </>
          )}

          {isBuyer && (
            <>
              <div>
                <span>Referred by</span>
                {parent ? (
                  <button 
                    className="text-button" 
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: 0 }}
                    onClick={() => onSelect(parent.id)}
                  >
                    <Avatar
                      lead={{ name: parent.name, color: "blue" } as any}
                      size="small"
                    />
                    {parent.name}
                  </button>
                ) : (
                  <strong>Direct signup</strong>
                )}
              </div>
              <div>
                <span>Referral code used</span>
                {buyer.referredBy ? (
                  <Code muted>{buyer.referredBy}</Code>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>
              <div>
                <span>
                  <ShieldCheck size={15} />
                  Payment verified
                </span>
                <Toggle
                  checked={buyer.status === "verified"}
                  onChange={(value) => setVerified(buyer.id, value)}
                  label={`Verify payment for ${buyer.name}`}
                />
              </div>
            </>
          )}
        </div>

        {isReferrer && children.length > 0 && (
          <div className="lead-network">
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", margin: "24px 0 12px", fontWeight: "600" }}>People referred ({children.length})</h3>
            <div className="network-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {children.map(child => (
                <button 
                  key={child.id} 
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--purple-soft)", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                  onClick={() => onSelect(child.id)}
                  onMouseOver={(e) => e.currentTarget.style.background = "#d1e3f8"}
                  onMouseOut={(e) => e.currentTarget.style.background = "var(--purple-soft)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar lead={child as any} size="small" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)" }}>{child.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>{formatDate(child.date)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <StatusBadge status={child.status} short />
                    <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
      <div className="sheet-footer">
        <button className="button button-white" onClick={onClose}>
          Close details
        </button>
      </div>
    </Dialog>
  );
}
