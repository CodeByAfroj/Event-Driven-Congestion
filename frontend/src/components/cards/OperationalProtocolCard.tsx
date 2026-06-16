import { motion } from 'framer-motion';
import { AlertCircle, Clock, Database, Navigation, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { getRiskColor, getRiskBg } from '@/utils/colors';
import { formatNumber } from '@/utils/formatters';

interface OperationalProtocolCardProps {
  risk: string;
  totalEvents?: number;
  averageDuration?: number;
  officers?: number;
  barricades?: number;
  diversion?: boolean | string;
}

export const OperationalProtocolCard = ({
  risk,
  totalEvents = 7009,
  averageDuration = 89,
  officers = 13,
  barricades = 5,
  diversion = 'Yes',
}: OperationalProtocolCardProps) => {
  const color = getRiskColor(risk);
  const bg = getRiskBg(risk);
  const parsedDiversion =
    diversion === true || diversion === 'Yes' || diversion === 'yes';

  const kpis = [
    {
      label: 'Risk Level',
      value: risk?.toUpperCase() || 'MEDIUM',
      icon: <AlertCircle size={22} />,
      color,
      bg,
      desc: 'Current threat evaluation',
    },
    {
      label: 'Historical Events',
      value: formatNumber(totalEvents),
      icon: <Database size={22} />,
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.08)',
      desc: 'Incidents in Bengaluru',
    },
    {
      label: 'Avg Duration',
      value: `${averageDuration} min`,
      icon: <Clock size={22} />,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.08)',
      desc: 'Mean clearance time',
    },
    {
      label: 'Officers Required',
      value: `${officers} Units`,
      icon: <Navigation size={22} />,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.08)',
      desc: 'Field personnel dispatched',
    },
    {
      label: 'Barricades',
      value: `${barricades} Units`,
      icon: <BarChart3 size={22} />,
      color: '#8B5CF6',
      bg: 'rgba(139,92,246,0.08)',
      desc: 'Physical blockades deployed',
    },
    {
      label: 'Diversion Required',
      value: parsedDiversion ? 'ACTIVE' : 'NONE',
      icon: parsedDiversion ? <CheckCircle2 size={22} /> : <XCircle size={22} />,
      color: parsedDiversion ? '#10B981' : '#6B7280',
      bg: parsedDiversion ? 'rgba(16,185,129,0.08)' : 'rgba(107,114,128,0.06)',
      desc: parsedDiversion ? 'Reroute plan activated' : 'No rerouting needed',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-card)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)',
          color: '#3B82F6', flexShrink: 0,
        }}>
          <Navigation size={24} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text)' }}>
            Operational Command Protocol
          </div>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.2rem' }}>
            Consolidated tactical deployment parameters
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />

      <div className="grid-3col">
        {kpis.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: item.bg,
              border: `1px solid ${item.color}28`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.375rem 1.5rem',
              minHeight: '150px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: 'var(--font-xs)', fontWeight: 700,
                color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{item.label}</span>
              <div style={{ color: item.color }}>{item.icon}</div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--font-xl)', fontWeight: 900,
                color: item.color, letterSpacing: '-0.02em',
              }}>{item.value}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.35rem' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
