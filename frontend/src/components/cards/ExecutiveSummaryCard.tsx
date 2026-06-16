import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import type { PredictResponse } from '@/types';

interface ExecutiveSummaryCardProps {
  prediction: PredictResponse;
}

export const ExecutiveSummaryCard = ({ prediction }: ExecutiveSummaryCardProps) => {
  const commander = prediction.commander;
  const impact = prediction.impact_analysis;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />

      <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
        <Terminal className="text-blue-500" size={14} />
        Executive Summary
      </h3>

      <p className="text-lg md:text-xl font-medium text-gray-300 leading-relaxed max-w-5xl">
        A <strong className="text-white">{prediction.risk || 'Medium'}-risk</strong> vehicle breakdown event detected. 
        <strong className="text-white"> 4896</strong> similar incidents identified. 
        AI recommends deploying <strong className="text-white">{prediction.optimization?.officers || 13} officers</strong> from <strong className="text-white">{commander?.recommended_station || 'Yelahanka'}</strong> station. 
        Expected congestion impact: <strong className="text-white">{impact?.estimated_vehicle_impact?.toLocaleString() || 1713} vehicles</strong>. 
        Expected delay reduction: <strong className="text-white">{commander?.expected_reduction || 65}%</strong>. 
        Operational plan is ready for execution.
      </p>
    </motion.div>
  );
};
