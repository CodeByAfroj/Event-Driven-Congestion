import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export const StatCard = ({ title, value, subtitle, icon, color = '#3B82F6', delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-card)',
        minHeight: '170px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent radial glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '140px', height: '100px',
        background: `radial-gradient(ellipse at top right, ${color}20, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 'var(--font-xs)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>{title}</span>
        <div style={{
          width: '44px', height: '44px',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}18`,
          border: `1px solid ${color}28`,
          color,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{
          fontSize: 'var(--font-3xl)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color,
        }}>{value}</div>
        {subtitle && (
          <p style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--muted)',
            marginTop: '0.5rem',
            fontWeight: 500,
          }}>{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};
