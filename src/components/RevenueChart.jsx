import React, { useState } from 'react';
import { MONTHLY_REVENUE_DATA } from '../mock/initialData';
import { formatINR } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

export const RevenueChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxVal = 100000;
  const chartHeight = 160;
  const chartWidth = 520;
  const paddingX = 40;

  return (
    <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
            <TrendingUp size={16} color="var(--accent-primary)" /> Monthly Collection vs Budget
          </h3>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Historical rent collection performance against budgeted targets
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-primary)' }}></span>
            <span>Collected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--border-color-hover)' }}></span>
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`} style={{ width: '100%', height: 'auto', minWidth: '420px' }}>
          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - ratio * chartHeight + 10;
            const val = Math.round(maxVal * ratio / 1000);
            return (
              <g key={i}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={chartWidth - 15} 
                  y2={y} 
                  stroke="var(--border-color)" 
                  strokeDasharray="2 3" 
                  strokeWidth="1"
                />
                <text 
                  x={paddingX - 6} 
                  y={y + 3.5} 
                  fill="var(--text-muted)" 
                  fontSize="9.5" 
                  textAnchor="end"
                  className="tabular-nums"
                  style={{ fontFamily: 'inherit' }}
                >
                  ₹{val}k
                </text>
              </g>
            );
          })}

          {/* Bar & Target Columns */}
          {MONTHLY_REVENUE_DATA.map((d, index) => {
            const step = (chartWidth - paddingX - 35) / (MONTHLY_REVENUE_DATA.length - 1);
            const x = paddingX + 18 + index * step;
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
                {/* Target Marker Dash */}
                <line 
                  x1={x - 14} 
                  y1={targetY} 
                  x2={x + 14} 
                  y2={targetY} 
                  stroke="var(--text-muted)" 
                  strokeWidth="1.5" 
                  strokeDasharray="2 2"
                />

                {/* Collected Bar */}
                <rect
                  x={x - 11}
                  y={barY}
                  width="22"
                  height={barHeight}
                  rx="3"
                  fill={isHovered ? 'var(--accent-primary-hover)' : 'var(--accent-primary)'}
                  opacity={isHovered ? 1 : 0.88}
                  style={{ transition: 'all var(--transition-fast)' }}
                />

                {/* Month Label */}
                <text 
                  x={x} 
                  y={chartHeight + 26} 
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'} 
                  fontSize="10" 
                  fontWeight={isHovered ? '600' : '400'}
                  textAnchor="middle"
                  style={{ fontFamily: 'inherit' }}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.75rem',
            animation: 'fadeIn 0.12s ease-out'
          }}>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '3px' }}>
              {MONTHLY_REVENUE_DATA[hoveredIndex].month} 2026
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Collected: <strong className="tabular-nums" style={{ color: 'var(--accent-primary)' }}>{formatINR(MONTHLY_REVENUE_DATA[hoveredIndex].collected)}</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Target: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatINR(MONTHLY_REVENUE_DATA[hoveredIndex].target)}</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Occupancy: <strong className="tabular-nums" style={{ color: 'var(--status-success)' }}>{MONTHLY_REVENUE_DATA[hoveredIndex].occupancy}%</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
