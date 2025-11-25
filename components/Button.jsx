import React from 'react';

const Button = ({ children, onClick, variant = 'primary', style, ...props }) => {
  const baseStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Segoe UI, sans-serif',
    transition: 'background-color 0.2s',
    ...style
  };

  const variants = {
    primary: { backgroundColor: '#0078d4', color: '#fff' },
    secondary: { backgroundColor: '#444', color: '#fff' },
    danger: { backgroundColor: '#e81123', color: '#fff' },
    ghost: { backgroundColor: 'transparent', color: '#fff' }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
