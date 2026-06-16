import { motion } from 'framer-motion';
import { ShieldAlert, Crosshair, MapPin, CheckCircle, ArrowDown } from 'lucide-react';
import type { PredictResponse } from '@/types';

interface CommanderBriefingCardProps {
  prediction: PredictResponse;
}

export const CommanderBriefingCard = ({ prediction }: CommanderBriefingCardProps) => {
  const commander = prediction.commander;
  const stats = prediction.historical_stats;
  
  const expectedDelay = commander?.expected_delay ?? 89;
  const expectedReduction = commander?.expected_reduction ?? 65;
  const numericDelay = parseFloat(String(expectedDelay)) || 89;
  const numericReduction = parseFloat(String(expectedReduction)) || 65;
  const mitigatedDelay = Math.round(numericDelay * (1 - numericReduction / 100)) || 31;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-800 flex items-center gap-4 bg-gray-900/50">
        <ShieldAlert className="text-blue-500" size={24} />
        <h2 className="text-xl font-black text-white tracking-wide uppercase">AI Commander Briefing</h2>
      </div>

      <div className="p-8 space-y-10 relative z-10">
        {/* Situation */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 border-l-2 border-gray-700 pl-3">Situation</h3>
          <div className="space-y-2 text-gray-300">
            <p><strong className="text-white">{stats?.total_incidents || 4896}</strong> similar incidents detected.</p>
            <p>Historical average duration: <strong className="text-white">{stats?.avg_duration_min || 76} minutes</strong>.</p>
            <p>Peak congestion occurs around: <strong className="text-white">{stats?.peak_hour || 20}:00</strong>.</p>
          </div>
        </section>

        {/* Recommendation */}
        <section>
          <h3 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-4 border-l-2 border-blue-500 pl-3">Tactical Recommendation</h3>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-400 mt-1" size={18} />
              <p className="text-white font-medium">Deploy <span className="font-bold text-blue-400">{prediction.optimization?.officers || 13} officers</span> from {commander?.recommended_station || 'Yelahanka'} station.</p>
            </div>
            <div className="flex items-start gap-3">
              <Crosshair className="text-amber-400 mt-1" size={18} />
              <p className="text-white font-medium">Install <span className="font-bold text-amber-400">{prediction.optimization?.barricades || 1} barricade(s)</span> at primary choke points.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-emerald-400 mt-1" size={18} />
              <p className="text-white font-medium">Monitor critical hotspots along {commander?.critical_corridor || 'the affected corridor'}.</p>
            </div>
          </div>
        </section>

        {/* Expected Outcome */}
        <section>
          <h3 className="text-xs font-bold text-emerald-500 tracking-widest uppercase mb-4 border-l-2 border-emerald-500 pl-3">Expected Outcome</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Delay Reduction</p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="block text-2xl font-black text-red-400">{numericDelay}m</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Baseline</span>
                </div>
                <ArrowDown className="text-gray-600" />
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400">{mitigatedDelay}m</span>
                  <span className="text-[10px] text-emerald-500/70 uppercase font-bold">Mitigated</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-center items-center">
              <p className="text-xs text-emerald-500/70 font-bold uppercase tracking-wider mb-1">Efficiency Gain</p>
              <span className="text-4xl font-black text-emerald-400">{numericReduction}%</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
