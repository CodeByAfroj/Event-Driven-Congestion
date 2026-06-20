import { motion } from 'framer-motion';
import { getRiskColor } from '@/utils/colors';
import type { PredictResponse } from '@/types';
import { Tag } from './Tag';

export const MissionStatusBanner = ({ prediction }: { prediction?: PredictResponse }) => {

  const risk =
    prediction?.risk === 2
      ? 'High'
      : prediction?.risk === 1
        ? 'Medium'
        : 'Low';
  const riskColor = getRiskColor(risk);
  const delay = Number(prediction?.commander?.expected_delay ?? 89);

  const reduction = parseFloat(
    String(prediction?.commander?.expected_reduction ?? '65').replace('%', '')
  );

  const mitigated = Math.round(
    delay * (1 - reduction / 100)
  );
  const vehicles = prediction?.impact_analysis?.estimated_vehicle_impact || 1713;
  const radius = prediction?.impact_analysis?.impact_radius_km || 2.63;
  const isLive = !!prediction;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${isLive ? riskColor + '40' : 'var(--border)'}`,
        background: isLive
          ? `linear-gradient(135deg, rgba(15,22,35,0.98) 0%, ${riskColor}08 100%)`
          : 'var(--bg-card)',
      }}
    >
      {/* Ambient glow */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${riskColor}, transparent)`,
        }} />
      )}

      {/* Status strip */}
      <div style={{
        padding: '0.6rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isLive ? `${riskColor}12` : 'rgba(59,130,246,0.06)',
        borderBottom: `1px solid ${isLive ? riskColor + '25' : 'var(--border)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: isLive ? riskColor : '#64748B',
              animation: isLive ? 'none' : undefined,
              boxShadow: isLive ? `0 0 12px ${riskColor}` : 'none',
            }} />
            {isLive && (
              <div style={{
                position: 'absolute', width: '20px', height: '20px', borderRadius: '50%',
                border: `1px solid ${riskColor}`,
                animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }} />
            )}
          </div>
          <span style={{
            fontSize: 'var(--font-xs)', fontWeight: 800, letterSpacing: '0.14em',
            color: isLive ? riskColor : 'var(--muted)',
            textTransform: 'uppercase',
          }}>
            {isLive ? 'ACTIVE INCIDENT · RESPONSE READY' : 'SYSTEM STANDBY · AWAITING INCIDENT DATA'}
          </span>
        </div>
        <span style={{ fontSize: 'var(--font-xs)', fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)' }}>
          {new Date().toLocaleTimeString()} IST
        </span>
      </div>

      {/* Main content */}
      <div className={isLive ? 'banner-grid-live' : 'banner-grid'} style={{
        padding: '2rem 2rem 2.25rem',
      }}>
        {/* Event type */}
        <div style={{ padding: '0 1.5rem 0 0.5rem' }}>
          <div style={{
            fontSize: 'var(--font-xs)', fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            {isLive ? 'INCIDENT TYPE' : 'OPERATIONS CENTER'}
          </div>
          <div style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900,
            letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.1,
          }}>
            {isLive ? (prediction?.commander?.summary?.split(' ').slice(0, 3).join(' ') || 'Vehicle Breakdown') : 'Traffic Command'}
          </div>
          {isLive && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              <Tag color={riskColor}>Risk: {risk}</Tag>
              <Tag color="#10B981">Ready for Deployment</Tag>
            </div>
          )}
          {!isLive && (
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Configure an incident scenario below to engage AI-guided response.
            </p>
          )}
        </div>

        {isLive && (
          <>
            <div className="banner-divider" />

            {/* Key metrics strip */}
            <div className="banner-stats-grid" style={{ padding: '0 1.5rem' }}>
              {[
                { label: 'Affected Vehicles', value: vehicles.toLocaleString(), unit: 'units', color: '#F59E0B' },
                { label: 'Impact Radius', value: `${radius}`, unit: 'km', color: '#EF4444' },
                { label: 'Expected Delay', value: `${delay}`, unit: 'min', color: '#EF4444' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '0.5rem 1.25rem',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: m.color, letterSpacing: '-0.02em' }}>
                    {m.value}
                    <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--muted)', marginLeft: '0.3rem' }}>{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="banner-divider" />

            {/* Outcome */}
            <div className="banner-outcome">
              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Post-Deployment Delay
              </div>
              <div className="banner-outcome-val" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#10B981' }}>{mitigated}</span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)' }}>min</span>
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: '#10B981', fontWeight: 700, marginTop: '0.25rem' }}>
                ↓ {reduction}% reduction achieved
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
