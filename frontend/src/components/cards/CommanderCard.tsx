import { motion } from 'framer-motion';
import { Terminal, MapPin, Users, Clock, TrendingDown, Crosshair, Activity } from 'lucide-react';
import { getRiskColor, getRiskBg } from '@/utils/colors';
import type { CommanderBriefing } from '@/types';

interface CommanderCardProps {
  commander: CommanderBriefing;
}

const MetricTile = ({
  label, value, desc, icon, color,
}: {
  label: string; value: string; desc: string; icon: React.ReactNode; color: string;
}) => (
  <div style={{
    background: 'var(--bg-raised)',
    border: '1px solid var(--border-bright)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.375rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minHeight: '140px',
    justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{
        fontSize: 'var(--font-xs)',
        fontWeight: 700,
        color: 'var(--muted-dark)',
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
      }}>{label}</span>
      <div style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}28`,
        borderRadius: 'var(--radius-sm)',
        padding: '0.4rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
    </div>
    <div>
      <div style={{
        fontSize: 'var(--font-xl)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        color,
        lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontSize: 'var(--font-xs)',
        color: 'var(--muted)',
        marginTop: '0.35rem',
        fontWeight: 500,
      }}>{desc}</div>
    </div>
  </div>
);

export const CommanderCard = ({ commander }: CommanderCardProps) => {
  const riskColor = getRiskColor(commander?.risk || '');
  const riskBg = getRiskBg(commander?.risk || '');

  const expectedDelay = commander?.expected_delay ?? '89';
  const expectedReduction = commander?.expected_reduction ?? '65';
  const numericDelay = parseFloat(String(expectedDelay)) || 89;
  const numericReduction = parseFloat(String(expectedReduction)) || 65;
  const mitigatedDelay = Math.round(numericDelay * (1 - numericReduction / 100)) || 31;

  const metrics = [
    {
      label: 'Recommended Station',
      value: commander?.recommended_station ?? 'Yelahanka',
      icon: <MapPin size={18} />,
      color: '#3B82F6',
      desc: 'Primary dispatch hub',
    },
    {
      label: 'Critical Corridor',
      value: commander?.critical_corridor ?? 'Non-Corridor',
      icon: <Crosshair size={18} />,
      color: '#F59E0B',
      desc: 'High-priority route',
    },
    {
      label: 'Officers Deployed',
      value: commander?.officers != null ? `${commander.officers} Units` : '13 Units',
      icon: <Users size={18} />,
      color: '#10B981',
      desc: 'Active field personnel',
    },
    {
      label: 'Baseline Delay',
      value: `${numericDelay} min`,
      icon: <Clock size={18} />,
      color: '#EF4444',
      desc: 'Without intervention',
    },
    {
      label: 'Mitigated Delay',
      value: `${mitigatedDelay} min`,
      icon: <Activity size={18} />,
      color: '#10B981',
      desc: 'With full deployment',
    },
    {
      label: 'Delay Reduction',
      value: `${numericReduction}%`,
      icon: <TrendingDown size={18} />,
      color: '#10B981',
      desc: 'Efficiency improvement',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong"
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
      }}
    >
      {/* Blue glow top */}
      <div style={{
        position: 'absolute', top: 0, right: '20%',
        width: '350px', height: '130px',
        background: 'radial-gradient(ellipse, rgba(59,130,246,0.1), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '1.75rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.3)',
            position: 'relative', flexShrink: 0,
          }}>
            <Terminal size={24} color="#3B82F6" />
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '13px', height: '13px', borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 0 3px rgba(7,9,15,0.8)',
            }} />
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#3B82F6',
              textTransform: 'uppercase',
              marginBottom: '0.3rem',
            }}>COMMAND CENTER BRIEFING</div>
            <div style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 900,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>Tactical Operations Directive</div>
          </div>
        </div>

        <div style={{
          padding: '0.6rem 1.375rem',
          borderRadius: '999px',
          background: riskBg,
          border: `1px solid ${riskColor}40`,
          color: riskColor,
          fontSize: 'var(--font-sm)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace',
          flexShrink: 0,
        }}>
          STATUS: {commander?.risk?.toUpperCase() || 'MEDIUM'}
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ padding: '1.75rem 2rem' }}>
        <div className="grid-3col">
          {metrics.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
            >
              <MetricTile {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
