import React, { useState, useEffect, useRef } from 'react';
import './TitleBar.css';

/**
 * ContextMenu Component for Pytron
 * 
 * Provides a native-feeling context menu that replaces the default browser menu.
 */
export const ContextMenu = React.memo(({ items = [], variant = 'windows', customStyles = {} }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

    const defaultItems = [
        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: 'Ctrl+V', onClick: () => document.execCommand('paste') },
        { label: 'Select All', shortcut: 'Ctrl+A', onClick: () => document.execCommand('selectAll') },
    ];

    const menuItems = items.length > 0 ? items : defaultItems;

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();

            let x = e.clientX;
            let y = e.clientY;

            // Keep menu on screen
            const menuWidth = 200;
            const menuHeight = menuItems.length * 35;

            if (x + menuWidth > window.innerWidth) x -= menuWidth;
            if (y + menuHeight > window.innerHeight) y -= menuHeight;

            setPosition({ x, y });
            setVisible(true);
        };

        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setVisible(false);
            }
        };

        const handleBlur = () => setVisible(false);

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('blur', handleBlur);
        };
    }, [menuItems]);

    if (isAndroid || !visible) return null;

    const isMac = variant === 'mac';

    const menuStyle = {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 10000,
        minWidth: '200px',
        background: isMac ? 'rgba(45, 45, 45, 0.8)' : '#252526',
        backdropFilter: isMac ? 'blur(20px) saturate(180%)' : 'none',
        border: isMac ? '0.5px solid rgba(255, 255, 255, 0.1)' : '1px solid #454545',
        borderRadius: isMac ? '10px' : '4px',
        padding: '5px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: 'pytron-fade-in 0.1s ease-out',
        ...customStyles
    };

    return (
        <div ref={menuRef} style={menuStyle} className={`pytron-context-menu ${variant}`}>
            <style>{`
                @keyframes pytron-fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .pytron-menu-item {
                    display: flex;
                    align-items: center;
                    padding: 6px 12px;
                    color: #ccc;
                    font-size: 13px;
                    cursor: default;
                    border-radius: ${isMac ? '5px' : '3px'};
                    transition: background 0.1s, color 0.1s;
                    user-select: none;
                }
                .pytron-menu-item:hover {
                    background: ${isMac ? '#0078d4' : '#37373d'};
                    color: #fff;
                }
                .pytron-menu-divider {
                    height: 1px;
                    background: #454545;
                    margin: 4px 8px;
                }
                .pytron-menu-label { flex: 1; }
                .pytron-menu-shortcut { 
                    margin-left: 20px; 
                    font-size: 11px; 
                    opacity: 0.5; 
                    font-family: monospace;
                }
            `}</style>
            {menuItems.map((item, index) => (
                item.type === 'divider' ? (
                    <div key={index} className="pytron-menu-divider" />
                ) : (
                    <div
                        key={index}
                        className="pytron-menu-item"
                        onClick={() => {
                            if (item.onClick) item.onClick();
                            setVisible(false);
                        }}
                    >
                        {item.icon && <span style={{ marginRight: '10px', opacity: 0.8 }}>{item.icon}</span>}
                        <span className="pytron-menu-label">{item.label}</span>
                        {item.shortcut && <span className="pytron-menu-shortcut">{item.shortcut}</span>}
                    </div>
                )
            ))}
        </div>
    );
});
