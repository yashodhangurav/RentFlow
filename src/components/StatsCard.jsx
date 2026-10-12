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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </div>

          <div 
            className="tabular-nums dashboard-stats-value" 
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}
          >
            {value}
          </div>
        </div>

        {Icon && (
          <div className="dashboard-stats-icon" style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={16} color="var(--text-secondary)" />
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.65rem',
        paddingTop: '0.55rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.725rem',
        gap: '0.35rem'
      }}>
        <span className="dashboard-stats-subtext" style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtext}
        </span>

        {trend && (
          <div className="dashboard-stats-trend" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontWeight: '500',
            fontSize: '0.68rem',
            padding: '2px 5px',
            borderRadius: 'var(--radius-xs)',
            background: isPositive ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
            color: isPositive ? 'var(--status-success)' : 'var(--status-danger)',
            border: `1px solid ${isPositive ? 'var(--status-success-border)' : 'var(--status-danger-border)'}`,
            flexShrink: 0
          }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span className="tabular-nums">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};
