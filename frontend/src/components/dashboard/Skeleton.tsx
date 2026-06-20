export const Skeleton = ({ h = 120 }: { h?: number }) => (
  <div className="skeleton" style={{ height: h, borderRadius: 'var(--radius-card)' }} />
);
