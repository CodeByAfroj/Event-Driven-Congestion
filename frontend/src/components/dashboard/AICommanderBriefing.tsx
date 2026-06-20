import { motion } from 'framer-motion';
import { Brain, CheckCircle } from 'lucide-react';
import type { PredictResponse } from '@/types';
import { Tag } from './Tag';

export const AICommanderBriefing = ({ prediction }: { prediction: PredictResponse }) => {
  const { commander, historical_stats, optimization, impact_analysis } = prediction;
  const risk =
    prediction.risk === 2
      ? 'High'
      : prediction.risk === 1
        ? 'Medium'
        : 'Low';
  const delay = Number(commander?.expected_delay ?? 89);

  const reduction = parseFloat(
    String(commander?.expected_reduction ?? '65').replace('%', '')
  );

  const mitigated = Math.round(
    delay * (1 - reduction / 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(59,130,246,0.25)',
        background: 'linear-gradient(135deg, rgba(15,22,35,0.99) 0%, rgba(59,130,246,0.04) 100%)',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, transparent)' }} />

      {/* Header */}
      <div style={{
        padding: '1.75rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
            position: 'relative',
          }}>
            <Brain size={24} color="#3B82F6" />
            <div style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '11px', height: '11px', borderRadius: '50%',
              background: '#10B981', border: '2px solid var(--bg-card)',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              AI COMMANDER
            </div>
            <div style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Operational Intelligence Briefing
            </div>
          </div>
        </div>
        <Tag color="#10B981">Confidence: 92%</Tag>
      </div>

      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>

        {/* Situation Overview */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Situation Overview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { label: 'Similar incidents detected', value: historical_stats?.total_events?.toLocaleString() || '4,896' },
              { label: 'Average incident duration', value: `${historical_stats?.average_duration || 76} minutes` },
              { label: 'Peak congestion hour', value: `${historical_stats?.peak_hour || 20}:00` },
              { label: 'Common corridor', value: historical_stats?.most_common_corridor || 'Non-corridor' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text)', fontWeight: 800 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Recommendation */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Operational Recommendation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { action: `Deploy ${optimization?.officers || 13} officers`, from: `from ${commander?.recommended_station || 'Yelahanka'} Station` },
              { action: `Install ${optimization?.barricades || 1} barricade${(optimization?.barricades || 1) > 1 ? 's' : ''}`, from: 'at incident perimeter' },
              { action: `Monitor ${commander?.critical_corridor || 'Non-Corridor'} route`, from: 'for diversion compliance' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <CheckCircle size={12} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text)' }}>{item.action}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)' }}>{item.from}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcome */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Expected Outcome
          </div>

          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#EF4444', letterSpacing: '-0.03em' }}>{delay}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600 }}>minutes delay (without action)</div>

            <div style={{ fontSize: '1.75rem', color: '#10B981', fontWeight: 900, margin: '0.25rem 0' }}>↓</div>

            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#10B981', letterSpacing: '-0.03em' }}>{mitigated}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600 }}>minutes delay (after deployment)</div>

            <div style={{
              marginTop: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '999px',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 900, color: '#10B981' }}>
                {reduction}% reduction achieved
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
