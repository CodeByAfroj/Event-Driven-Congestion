import { motion } from 'framer-motion';
import { Megaphone, AlertCircle, Share2, Copy } from 'lucide-react';
import type { PredictResponse } from '@/types';

interface PublicAdvisoryCardProps {
  prediction: PredictResponse;
}

export const PublicAdvisoryCard = ({ prediction }: PublicAdvisoryCardProps) => {
  const impact = prediction.impact_analysis;
  const delay = prediction.commander?.expected_delay || 89;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-2xl relative text-gray-900 flex flex-col"
    >
      {/* Warning Header */}
      <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
        <AlertCircle className="text-white" size={24} />
        <h2 className="text-lg font-black text-white tracking-widest uppercase">Public Traffic Advisory</h2>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          <p className="text-xl font-semibold text-gray-800 leading-snug">
            Heavy congestion is expected near <span className="font-black text-red-600">{impact?.affected_junctions?.[0] || 'Mekhri Circle'}</span> due to a {prediction.risk || 'Medium'}-risk incident.
          </p>

          <div className="bg-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Affected Radius</span>
              <span className="text-sm font-black text-gray-800">{impact?.impact_radius_km || 2.63} km</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Expected Impact</span>
              <span className="text-sm font-black text-gray-800">{impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'} vehicles</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Expected Duration</span>
              <span className="text-sm font-black text-gray-800">{delay} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avoidance Period</span>
              <span className="text-sm font-black text-red-600">8 PM – 10 PM</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 font-medium italic border-l-4 border-red-500 pl-3">
            Commuters are advised to use alternate routes. Traffic police are deployed on-site to assist.
          </p>
        </div>

        {/* Action Buttons for communication dashboard */}
        <div className="flex gap-3 mt-8">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
            <Share2 size={18} />
            Publish to Socials
          </button>
          <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-colors border border-gray-300">
            <Copy size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
