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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: '28px',
        overflow: 'hidden',
        border: '1px solid rgba(59,130,246,0.15)',
        background: '#08111F',
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              color: '#10B981',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.12em',
            }}
          >
            OPERATIONAL IMPACT SIMULATOR
          </div>

          <h2
            style={{
              marginTop: 8,
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            Delay Reduction Optimization Comparison
          </h2>
        </div>

        <div
          style={{
            color: '#10B981',
            fontWeight: 700,
            padding: '.55rem 1rem',
            borderRadius: 999,
            background: 'rgba(16,185,129,.08)',
            border: '1px solid rgba(16,185,129,.2)',
          }}
        >
          ↘ {reduction} delay reduction achieved
        </div>
      </div>

      {/* Scenario Cards */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1rem',
          padding: '1.5rem',
        }}
      >
        {data.map((item, index) => {

          const colors = [
            '#EF4444',
            '#F59E0B',
            '#3B82F6',
            '#10B981'
          ];

          const recommended =
            index === data.length - 1;

          return (
            <div
              key={index}
              style={{
                padding: '1.25rem',
                borderRadius: '20px',
                background:
                  recommended
                    ? 'rgba(16,185,129,.05)'
                    : '#0D1728',
                border: recommended
                  ? '1px solid rgba(16,185,129,.35)'
                  : '1px solid rgba(255,255,255,.06)',
              }}
            >
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  marginTop: '.4rem',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: colors[index],
                }}
              >
                {item.delay} min
              </div>

              <div
                style={{
                  marginTop: '.3rem',
                  fontSize: 13,
                  color: 'var(--muted)',
                }}
              >
                {index === 0 &&
                  'Baseline unmitigated congestion delay'}

                {index === 1 &&
                  'Manual traffic policing control'}

                {index === 2 &&
                  'Systematic rerouting configuration'}

                {index === 3 &&
                  'Full AI co-pilot command response'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}

      <div
        style={{
          height: 320,
          padding: '0 1rem 1rem',
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="delayFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3B82F6"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1F2937"
            />

            <XAxis
              dataKey="name"
              stroke="#64748B"
            />

            <YAxis
              stroke="#64748B"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="delay"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#delayFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
