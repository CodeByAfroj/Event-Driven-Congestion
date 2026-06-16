import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, Zap, BarChart2 } from 'lucide-react';
import type { SimulationScenario } from '@/types';
import { formatKey } from '@/utils/formatters';

interface SimulationChartProps {
  data: SimulationScenario[];
}

const getScenarioDescription = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('no action')) return 'Baseline unmitigated congestion delay';
  if (lower.includes('officer')) return 'Manual traffic policing control';
  if (lower.includes('diversion')) return 'Systematic rerouting configuration';
  return 'Full AI co-pilot command response';
};

const SCENARIO_COLORS: Record<string, string> = {
  'no action': '#EF4444',
  'officer deployment': '#F59E0B',
  'diversion strategy': '#3B82F6',
  'full response plan': '#10B981',
};

export const SimulationChart = ({ data }: SimulationChartProps) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((s) => ({
    name: s.scenario || formatKey(String(Object.values(s)[0])),
    delay: s.delay_minutes ?? (Object.entries(s).find(([k]) => k.toLowerCase().includes('delay'))?.[1] as number) ?? 0,
    reduction: s.reduction_percent ?? (Object.entries(s).find(([k]) => k.toLowerCase().includes('reduction'))?.[1] as number) ?? 0,
    color: SCENARIO_COLORS[s.scenario?.toLowerCase() || ''] || '#3B82F6',
  }));

  const fullResponse = chartData.find(c => c.name.toLowerCase().includes('full')) || chartData[chartData.length - 1];
  const maxDelay = Math.max(...chartData.map(d => d.delay));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-8 space-y-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={14} color="#10B981" />
            <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Operational Impact Simulator</h3>
          </div>
          <p className="text-xl font-extrabold tracking-tight text-white">Delay Reduction Optimization Comparison</p>
        </div>

        {fullResponse && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center">
            <TrendingDown size={14} />
            {fullResponse.reduction}% delay reduction achieved
          </div>
        )}
      </div>

      {/* Row list visualizer comparing steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {chartData.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border flex flex-col justify-between space-y-3 relative overflow-hidden transition-all hover:bg-gray-800/20"
            style={{
              borderColor: s.name.toLowerCase().includes('full') ? 'rgba(16,185,129,0.3)' : 'var(--border)',
              background: s.name.toLowerCase().includes('full') ? 'rgba(16,185,129,0.02)' : 'transparent',
            }}
          >
            {/* Visual accent vertical indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: s.color }} />

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">{s.name}</span>
              <p className="text-2xl font-black text-white">{s.delay} min</p>
            </div>

            <div className="text-[10px] text-gray-400 leading-normal">
              {getScenarioDescription(s.name)}
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Area Chart displaying the optimized mitigation curve */}
      <div className="h-60 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxDelay + 10]}
            />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
              labelStyle={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#3B82F6' }}
            />
            <Area
              type="monotone"
              dataKey="delay"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDelay)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
