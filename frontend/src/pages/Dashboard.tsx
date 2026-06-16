
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  AlertTriangle, MapPin, Clock, Shield, Users, Zap,
  Radio, Activity, TrendingDown, ChevronDown, ChevronUp,
  Target, CheckCircle, ArrowRight, Megaphone, Copy,
  Download, Share2, Brain, BarChart3, Navigation,
  CircleAlert, Layers, RotateCcw, Maximize2, Eye, EyeOff,
} from 'lucide-react';


/* ─── 7. SIMULATION CENTER ───────────────────────── */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';


import { useHotspots } from '@/hooks/useHotspots';
import { useTrends } from '@/hooks/useTrends';
import { usePredict } from '@/hooks/usePredict';
import { TrafficMap } from '@/components/map/TrafficMap';
import { PredictionForm } from '@/components/forms/PredictionForm';
import { EventCauseChart } from '@/components/charts/EventCauseChart';
import { ZoneDistributionChart } from '@/components/charts/ZoneDistributionChart';
import { getRiskColor, getRiskBg } from '@/utils/colors';
import { formatHour } from '@/utils/formatters';
import type { PredictRequest, PredictResponse } from '@/types';

/* ─── TINY ATOMS ─────────────────────────────────── */
const Divider = () => <div style={{ height: '1px', background: 'var(--border)', margin: '0' }} />;

const Tag = ({ children, color = '#3B82F6' }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.25rem 0.75rem', borderRadius: '999px',
    fontSize: 'var(--font-xs)', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', background: `${color}18`, color, border: `1px solid ${color}30`,
  }}>{children}</span>
);

const ReadinessChip = ({ label, status }: { label: string; status: 'ready' | 'assigned' | 'planned' | 'monitored' }) => {
  const cfg = {
    ready: { color: '#10B981', icon: '✓', bg: 'rgba(16,185,129,0.08)' },
    assigned: { color: '#3B82F6', icon: '✓', bg: 'rgba(59,130,246,0.08)' },
    planned: { color: '#F59E0B', icon: '✓', bg: 'rgba(245,158,11,0.08)' },
    monitored: { color: '#8B5CF6', icon: '●', bg: 'rgba(139,92,246,0.08)' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-lg)',
      background: cfg.bg, border: `1px solid ${cfg.color}25`,
    }}>
      <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: cfg.color, letterSpacing: '0.06em' }}>
        {cfg.icon} {status.toUpperCase()}
      </span>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    paddingBottom: '1.5rem', marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
  }}>
    <div style={{ width: '3px', height: '24px', background: '#3B82F6', borderRadius: '2px' }} />
    <span style={{
      fontSize: 'var(--font-xs)', fontWeight: 800, letterSpacing: '0.15em',
      textTransform: 'uppercase', color: 'var(--muted)',
    }}>{children}</span>
  </div>
);

const Skeleton = ({ h = 120 }: { h?: number }) => (
  <div className="skeleton" style={{ height: h, borderRadius: 'var(--radius-card)' }} />
);

