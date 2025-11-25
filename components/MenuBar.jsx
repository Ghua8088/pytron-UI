import React, { useState, useEffect, useRef } from 'react';

const MenuBar = ({ menus, style }) => {
  // menus = [{ label: 'File', items: [{ label: 'Open', onClick: ... }] }]
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} style={{ display: 'flex', background: '#333', color: '#fff', fontSize: '13px', userSelect: 'none', ...style }}>
      {menus.map((menu, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <div
            onClick={() => setActiveMenu(activeMenu === index ? null : index)}
            onMouseEnter={() => {
                if (activeMenu !== null) setActiveMenu(index);
            }}
            style={{ 
                padding: '6px 10px', 
                cursor: 'default', 
                background: activeMenu === index ? '#505050' : 'transparent' 
            }}
          >
            {menu.label}
          </div>
          {activeMenu === index && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#2b2b2b',
              border: '1px solid #454545',
              minWidth: '200px',
              zIndex: 2000,
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              padding: '4px 0'
            }}>
              {menu.items.map((item, i) => (
                <MenuItem key={i} item={item} closeMenu={() => setActiveMenu(null)} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const MenuItem = ({ item, closeMenu }) => {
    const [hover, setHover] = useState(false);

    if (item.separator) {
        return <div style={{ height: '1px', background: '#454545', margin: '4px 0' }} />;
    }

    return (
        <div
            onClick={() => {
                if (item.onClick) item.onClick();
                closeMenu();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                padding: '8px 16px',
                cursor: 'default',
                background: hover ? '#0078d4' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <span>{item.label}</span>
            {item.shortcut && <span style={{ color: hover ? '#fff' : '#aaa', fontSize: '11px', marginLeft: '10px' }}>{item.shortcut}</span>}
        </div>
    );
};

export default MenuBar;
