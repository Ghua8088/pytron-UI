// src/components/SnapGrid.jsx
import React from 'react';
import pytron from 'pytron-client';

const SnapGrid = React.memo(({ onClose }) => {

    const snap = async (type) => {
        // 1. GET SCALING FACTOR (Crucial for 125%/150% screens)
        const scale = window.devicePixelRatio || 1;

        // 2. GET SCREEN BOUNDS (Logical CSS Pixels)
        // availLeft/Top accounts for the taskbar position and multi-monitor offset
        const screenLeft = window.screen.availLeft || 0;
        const screenTop = window.screen.availTop || 0;
        const screenW = window.screen.availWidth;
        const screenH = window.screen.availHeight;

        let x, y, w, h;

        // 3. CALCULATE LOGICAL COORDINATES
        switch (type) {
            // --- ROW 1: Halves (50/50) ---
            case 'left-half':
                x = screenLeft;
                y = screenTop;
                w = screenW / 2;
                h = screenH;
                break;
            case 'right-half':
                x = screenLeft + (screenW / 2);
                y = screenTop;
                w = screenW / 2;
                h = screenH;
                break;

            // --- ROW 2: Thirds (66/33) ---
            case 'two-thirds-left':
                x = screenLeft;
                y = screenTop;
                w = (screenW / 3) * 2;
                h = screenH;
                break;
            case 'one-third-right':
                x = screenLeft + ((screenW / 3) * 2);
                y = screenTop;
                w = screenW / 3;
                h = screenH;
                break;

            // --- ROW 3: Quarters (Corner Snaps) ---
            case 'top-left':
                x = screenLeft;
                y = screenTop;
                w = screenW / 2;
                h = screenH / 2;
                break;
            case 'top-right':
                x = screenLeft + (screenW / 2);
                y = screenTop;
                w = screenW / 2;
                h = screenH / 2;
                break;
            case 'bottom-left':
                x = screenLeft;
                y = screenTop + (screenH / 2);
                w = screenW / 2;
                h = screenH / 2;
                break;
            case 'bottom-right':
                x = screenLeft + (screenW / 2);
                y = screenTop + (screenH / 2);
                w = screenW / 2;
                h = screenH / 2;
                break;

            default: return;
        }

        // 4. CONVERT TO PHYSICAL PIXELS FOR PYTHON (The Fix)
        // Windows API expects Integers, not Floats.
        const finalX = Math.round(x * scale);
        const finalY = Math.round(y * scale);
        const finalW = Math.round(w * scale);
        const finalH = Math.round(h * scale);

        // 5. Send to Backend
        if (pytron && pytron.set_bounds) {
            await pytron.set_bounds(finalX, finalY, finalW, finalH);
        } else if (window.pytron_set_bounds) { // Fallback
            await window.pytron_set_bounds(finalX, finalY, finalW, finalH);
        }
        onClose();
    };

    // --- STYLES (Windows 11 Look) ---
    const gridStyle = {
        position: 'absolute',
        top: '38px', // Adjusted to sit nicely below titlebar
        right: '0px',
        width: '240px',
        background: 'var(--pytron-bg, #202020)',
        border: '1px solid var(--pytron-border, #333)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        zIndex: 9999,
        backdropFilter: 'blur(10px)', // Glass effect if supported
    };

    const rowStyle = {
        display: 'flex',
        gap: '6px',
        height: '50px',
        width: '100%',
    };

    const itemBase = {
        background: 'var(--pytron-secondary, #3a3a3a)',
        border: '1px solid var(--pytron-border, #555)',
        cursor: 'pointer',
        transition: 'background 0.1s',
    };

    return (
        <div style={gridStyle} onMouseLeave={onClose}>
            {/* GLOBAL HOVER STYLE */}
            <style>{`.snap-item:hover { background: var(--pytron-primary, #0078d4) !important; border-color: var(--pytron-primary, #0078d4) !important; }`}</style>

            {/* Row 1: 50/50 */}
            <div style={rowStyle}>
                <div onClick={() => snap('left-half')} className="snap-item" style={{ ...itemBase, flex: 1, borderRadius: '4px 0 0 4px', borderRight: 'none' }}></div>
                <div onClick={() => snap('right-half')} className="snap-item" style={{ ...itemBase, flex: 1, borderRadius: '0 4px 4px 0' }}></div>
            </div>

            {/* Row 2: 66/33 (Big Left, Small Right) */}
            <div style={rowStyle}>
                <div onClick={() => snap('two-thirds-left')} className="snap-item" style={{ ...itemBase, flex: 2, borderRadius: '4px 0 0 4px', borderRight: 'none' }}></div>
                <div onClick={() => snap('one-third-right')} className="snap-item" style={{ ...itemBase, flex: 1, borderRadius: '0 4px 4px 0' }}></div>
            </div>

            {/* Row 3: Quarters (2x2 Grid) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '6px',
                height: '80px',
                width: '100%'
            }}>
                <div onClick={() => snap('top-left')} className="snap-item" style={{ ...itemBase, borderRadius: '4px 0 0 0' }}></div>
                <div onClick={() => snap('top-right')} className="snap-item" style={{ ...itemBase, borderRadius: '0 4px 0 0' }}></div>
                <div onClick={() => snap('bottom-left')} className="snap-item" style={{ ...itemBase, borderRadius: '0 0 0 4px' }}></div>
                <div onClick={() => snap('bottom-right')} className="snap-item" style={{ ...itemBase, borderRadius: '0 0 4px 0' }}></div>
            </div>
        </div>
    );
});

export default SnapGrid;
