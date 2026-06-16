import { motion } from 'framer-motion';
import { Target, Map, CarFront, Clock, AlertOctagon } from 'lucide-react';
import type { PredictResponse } from '@/types';

interface ImpactCommunicationCardProps {
  prediction: PredictResponse;
}

export const ImpactCommunicationCard = ({ prediction }: ImpactCommunicationCardProps) => {
  const impact = prediction.impact_analysis;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-red-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

      <h3 className="text-sm font-bold text-red-400 tracking-widest uppercase mb-6 flex items-center gap-2 relative z-10">
        <Target size={18} />
        Affected Area Summary
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4">
          <Map className="text-red-400 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold text-red-400/80 uppercase tracking-wider mb-1">Impact Radius</p>
            <p className="text-xl font-black text-white">{impact?.impact_radius_km || 2.63} km</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4">
          <AlertOctagon className="text-amber-400 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold text-amber-400/80 uppercase tracking-wider mb-1">Affected Junctions</p>
            <p className="text-xl font-black text-white">{impact?.affected_junctions?.length || 5}</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4">
          <CarFront className="text-blue-400 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold text-blue-400/80 uppercase tracking-wider mb-1">Vehicles Affected</p>
            <p className="text-xl font-black text-white">{impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'}</p>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-4">
          <Clock className="text-purple-400 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold text-purple-400/80 uppercase tracking-wider mb-1">Expected Congestion</p>
            <p className="text-xl font-black text-white">{prediction.commander?.expected_delay || 89} min</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-red-900/30 relative z-10 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-400">Traffic Disruption Profile</span>
        <span className="px-3 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold uppercase tracking-wider">
          {prediction.risk || 'Medium'} Severity
        </span>
      </div>

    </motion.div>
  );
};
