import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export const KPICard = ({ label, value, icon, color = '#3B82F6', delay = 0 }: KPICardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -2 }}
    className="rounded-xl p-4 flex items-center gap-4"
    style={{ background: 'rgba(31,41,55,0.4)', border: '1px solid var(--border)' }}
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}
    >
      <div style={{ color }}>{icon}</div>
    </div>
    <div className="min-w-0">
      <div className="text-lg font-bold truncate" style={{ color: 'var(--text)' }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  </motion.div>
);
