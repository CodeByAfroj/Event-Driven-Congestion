import { motion } from 'framer-motion';
import { ArrowDownToLine, TrendingDown, Clock } from 'lucide-react';
import type { SimulationScenario } from '@/types';
import { formatKey } from '@/utils/formatters';

interface SimulationScenariosCardProps {
  data: SimulationScenario[];
}

export const SimulationScenariosCard = ({ data }: SimulationScenariosCardProps) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((s) => ({
    name: s.scenario || formatKey(String(Object.values(s)[0])),
    delay: s.delay_minutes ?? (Object.entries(s).find(([k]) => k.toLowerCase().includes('delay'))?.[1] as number) ?? 0,
    reduction: s.reduction_percent ?? (Object.entries(s).find(([k]) => k.toLowerCase().includes('reduction'))?.[1] as number) ?? 0,
  }));

  const baseDelay = chartData[0]?.delay || 89;
  const fullResponseDelay = chartData[chartData.length - 1]?.delay || 31;
  const minutesSaved = baseDelay - fullResponseDelay;
  const reductionPercent = chartData[chartData.length - 1]?.reduction || 65;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2 mb-2">
            <TrendingDown className="text-emerald-500" size={16} />
            Mitigation Simulation Scenarios
          </h3>
          <h2 className="text-2xl font-black text-white">Delay Reduction Optimization</h2>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-6">
          <div>
            <p className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Minutes Saved</p>
            <p className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              {minutesSaved} <ArrowDownToLine size={20} />
            </p>
          </div>
          <div className="w-px h-10 bg-emerald-500/20" />
          <div>
            <p className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Reduction</p>
            <p className="text-2xl font-black text-emerald-400">{reductionPercent}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.map((scenario, idx) => {
          const isFullResponse = idx === chartData.length - 1;
          const isBaseline = idx === 0;

          return (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-6 border transition-all ${
                isFullResponse 
                  ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                  : isBaseline
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-gray-800/30 border-gray-700/50'
              }`}
            >
              {isFullResponse && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-gray-900 text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-bl-xl">
                  Recommended
                </div>
              )}

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 h-8">{scenario.name}</p>
              
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-4xl font-black ${
                  isBaseline ? 'text-red-400' : isFullResponse ? 'text-emerald-400' : 'text-white'
                }`}>
                  {scenario.delay}
                </span>
                <span className="text-sm font-bold text-gray-500 mb-1">min</span>
              </div>
              
              <p className="text-xs font-medium text-gray-400">
                {isBaseline ? 'Baseline congestion delay' : `Reduces delay by ${scenario.reduction}%`}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
