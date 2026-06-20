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
      style={{
        borderRadius: 'var(--radius-card)',
        padding: '1.75rem',
        background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: '1px solid var(--border)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          flexShrink: 0,
        }}>
          <BrainCircuit size={22} color="#3B82F6" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text)' }}>
            Incident Parameters
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.2rem' }}>
            Configure event details for AI response planning
          </div>
        </div>
      </div>

      <div className="grid-2col" style={{ gap: '1rem' }}>
        <CustomSelect label="Event Type" options={EVENT_TYPES} value={form.event_type} onChange={set('event_type')} />
        <CustomSelect label="Event Cause" options={EVENT_CAUSES} value={form.event_cause} onChange={set('event_cause')} searchable />
        <CustomSelect label="Road Closure" options={ROAD_CLOSURE} value={form.requires_road_closure} onChange={set('requires_road_closure')} />
        <CustomSelect label="Priority" options={PRIORITIES} value={form.priority} onChange={set('priority')} />
        <CustomSelect label="Corridor" options={CORRIDORS} value={form.corridor} onChange={set('corridor')} searchable />
        <CustomSelect label="Police Station" options={POLICE_STATIONS} value={form.police_station} onChange={set('police_station')} searchable />
        <CustomSelect label="Hour of Day" options={HOURS} value={String(form.hour)} onChange={set('hour')} searchable />
        <CustomSelect label="Day of Week" options={DAYS} value={String(form.day_of_week)} onChange={set('day_of_week')} />
        <div style={{ gridColumn: '1 / -1' }}>
          <CustomSelect label="Month" options={MONTHS} value={String(form.month)} onChange={set('month')} />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          padding: '1rem 2rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: 'var(--font-sm)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: isLoading
            ? 'rgba(59,130,246,0.4)'
            : 'linear-gradient(135deg, #3B82F6, #6366F1)',
          color: 'white',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: isLoading ? 'none' : '0 0 20px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing Incident...
          </>
        ) : (
          <>
            <Send size={16} />
            Generate Response Plan
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
