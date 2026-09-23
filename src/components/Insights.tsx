"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  GitFork,
  Sparkles,
  Trophy,
  UserPlus,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { type Lead } from "@/lib/data";
import { Avatar } from "./Ui";

export function TopReferrers({
  onSelect,
  onViewAll,
  expanded = false,
}: {
  onSelect: (buyer: any) => void;
  onViewAll?: () => void;
  expanded?: boolean;
}) {
  const { referrers, buyers } = useApp();
  const ranked = referrers
    .map((referrer) => ({
      referrer,
      verified: buyers.filter(
        (child) =>
          child.referredBy === referrer.code && child.status === "verified",
      ).length,
      total: buyers.filter((child) => child.referredBy === referrer.code)
        .length,
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.verified - a.verified)
    .slice(0, expanded ? 12 : 3);
  const max = ranked[0]?.verified || 1;
  return (
    <section className="insight-card top-referrers">
      <div className="insight-heading">
        <h2>
          <Trophy size={17} />
          Top referrers
        </h2>
        {onViewAll && (
          <button className="text-button" onClick={onViewAll}>
            View network
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
      <p className="insight-subtitle">
        The people moving your community forward.
      </p>
      <div className="ranked-list">
        {ranked.map(({ referrer, verified, total }, index) => (
          <button key={referrer.id} className="ranked-item" onClick={() => onSelect(referrer)}>
            <span className={`rank-number rank-${index + 1}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <Avatar
              lead={{ name: referrer.name, color: "blue" } as any}
              size="small"
            />
            <span className="ranked-name">
              <strong>{referrer.name}</strong>
              <span>{total} total referrals</span>
            </span>
            <span className="ranked-progress">
              <span style={{ width: `${(verified / max) * 100}%` }} />
            </span>
            <span className="ranked-score">
              <strong>{verified} <span style={{ fontSize: '0.8em', color: 'var(--muted)', fontWeight: 'normal' }}>/ {total}</span></strong>
              <span>verified</span>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
      {expanded && (
        <div className="network-explainer">
          <GitFork size={18} />
          <span>Referrers with the most verified referrals.</span>
        </div>
      )}
    </section>
  );
}

export function RecentActivity({
  onViewAll,
  expanded = false,
}: {
  onViewAll?: () => void;
  expanded?: boolean;
}) {
  const { activities } = useApp();
  return (
    <section className="insight-card recent-activity">
      <div className="insight-heading">
        <h2>
          <span className="activity-heading-dot" />
          Recent activity
        </h2>
        {onViewAll && (
          <button className="text-button" onClick={onViewAll}>
            View all
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
      <p className="insight-subtitle">A little momentum, in real time.</p>
      <div className="activity-list">
        {activities.slice(0, expanded ? 20 : 3).map((activity) => (
          <div key={activity.id} className="activity-item">
            <span className={`activity-icon activity-${activity.type}`}>
              {activity.type === "verification" ? (
                <Check size={14} />
              ) : activity.type === "registration" ? (
                <UserPlus size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
            </span>
            <div>
              <strong>{activity.name}</strong>
              <p>{activity.detail}</p>
            </div>
            <time>{activity.time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NetworkBanner({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="network-banner">
      <div className="network-banner-art">
        <div className="network-center">
          <GitFork size={25} />
        </div>
        <span className="network-node node-1">
          <UserPlus size={12} />
        </span>
        <span className="network-node node-2">
          <Check size={12} />
        </span>
        <span className="network-node node-3">
          <Sparkles size={12} />
        </span>
      </div>
      <div>
        <span className="eyebrow">BETTER, TOGETHER</span>
        <h3>Your next great connection starts with a share.</h3>
        <p>
          Invite people to your community. Let meaningful referrals do the rest.
        </p>
      </div>
      <button className="button button-white" onClick={onInvite}>
        Share registration page
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export function ReferralChart() {
  const { buyers } = useApp();
  const groups = [1, 4, 7, 10, 13, 16, 19].map((start) => {
    const group = buyers.filter((buyer) => {
      const day = new Date(buyer.date).getDate();
      return day >= start && day < start + 3;
    });
    return {
      label: `Sep ${String(start).padStart(2, "0")}`,
      total: group.length,
      verified: group.filter(
        (buyer) => buyer.status === "verified" && buyer.referredBy,
      ).length,
    };
  });
  const max = Math.max(...groups.map((group) => group.total), 1);
  return (
    <section className="insight-card chart-card">
      <div className="insight-heading">
        <h2>Referrals over time</h2>
        <span className="count-pill">September 2026</span>
      </div>
      <p className="insight-subtitle">
        Registration and verified-referral activity at a glance.
      </p>
      <div className="chart-legend">
        <span>
          <i />
          Registered leads
        </span>
        <span>
          <i />
          Verified referrals
        </span>
      </div>
      <div className="bar-chart">
        {groups.map((group) => (
          <div className="chart-group" key={group.label}>
            <div className="chart-bars">
              <div
                className="chart-bar chart-bar-total"
                style={{ height: `${Math.max((group.total / max) * 100, 2)}%` }}
                title={`${group.total} registrations`}
              >
                <span>{group.total}</span>
              </div>
              <div
                className="chart-bar chart-bar-verified"
                style={{
                  height: `${Math.max((group.verified / max) * 100, 2)}%`,
                }}
                title={`${group.verified} verified referrals`}
              >
                <span>{group.verified}</span>
              </div>
            </div>
            <span className="chart-label">{group.label}</span>
          </div>
        ))}
      </div>
      <div className="chart-footer">
        <BadgeCheck size={15} />
        Only payment-verified referrals contribute to the referral score.
      </div>
    </section>
  );
}
