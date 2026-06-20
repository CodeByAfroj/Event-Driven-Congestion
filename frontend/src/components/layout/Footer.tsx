import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer style={{
      padding: '2rem 1.75rem',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
      textAlign: 'center',
      marginTop: 'auto',
    }}>
      <div style={{
        fontSize: 'var(--font-sm)',
        color: 'var(--muted)',
        fontWeight: 500,
        letterSpacing: '0.05em'
      }}>
        Designed & Built by <span style={{ color: '#3B82F6', fontWeight: 800 }}>CodeFlux</span>
      </div>
    </footer>
  );
};
