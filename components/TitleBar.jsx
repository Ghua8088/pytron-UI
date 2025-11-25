import React from 'react';

const TitleBar = ({ title, icon, onClose, onMinimize, onMaximize, style, children }) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const handleMinimize = () => {
    if (window.pywebview?.api?.minimize) {
      window.pywebview.api.minimize();
    }
    if (onMinimize) onMinimize();
  };

  const handleMaximizeToggle = () => {
    if (isMaximized) {
      if (window.pywebview?.api?.restore) window.pywebview.api.restore();
      setIsMaximized(false);
    } else {
      if (window.pywebview?.api?.maximize) window.pywebview.api.maximize();
      setIsMaximized(true);
    }
    if (onMaximize) onMaximize();
  };

  const handleClose = () => {
    if (window.pywebview?.api?.close) {
      window.pywebview.api.close();
    }
    if (onClose) onClose();
  };

  const handleDoubleClick = () => {
    handleMaximizeToggle();
  };

  return (
    <div className="pywebview-drag-region" onDoubleClick={handleDoubleClick} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '32px',
      backgroundColor: '#202020',
      color: '#eeeeee',
      userSelect: 'none',
      WebkitAppRegion: 'drag', // Use native draggable region like Electron
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
        <WindowControlBtn onClick={handleMaximizeToggle}>&#9633;</WindowControlBtn>
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
