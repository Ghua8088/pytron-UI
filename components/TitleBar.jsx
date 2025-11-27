import React, { useState, useEffect } from 'react';
import pytron from 'pytron-client';

const Icons = {
  Minimize: () => (
    <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0.5H10" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Maximize: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Restore: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="0.5" width="7" height="7" stroke="currentColor" strokeWidth="1" />
      <path d="M0.5 9.5V2.5H7.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Close: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};

const TitleBar = ({
  title,
  icon,
  onClose,
  onMinimize,
  onMaximize,
  style,
  children,
  overlay = false,
  glass = false,
  height = '32px',
  backgroundColor = '#202020',
  color = '#eeeeee'
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Optional: Listen to window resize events to update maximized state if possible
    // For now we track local state toggles
  }, []);

  const handleMinimize = () => {
    if (pytron?.minimize) pytron.minimize();
    if (onMinimize) onMinimize();
  };

  const handleMaximizeToggle = () => {
    if (isMaximized) {
      if (pytron?.restore) pytron.restore();
      setIsMaximized(false);
    } else {
      if (pytron?.maximize) pytron.maximize();
      setIsMaximized(true);
    }
    if (onMaximize) onMaximize();
  };

  const handleClose = () => {
    if (pytron?.close) pytron.close();
    if (onClose) onClose();
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height,
    backgroundColor: glass ? 'rgba(32, 32, 32, 0.6)' : backgroundColor,
    backdropFilter: glass ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: glass ? 'blur(10px)' : 'none',
    color: color,
    userSelect: 'none',
    WebkitAppRegion: 'drag',
    padding: '0 0 0 16px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    fontSize: '13px',
    position: overlay ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    transition: 'background-color 0.2s ease',
    ...style
  };

  return (
    <div
      className="pytron-titlebar"
      style={containerStyle}
      onDoubleClick={handleMaximizeToggle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
        {icon && <img src={icon} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />}
        <span style={{ fontWeight: 500, letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title || 'Pytron App'}
        </span>
        {children}
      </div>

      <div style={{ display: 'flex', height: '100%', WebkitAppRegion: 'no-drag' }}>
        <WindowControlBtn onClick={handleMinimize}>
          <Icons.Minimize />
        </WindowControlBtn>
        <WindowControlBtn onClick={handleMaximizeToggle}>
          {isMaximized ? <Icons.Restore /> : <Icons.Maximize />}
        </WindowControlBtn>
        <WindowControlBtn onClick={handleClose} isClose>
          <Icons.Close />
        </WindowControlBtn>
      </div>
    </div>
  );
};

const WindowControlBtn = ({ onClick, children, isClose }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? (isClose ? '#e81123' : 'rgba(255, 255, 255, 0.1)') : 'transparent',
        border: 'none',
        color: 'inherit',
        width: '46px',
        height: '100%',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s ease',
        outline: 'none'
      }}
    >
      {children}
    </button>
  );
};

export default TitleBar;