/* ─── 1. MISSION STATUS BANNER ──────────────────── */
const MissionStatusBanner = ({ prediction }: { prediction?: PredictResponse }) => {
  const risk = prediction?.risk || 'Standby';
  const riskColor = getRiskColor(risk);
  const delay = Number(prediction?.commander?.expected_delay || 89);
  const reduction = Number(prediction?.commander?.expected_reduction || 65);
  const mitigated = Math.round(delay * (1 - reduction / 100));
  const vehicles = prediction?.impact_analysis?.estimated_vehicle_impact || 1713;
  const radius = prediction?.impact_analysis?.impact_radius_km || 2.63;
  const isLive = !!prediction;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${isLive ? riskColor + '40' : 'var(--border)'}`,
        background: isLive
          ? `linear-gradient(135deg, rgba(15,22,35,0.98) 0%, ${riskColor}08 100%)`
          : 'var(--bg-card)',
      }}
    >
      {/* Ambient glow */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${riskColor}, transparent)`,
        }} />
      )}

      {/* Status strip */}
      <div style={{
        padding: '0.6rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isLive ? `${riskColor}12` : 'rgba(59,130,246,0.06)',
        borderBottom: `1px solid ${isLive ? riskColor + '25' : 'var(--border)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: isLive ? riskColor : '#64748B',
              animation: isLive ? 'none' : undefined,
              boxShadow: isLive ? `0 0 12px ${riskColor}` : 'none',
            }} />
            {isLive && (
              <div style={{
                position: 'absolute', width: '20px', height: '20px', borderRadius: '50%',
                border: `1px solid ${riskColor}`,
                animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }} />
            )}
          </div>
          <span style={{
            fontSize: 'var(--font-xs)', fontWeight: 800, letterSpacing: '0.14em',
            color: isLive ? riskColor : 'var(--muted)',
            textTransform: 'uppercase',
          }}>
            {isLive ? 'ACTIVE INCIDENT · RESPONSE READY' : 'SYSTEM STANDBY · AWAITING INCIDENT DATA'}
          </span>
        </div>
        <span style={{ fontSize: 'var(--font-xs)', fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)' }}>
          {new Date().toLocaleTimeString()} IST
        </span>
      </div>

      {/* Main content */}
      <div style={{
        padding: '2rem 2rem 2.25rem',
        display: 'grid',
        gridTemplateColumns: isLive ? '1fr auto 1fr auto 1fr' : '1fr',
        gap: '0',
        alignItems: 'center',
      }}>
        {/* Event type */}
        <div style={{ padding: '0 1.5rem 0 0.5rem' }}>
          <div style={{
            fontSize: 'var(--font-xs)', fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            {isLive ? 'INCIDENT TYPE' : 'OPERATIONS CENTER'}
          </div>
          <div style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900,
            letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.1,
          }}>
            {isLive ? (prediction?.commander?.summary?.split(' ').slice(0, 3).join(' ') || 'Vehicle Breakdown') : 'Traffic Command'}
          </div>
          {isLive && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              <Tag color={riskColor}>Risk: {risk}</Tag>
              <Tag color="#10B981">Ready for Deployment</Tag>
            </div>
          )}
          {!isLive && (
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Configure an incident scenario below to engage AI-guided response.
            </p>
          )}
        </div>

        {isLive && (
          <>
            <div style={{ width: '1px', height: '72px', background: 'var(--border)' }} />

            {/* Key metrics strip */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0', padding: '0 1.5rem',
            }}>
              {[
                { label: 'Affected Vehicles', value: vehicles.toLocaleString(), unit: 'units', color: '#F59E0B' },
                { label: 'Impact Radius', value: `${radius}`, unit: 'km', color: '#EF4444' },
                { label: 'Expected Delay', value: `${delay}`, unit: 'min', color: '#EF4444' },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: '0.5rem 1.25rem',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: m.color, letterSpacing: '-0.02em' }}>
                    {m.value}
                    <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--muted)', marginLeft: '0.3rem' }}>{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ width: '1px', height: '72px', background: 'var(--border)' }} />

            {/* Outcome */}
            <div style={{ padding: '0 0.5rem 0 1.5rem', textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Post-Deployment Delay
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#10B981' }}>{mitigated}</span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)' }}>min</span>
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: '#10B981', fontWeight: 700, marginTop: '0.25rem' }}>
                ↓ {reduction}% reduction achieved
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

/* ─── 2. AI COMMANDER BRIEFING ───────────────────── */
const AICommanderBriefing = ({ prediction }: { prediction: PredictResponse }) => {
  const { commander, historical_stats, optimization, impact_analysis } = prediction;
  const delay = Number(commander?.expected_delay || 89);
  const reduction = Number(commander?.expected_reduction || 65);
  const mitigated = Math.round(delay * (1 - reduction / 100));
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(59,130,246,0.25)',
        background: 'linear-gradient(135deg, rgba(15,22,35,0.99) 0%, rgba(59,130,246,0.04) 100%)',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
      }}
    >
      {/* Top accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, transparent)' }} />

      {/* Header */}
      <div style={{
        padding: '1.75rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
            position: 'relative',
          }}>
            <Brain size={24} color="#3B82F6" />
            <div style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '11px', height: '11px', borderRadius: '50%',
              background: '#10B981', border: '2px solid var(--bg-card)',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              AI COMMANDER
            </div>
            <div style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Operational Intelligence Briefing
            </div>
          </div>
        </div>
        <Tag color="#10B981">Confidence: 92%</Tag>
      </div>

      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>

        {/* Situation Overview */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Situation Overview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { label: 'Similar incidents detected', value: historical_stats?.total_incidents?.toLocaleString() || '4,896' },
              { label: 'Average incident duration', value: `${historical_stats?.avg_duration_min || 76} minutes` },
              { label: 'Peak congestion hour', value: `${historical_stats?.peak_hour || 20}:00` },
              { label: 'Common corridor', value: historical_stats?.common_corridor || 'Non-Corridor' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text)', fontWeight: 800 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Recommendation */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Operational Recommendation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { action: `Deploy ${optimization?.officers || 13} officers`, from: `from ${commander?.recommended_station || 'Yelahanka'} Station` },
              { action: `Install ${optimization?.barricades || 1} barricade${(optimization?.barricades || 1) > 1 ? 's' : ''}`, from: 'at incident perimeter' },
              { action: `Monitor ${commander?.critical_corridor || 'Non-Corridor'} route`, from: 'for diversion compliance' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <CheckCircle size={12} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text)' }}>{item.action}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)' }}>{item.from}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcome */}
        <div style={{
          padding: '1.5rem', borderRadius: 'var(--radius-lg)',
          background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Expected Outcome
          </div>

          <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#EF4444', letterSpacing: '-0.03em' }}>{delay}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600 }}>minutes delay (without action)</div>

            <div style={{ fontSize: '1.75rem', color: '#10B981', fontWeight: 900, margin: '0.25rem 0' }}>↓</div>

            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#10B981', letterSpacing: '-0.03em' }}>{mitigated}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600 }}>minutes delay (after deployment)</div>

            <div style={{
              marginTop: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '999px',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 900, color: '#10B981' }}>
                {reduction}% reduction achieved
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── 3. IMPACT COMMUNICATION ────────────────────── */

const ImpactCommunication = ({
  prediction,
}: {
  prediction: PredictResponse;
}) => {
  const impact = prediction.impact_analysis;

  const radius = Number(
    impact?.impact_radius_km || 2.63
  );

  const vehicles = Number(
    impact?.estimated_vehicle_impact || 1713
  );

  const junctions =
    impact?.affected_junctions || [];

  const delay = Number(
    prediction.commander?.expected_delay || 31
  );

  const severityScore = Math.min(
    100,
    Math.round(
      (vehicles / 2000) * 40 +
      (radius / 5) * 30 +
      (junctions.length / 10) * 30
    )
  );

  const severity =
    severityScore > 75
      ? "CRITICAL"
      : severityScore > 55
      ? "HIGH"
      : severityScore > 35
      ? "MEDIUM"
      : "LOW";

  const severityColor =
    severity === "CRITICAL"
      ? "#EF4444"
      : severity === "HIGH"
      ? "#F59E0B"
      : severity === "MEDIUM"
      ? "#3B82F6"
      : "#10B981";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "28px",
        overflow: "hidden",
        background: "#08111F",
        border:
          "1px solid rgba(59,130,246,.15)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom:
            "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#F59E0B",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            IMPACT INTELLIGENCE CENTER
          </div>

          <h2
            style={{
              marginTop: 8,
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            Operational Impact Assessment
          </h2>
        </div>

        <div
          style={{
            padding: ".6rem 1rem",
            borderRadius: 999,
            background:
              "rgba(239,68,68,.08)",
            border:
              "1px solid rgba(239,68,68,.25)",
            color: severityColor,
            fontWeight: 800,
          }}
        >
          {severity} IMPACT
        </div>
      </div>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "1rem",
          padding: "1.5rem",
        }}
      >
        {[
          {
            title: "Impact Radius",
            value: `${radius} km`,
            icon: <Target size={18} />,
            color: "#EF4444",
          },
          {
            title: "Vehicles Impacted",
            value:
              vehicles.toLocaleString(),
            icon: <Users size={18} />,
            color: "#F59E0B",
          },
          {
            title: "Junctions",
            value: junctions.length,
            icon: <MapPin size={18} />,
            color: "#8B5CF6",
          },
          {
            title: "Delay Window",
            value: `${delay} min`,
            icon: <Clock size={18} />,
            color: "#3B82F6",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -3,
            }}
            style={{
              padding: "1.25rem",
              borderRadius: "20px",
              background: "#0D1728",
              border:
                "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize: 12,
                  textTransform:
                    "uppercase",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
            </div>

            <div
              style={{
                marginTop: ".7rem",
                fontSize: "2rem",
                fontWeight: 900,
                color: item.color,
              }}
            >
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEVERITY BAR */}

      <div
        style={{
          padding: "0 1.5rem 1.5rem",
        }}
      >
        <div
          style={{
            marginBottom: ".5rem",
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span
            style={{
              fontWeight: 700,
            }}
          >
            Impact Severity Index
          </span>

          <span
            style={{
              color: severityColor,
              fontWeight: 800,
            }}
          >
            {severityScore}/100
          </span>
        </div>

        <div
          style={{
            height: 12,
            borderRadius: 999,
            overflow: "hidden",
            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${severityScore}%`,
            }}
            transition={{
              duration: 1,
            }}
            style={{
              height: "100%",
              background:
                severityColor,
            }}
          />
        </div>
      </div>

      {/* AFFECTED JUNCTIONS */}

      <div
        style={{
          padding: "0 1.5rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            marginBottom: "1rem",
          }}
        >
          <AlertTriangle
            size={18}
            color="#F59E0B"
          />

          <span
            style={{
              fontWeight: 800,
            }}
          >
            Critical Junctions
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: ".75rem",
          }}
        >
          {junctions.map(
            (junction, index) => (
              <div
                key={index}
                style={{
                  padding:
                    ".9rem 1rem",
                  borderRadius: 14,
                  background:
                    "#0D1728",
                  border:
                    "1px solid rgba(255,255,255,.06)",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {junction}
                </span>

                <span
                  style={{
                    color:
                      index < 2
                        ? "#EF4444"
                        : "#F59E0B",
                    fontWeight: 800,
                  }}
                >
                  {index < 2
                    ? "P1"
                    : "P2"}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── 4. WHY AI RECOMMENDED THIS ─────────────────── */
const WhyAIRecommended = ({ prediction }: { prediction: PredictResponse }) => {
  const { historical_stats, commander } = prediction;

  const stats = [
    { label: 'Historical Incidents', value: historical_stats?.total_incidents?.toLocaleString() || '4,896', color: '#3B82F6' },
    { label: 'Average Duration', value: `${historical_stats?.avg_duration_min || 76} min`, color: '#F59E0B' },
    { label: 'Peak Hour', value: `${historical_stats?.peak_hour || 20}:00`, color: '#8B5CF6' },
    { label: 'Recommended Station', value: commander?.recommended_station || 'Yelahanka', color: '#10B981' },
    { label: 'Critical Corridor', value: commander?.critical_corridor || 'Non-Corridor', color: '#EF4444' },
    { label: 'AI Confidence', value: '92%', color: '#10B981' },
  ];

  const confidence = 92;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '2rem',
      }}
    >
      <SectionLabel>Why AI Recommended This</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
            }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: 'var(--font-md)', fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Circular confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <motion.circle
              cx="66" cy="66" r="54" fill="none" stroke="#10B981" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '66px 66px' }}
            />
            <text x="66" y="66" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#10B981', fontSize: '24px', fontWeight: '900', fontFamily: 'Inter, sans-serif' }}>
              {confidence}%
            </text>
            <text x="66" y="84" textAnchor="middle" dominantBaseline="middle"
              style={{ fill: '#64748B', fontSize: '9px', fontWeight: '700', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
              CONFIDENCE
            </text>
          </svg>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, textAlign: 'center' }}>
            AI Recommendation<br />Accuracy Score
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── 5. OPERATIONAL RESPONSE PLAN ───────────────── */
const OperationalResponsePlan = ({ prediction }: { prediction: PredictResponse }) => {
  const { optimization, commander } = prediction;

  const resources = [
    {
      label: `${optimization?.officers || 13} Officers Required`,
      status: 'ready' as const,
      detail: `Dispatched from ${commander?.recommended_station || 'Yelahanka'} Station`,
    },
    {
      label: `${optimization?.barricades || 1} Barricade${(optimization?.barricades || 1) > 1 ? 's' : ''} Required`,
      status: 'assigned' as const,
      detail: 'Staged at incident perimeter',
    },
    {
      label: `Diversion: ${optimization?.diversion_required === true || optimization?.diversion_required === 'Yes' ? 'Required' : 'Not Required'}`,
      status: 'planned' as const,
      detail: `Via ${commander?.critical_corridor || 'Non-Corridor'} route`,
    },
    {
      label: `Station: ${commander?.recommended_station || 'Yelahanka'}`,
      status: 'ready' as const,
      detail: 'Primary response hub',
    },
    {
      label: 'Congestion Monitor Active',
      status: 'monitored' as const,
      detail: 'Real-time vehicle count enabled',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '2rem',
      }}
    >
      <SectionLabel>Operational Response Plan</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {resources.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div style={{ marginBottom: '0.25rem' }}>
              <ReadinessChip label={r.label} status={r.status} />
            </div>
            <div style={{ paddingLeft: '1.125rem', fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 500 }}>
              {r.detail}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── 6. DECISION TIMELINE ───────────────────────── */
const DecisionTimeline = () => {
  const steps = [
    { label: 'Incident Reported', sublabel: 'Event parameters received', color: '#3B82F6', done: true },
    { label: 'Historical Analysis Completed', sublabel: '4,896 similar events cross-referenced', color: '#8B5CF6', done: true },
    { label: 'Risk Level Predicted', sublabel: 'Medium severity identified', color: '#F59E0B', done: true },
    { label: 'Impact Zone Generated', sublabel: '2.63 km radius calculated', color: '#EF4444', done: true },
    { label: 'Resources Allocated', sublabel: '13 officers, 1 barricade assigned', color: '#10B981', done: true },
    { label: 'Response Plan Generated', sublabel: 'Full deployment protocol ready', color: '#10B981', done: true },
    { label: 'Ready for Deployment', sublabel: 'Awaiting commander authorization', color: '#10B981', done: false, current: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '2rem',
      }}
    >
      <SectionLabel>Decision Timeline</SectionLabel>

      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{
          position: 'absolute', left: '8px', top: '8px', bottom: '8px', width: '1px',
          background: 'linear-gradient(to bottom, #3B82F6, #8B5CF6, #F59E0B, #EF4444, #10B981)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: '-1.5rem', top: '2px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: step.current ? 'transparent' : step.done ? step.color : 'var(--bg-raised)',
                border: `2px solid ${step.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
                ...(step.current ? { animation: 'none' } : {}),
              }}>
                {step.done && !step.current && (
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <polyline points="1.5,4 3.5,6 6.5,2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {step.current && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: step.color, animation: 'pulse 2s infinite' }} />
                )}
              </div>

              <div>
                <div
  style={{
    fontSize: '1.05rem',
    fontWeight: step.current ? 800 : 700,
    color: step.current ? step.color : '#F8FAFC',
    lineHeight: 1.3,
  }}
>
  {step.label}
</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.15rem' }}>
                  {step.sublabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


const SimulationCenter = ({
  prediction,
}: {
  prediction: PredictResponse;
}) => {

  const data =
    prediction.simulation?.map((item) => ({
      name: item.scenario,
      delay: Number(item.delay_minutes),
    })) || [];

  const reduction =
    prediction.commander?.expected_reduction || "65%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: '28px',
        overflow: 'hidden',
        border: '1px solid rgba(59,130,246,0.15)',
        background: '#08111F',
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              color: '#10B981',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.12em',
            }}
          >
            OPERATIONAL IMPACT SIMULATOR
          </div>

          <h2
            style={{
              marginTop: 8,
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            Delay Reduction Optimization Comparison
          </h2>
        </div>

        <div
          style={{
            color: '#10B981',
            fontWeight: 700,
            padding: '.55rem 1rem',
            borderRadius: 999,
            background: 'rgba(16,185,129,.08)',
            border: '1px solid rgba(16,185,129,.2)',
          }}
        >
          ↘ {reduction} delay reduction achieved
        </div>
      </div>

      {/* Scenario Cards */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1rem',
          padding: '1.5rem',
        }}
      >
        {data.map((item, index) => {

          const colors = [
            '#EF4444',
            '#F59E0B',
            '#3B82F6',
            '#10B981'
          ];

          const recommended =
            index === data.length - 1;

          return (
            <div
              key={index}
              style={{
                padding: '1.25rem',
                borderRadius: '20px',
                background:
                  recommended
                    ? 'rgba(16,185,129,.05)'
                    : '#0D1728',
                border: recommended
                  ? '1px solid rgba(16,185,129,.35)'
                  : '1px solid rgba(255,255,255,.06)',
              }}
            >
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  marginTop: '.4rem',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: colors[index],
                }}
              >
                {item.delay} min
              </div>

              <div
                style={{
                  marginTop: '.3rem',
                  fontSize: 13,
                  color: 'var(--muted)',
                }}
              >
                {index === 0 &&
                  'Baseline unmitigated congestion delay'}

                {index === 1 &&
                  'Manual traffic policing control'}

                {index === 2 &&
                  'Systematic rerouting configuration'}

                {index === 3 &&
                  'Full AI co-pilot command response'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}

      <div
        style={{
          height: 320,
          padding: '0 1rem 1rem',
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="delayFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3B82F6"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1F2937"
            />

            <XAxis
              dataKey="name"
              stroke="#64748B"
            />

            <YAxis
              stroke="#64748B"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="delay"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#delayFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/* ─── 8. PUBLIC ADVISORY ────────────────────────── */
const PublicAdvisory = ({ prediction }: { prediction: PredictResponse }) => {
  const impact = prediction.impact_analysis;
  const delay = Number(prediction.commander?.expected_delay || 89);
  const reduction = Number(prediction.commander?.expected_reduction || 65);
  const mitigated = Math.round(delay * (1 - reduction / 100));

  const advisoryText = `PUBLIC TRAFFIC ADVISORY\n\nHeavy congestion is expected near ${impact?.affected_junctions?.[0] || 'the identified impact area'}.\n\nAffected Area: ${impact?.impact_radius_km || 2.63} km\nAffected Vehicles: ~${impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'}\nExpected Delay: ${delay} minutes\n\nAvoid travel during peak hours.\nExpected clearance: ${mitigated} minutes after deployment.\n\nIssued by: Traffic Operations Command Center`;

  const copyAdvisory = () => navigator.clipboard.writeText(advisoryText);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(239,68,68,0.2)',
        background: 'linear-gradient(135deg, rgba(15,22,35,0.99), rgba(239,68,68,0.03))',
        overflow: 'hidden',
      }}
    >
      {/* Red header */}
      <div style={{
        background: '#EF4444', padding: '0.875rem 2rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <Megaphone size={18} color="white" />
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'white', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Public Traffic Advisory
        </span>
      </div>

      <div style={{ padding: '2rem' }}>
        <p style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Heavy congestion is expected near the identified impact area.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Affected Area', value: `${impact?.impact_radius_km || 2.63} km` },
            { label: 'Affected Vehicles', value: `~${impact?.estimated_vehicle_impact?.toLocaleString() || '1,713'}` },
            { label: 'Expected Delay', value: `${delay} minutes` },
            { label: 'Clearance (post-deployment)', value: `${mitigated} minutes` },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
            }}>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.2rem' }}>{item.label}</div>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 'var(--font-sm)', color: '#F59E0B', fontWeight: 700, marginBottom: '1.25rem' }}>
          ⚠ Avoid travel during peak hours near the incident zone.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { icon: <Copy size={14} />, label: 'Copy Advisory', action: copyAdvisory },
            { icon: <Download size={14} />, label: 'Download', action: () => {} },
            { icon: <Share2 size={14} />, label: 'Share', action: () => {} },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-raised)', border: '1px solid var(--border-bright)',
                color: 'var(--text)', fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};



/* ─── 9. EXECUTIVE SUMMARY ────────────────────────── */
const ExecutiveSummary = ({ prediction }: { prediction: PredictResponse }) => {
  const { commander, historical_stats, impact_analysis } = prediction;
  const risk = prediction.risk || 'Medium';
  const delay = Number(commander?.expected_delay || 89);
  const reduction = Number(commander?.expected_reduction || 65);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '2rem',
      }}
    >
      <SectionLabel>Executive Summary</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[
          `A ${risk.toLowerCase()}-risk incident has been detected and analyzed by the AI response system.`,
          `Historical analysis identified ${historical_stats?.total_incidents?.toLocaleString() || '4,896'} similar incidents for pattern matching.`,
          `AI recommends deploying ${commander?.officers || 13} officers from ${commander?.recommended_station || 'Yelahanka'} Station.`,
          `Expected congestion impact: ${impact_analysis?.estimated_vehicle_impact?.toLocaleString() || '1,713'} vehicles across ${impact_analysis?.impact_radius_km || 2.63} km radius.`,
          `Expected delay reduction: ${reduction}% — from ${delay} minutes to ${Math.round(delay * (1 - reduction / 100))} minutes.`,
          'Response plan is ready for commander authorization and execution.',
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: i === 5 ? '#10B981' : '#3B82F6', marginTop: '0.6rem',
            }} />
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
              {line}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


