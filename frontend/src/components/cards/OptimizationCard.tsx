import { motion } from 'framer-motion';
import { ShieldCheck, Users, Layers, Navigation2, CheckCircle2, XCircle } from 'lucide-react';
import type { OptimizationResult } from '@/types';

interface OptimizationCardProps {
  optimization: OptimizationResult;
}

export const OptimizationCard = ({ optimization }: OptimizationCardProps) => {
  const divRequired =
    optimization?.diversion_required === true ||
    optimization?.diversion_required === 'Yes' ||
    optimization?.diversion_required === 'yes';

  const rows = [
    {
      label: 'Officers Required',
      value: optimization?.officers != null ? `${optimization.officers} Units` : '—',
      icon: <Users size={19} />,
      color: '#10B981',
    },
    {
      label: 'Barricades',
      value: optimization?.barricades != null ? `${optimization.barricades} Units` : '—',
      icon: <Layers size={19} />,
      color: '#8B5CF6',
    },
    {
      label: 'Diversion Plan',
      value: divRequired ? 'Active Plan' : 'Not Required',
      icon: divRequired ? <CheckCircle2 size={19} /> : <XCircle size={19} />,
      color: divRequired ? '#10B981' : '#6B7280',
    },
  ];

  // Show any extra backend fields
  const extraFields = Object.entries(optimization || {}).filter(
    ([k]) => !['officers', 'barricades', 'diversion_required'].includes(k)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          color: '#10B981', flexShrink: 0,
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text)' }}>
            Resource Optimization
          </div>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.2rem' }}>
            AI-recommended deployment allocation
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
              textAlign: 'right', flexShrink: 0,
            }}>{row.value}</span>
          </div>
        ))}

        {/* Diversion visual pill */}
        <div style={{
          marginTop: '0.375rem',
          padding: '1rem 1.25rem',
          background: divRequired ? 'rgba(16,185,129,0.06)' : 'rgba(107,114,128,0.05)',
          border: `1px solid ${divRequired ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.18)'}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <Navigation2 size={19} style={{ color: divRequired ? '#10B981' : '#6B7280', flexShrink: 0 }} />
          <span style={{
            fontSize: 'var(--font-sm)', fontWeight: 600,
            color: 'var(--text-secondary)', flex: 1,
          }}>Route Diversion</span>
          <span style={{
            padding: '0.3rem 0.875rem',
            borderRadius: '999px',
            fontSize: 'var(--font-xs)',
            fontWeight: 700,
            background: divRequired ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
            color: divRequired ? '#10B981' : '#9CA3AF',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{divRequired ? 'REQUIRED' : 'NONE'}</span>
        </div>

        {/* Extra backend fields if any */}
        {extraFields.map(([key, val]) => (
          <div
            key={key}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1.25rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span style={{
              fontSize: 'var(--font-sm)', fontWeight: 600,
              color: 'var(--muted)', textTransform: 'capitalize',
            }}>{key.replace(/_/g, ' ')}</span>
            <span style={{
              fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text)',
            }}>{String(val)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
