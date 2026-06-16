import { motion } from 'framer-motion';
import { Users, Navigation, Bell, FileText, Megaphone, Download } from 'lucide-react';

export const CommandActionsPanel = () => {
  const actions = [
    { label: 'Deploy Officers', icon: <Users size={20} />, color: 'bg-blue-600 hover:bg-blue-700', text: 'text-white' },
    { label: 'Activate Diversion', icon: <Navigation size={20} />, color: 'bg-emerald-600 hover:bg-emerald-700', text: 'text-white' },
    { label: 'Notify Police Station', icon: <Bell size={20} />, color: 'bg-amber-600 hover:bg-amber-700', text: 'text-white' },
    { label: 'Generate Incident Report', icon: <FileText size={20} />, color: 'bg-gray-800 hover:bg-gray-700 border border-gray-600', text: 'text-white' },
    { label: 'Issue Public Advisory', icon: <Megaphone size={20} />, color: 'bg-gray-800 hover:bg-gray-700 border border-gray-600', text: 'text-white' },
    { label: 'Export Response Plan', icon: <Download size={20} />, color: 'bg-gray-800 hover:bg-gray-700 border border-gray-600', text: 'text-white' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl"
    >
      <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6">Execute Command Protocols</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <button 
            key={i}
            className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg ${action.color} ${action.text}`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
