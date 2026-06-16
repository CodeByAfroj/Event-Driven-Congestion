import type { RiskLevel } from '@/types';

export const getRiskColor = (risk: RiskLevel): string => {
  const r = risk?.toLowerCase();
  if (r === 'low') return '#10B981';
  if (r === 'medium') return '#F59E0B';
  if (r === 'high') return '#EF4444';
  return '#9CA3AF';
};

export const getRiskGlow = (risk: RiskLevel): string => {
  const r = risk?.toLowerCase();
  if (r === 'low') return 'rgba(16,185,129,0.2)';
  if (r === 'medium') return 'rgba(245,158,11,0.2)';
  if (r === 'high') return 'rgba(239,68,68,0.2)';
  return 'rgba(156,163,175,0.1)';
};

export const getRiskBg = (risk: RiskLevel): string => {
  const r = risk?.toLowerCase();
  if (r === 'low') return 'rgba(16,185,129,0.08)';
  if (r === 'medium') return 'rgba(245,158,11,0.08)';
  if (r === 'high') return 'rgba(239,68,68,0.08)';
  return 'rgba(156,163,175,0.05)';
};

export const CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
];
