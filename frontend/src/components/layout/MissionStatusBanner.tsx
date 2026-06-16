import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Navigation, Clock, ShieldCheck, Target } from 'lucide-react';
import { getRiskColor, getRiskBg } from '@/utils/colors';

interface MissionStatusBannerProps {
  eventType?: string;
  risk?: string;
  status?: string;
  impactVehicles?: number | string;
  expectedDelay?: number | string;
  recommendedPlan?: string;
}

export const MissionStatusBanner = ({
  eventType = 'Vehicle Breakdown',
  risk = 'Medium',
  status = 'Awaiting Deployment',
  impactVehicles = 1713,
  expectedDelay = 89,
  recommendedPlan = 'Full Response',
}: MissionStatusBannerProps) => {
  const color = getRiskColor(risk);
  const bg = getRiskBg(risk);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl overflow-hidden border shadow-2xl relative"
      style={{
        borderColor: `var(--border)`,
        background: 'rgba(15,22,35,0.8)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Top Warning Strip */}
      <div 
        className="px-6 py-2 flex items-center justify-between"
        style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: color }}></span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>ACTIVE INCIDENT DETECTED</span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">{new Date().toISOString()}</span>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
        
        <div className="flex items-center gap-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center border"
            style={{ background: bg, borderColor: `${color}50`, color }}
          >
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">Event Type</p>
            <h2 className="text-3xl font-black text-white tracking-tight">{eventType}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: bg, color, border: `1px solid ${color}40` }}>
                Risk: {risk}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-800/50 border-gray-700 text-gray-300">
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-px h-16 bg-gray-800"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 flex-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-gray-400">
              <Target size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Expected Impact</span>
            </div>
            <div className="text-2xl font-black text-white">{impactVehicles} <span className="text-sm font-semibold text-gray-500">Vehicles</span></div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-red-400">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Expected Delay</span>
            </div>
            <div className="text-2xl font-black text-white">{expectedDelay} <span className="text-sm font-semibold text-gray-500">Minutes</span></div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Recommended Plan</span>
            </div>
            <div className="text-2xl font-black text-white">{recommendedPlan}</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
