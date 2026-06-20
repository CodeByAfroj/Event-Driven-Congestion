import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Activity, Clock, Shield, Zap } from 'lucide-react';
import type { PredictResponse } from '@/types';

export const SimulationCenter = ({
  prediction,
}: {
  prediction: PredictResponse;
}) => {

  const data =
    prediction.simulation?.map((item) => ({
      name: item.scenario,
      delay: Number(item.delay_minutes),
    })) || [];

  const reduction =
    prediction.commander?.expected_reduction || "65%";

  const icons = [
    <Clock size={16} color="#EF4444" />,
    <Shield size={16} color="#F59E0B" />,
    <Zap size={16} color="#3B82F6" />,
    <Activity size={16} color="#10B981" />
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.02) 100%)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Header */}
      <div
        style={{
          padding: '1.75rem 2rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.01)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              color: '#3B82F6',
              fontSize: 'var(--font-xs)',
              fontWeight: 800,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
            }}
          >
            OPERATIONAL IMPACT SIMULATOR
          </div>

          <h2
            style={{
              marginTop: '0.25rem',
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            Optimization Comparison
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#10B981',
            fontWeight: 800,
            fontSize: 'var(--font-sm)',
            padding: '0.6rem 1.25rem',
            borderRadius: '999px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            boxShadow: '0 4px 20px rgba(16,185,129,0.15)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          {reduction} Delay Reduced
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid-kpi" style={{ padding: '2rem 2rem 1.5rem 2rem' }}>
        {data.map((item, index) => {

          const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
          const bgColors = ['rgba(239,68,68,0.05)', 'rgba(245,158,11,0.05)', 'rgba(59,130,246,0.05)', 'rgba(16,185,129,0.08)'];
          const borderColors = ['rgba(239,68,68,0.2)', 'rgba(245,158,11,0.2)', 'rgba(59,130,246,0.2)', 'rgba(16,185,129,0.3)'];

          const recommended = index === data.length - 1;

          return (
            <motion.div
              whileHover={{ y: -4 }}
              key={index}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: bgColors[index],
                border: `1px solid ${borderColors[index]}`,
                boxShadow: recommended ? '0 8px 32px rgba(16,185,129,0.15), inset 0 1px 0 rgba(16,185,129,0.3)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {recommended && (
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.25rem 0.75rem', background: '#10B981', color: '#000', fontSize: '10px', fontWeight: 900, borderBottomLeftRadius: '8px' }}>
                  AI CHOICE
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  letterSpacing: '.08em',
                }}
              >
                {icons[index]}
                {item.name}
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: colors[index],
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {item.delay} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--muted)' }}>min</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <div
        style={{
          flex: 1,
          minHeight: 280,
          padding: '0 2rem 2rem 0.5rem',
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="delayFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />

            <XAxis
              dataKey="name"
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />

            <Tooltip
              contentStyle={{ background: 'var(--bg-popover)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: 'var(--text)', fontWeight: 700 }}
              labelStyle={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}
            />

            <Area
              type="monotone"
              dataKey="delay"
              stroke="#3B82F6"
              strokeWidth={4}
              fill="url(#delayFill)"
              activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
