import React, { useEffect, useState, createContext, useContext } from 'react';
import pytron from 'pytron-client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Listen for backend notifications
    useEffect(() => {
        const handleNotification = (e) => {
            // e.detail contains { title, message, type, duration }
            const { title, message, type = 'info', duration = 5000 } = e.detail || {};
            addToast(message, { title, type, duration });
        };

        // We can listen on window for the custom event 'pytron:notification' dispatched by pytron client
        window.addEventListener('pytron:notification', handleNotification);

        // Also support manual triggering via pytron.on if user prefers that binding
        const binding = pytron.on ? pytron.on('notification', (data) => {
            const { title, message, type = 'info', duration = 5000 } = data;
            addToast(message, { title, type, duration });
        }) : null;

        return () => {
            window.removeEventListener('pytron:notification', handleNotification);
            if (binding && pytron.off) pytron.off('notification', binding);
        };
    }, []);

    const addToast = (message, options = {}) => {
        const id = Date.now().toString();
        const newToast = {
            id,
            message,
            title: options.title,
            type: options.type || 'info', // info, success, warning, error
            duration: options.duration || 5000,
        };
        setToasts((prev) => [...prev, newToast]);

        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

// --- Internal Components ---

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none', // Allow clicks through container area
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ToastItem = ({ toast, onClose }) => {
    let Icon = Info;
    let color = 'var(--pytron-primary, #0078d4)';

    switch (toast.type) {
        case 'success': Icon = CheckCircle; color = 'var(--pytron-success, #107c10)'; break;
        case 'error': Icon = AlertCircle; color = 'var(--pytron-danger, #e81123)'; break;
        case 'warning': Icon = AlertTriangle; color = 'var(--pytron-warning, #d83b01)'; break;
        default: break;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            layout
            style={{
                pointerEvents: 'auto',
                background: 'var(--pytron-surface, #2b2b2b)',
                border: '1px solid var(--pytron-border, #333)',
                borderLeft: `4px solid ${color}`,
                borderRadius: '6px',
                padding: '12px 16px',
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: 'var(--pytron-fg, #fff)',
                fontFamily: 'Segoe UI, sans-serif'
            }}
        >
            <Icon size={20} color={color} style={{ marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
                {toast.title && <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{toast.title}</div>}
                <div style={{ fontSize: '13px', lineHeight: '1.4', opacity: 0.9 }}>{toast.message}</div>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--pytron-fg, #fff)',
                    opacity: 0.5,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};
