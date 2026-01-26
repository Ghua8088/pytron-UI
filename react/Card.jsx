import React from 'react';

const Card = React.memo(({ children, title, footer, style, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                background: 'var(--pytron-surface, #252526)',
                border: '1px solid var(--pytron-border, #333)',
                borderRadius: '8px',
                overflow: 'hidden', // Ensure corners are clipped
                color: 'var(--pytron-fg, #fff)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.1s, box-shadow 0.1s',
                ...style
            }}
        >
            {title && (
                <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--pytron-border, #333)',
                    fontWeight: 600,
                    fontSize: '15px'
                }}>
                    {title}
                </div>
            )}
            <div style={{ padding: '16px' }}>
                {children}
            </div>
            {footer && (
                <div style={{
                    padding: '12px 16px',
                    background: 'var(--pytron-secondary, #2d2d2d)',
                    borderTop: '1px solid var(--pytron-border, #333)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {footer}
                </div>
            )}
        </div>
    );
});

export default Card;
