import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { Plus, ArrowRight, Edit } from 'lucide-react';

export const Maintenance = ({ maintenance = [], onOpenCreateTicket, onEditTicket, onMoveStatus }) => {
  const [priorityFilter, setPriorityFilter] = useState('All');

  const columns = [
    { id: 'New', title: 'New Requests', color: 'var(--status-info)' },
    { id: 'In Progress', title: 'In Progress', color: 'var(--status-warning)' },
    { id: 'Scheduled', title: 'Scheduled', color: 'var(--accent-primary)' },
    { id: 'Resolved', title: 'Resolved', color: 'var(--status-success)' }
  ];

  const filteredItems = maintenance.filter(item => {
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Priority Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['All', 'Emergency', 'High', 'Medium', 'Low'].map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`btn btn-sm ${priorityFilter === pr ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {pr} Priority
            </button>
          ))}
        </div>

        <button 
          onClick={onOpenCreateTicket}
          className="btn btn-primary btn-sm"
          id="maint-create-ticket-btn"
          style={{ height: '32px' }}
        >
          <Plus size={14} /> Create Work Order
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', alignItems: 'start' }}>
        {columns.map((col) => {
          const colItems = filteredItems.filter(item => item.status === col.id);

          return (
            <div key={col.id} className="fintech-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-surface)' }}>
              {/* Column Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid ' + col.color
              }}>
                <div style={{ fontWeight: '600', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  {col.title}
                </div>
                <span className="tabular-nums" style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.68rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}>
                  {colItems.length}
                </span>
              </div>

              {/* Tickets Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minHeight: '180px' }}>
                {colItems.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    No items
                  </div>
                ) : (
                  colItems.map((ticket) => (
                    <div key={ticket.id} style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      boxShadow: 'var(--shadow-xs)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`badge ${
                          ticket.priority === 'Emergency' ? 'badge-danger' :
                          ticket.priority === 'High' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {ticket.priority}
                        </span>
                        <button
                          onClick={() => onEditTicket(ticket)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                        >
                          <Edit size={13} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '0.8125rem', fontWeight: '600', lineHeight: '1.3', margin: 0, color: 'var(--text-primary)' }}>
                        {ticket.title}
                      </h4>

                      <div className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                        {ticket.unit} • {ticket.propertyName}
                      </div>

                      <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                        {ticket.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '0.4rem',
                        marginTop: '0.2rem'
                      }}>
                        <span>Vendor: <strong style={{ color: 'var(--text-primary)' }}>{ticket.assignedVendor}</strong></span>
                        <strong className="tabular-nums" style={{ color: 'var(--status-success)' }}>{formatINR(ticket.costEstimate)}</strong>
                      </div>

                      {/* Move Status Buttons */}
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end', paddingTop: '0.2rem' }}>
                        {col.id !== 'Resolved' && (
                          <button
                            onClick={() => onMoveStatus(ticket.id, col.id === 'New' ? 'In Progress' : col.id === 'In Progress' ? 'Scheduled' : 'Resolved')}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', gap: '3px', lineHeight: '1.25' }}
                          >
                            Advance <ArrowRight size={11} />
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
