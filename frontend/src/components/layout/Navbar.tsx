import { motion } from 'framer-motion';
import { Activity, Zap, Radio, Shield } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const { data, isError } = useHealthCheck();
  const isOnline = !!data && !isError;
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="glass"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        maxWidth: '1600px', margin: '0 auto',
        padding: '0 1rem',
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            flexShrink: 0,
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-md)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>Event AI</div>
            <div style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--muted)',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }} className="hidden sm:block">Traffic Command Center</div>
          </div>
        </div>

        {/* Center live badge */}
        <div className="hidden md:block">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '999px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.18)',
          }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}>
              <Zap size={14} color="#3B82F6" />
            </motion.div>
            <span style={{
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#3B82F6',
            }}>LIVE OPERATIONS</span>
          </div>
        </div>

        {/* Right: status + clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {/* Online indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '10px', height: '10px' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: isOnline ? '#10B981' : '#EF4444',
                position: 'absolute',
              }} />
              {isOnline && (
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#10B981', opacity: 0.35,
                  position: 'absolute',
                  animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
                }} />
              )}
            </div>
            <span style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: isOnline ? '#10B981' : '#EF4444',
            }} className="hidden sm:block">{isOnline ? 'System Online' : 'Offline'}</span>
          </div>

          {/* Clock */}
          <div className="hidden sm:block">
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
            }}>
              <Radio size={13} style={{ color: 'var(--muted)' }} />
              <span className="font-mono" style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--muted)',
                fontWeight: 500,
              }}>{time}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
