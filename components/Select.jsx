import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ options = [], value, onChange, placeholder = "Select...", style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', minWidth: '150px', ...style }}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '8px 12px',
                    background: 'var(--pytron-secondary, #252526)',
                    border: `1px solid ${isOpen ? 'var(--pytron-primary, #0078d4)' : 'var(--pytron-border, #454545)'}`,
                    borderRadius: '4px',
                    color: 'var(--pytron-fg, #fff)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s'
                }}
            >
                <span style={{ color: selectedOption ? 'inherit' : '#aaa' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'var(--pytron-surface, #2b2b2b)',
                    border: '1px solid var(--pytron-border, #454545)',
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className="pytron-select-item"
                            style={{
                                padding: '8px 12px',
                                fontSize: '14px',
                                color: 'var(--pytron-fg, #fff)',
                                cursor: 'pointer',
                                background: option.value === value ? 'var(--pytron-primary, #0078d4)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (option.value !== value) e.currentTarget.style.background = 'var(--pytron-secondary, #333)';
                            }}
                            onMouseLeave={(e) => {
                                if (option.value !== value) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div style={{ padding: '8px 12px', fontSize: '13px', color: '#aaa' }}>No options</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Select;
