import { motion } from 'framer-motion';
import { Megaphone, Copy, Download, Share2 } from 'lucide-react';
import type { PredictResponse } from '@/types';

export const PublicAdvisory = ({ prediction }: { prediction: PredictResponse }) => {
  const impact = prediction.impact_analysis;
  const delay = Number(prediction.commander?.expected_delay || 89);
  const reduction = Number(prediction.commander?.expected_reduction || 65);
  const mitigated = Math.round(delay * (1 - reduction / 100));

  const advisoryText = `PUBLIC TRAFFIC ADVISORY\n\nHeavy congestion is expected near ${impact?.affected_junctions?.[0] || 'the identified impact area'}.\n\nAffected Area: ${impact?.impact_radius_km || 2.63} km\nAffected Vehicles: ~${impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'}\nExpected Delay: ${delay} minutes\n\nAvoid travel during peak hours.\nExpected clearance: ${mitigated} minutes after deployment.\n\nIssued by: Traffic Operations Command Center`;

  const copyAdvisory = () => navigator.clipboard.writeText(advisoryText);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(239,68,68,0.2)',
        background: 'linear-gradient(135deg, rgba(15,22,35,0.99), rgba(239,68,68,0.03))',
        overflow: 'hidden',
      }}
    >
      {/* Red header */}
      <div style={{
        background: '#EF4444', padding: '0.875rem 2rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <Megaphone size={18} color="white" />
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'white', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Public Traffic Advisory
        </span>
      </div>

      <div style={{ padding: '2rem' }}>
        <p style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Heavy congestion is expected near the identified impact area.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Affected Area', value: `${impact?.impact_radius_km || 2.63} km` },
            { label: 'Affected Vehicles', value: `~${impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'}` },
            { label: 'Expected Delay', value: `${delay} minutes` },
            { label: 'Clearance (post-deployment)', value: `${mitigated} minutes` },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
            }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.2rem' }}>{item.label}</div>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 'var(--font-sm)', color: '#F59E0B', fontWeight: 700, marginBottom: '1.25rem' }}>
          ⚠ Avoid travel during peak hours near the incident zone.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { icon: <Copy size={14} />, label: 'Copy Advisory', action: copyAdvisory },
            { icon: <Download size={14} />, label: 'Download', action: () => {} },
            { icon: <Share2 size={14} />, label: 'Share', action: () => {} },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
                color: 'var(--text)', fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
