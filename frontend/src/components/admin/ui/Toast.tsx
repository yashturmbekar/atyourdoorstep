/**
 * Toast Notification Component
 * Beautiful, accessible toast notifications
 */

import React, { useState, useCallback, useEffect } from 'react';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { ToastContext, type ToastType, type ToastOptions, type ToastItem } from './useToast';
import './Toast.css';

// Re-export types and hook for convenience
export type { ToastType, ToastOptions, ToastItem, ToastContextValue } from './useToast';
export { useToast } from './useToast';

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <FiCheck />;
    case 'error':
      return <FiX />;
    case 'warning':
      return <FiAlertTriangle />;
    case 'info':
      return <FiInfo />;
    default:
      return <FiInfo />;
  }
};

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / (duration / 100))));
    }, 100);

    const timeout = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [toast.id, duration, onDismiss]);

  return (
    <div 
      className={`toast toast-${toast.type} ${toast.isExiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">{getIcon(toast.type)}</div>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
        {toast.action && (
          <button 
            className="toast-action"
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button 
        className="toast-dismiss"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <FiX />
      </button>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({ 
  toasts, 
  onDismiss 
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => 
      prev.map(t => t.id === id ? { ...t, isExiting: true } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...options, id, isExiting: false }]);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message, duration: 7000 });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export default Toast;
