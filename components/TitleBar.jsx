// src/components/TitleBar.jsx
import React, { useState } from 'react';
import './TitleBar.css';
import SnapGrid from './SnapGrid';
import pytron from 'pytron-client';

const TitleBar = ({ title = "Pytron App", children, variant = "windows", onMinimize, onMaximize, onClose }) => {
  // variant: 'windows' | 'mac'
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  let hoverTimeout;

  const handleDrag = async (e) => {
    // Only drag on left click (0)
    if (e.button === 0) {
      try {
        // Wait briefly for backend if available
        if (pytron && typeof pytron.waitForBackend === 'function') {
          try { await pytron.waitForBackend(2000); } catch (e) { /* ignore timeout */ }
        }
        if (pytron && typeof pytron.drag === 'function') {
          await pytron.drag();
        } else if (typeof window.pytron_drag === 'function') {
          await window.pytron_drag();
        } else {
          console.warn('[TitleBar] drag backend not available');
        }
      } catch (err) {
        console.warn('[Pytron] Drag call failed:', err);
      }
    }
  };

  const handleMouseEnterMax = () => {
    if (variant === 'mac') return; // Mac doesn't typically show snap grid on hover of maximize button like Windows 11
    hoverTimeout = setTimeout(() => {
      setShowSnapMenu(true);
    }, 500); // 500ms hover delay
  };

  const handleMouseLeaveMax = () => {
    clearTimeout(hoverTimeout);
  };

  const handleMinimize = async () => {
    if (onMinimize) onMinimize();
    try {
      if (pytron && typeof pytron.waitForBackend === 'function') {
        try { await pytron.waitForBackend(2000); } catch (e) { /* ignore */ }
      }
      if (pytron?.minimize) await pytron.minimize();
      else if (typeof window.pytron_minimize === 'function') await window.pytron_minimize();
    } catch (err) {
      console.warn('[Pytron] Minimize call failed:', err);
    }
  };

  const handleClose = async () => {
    if (onClose) onClose();
    try {
      if (pytron && typeof pytron.waitForBackend === 'function') {
        try { await pytron.waitForBackend(2000); } catch (e) { /* ignore */ }
      }
      if (pytron?.close) await pytron.close();
      else if (typeof window.pytron_close === 'function') await window.pytron_close();
    } catch (err) {
      console.warn('[Pytron] Close call failed:', err);
    }
  };

  const handleMaximize = async () => {
    if (onMaximize) onMaximize();
    try {
      if (pytron && typeof pytron.waitForBackend === 'function') {
        try { await pytron.waitForBackend(2000); } catch (e) { /* ignore */ }
      }
      if (pytron?.toggle_maximize) await pytron.toggle_maximize();
      else if (typeof window.pytron_toggle_maximize === 'function') await window.pytron_toggle_maximize();
    } catch (err) {
      console.warn('[Pytron] Toggle maximize failed:', err);
    }
    setIsMaximized(!isMaximized);
  }

  // Define Controls Component for reusability
  const WindowControls = ({ type }) => {
    if (type === 'mac') {
      return (
        <div className="window-controls mac" onMouseDown={(e) => e.stopPropagation()}>
          <div className="mac-btn close" onClick={handleClose} title="Close">
            <svg className="icon" viewBox="0 0 10 10"><path d="M10.7 0.7L10 0 5.3 4.7 0.7 0 0 0.7 4.7 5.3 0 10 0.7 10.7 5.3 6 10 10.7 10.7 10 6 5.3z" transform="scale(0.8) translate(1,1)" /></svg>
          </div>
          <div className="mac-btn minimize" onClick={handleMinimize} title="Minimize">
            <svg className="icon" viewBox="0 0 10 1"><rect width="10" height="1.5" y="4" /></svg>
          </div>
          <div className="mac-btn maximize" onClick={handleMaximize} title="Maximize">
            <svg className="icon" viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" transform="scale(0.8) translate(1,1)" /></svg>
          </div>
        </div>
      );
    }

    // Default Windows
    return (
      <div className="window-controls" onMouseDown={(e) => e.stopPropagation()}>
        <div className="control-btn" onClick={handleMinimize}>
          <svg className="icon" viewBox="0 0 10 1"><path d="M0 0h10v1H0z" /></svg>
        </div>

        <div
          className="control-btn"
          onClick={handleMaximize}
          onMouseEnter={handleMouseEnterMax}
          onMouseLeave={handleMouseLeaveMax}
          style={{ position: 'relative' }}
        >
          <svg className="icon" viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
        </div>

        <div className="control-btn close" onClick={handleClose}>
          <svg className="icon" viewBox="0 0 10 10"><path d="M10.7 0.7L10 0 5.3 4.7 0.7 0 0 0.7 4.7 5.3 0 10 0.7 10.7 5.3 6 10 10.7 10.7 10 6 5.3z" transform="scale(0.9)" /></svg>
        </div>
      </div>
    );
  };

  return (
    <div className={`pytron-titlebar ${variant}`}>
      {/* 1. CONSTROLS (Left for Mac) */}
      {variant === 'mac' && <WindowControls type="mac" />}

      {/* 2. Drag Area (Title + Icon + Children) */}
      <div className="drag-region" onMouseDown={handleDrag}>
        {/* If Mac, we usually don't show the icon next to traffic lights, but we can if title requires it.
            For now, let's keep the optional icon. */}
        {variant !== 'mac' && <span style={{ marginRight: 8 }}>🐍</span>}

        <span style={{ fontWeight: variant === 'mac' ? '600' : '400' }}>{title}</span>

        {/* Render children (Search bars, menubars, etc) */}
        {children}
      </div>

      {/* 3. CONTROLS (Right for Windows) */}
      {variant === 'windows' && <WindowControls type="windows" />}

      {/* RENDER SNAP GRID IF HOVERED (Windows Only Logic mostly) */}
      {showSnapMenu && variant === 'windows' && (
        <SnapGrid onClose={() => setShowSnapMenu(false)} />
      )}
    </div>
  );
};

export default TitleBar;
