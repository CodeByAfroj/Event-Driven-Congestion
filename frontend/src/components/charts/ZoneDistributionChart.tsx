import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { CHART_COLORS } from '@/utils/colors';
import { formatNumber } from '@/utils/formatters';

interface ZoneDistributionChartProps {
  data: Record<string, number>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(10, 16, 26, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.2)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{payload[0].name}</p>
        <p className="text-xl font-black" style={{ color: payload[0].fill }}>{formatNumber(payload[0].value)}</p>
        <p className="text-xs font-bold" style={{ color: 'var(--text)', marginTop: '0.2rem' }}>{payload[0].payload.pct}% <span style={{color: 'var(--muted)', fontWeight: 500}}>of total</span></p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
    {payload?.map((entry: any, i: number) => (
      <div key={i} className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
          <span style={{ color: 'var(--text-secondary)' }} className="truncate max-w-[100px]">{entry.value}</span>
        </div>
        <span className="font-bold text-white ml-2">{entry.payload.pct}%</span>
      </div>
    ))}
  </div>
);

export const ZoneDistributionChart = ({ data }: ZoneDistributionChartProps) => {
  const total = Object.values(data || {}).reduce((a, b) => a + b, 0);
  const chartData = Object.entries(data || {}).map(([key, value]) => ({
    name: key,
    value,
    pct: total > 0 ? ((value / total) * 100).toFixed(1) : '0',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
      style={{ background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.03) 100%)', border: '1px solid var(--border)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
    >
      <div className="mb-6">
        <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
          <Compass size={12} className="text-blue-500" />
          ZONE DISTRIBUTION
        </h3>
        <p className="text-xs text-gray-400 mt-1">Incident spread by operational zone</p>
      </div>

      <div className="flex flex-col">
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.4))' }}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <CustomLegend payload={chartData.map((d, i) => ({ value: d.name, color: CHART_COLORS[i % CHART_COLORS.length], payload: d }))} />
      </div>
    </motion.div>
  );
};
