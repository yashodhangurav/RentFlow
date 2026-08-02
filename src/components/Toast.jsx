import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const Toast = ({ toasts = [], onDismiss }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 :
                     toast.type === 'error' ? XCircle :
                     toast.type === 'warning' ? AlertTriangle : Info;

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
            <Icon size={18} color={
              toast.type === 'success' ? 'var(--accent-success)' :
              toast.type === 'error' ? 'var(--accent-danger)' :
              toast.type === 'warning' ? 'var(--accent-warning)' : 'var(--accent-info)'
            } />
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
