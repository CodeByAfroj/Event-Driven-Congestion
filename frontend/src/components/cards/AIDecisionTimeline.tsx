import { motion } from 'framer-motion';
import { Activity, Database, AlertTriangle, Map, Users, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AIDecisionTimeline = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const d = new Date();
    setCurrentTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
  }, []);

  const steps = [
    { label: 'Incident detected', icon: <Activity size={14} />, color: '#3B82F6' },
    { label: 'Historical patterns analyzed', icon: <Database size={14} />, color: '#8B5CF6' },
    { label: 'Risk predicted as Medium', icon: <AlertTriangle size={14} />, color: '#F59E0B' },
    { label: 'Impact zone calculated', icon: <Map size={14} />, color: '#EF4444' },
    { label: 'Resource deployment generated', icon: <Users size={14} />, color: '#10B981' },
    { label: 'Operational plan ready', icon: <CheckCircle size={14} />, color: '#10B981' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <h3 className="text-sm font-bold text-gray-300 tracking-widest uppercase mb-8 flex items-center gap-2">
        <Activity className="text-blue-500" size={16} />
        AI Decision Timeline
      </h3>

      <div className="relative border-l border-gray-700 ml-3 space-y-6">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
            className="relative pl-6"
          >
            {/* Timeline dot */}
            <div 
              className="absolute -left-[13px] top-1 w-[25px] h-[25px] rounded-full flex items-center justify-center border-2 border-gray-900 z-10"
              style={{ background: step.color }}
            >
              <div className="text-white drop-shadow-md">
                {step.icon}
              </div>
            </div>
            
            <div className="flex items-start justify-between bg-gray-800/30 border border-gray-700/50 p-3 rounded-xl ml-2 hover:bg-gray-800/80 transition-colors">
              <span className="text-sm font-semibold text-gray-200">{step.label}</span>
              <span className="text-xs font-mono text-gray-500 bg-gray-900/50 px-2 py-0.5 rounded border border-gray-700">{currentTime || '17:10'}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
