import React from 'react';

const Loader = ({ size = 24, color, style }) => {
    const spinnerColor = color || 'var(--pytron-primary, #0078d4)';

    return (
        <div style={{ display: 'inline-block', ...style }}>
            <style>
                {`
        @keyframes pytron-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
            </style>
            <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `3px solid var(--pytron-secondary, rgba(255,255,255,0.1))`,
                borderTopColor: spinnerColor,
                animation: 'pytron-spin 0.8s linear infinite'
            }} />
        </div>
    );
};

export default Loader;
