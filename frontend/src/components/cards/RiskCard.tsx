import { motion } from 'framer-motion';
import { AlertCircle, Clock, TrendingDown } from 'lucide-react';
import { getRiskColor, getRiskBg } from '@/utils/colors';
import type { RiskLevel } from '@/types';

interface RiskCardProps {
  risk: RiskLevel;
  expectedDelay?: number | string;
  expectedReduction?: number | string;
}

export const RiskCard = ({ risk, expectedDelay = 89, expectedReduction = 65 }: RiskCardProps) => {
  const color = getRiskColor(risk);
  const bg = getRiskBg(risk);

  const numericDelay = parseFloat(String(expectedDelay)) || 89;
  const numericReduction = parseFloat(String(expectedReduction)) || 65;
  const mitigatedDelay = Math.round(numericDelay * (1 - numericReduction / 100)) || 31;

  const getRiskIndex = (r?: string) => {
    const l = r?.toLowerCase();
    if (l === 'low') return 0;
    if (l === 'high') return 2;
    return 1;
  };
  const activeIndex = getRiskIndex(String(risk));
  const levels = [
    { label: 'LOW',    color: '#10B981' },
    { label: 'MEDIUM', color: '#F59E0B' },
    { label: 'HIGH',   color: '#EF4444' },
  ];

  const circumference = 2 * Math.PI * 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-card)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Row 1: Risk Level + Icon Badge */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertCircle size={18} style={{ color }} />
              <span style={{
                fontSize: 'var(--font-xs)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)',
              }}>Threat Assessment</span>
            </div>

            <div style={{
              fontSize: 'var(--font-4xl)',
              fontWeight: 900,
              color,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}>{risk?.toUpperCase() || 'MEDIUM'}</div>

            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)' }}>
              Current threat level
            </div>

            {/* Segment bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', maxWidth: '300px' }}>
              {levels.map((level, idx) => (
                <div key={level.label} style={{ flex: 1 }}>
                  <div style={{
                    height: '7px', borderRadius: '999px',
                    background: idx === activeIndex
                      ? level.color
                      : idx < activeIndex
                        ? `${level.color}50`
                        : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.4s',
                  }} />
                  <span style={{
                    display: 'block', textAlign: 'center', marginTop: '0.4rem',
                    fontSize: '0.6875rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: idx === activeIndex ? level.color : 'var(--muted-dark)',
                  }}>{level.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Big risk badge */}
          <div style={{
            width: '130px', height: '130px',
            borderRadius: 'var(--radius-lg)',
            background: bg,
            border: `2px solid ${color}40`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            flexShrink: 0,
          }}>
            <AlertCircle size={36} style={{ color }} />
            <span style={{
              fontSize: 'var(--font-xs)', fontWeight: 800, color,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{risk || 'MEDIUM'}</span>
          </div>
        </div>

        {/* Row 2: 3 KPI blocks */}
        <div className="grid-3col">
          {/* Expected Delay */}
          <div style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.375rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Clock size={17} style={{ color: '#EF4444' }} />
              <span style={{
                fontSize: 'var(--font-xs)', fontWeight: 700,
                color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Expected Delay</span>
            </div>
            <div style={{
              fontSize: 'var(--font-xl)', fontWeight: 900,
              color: '#EF4444', letterSpacing: '-0.02em',
            }}>{numericDelay} min</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.3rem' }}>
              Without intervention
            </div>
          </div>

          {/* Mitigated Delay */}
          <div style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.375rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Clock size={17} style={{ color: '#10B981' }} />
              <span style={{
                fontSize: 'var(--font-xs)', fontWeight: 700,
                color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Mitigated Delay</span>
            </div>
            <div style={{
              fontSize: 'var(--font-xl)', fontWeight: 900,
              color: '#10B981', letterSpacing: '-0.02em',
            }}>{mitigatedDelay} min</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.3rem' }}>
              With active plan
            </div>
          </div>

          {/* Reduction Ring */}
          <div style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.375rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', width: '100%' }}>
              <TrendingDown size={17} style={{ color: '#10B981' }} />
              <span style={{
                fontSize: 'var(--font-xs)', fontWeight: 700,
                color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Reduction</span>
            </div>
            <div style={{
              position: 'relative', width: '80px', height: '80px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="30" stroke="rgba(16,185,129,0.12)" strokeWidth="5" fill="transparent" />
                <motion.circle
                  cx="40" cy="40" r="30"
                  stroke="#10B981" strokeWidth="5" fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - numericReduction / 100) }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <span style={{
                fontSize: 'var(--font-md)', fontWeight: 900,
                color: '#10B981', zIndex: 1,
              }}>{numericReduction}%</span>
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.5rem' }}>Delay reduction</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
