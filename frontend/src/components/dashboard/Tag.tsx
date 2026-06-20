import React from 'react';

export const Tag = ({ children, color = '#3B82F6' }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.25rem 0.75rem', borderRadius: '999px',
    fontSize: 'var(--font-xs)', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', background: `${color}18`, color, border: `1px solid ${color}30`,
  }}>{children}</span>
);
