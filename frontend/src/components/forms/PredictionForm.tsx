import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, BrainCircuit } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import type { PredictRequest } from '@/types';
import { dayNames, monthNames } from '@/utils/formatters';

interface PredictionFormProps {
  onSubmit: (data: PredictRequest) => void;
  isLoading: boolean;
}

const DEFAULT: PredictRequest = {
  event_type: 'unplanned',
  event_cause: 'vehicle_breakdown',
  requires_road_closure: 'No',
  priority: 'High',
  corridor: 'Non-corridor',
  police_station: 'Yelahanka',
  hour: 21,
  day_of_week: 4,
  month: 6,
};

const EVENT_TYPES = [
  { value: 'unplanned', label: 'Unplanned' },
  { value: 'planned', label: 'Planned' },
];

const EVENT_CAUSES = [
  { value: 'vehicle_breakdown', label: 'Vehicle Breakdown' },
  { value: 'accident', label: 'Accident' },
  { value: 'road_work', label: 'Road Work' },
  { value: 'flood', label: 'Flood' },
  { value: 'fire', label: 'Fire' },
  { value: 'protest', label: 'Protest / Rally' },
  { value: 'vip_movement', label: 'VIP Movement' },
  { value: 'others', label: 'Others' },
];

const ROAD_CLOSURE = [
  { value: 'No', label: 'No' },
  { value: 'Yes', label: 'Yes' },
];

const PRIORITIES = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const CORRIDORS = [
  { value: 'Non-corridor', label: 'Non-Corridor' },
  { value: 'Outer Ring Road', label: 'Outer Ring Road' },
  { value: 'NICE Road', label: 'NICE Road' },
  { value: 'Bellary Road', label: 'Bellary Road' },
  { value: 'Hosur Road', label: 'Hosur Road' },
  { value: 'Tumkur Road', label: 'Tumkur Road' },
  { value: 'Old Madras Road', label: 'Old Madras Road' },
];

const POLICE_STATIONS = [
  { value: 'Yelahanka', label: 'Yelahanka' },
  { value: 'Whitefield', label: 'Whitefield' },
  { value: 'Electronic City', label: 'Electronic City' },
  { value: 'Koramangala', label: 'Koramangala' },
  { value: 'Indiranagar', label: 'Indiranagar' },
  { value: 'Marathahalli', label: 'Marathahalli' },
  { value: 'Hebbal', label: 'Hebbal' },
  { value: 'HSR Layout', label: 'HSR Layout' },
  { value: 'Jayanagar', label: 'Jayanagar' },
  { value: 'Rajajinagar', label: 'Rajajinagar' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: String(i),
  label: `${i.toString().padStart(2, '0')}:00 ${i < 12 ? 'AM' : 'PM'}`,
}));

const DAYS = dayNames.map((d, i) => ({ value: String(i), label: d }));
const MONTHS = monthNames.map((m, i) => ({ value: String(i + 1), label: m }));

export const PredictionForm = ({ onSubmit, isLoading }: PredictionFormProps) => {
  const [form, setForm] = useState<PredictRequest>(DEFAULT);

  const set = (key: keyof PredictRequest) => (val: string) =>
    setForm(prev => ({
      ...prev,
      [key]: ['hour', 'day_of_week', 'month'].includes(key) ? Number(val) : val,
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
          <BrainCircuit size={18} color="#3B82F6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Predict Event Risk</h2>
          <p className="text-xs text-gray-400">Configure event parameters for AI analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelect
          label="Event Type"
          options={EVENT_TYPES}
          value={form.event_type}
          onChange={set('event_type')}
        />
        <CustomSelect
          label="Event Cause"
          options={EVENT_CAUSES}
          value={form.event_cause}
          onChange={set('event_cause')}
          searchable
        />
        <CustomSelect
          label="Road Closure Required"
          options={ROAD_CLOSURE}
          value={form.requires_road_closure}
          onChange={set('requires_road_closure')}
        />
        <CustomSelect
          label="Priority"
          options={PRIORITIES}
          value={form.priority}
          onChange={set('priority')}
        />
        <CustomSelect
          label="Corridor"
          options={CORRIDORS}
          value={form.corridor}
          onChange={set('corridor')}
          searchable
        />
        <CustomSelect
          label="Police Station"
          options={POLICE_STATIONS}
          value={form.police_station}
          onChange={set('police_station')}
          searchable
        />
        <CustomSelect
          label="Hour of Day"
          options={HOURS}
          value={String(form.hour)}
          onChange={set('hour')}
          searchable
        />
        <CustomSelect
          label="Day of Week"
          options={DAYS}
          value={String(form.day_of_week)}
          onChange={set('day_of_week')}
        />
        <div className="sm:col-span-2">
          <CustomSelect
            label="Month"
            options={MONTHS}
            value={String(form.month)}
            onChange={set('month')}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="mt-6 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
        style={{
          background: isLoading
            ? 'rgba(59,130,246,0.4)'
            : 'linear-gradient(135deg, #3B82F6, #6366F1)',
          color: 'white',
          border: 'none',
          boxShadow: isLoading ? 'none' : '0 4px 24px rgba(59,130,246,0.25)',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing Event...
          </>
        ) : (
          <>
            <Send size={15} />
            Run AI Prediction
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
