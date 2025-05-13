import React, { useState } from 'react';

interface TooltipProps {
    text: string;
}

export function Tooltip({ text }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginLeft: 8 }}>
            <span
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                style={{ 
                    cursor: 'help',
                    color: 'var(--task-item-color)',
                    opacity: 0.7,
                    fontSize: '16px'
                }}
            >
                ❓
            </span>
            {isVisible && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--container-bg)',
                    color: 'var(--task-item-color)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    width: 'max-content',
                    maxWidth: '250px',
                    marginTop: '8px',
                    border: '1px solid var(--container-border)',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {text}
                </div>
            )}
        </div>
    );
} 