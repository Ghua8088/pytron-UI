import React from 'react';

// --- Persistent Exit Button (Lockdown Overlay) ---
// Designed to sit on top of everything (z-index 10000)
// Uses pointer-events trickery to be clickable but not block underlying content.
export const ExitOverlay = ({ onExit, zIndex = 10000 }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '0px', // Minimal height container
            zIndex: zIndex,
            pointerEvents: 'none' // Passthrough clicks
        }}>
            <div
                onClick={onExit}
                title="Exit Secure Environment"
                className="exit-btn-pytron"
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '25px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    pointerEvents: 'auto', // Re-enable clicks
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s',
                    zIndex: zIndex + 1
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                ✕
            </div>
        </div>
    );
};

// --- Secure Status Badge ---
// Displays ID, Timer, and Connection Status
export const SecureBadge = ({
    studentId = "Unknown",
    timeLeft = null,
    connected = false,
    faceCount = 0,
    zIndex = 9999
}) => {
    // Helper format
    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #334155',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: zIndex,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontFamily: 'sans-serif',
            fontSize: '12px',
            minWidth: '140px',
            pointerEvents: 'none', // Usually just visual
            userSelect: 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                        display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
                        animation: connected ? 'pulse 2s infinite' : 'none'
                    }} />
                    REC
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>SECURE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>ID</span>
                <span style={{ color: '#f8fafc', fontWeight: 500 }}>{studentId}</span>
            </div>

            {timeLeft !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>TIMER</span>
                    <span style={{
                        color: timeLeft < 300 ? '#ef4444' : '#f8fafc',
                        fontWeight: 'bold',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>STATUS</span>
                <span style={{ color: connected ? '#10b981' : '#ef4444' }}>
                    {connected ? "LIVE" : "OFFLINE"}
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>FACE</span>
                <span style={{ color: faceCount > 0 ? '#10b981' : '#f59e0b' }}>
                    {faceCount > 0 ? "DETECTED" : "SEARCHING"}
                </span>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};
