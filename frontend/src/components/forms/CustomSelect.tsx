import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  searchable?: boolean;
  placeholder?: string;
}

export const CustomSelect = ({
  label, options, value, onChange, searchable = false, placeholder = 'Select...'
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = searchable
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Label */}
      <label style={{
        display: 'block',
        fontSize: 'var(--font-xs)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        marginBottom: '0.5rem',
      }}>{label}</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(v => !v); setQuery(''); }}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-sm)',
          fontWeight: 600,
          background: open ? 'rgba(59,130,246,0.06)' : 'var(--bg-raised)',
          border: `1px solid ${open ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
          color: selected ? 'var(--text)' : 'var(--muted)',
          boxShadow: open ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.18s',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label || placeholder}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', zIndex: 100,
              width: '100%', marginTop: '0.375rem',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.65)',
            }}
          >
            {searchable && (
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-raised)',
                }}>
                  <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search..."
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  />
                </div>
              </div>
            )}
            <div style={{ maxHeight: '224px', overflowY: 'auto', padding: '0.375rem' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '0.875rem 1rem', fontSize: 'var(--font-sm)', color: 'var(--muted)' }}>
                  No results
                </div>
              ) : (
                filtered.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: opt.value === value ? 700 : 500,
                      color: opt.value === value ? '#3B82F6' : 'var(--text)',
                      background: opt.value === value ? 'rgba(59,130,246,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'left',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => {
                      if (opt.value !== value)
                        (e.currentTarget as HTMLElement).style.background = 'rgba(30,45,66,0.8)';
                    }}
                    onMouseLeave={e => {
                      if (opt.value !== value)
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span>{opt.label}</span>
                    {opt.value === value && <Check size={15} color="#3B82F6" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
