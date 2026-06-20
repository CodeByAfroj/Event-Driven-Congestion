import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';

export const DecisionTimeline = () => {
  const steps = [
    { label: 'Incident Reported', sublabel: 'Event parameters received', color: '#3B82F6', done: true },
    { label: 'Historical Analysis Completed', sublabel: '4,896 similar events cross-referenced', color: '#8B5CF6', done: true },
    { label: 'Risk Level Predicted', sublabel: 'Medium severity identified', color: '#F59E0B', done: true },
    { label: 'Impact Zone Generated', sublabel: '2.63 km radius calculated', color: '#EF4444', done: true },
    { label: 'Resources Allocated', sublabel: '13 officers, 1 barricade assigned', color: '#10B981', done: true },
    { label: 'Response Plan Generated', sublabel: 'Full deployment protocol ready', color: '#10B981', done: true },
    { label: 'Ready for Deployment', sublabel: 'Awaiting commander authorization', color: '#10B981', done: false, current: true },
  ];

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
      <SectionLabel>Decision Timeline</SectionLabel>

      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{
          position: 'absolute', left: '8px', top: '8px', bottom: '8px', width: '1px',
          background: 'linear-gradient(to bottom, #3B82F6, #8B5CF6, #F59E0B, #EF4444, #10B981)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: '-1.5rem', top: '2px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: step.current ? 'transparent' : step.done ? step.color : 'var(--bg-raised)',
                border: `2px solid ${step.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
                ...(step.current ? { animation: 'none' } : {}),
              }}>
                {step.done && !step.current && (
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <polyline points="1.5,4 3.5,6 6.5,2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {step.current && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: step.color, animation: 'pulse 2s infinite' }} />
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: step.current ? 800 : 700,
                    color: step.current ? step.color : '#F8FAFC',
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.15rem' }}>
                  {step.sublabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
