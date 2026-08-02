import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, User, ArrowRight, Edit, ShieldAlert } from 'lucide-react';

export const Maintenance = ({ maintenance = [], onOpenCreateTicket, onEditTicket, onMoveStatus }) => {
  const [priorityFilter, setPriorityFilter] = useState('All');

  const columns = [
    { id: 'New', title: 'New Requests', color: 'var(--accent-info)' },
    { id: 'In Progress', title: 'In Progress', color: 'var(--accent-warning)' },
    { id: 'Scheduled', title: 'Scheduled', color: 'var(--accent-primary)' },
    { id: 'Resolved', title: 'Resolved', color: 'var(--accent-success)' }
  ];

  const filteredItems = maintenance.filter(item => {
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Priority Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Emergency', 'High', 'Medium', 'Low'].map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className="btn btn-sm"
              style={{
                borderRadius: '20px',
                background: priorityFilter === pr ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: priorityFilter === pr ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {pr} Priority
            </button>
          ))}
        </div>

        <button 
          onClick={onOpenCreateTicket}
          className="btn btn-primary btn-sm"
          id="maint-create-ticket-btn"
        >
          <Plus size={16} /> Create Work Order Ticket
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {columns.map((col) => {
          const colItems = filteredItems.filter(item => item.status === col.id);

          return (
            <div key={col.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Column Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.65rem',
                borderBottom: '2px solid ' + col.color
              }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {col.title}
                </div>
                <span style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.725rem',
                  fontWeight: '700'
                }}>
                  {colItems.length}
                </span>
              </div>

              {/* Tickets Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: '200px' }}>
                {colItems.length === 0 ? (
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    No tickets in {col.title}
                  </div>
                ) : (
                  colItems.map((ticket) => (
                    <div key={ticket.id} style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform var(--transition-fast)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className={`badge ${
                          ticket.priority === 'Emergency' ? 'badge-danger' :
                          ticket.priority === 'High' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {ticket.priority}
                        </span>
                        <button
                          onClick={() => onEditTicket(ticket)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          <Edit size={14} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '0.875rem', fontWeight: '700', lineHeight: '1.3' }}>
                        {ticket.title}
                      </h4>

                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                        {ticket.unit} • {ticket.propertyName}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {ticket.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.725rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '0.5rem',
                        marginTop: '0.2rem'
                      }}>
                        <span>Vendor: <strong>{ticket.assignedVendor}</strong></span>
                        <strong style={{ color: 'var(--accent-success)' }}>{formatINR(ticket.costEstimate)}</strong>
                      </div>

                      {/* Move Status Buttons */}
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.25rem' }}>
                        {col.id !== 'New' && (
                          <button
                            onClick={() => onMoveStatus(ticket.id, columns[columns.findIndex(c => c.id === col.id) - 1].id)}
                            style={{ flex: 1, padding: '2px', fontSize: '0.675rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            ← Prev
                          </button>
                        )}
                        {col.id !== 'Resolved' && (
                          <button
                            onClick={() => onMoveStatus(ticket.id, columns[columns.findIndex(c => c.id === col.id) + 1].id)}
                            style={{ flex: 1, padding: '2px', fontSize: '0.675rem', background: 'var(--accent-primary)', border: 'none', color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
