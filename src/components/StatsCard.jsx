import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'var(--text-primary)' 
}) => {
  const isPositive = trend === 'up';

  return (
    <div className="fintech-card dashboard-stats-card">
      {/* Top Header: Title & Icon */}
      <div className="dashboard-stats-header">
        <span className="dashboard-stats-title" title={title}>
          {title}
        </span>
        {Icon && (
          <div className="dashboard-stats-icon">
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Middle: Number / Metric Baseline-Locked Row */}
      <div className="dashboard-stats-body">
        <div 
          className="tabular-nums dashboard-stats-value"
          style={{ color: color !== 'var(--text-primary)' ? color : 'var(--text-primary)' }}
        >
          {value}
        </div>
      </div>

      {/* Bottom Footer: Subtext & Trend Badge */}
      <div className="dashboard-stats-footer">
        <span className="dashboard-stats-subtext" title={subtext}>
          {subtext}
        </span>

        {trend && (
          <div 
            className="dashboard-stats-trend"
            style={{
              background: isPositive ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
              color: isPositive ? 'var(--status-success)' : 'var(--status-danger)',
              border: `1px solid ${isPositive ? 'var(--status-success-border)' : 'var(--status-danger-border)'}`
            }}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span className="tabular-nums">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};
