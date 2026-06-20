import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { CHART_COLORS } from '@/utils/colors';
import { formatKey, formatNumber } from '@/utils/formatters';

interface EventCauseChartProps {
  data: Record<string, number>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(10, 16, 26, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.2)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{formatKey(label)}</p>
        <p className="text-xl font-black" style={{ color: 'var(--primary)' }}>{formatNumber(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const EventCauseChart = ({ data }: EventCauseChartProps) => {
  const chartData = Object.entries(data || {}).map(([key, value]) => ({
    name: key,
    value,
    label: formatKey(key),
  })).sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl p-6 sm:p-8"
      style={{ background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.03) 100%)', border: '1px solid var(--border)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
    >
      <div className="mb-6">
        <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
          <BarChart2 size={12} className="text-blue-500" />
          EVENT CAUSE BREAKDOWN
        </h3>
        <p className="text-xs text-gray-400 mt-1">Incident frequency by cause type</p>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
