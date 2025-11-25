import React, { useEffect, useRef } from 'react';

const ResizeHandles = () => {
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const direction = useRef('');

  useEffect(() => {
    const handleMouseMove = async (e) => {
      if (!isResizing.current) return;

      const dx = e.screenX - startPos.current.x;
      const dy = e.screenY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (direction.current.includes('e')) newWidth += dx;
      if (direction.current.includes('s')) newHeight += dy;

      // Minimum size check (could be configurable)
      if (newWidth < 200) newWidth = 200;
      if (newHeight < 100) newHeight = 100;

      if (window.pywebview?.api?.resize) {
        // We use a small throttle or just call it. 
        // Since this is JS driving Python, it might be slightly laggy but functional.
        await window.pywebview.api.resize(Math.round(newWidth), Math.round(newHeight));
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = async (e, dir) => {
    e.preventDefault();
    isResizing.current = true;
    direction.current = dir;
    startPos.current = { x: e.screenX, y: e.screenY };
    
    // Get current size from backend for accuracy, or fallback to window.outerWidth
    if (window.pywebview?.api?.get_size) {
        const size = await window.pywebview.api.get_size();
        startSize.current = { width: size.width, height: size.height };
    } else {
        startSize.current = { width: window.outerWidth, height: window.outerHeight };
    }
    
    document.body.style.cursor = dir === 'se' ? 'nwse-resize' : (dir === 'e' ? 'ew-resize' : 'ns-resize');
  };

  const style = {
    position: 'fixed',
    zIndex: 9999,
    userSelect: 'none'
  };

  return (
    <>
      {/* Right Handle */}
      <div
        onMouseDown={(e) => startResize(e, 'e')}
        style={{
          ...style,
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          cursor: 'ew-resize',
        }}
      />
      {/* Bottom Handle */}
      <div
        onMouseDown={(e) => startResize(e, 's')}
        style={{
          ...style,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4px',
          cursor: 'ns-resize',
        }}
      />
      {/* Corner Handle */}
      <div
        onMouseDown={(e) => startResize(e, 'se')}
        style={{
          ...style,
          bottom: 0,
          right: 0,
          width: '10px',
          height: '10px',
          cursor: 'nwse-resize',
          zIndex: 10000 // Above others
        }}
      />
    </>
  );
};

export default ResizeHandles;
