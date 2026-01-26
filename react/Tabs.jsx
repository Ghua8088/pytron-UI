import React, { useState } from 'react';

const Tabs = React.memo(({ tabs = [], activeTab, onChange, style }) => {
    // tabs = [{ id: 'tab1', label: 'Tab 1' }, ...]

    return (
        <div style={{ ...style }}>
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--pytron-border, #333)',
                gap: '2px'
            }}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: isActive ? 'var(--pytron-primary-fg, #fff)' : 'var(--pytron-fg, #ccc)',
                                background: isActive ? 'var(--pytron-secondary, #2d2d2d)' : 'transparent',
                                borderTop: '2px solid transparent',
                                borderBottom: isActive ? '2px solid var(--pytron-primary, #0078d4)' : '2px solid transparent',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {tab.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default Tabs;
