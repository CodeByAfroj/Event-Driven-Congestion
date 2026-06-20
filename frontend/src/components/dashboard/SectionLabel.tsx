import React from 'react';

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    paddingBottom: '1.5rem', marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
  }}>
    <div style={{ width: '3px', height: '24px', background: '#3B82F6', borderRadius: '2px' }} />
    <span style={{
      fontSize: 'var(--font-xs)', fontWeight: 800, letterSpacing: '0.15em',
      textTransform: 'uppercase', color: 'var(--muted)',
    }}>{children}</span>
  </div>
);
