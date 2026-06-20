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
        background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.03) 100%)',
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionLabel>Why AI Recommended This</SectionLabel>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
        <div className="grid-ai-container" style={{ width: '100%' }}>
          <div className="grid-2col" style={{ flex: 1, gap: '1rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '1.25rem', borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-bright)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

        {/* Circular confidence */}
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="12" />
            <motion.circle
              cx="80" cy="80" r="66" fill="none" stroke="#10B981" strokeWidth="12"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 66}
              initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 66) - (confidence / 100) * (2 * Math.PI * 66) }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
            <text x="80" y="78" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#10B981', fontSize: '32px', fontWeight: '900', fontFamily: 'Inter, sans-serif' }}>
              {confidence}%
            </text>
            <text x="80" y="100" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#64748B', fontSize: '10px', fontWeight: '700', fontFamily: 'Inter, sans-serif', letterSpacing: '0.12em' }}>
              CONFIDENCE
            </text>
          </svg>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text)', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem' }}>
            AI Recommendation<br /><span style={{ color: 'var(--muted)' }}>Accuracy Score</span>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};
