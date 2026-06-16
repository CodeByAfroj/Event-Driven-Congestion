import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OperationalReadinessCard = () => {
  const readinessScore = 92;

  const resources = [
    'Police Station Ready',
    'Officers Available',
    'Diversion Routes Prepared',
    'Monitoring Active',
    'Response Plan Generated'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center gap-10"
    >
      <div className="flex-shrink-0 flex flex-col items-center">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Operational Readiness</h3>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
            <motion.circle 
              cx="80" cy="80" r="70" 
              stroke="#10B981" strokeWidth="12" fill="none" 
              strokeLinecap="round"
              strokeDasharray="439.8"
              initial={{ strokeDashoffset: 439.8 }}
              animate={{ strokeDashoffset: 439.8 * (1 - readinessScore / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          <div className="text-center relative z-10 flex flex-col items-center">
            <span className="block text-4xl font-black text-white leading-none">{readinessScore}%</span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1">Ready</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Resources Available</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map((res, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700/50"
            >
              <CheckCircle2 className="text-emerald-500" size={18} />
              <span className="text-sm font-semibold text-gray-200">{res}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
