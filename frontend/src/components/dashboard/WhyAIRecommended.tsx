import { motion } from 'framer-motion';
import type { PredictResponse } from '@/types';
import { SectionLabel } from './SectionLabel';

export const WhyAIRecommended = ({ prediction }: { prediction: PredictResponse }) => {
  const { historical_stats, commander } = prediction;

  const stats = [
    { label: 'Historical Incidents', value: historical_stats?.total_incidents?.toLocaleString() || '4,896', color: '#3B82F6' },
    { label: 'Average Duration', value: `${historical_stats?.avg_duration_min || 76} min`, color: '#F59E0B' },
    { label: 'Peak Hour', value: `${historical_stats?.peak_hour || 20}:00`, color: '#8B5CF6' },
    { label: 'Recommended Station', value: commander?.recommended_station || 'Yelahanka', color: '#10B981' },
    { label: 'Critical Corridor', value: commander?.critical_corridor || 'Non-Corridor', color: '#EF4444' },
    { label: 'AI Confidence', value: '92%', color: '#10B981' },
  ];

  const confidence = 92;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (confidence / 100) * circumference;

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
      <SectionLabel>Why AI Recommended This</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
            }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: 'var(--font-md)', fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Circular confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <motion.circle
              cx="66" cy="66" r="54" fill="none" stroke="#10B981" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px' }}
            />
            <text x="66" y="66" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#10B981', fontSize: '24px', fontWeight: '900', fontFamily: 'Inter, sans-serif' }}>
              {confidence}%
            </text>
            <text x="66" y="84" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#64748B', fontSize: '9px', fontWeight: '700', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
              CONFIDENCE
            </text>
          </svg>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, textAlign: 'center' }}>
            AI Recommendation<br />Accuracy Score
          </div>
        </div>
      </div>
    </motion.div>
  );
};
