import React from 'react';
import useCountUp from '@/hooks/useCountUp';

interface StatCardProps {
  label: string;
  targetValue: number;
  suffix?: string;
  decimals?: boolean;
  subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, targetValue, suffix = '', decimals = false, subtext }) => {
  const animatedValue = useCountUp(targetValue * (decimals ? 10 : 1), 2000);
  const displayValue = decimals ? (animatedValue / 10).toFixed(1) : animatedValue;

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 text-left">
      <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">
        {label}
      </span>
      <div className="text-3xl font-extrabold text-white tracking-tight">
        {displayValue}
        {suffix}
      </div>
      <p className="mt-1 text-xs text-brand-muted/70">{subtext}</p>
    </div>
  );
};

export const StatsSection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Strategic Reserve Remaining"
        targetValue={74}
        suffix=" Days"
        subtext="Total cover based on current consumption rates"
      />
      <StatCard
        label="Active Fleet Tracked"
        targetValue={28}
        suffix=" Vessels"
        subtext="Vessels currently transit ocean logistics corridors"
      />
      <StatCard
        label="Refinery Capacity"
        targetValue={92.6}
        suffix="%"
        decimals={true}
        subtext="Weighted average across 7 national refineries"
      />
      <StatCard
        label="Supply Chain Integrity"
        targetValue={98.4}
        suffix="%"
        decimals={true}
        subtext="Real-time security threat assessment level"
      />
    </section>
  );
};

export default StatsSection;
