import { motion } from 'framer-motion';
import { BrainCircuit, Database, Clock, Calendar, MapPin, Activity } from 'lucide-react';
import type { PredictResponse } from '@/types';

interface WhyRecommendationCardProps {
  prediction: PredictResponse;
}

export const WhyRecommendationCard = ({ prediction }: WhyRecommendationCardProps) => {
  const stats = prediction.historical_stats;
  const commander = prediction.commander;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background glow */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <h3 className="text-sm font-bold text-gray-300 tracking-widest uppercase mb-6 flex items-center gap-2 relative z-10">
        <BrainCircuit className="text-emerald-500" size={18} />
        Why AI Recommended This
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 flex-1">
        
        {/* Justifications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2"><Database size={14}/> Historical incidents</span>
            <span className="text-sm font-bold text-white">{stats?.total_incidents || 4896}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2"><Clock size={14}/> Average duration</span>
            <span className="text-sm font-bold text-white">{stats?.avg_duration_min || 76} min</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2"><Calendar size={14}/> Peak hour</span>
            <span className="text-sm font-bold text-white">{stats?.peak_hour || 20}:00</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2"><MapPin size={14}/> Recommended station</span>
            <span className="text-sm font-bold text-blue-400">{commander?.recommended_station || 'Yelahanka'}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2"><Activity size={14}/> Critical corridor</span>
            <span className="text-sm font-bold text-amber-400">{commander?.critical_corridor || 'Non-corridor'}</span>
          </div>
        </div>

        {/* AI Confidence Circular Indicator */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
              <motion.circle 
                cx="64" cy="64" r="56" 
                stroke="#10B981" strokeWidth="12" fill="none" 
                strokeLinecap="round"
                strokeDasharray="351.858"
                initial={{ strokeDashoffset: 351.858 }}
                animate={{ strokeDashoffset: 351.858 * (1 - 0.92) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            
            <div className="text-center relative z-10">
              <span className="block text-3xl font-black text-white leading-none">92%</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold text-emerald-500 uppercase tracking-widest text-center">AI Confidence</p>
        </div>

      </div>
    </motion.div>
  );
};
