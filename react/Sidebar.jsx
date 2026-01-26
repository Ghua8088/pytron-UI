import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(null);

export const Sidebar = React.memo(({ children, style, width = '250px' }) => {
    return (
        <div style={{
            width: width,
            height: '100%',
            background: 'var(--pytron-bg, #1e1e1e)', // Typically sidebars match bg or surface
            borderRight: '1px solid var(--pytron-border, #333)',
            display: 'flex',
            flexDirection: 'column',
            ...style
        }}>
            {children}
        </div>
    );
});

export const SidebarItem = React.memo(({ icon: Icon, label, active, onClick, badge }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: active ? 'var(--pytron-fg, #fff)' : 'var(--pytron-fg-dim, #aaa)',
                background: active ? 'var(--pytron-secondary, #333)' : 'transparent',
                borderLeft: active ? '3px solid var(--pytron-primary, #0078d4)' : '3px solid transparent',
                transition: 'background 0.2s',
                userSelect: 'none'
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
            }}
        >
            {Icon && <Icon size={18} />}
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{
                    background: 'var(--pytron-primary, #0078d4)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '99px',
                    fontWeight: 600
                }}>
                    {badge}
                </span>
            )}
        </div>
    );
});

export const SidebarHeader = ({ children }) => (
    <div style={{ padding: '20px 16px', fontWeight: 600, fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {children}
    </div>
);

export const SidebarContent = ({ children, style, ...props }) => {
    return (
        <div style={{ flex: 1, ...style }} {...props}>
            {children}
        </div>
    );
};
