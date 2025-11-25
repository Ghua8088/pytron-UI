import React from 'react';

const TitleBar = ({ title, icon, onClose, onMinimize, onMaximize, style, children }) => {
  const handleMinimize = () => {
    if (window.pywebview?.api?.minimize) {
      window.pywebview.api.minimize();
    }
    if (onMinimize) onMinimize();
  };

  const handleMaximize = () => {
    if (window.pywebview?.api?.maximize) {
        // Simple maximize for now. 
        // Ideally we toggle between maximize and restore.
        // But without state from backend, it's hard to know.
        // We can try to call toggle_fullscreen if preferred.
        window.pywebview.api.maximize();
    }
    if (onMaximize) onMaximize();
  };

  const handleClose = () => {
    if (window.pywebview?.api?.close) {
      window.pywebview.api.close();
    }
    if (onClose) onClose();
  };

  return (
    <div className="pywebview-drag-region" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '32px',
      backgroundColor: '#202020',
      color: '#eeeeee',
      userSelect: 'none',
      WebkitAppRegion: 'drag', // For WebView2/Electron
      padding: '0 10px',
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      ...style
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <img src={icon} alt="icon" style={{ width: '16px', height: '16px' }} />}
        <span>{title || 'Pytron App'}</span>
        {children}
      </div>
      <div style={{ display: 'flex', WebkitAppRegion: 'no-drag', height: '100%' }}>
        <WindowControlBtn onClick={handleMinimize}>&#9472;</WindowControlBtn>
        <WindowControlBtn onClick={handleMaximize}>&#9633;</WindowControlBtn>
        <WindowControlBtn onClick={handleClose} isClose>&#10005;</WindowControlBtn>
      </div>
    </div>
  );
};

const WindowControlBtn = ({ onClick, children, isClose }) => {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? (isClose ? '#e81123' : '#3a3a3a') : 'transparent',
        border: 'none',
        color: '#fff',
        width: '46px',
        height: '100%',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'background 0.1s'
      }}
    >
      {children}
    </button>
  );
};

export default TitleBar;
