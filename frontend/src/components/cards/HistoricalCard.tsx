import { motion } from 'framer-motion';
import { BookOpen, Clock, MapPin, Radio, TrendingUp } from 'lucide-react';
import type { HistoricalStats } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface HistoricalCardProps {
  stats: HistoricalStats;
}

export const HistoricalCard = ({ stats }: HistoricalCardProps) => {
  const rows = [
    {
      label: 'Total Incidents',
      value: stats?.total_incidents != null ? formatNumber(stats.total_incidents) : '—',
      icon: <TrendingUp size={19} />,
      color: '#3B82F6',
    },
    {
      label: 'Avg Duration',
      value: stats?.avg_duration_min != null ? `${stats.avg_duration_min} min` : '—',
      icon: <Clock size={19} />,
      color: '#F59E0B',
    },
    {
      label: 'Peak Hour',
      value: stats?.peak_hour != null ? `${stats.peak_hour}:00` : '—',
      icon: <Radio size={19} />,
      color: '#8B5CF6',
    },
    {
      label: 'Common Corridor',
      value: stats?.common_corridor || '—',
      icon: <MapPin size={19} />,
      color: '#10B981',
    },
    {
      label: 'Nearest Station',
      value: stats?.common_station || '—',
      icon: <BookOpen size={19} />,
      color: '#F59E0B',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-card)',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          color: '#3B82F6', flexShrink: 0,
        }}>
          <BookOpen size={22} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text)' }}>
            Historical Context
          </div>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.2rem' }}>
            Incident patterns for this event type
          </div>
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-bright)',
              borderRadius: 'var(--radius-md)',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: row.color, flexShrink: 0 }}>{row.icon}</div>
              <span style={{
                fontSize: 'var(--font-sm)', fontWeight: 600,
                color: 'var(--text-secondary)',
              }}>{row.label}</span>
            </div>
            <span style={{
              fontSize: 'var(--font-sm)', fontWeight: 800,
              color: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'right',
              flexShrink: 0,
            }}>{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
