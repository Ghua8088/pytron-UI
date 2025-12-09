import React from 'react';

const ProgressBar = ({ value = 0, max = 100, color, height = '4px', showLabel = false, style }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div style={{ width: '100%', ...style }}>
            {showLabel && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '12px',
                    color: 'var(--pytron-fg, #ccc)'
                }}>
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div style={{
                width: '100%',
                height: height,
                background: 'var(--pytron-secondary, #333)',
                borderRadius: '999px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color || 'var(--pytron-primary, #0078d4)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease-out'
                }} />
            </div>
        </div>
    );
};

export default ProgressBar;
