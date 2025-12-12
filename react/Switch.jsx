import React from 'react';
import { motion } from 'framer-motion';

const Switch = ({ checked, onChange, label, style }) => {
    return (
        <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', ...style }}
            onClick={() => onChange && onChange(!checked)}
        >
            <div style={{
                width: '40px',
                height: '22px',
                background: checked ? 'var(--pytron-primary, #0078d4)' : 'var(--pytron-border, #454545)',
                borderRadius: '999px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                transition: 'background-color 0.2s'
            }}>
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                        width: '18px',
                        height: '18px',
                        background: '#fff',
                        borderRadius: '50%',
                        marginLeft: checked ? '18px' : '0px'
                    }}
                />
            </div>
            {label && <span style={{ fontSize: '14px', color: 'var(--pytron-fg, #fff)' }}>{label}</span>}
        </div>
    );
};

export default Switch;
