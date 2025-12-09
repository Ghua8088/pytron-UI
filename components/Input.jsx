import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, style, ...props }, ref) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
            {label && (
                <label style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--pytron-fg, #fff)'
                }}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${error ? 'var(--pytron-danger, #e81123)' : 'var(--pytron-border, #454545)'}`,
                    background: 'var(--pytron-secondary, #252526)',
                    color: 'var(--pytron-fg, #fff)',
                    fontSize: '14px',
                    fontFamily: 'Segoe UI, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--pytron-primary, #0078d4)';
                    if (props.onFocus) props.onFocus(e);
                }}
                onBlur={(e) => {
                    if (!error) e.target.style.borderColor = 'var(--pytron-border, #454545)';
                    if (props.onBlur) props.onBlur(e);
                }}
                {...props}
            />
            {error && (
                <span style={{ fontSize: '12px', color: 'var(--pytron-danger, #e81123)' }}>
                    {error}
                </span>
            )}
        </div>
    );
});

export default Input;
