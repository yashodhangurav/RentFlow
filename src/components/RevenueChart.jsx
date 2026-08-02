import React, { useState } from 'react';
import { MONTHLY_REVENUE_DATA } from '../mock/initialData';
import { formatINR } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

export const RevenueChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = 100000;
  const chartHeight = 180;
  const chartWidth = 520;
  const paddingX = 45;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--accent-primary)" /> Monthly Rent Collection & Target Trends
          </h3>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Monthly collected revenue vs target budget (₹ INR)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span>
            Rent Collected (₹)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
            Target Budget
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} style={{ width: '100%', height: 'auto', minWidth: '450px' }}>
          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - ratio * chartHeight + 10;
            const val = Math.round(maxVal * ratio / 1000);
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2={chartWidth - 20} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <text x={paddingX - 8} y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end">
                  ₹{val}k
                </text>
              </g>
            );
          })}

          {/* Bar & Target Columns */}
          {MONTHLY_REVENUE_DATA.map((d, index) => {
            const step = (chartWidth - paddingX - 40) / (MONTHLY_REVENUE_DATA.length - 1);
            const x = paddingX + 20 + index * step;
            const barHeight = (d.collected / maxVal) * chartHeight;
            const targetY = chartHeight - (d.target / maxVal) * chartHeight + 10;
            const barY = chartHeight - barHeight + 10;
            const isHovered = hoveredIndex === index;

            return (
              <g 
                key={d.month}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Target marker line */}
                <line 
                  x1={x - 18} 
                  y1={targetY} 
                  x2={x + 18} 
                  y2={targetY} 
                  stroke="rgba(255, 255, 255, 0.4)" 
                  strokeWidth="2" 
                  strokeDasharray="2 2"
                />

                {/* Collected Bar */}
                <rect
                  x={x - 14}
                  y={barY}
                  width="28"
                  height={barHeight}
                  rx="6"
                  fill={isHovered ? 'url(#barGlow)' : 'var(--accent-primary)'}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Occupancy Indicator Dot */}
                <circle
                  cx={x}
                  cy={barY - 10}
                  r="4"
                  fill="var(--accent-success)"
                />

                {/* Month Label */}
                <text 
                  x={x} 
                  y={chartHeight + 30} 
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'} 
                  fontSize="11" 
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                >
                  {d.month}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 0.85rem',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.775rem',
            animation: 'fadeIn 0.15s ease'
          }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '3px' }}>
              {MONTHLY_REVENUE_DATA[hoveredIndex].month} 2026 Summary
            </div>
            <div>Collected: <strong style={{ color: 'var(--text-primary)' }}>{formatINR(MONTHLY_REVENUE_DATA[hoveredIndex].collected)}</strong></div>
            <div>Target: <strong style={{ color: 'var(--text-secondary)' }}>{formatINR(MONTHLY_REVENUE_DATA[hoveredIndex].target)}</strong></div>
            <div>Occupancy: <strong style={{ color: 'var(--accent-success)' }}>{MONTHLY_REVENUE_DATA[hoveredIndex].occupancy}%</strong></div>
          </div>
        )}
      </div>
    </div>
  );
};
