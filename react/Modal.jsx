import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = React.memo(({ isOpen, onClose, title, children, footer, width = '500px' }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 200); // Wait for anim
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.2s',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
            <div style={{
                background: 'var(--pytron-bg, #1e1e1e)',
                border: '1px solid var(--pytron-border, #333)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                borderRadius: '8px',
                width: width,
                maxWidth: '90vw',
                maxHeight: '90vh',
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--pytron-border, #333)',
                }}>
                    <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--pytron-fg, #fff)' }}>
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--pytron-fg, #aaa)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#333'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: '20px',
                    overflowY: 'auto',
                    color: 'var(--pytron-fg, #ccc)',
                    lineHeight: 1.5
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '16px 20px',
                        borderTop: '1px solid var(--pytron-border, #333)',
                        background: 'var(--pytron-secondary, #252526)',
                        borderRadius: '0 0 8px 8px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
});

export default Modal;
