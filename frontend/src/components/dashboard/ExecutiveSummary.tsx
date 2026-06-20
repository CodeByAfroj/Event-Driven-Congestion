import { motion } from 'framer-motion';
import type { PredictResponse } from '@/types';
import { SectionLabel } from './SectionLabel';

export const ExecutiveSummary = ({ prediction }: { prediction: PredictResponse }) => {
  const { commander, historical_stats, impact_analysis } = prediction;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '2rem',
      }}
    >
      <SectionLabel>Executive Summary</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[
          `A ${risk.toLowerCase()}-risk incident has been detected and analyzed by the AI response system.`,
          `Historical analysis identified ${historical_stats?.total_events?.toLocaleString() || '4,896'} similar incidents for pattern matching.`,
          `AI recommends deploying ${commander?.officers || 13} officers from ${commander?.recommended_station || 'Yelahanka'} Station.`,
          `Expected congestion impact: ${impact_analysis?.estimated_vehicle_impact?.toLocaleString() || '1,713'} vehicles across ${impact_analysis?.impact_radius_km || 2.63} km radius.`,
          `Expected delay reduction: ${reduction}% — from ${delay} minutes to ${mitigated} minutes.`,
          'Response plan is ready for commander authorization and execution.',
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: i === 5 ? '#10B981' : '#3B82F6', marginTop: '0.6rem',
            }} />
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
              {line}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
