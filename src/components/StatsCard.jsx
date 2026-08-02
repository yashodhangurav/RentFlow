import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color = 'var(--accent-primary)' }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Accent Soft Glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: color,
        opacity: 0.12,
        filter: 'blur(20px)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.35rem 0 0.2rem', letterSpacing: '-0.02em' }}>
            {value}
          </div>
        </div>

        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: `rgba(255, 255, 255, 0.04)`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${color}20`
        }}>
          {Icon && <Icon size={22} color={color} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.775rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{subtext}</span>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontWeight: '700',
            color: trend === 'up' ? 'var(--accent-success)' : 'var(--accent-danger)',
            background: trend === 'up' ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};
