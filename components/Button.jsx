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
    primary: { backgroundColor: 'var(--pytron-primary, #0078d4)', color: 'var(--pytron-primary-fg, #fff)' },
    secondary: { backgroundColor: 'var(--pytron-secondary, #444)', color: 'var(--pytron-fg, #fff)' },
    danger: { backgroundColor: 'var(--pytron-danger, #e81123)', color: '#fff' },
    ghost: { backgroundColor: 'transparent', color: 'var(--pytron-fg, #fff)' } // Ghost usually takes text color
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...(variants[variant] || variants.primary) }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