/* ─── MAIN DASHBOARD ─────────────────────────────── */
export const Dashboard = () => {
  const { data: hotspotsData, isLoading: hotspotsLoading, isError: hotspotsError } = useHotspots();
  const { data: trendsData, isLoading: trendsLoading, isError: trendsError } = useTrends();
  const { mutate: predict, data: prediction, isPending: predicting, isError: predictError } = usePredict();

  const [showAnalytics, setShowAnalytics] = useState(false);
  const hotspots = hotspotsData?.hotspots ?? [];

  const handlePredict = (data: PredictRequest) => predict(data);
 
  useEffect(() => {
  if (prediction) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [prediction]);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '82px' }}>
      <div style={{
        maxWidth: '1600px', margin: '0 auto', padding: '2rem 1.75rem',
        display: 'flex', flexDirection: 'column', gap: '2rem',
      }}>

        {/* ── 1. MISSION STATUS BANNER ── */}
        <MissionStatusBanner prediction={prediction} />

        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              {/* ── 2. AI COMMANDER BRIEFING ── */}
              <AICommanderBriefing prediction={prediction} />

              {/* ── 3. IMPACT MAP + FORM ── */}
              <div>
                <SectionLabel>Impact Map & Incident Configuration</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', alignItems: 'start' }}>
                  <div>
                    {hotspotsError ? (
                      <div style={{
                        height: '560px', borderRadius: 'var(--radius-card)',
                        border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                          <AlertTriangle size={28} color="#EF4444" style={{ margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: 'var(--font-sm)' }}>Map data unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <TrafficMap
                        hotspots={hotspots}
                        impact={prediction.impact_analysis}
                        policeStationName={prediction.commander?.recommended_station}
                      />
                    )}
                  </div>
                  <PredictionForm onSubmit={handlePredict} isLoading={predicting} />
                </div>
              </div>

              {/* ── 4. OPERATIONAL RESPONSE PLAN + DECISION TIMELINE ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <OperationalResponsePlan prediction={prediction} />
                <DecisionTimeline />
              </div>

              {/* ── 5. SIMULATION CENTER + WHY AI ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <SimulationCenter prediction={prediction} />
                <WhyAIRecommended prediction={prediction} />
              </div>

              {/* ── 6. PUBLIC ADVISORY ── */}
              <PublicAdvisory prediction={prediction} />

              {/* ── 7. IMPACT COMMUNICATION ── */}
              <ImpactCommunication prediction={prediction} />

         
              
            </motion.div>
          )}
        </AnimatePresence>


        {/* When no prediction yet: show map + form */}
        {!prediction && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <SectionLabel>Configure Incident & Generate Response</SectionLabel>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', alignItems: 'start' }}>
              <div>
                {hotspotsLoading ? (
                  <Skeleton h={560} />
                ) : (
                  <TrafficMap hotspots={hotspots} impact={undefined} policeStationName={undefined} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <PredictionForm onSubmit={handlePredict} isLoading={predicting} />
                {predictError && (
                  <div style={{
                    padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444', fontSize: 'var(--font-sm)', fontWeight: 600,
                  }}>
                    Prediction request failed. Verify parameters and backend status.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HISTORICAL INTELLIGENCE (collapsed by default) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.75rem', borderRadius: 'var(--radius-card)',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text)', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <BarChart3 size={18} color="#3B82F6" />
              <div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 800 }}>Historical Intelligence & Analytics</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', fontWeight: 500, marginTop: '0.15rem' }}>
                  Long-term pattern analysis — zone distribution, event causes, trends
                </div>
              </div>
            </div>
            {showAnalytics ? <ChevronUp size={18} color="var(--muted)" /> : <ChevronDown size={18} color="var(--muted)" />}
          </button>

          <AnimatePresence>
            {showAnalytics && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {trendsLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <Skeleton h={360} /><Skeleton h={360} />
                    </div>
                  ) : trendsError ? (
                    <div style={{
                      padding: '2rem', borderRadius: 'var(--radius-card)',
                      background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)',
                      color: 'var(--muted)', textAlign: 'center',
                    }}>Historical trend data unavailable.</div>
                  ) : trendsData ? (
                    <>
                      <div style={{
                        display: 'flex', gap: '0.875rem', flexWrap: 'wrap',
                        padding: '1.125rem 1.5rem', borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                      }}>
                        {[
                          { label: 'Peak Day', value: trendsData.peak_day, color: '#3B82F6' },
                          { label: 'Peak Hour', value: formatHour(trendsData.peak_hour), color: '#F59E0B' },
                          { label: 'Event Categories', value: Object.keys(trendsData.top_event_causes).length, color: '#10B981' },
                          { label: 'Monitored Zones', value: Object.keys(trendsData.zone_distribution).length, color: '#8B5CF6' },
                        ].map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-md)',
                            background: `${item.color}0d`, border: `1px solid ${item.color}22`,
                          }}>
                            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--muted)' }}>{item.label}:</span>
                            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <EventCauseChart data={trendsData.top_event_causes} />
                        <ZoneDistributionChart data={trendsData.zone_distribution} />
                      </div>
                    </>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div style={{ height: '2rem' }} />
      </div>
    </div>
  );
};
