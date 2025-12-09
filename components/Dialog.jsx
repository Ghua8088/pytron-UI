import React from 'react';

const Dialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "OK", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--pytron-surface, #2b2b2b)',
        color: 'var(--pytron-fg, #fff)',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '300px',
        maxWidth: '80%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        border: '1px solid var(--pytron-border, #333)',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        {title && <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '18px' }}>{title}</h3>}
        <div style={{ marginBottom: '20px', lineHeight: '1.5', fontSize: '14px' }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {onCancel && (
            <button onClick={onCancel} style={buttonStyle}>
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} style={{ ...buttonStyle, backgroundColor: 'var(--pytron-primary, #0078d4)', color: 'var(--pytron-primary-fg, #fff)' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: 'var(--pytron-secondary, #444)',
  color: 'var(--pytron-fg, #fff)',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background-color 0.2s'
};

export default Dialog;
