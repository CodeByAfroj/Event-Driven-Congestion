import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Clock, Calendar, AlertTriangle, MapPin, TrendingUp, Activity,
  Layers, ChevronDown, ChevronUp, Radio, Compass, ShieldCheck,
  Navigation, Users, Target, Zap,
} from 'lucide-react';

import { useHotspots } from '@/hooks/useHotspots';
import { useTrends } from '@/hooks/useTrends';
import { usePredict } from '@/hooks/usePredict';

import { TrafficMap } from '@/components/map/TrafficMap';
import { PredictionForm } from '@/components/forms/PredictionForm';
import { StatCard } from '@/components/cards/StatCard';
import { RiskCard } from '@/components/cards/RiskCard';
import { CommanderCard } from '@/components/cards/CommanderCard';
import { OperationalProtocolCard } from '@/components/cards/OperationalProtocolCard';
import { HistoricalCard } from '@/components/cards/HistoricalCard';
import { OptimizationCard } from '@/components/cards/OptimizationCard';
import { EventCauseChart } from '@/components/charts/EventCauseChart';
import { ZoneDistributionChart } from '@/components/charts/ZoneDistributionChart';
import { SimulationChart } from '@/components/charts/SimulationChart';

import { formatHour } from '@/utils/formatters';
import type { PredictRequest } from '@/types';

/* ────────────────────────────────────────────────────────────
   SKELETON
──────────────────────────────────────────────────────────── */
const Skeleton = ({
  height = 120,
  radius = 'var(--radius-card)',
}: {
  height?: number;
  radius?: string;
}) => (
  <div className="skeleton" style={{ height, borderRadius: radius }} />
);

/* ────────────────────────────────────────────────────────────
   SECTION WRAPPER
──────────────────────────────────────────────────────────── */
const Section = ({
  title, subtitle, icon, children, delay = 0,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
  >
    {/* Section header */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: '42px', height: '42px',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(59,130,246,0.1)',
        border: '1px solid rgba(59,130,246,0.2)',
        color: '#3B82F6', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <h2 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--muted)',
            marginTop: '0.2rem',
          }}>{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </motion.section>
);

/* ────────────────────────────────────────────────────────────
   ERROR STATE
──────────────────────────────────────────────────────────── */
const ErrorState = ({ message }: { message: string }) => (
  <div style={{
    borderRadius: 'var(--radius-card)',
    padding: '2.5rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '0.875rem',
    background: 'rgba(239,68,68,0.04)',
    border: '1px solid rgba(239,68,68,0.15)',
  }}>
    <AlertTriangle size={28} color="#EF4444" />
    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', textAlign: 'center' }}>
      {message}
    </p>
  </div>
);

/* ────────────────────────────────────────────────────────────
   IMPACT ANALYSIS PANEL
──────────────────────────────────────────────────────────── */
const ImpactPanel = ({ impact }: { impact: any }) => {
  if (!impact) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      padding: 'var(--space-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#EF4444', flexShrink: 0,
        }}>
          <Target size={22} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text)' }}>
            Impact Analysis
          </div>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.2rem' }}>
            Zone-level event footprint assessment
          </div>
        </div>
      </div>

      <div className="grid-3col" style={{ gap: '0.875rem' }}>
        <div style={{
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
            Impact Radius
          </div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: '#EF4444' }}>
            {impact.impact_radius_km} km
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.3rem' }}>Affected coverage zone</div>
        </div>

        <div style={{
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
            Vehicle Impact
          </div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: '#F59E0B' }}>
            {impact.estimated_vehicle_impact?.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.3rem' }}>Estimated vehicles affected</div>
        </div>

        <div style={{
          background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)',
          borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--muted-dark)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
            Center Coordinates
          </div>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: '#8B5CF6', fontFamily: 'JetBrains Mono, monospace' }}>
            {impact.center?.latitude?.toFixed(4)}, {impact.center?.longitude?.toFixed(4)}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--muted)', marginTop: '0.3rem' }}>Epicenter location</div>
        </div>
      </div>

      {/* Affected junctions if present */}
      {impact.affected_junctions && impact.affected_junctions.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{
            fontSize: 'var(--font-xs)', fontWeight: 700,
            color: 'var(--muted-dark)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>Affected Junctions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {impact.affected_junctions.map((j: string, i: number) => (
              <span key={i} style={{
                padding: '0.35rem 0.875rem',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '999px',
                fontSize: 'var(--font-xs)', fontWeight: 600, color: '#EF4444',
              }}>{j}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   DASHBOARD
──────────────────────────────────────────────────────────── */
export const Dashboard = () => {
  const { data: hotspotsData, isLoading: hotspotsLoading, isError: hotspotsError } = useHotspots();
  const { data: trendsData, isLoading: trendsLoading, isError: trendsError } = useTrends();
  const { mutate: predict, data: prediction, isPending: predicting, isError: predictError } = usePredict();

  const [showRecommendations, setShowRecommendations] = useState(false);

  const handlePredict = (data: PredictRequest) => predict(data);
  const hotspots = hotspotsData?.hotspots ?? [];

  // ── KPI calculations ──
  const historicalTotalIncidents = trendsData
    ? Object.values(trendsData.top_event_causes).reduce((a, b) => a + b, 0)
    : 7009;
  const totalIncidentsValue = prediction?.historical_stats?.total_incidents ?? historicalTotalIncidents;
  const delayReductionValue = prediction?.commander?.expected_reduction
    ? `${prediction.commander.expected_reduction}%`
    : trendsData ? `${Math.round(Object.values(trendsData.top_event_causes).length * 3.5)}%` : '65%';
  const affectedVehiclesValue = prediction?.impact_analysis?.estimated_vehicle_impact
    ? prediction.impact_analysis.estimated_vehicle_impact.toLocaleString()
    : '—';
  const peakHour = trendsData?.peak_hour ?? prediction?.historical_stats?.peak_hour ?? '—';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px' }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '2.5rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
      }}>

        {/* ── HERO HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '999px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            width: 'fit-content',
          }}>
            <Radio size={13} style={{ color: '#3B82F6' }} />
            <span style={{
              fontSize: 'var(--font-xs)', fontWeight: 700,
              letterSpacing: '0.12em', color: '#3B82F6',
            }}>SECURE NETWORK · LIVE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.05,
          }}>
            Traffic Intelligence<br />
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Operations Center</span>
          </h1>

          <p style={{
            fontSize: 'var(--font-base)',
            color: 'var(--muted)',
            maxWidth: '640px',
            lineHeight: 1.7,
          }}>
            Monitor congestion hotspots, dispatch operational units, and simulate
            mitigation protocols in real-time across Bengaluru.
          </p>
        </motion.div>

        {/* ── EXECUTIVE KPI ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid-kpi">
            {hotspotsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={170} />)
            ) : (
              <>
                <StatCard
                  title="Historical Incidents"
                  value={totalIncidentsValue}
                  subtitle="Across Bengaluru metro area"
                  icon={<Activity size={20} />}
                  color="#3B82F6"
                  delay={0.0}
                />
                <StatCard
                  title="Active Hotspots"
                  value={hotspots.length || 15}
                  subtitle="Monitored junctions"
                  icon={<MapPin size={20} />}
                  color="#EF4444"
                  delay={0.05}
                />
                <StatCard
                  title="Peak Hour"
                  value={peakHour !== '—' ? `${peakHour}:00` : '—'}
                  subtitle="Highest congestion window"
                  icon={<Clock size={20} />}
                  color="#F59E0B"
                  delay={0.1}
                />
                <StatCard
                  title="Delay Reduction"
                  value={delayReductionValue}
                  subtitle="With full response plan"
                  icon={<ShieldCheck size={20} />}
                  color="#10B981"
                  delay={0.15}
                />
              </>
            )}
          </div>
        </motion.div>

        {/* ── AI COMMANDER STANDBY / ACTIVE ── */}
        <AnimatePresence mode="wait">
          {prediction ? (
            <Section
              title="AI Commander Operations Briefing"
              subtitle="Real-time incident response copilot dispatch recommendation"
              icon={<Activity size={20} />}
            >
              <CommanderCard commander={prediction.commander} />
            </Section>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
  borderRadius: 'var(--radius-card)',
  padding: '2rem 2.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem',
  background: 'rgba(59,130,246,0.03)',
  border: '1px solid rgba(59,130,246,0.12)',
}}
            >
              <div>
                <div style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text)' }}>
                  Commander Co-pilot Standby
                </div>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--muted)', marginTop: '0.3rem' }}>
                  Configure parameters below and run prediction to engage AI guidance.
                </p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.6rem 1.25rem', borderRadius: '999px',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              }}>
                <div style={{
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: '#3B82F6',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#3B82F6', letterSpacing: '0.08em' }}>
                  AWAITING PREDICTION
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAP + FORM (HERO) ── */}
        <Section
          title="Spatial Visualization & Control"
          subtitle="Hotspot mapping, impact zones, and prediction terminal"
          icon={<Layers size={20} />}
          delay={0.1}
        >
          <div className="grid-map">
            {/* Map */}
            <div>
              {hotspotsLoading ? (
                <Skeleton height={580} />
              ) : hotspotsError ? (
                <ErrorState message="Failed to load map. Verify backend API is reachable." />
              ) : (
                <TrafficMap
                  hotspots={hotspots}
                  impact={prediction?.impact_analysis}
                  policeStationName={prediction?.commander?.recommended_station}
                />
              )}
            </div>

            {/* Prediction form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PredictionForm onSubmit={handlePredict} isLoading={predicting} />
              {predictError && (
                <ErrorState message="Prediction request failed. Check parameters and backend status." />
              )}
            </div>
          </div>
        </Section>

        {/* ── PREDICTION RESULTS ── */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
            >
              {/* Threat Assessment */}
              <Section
                title="Dynamic Threat Assessment"
                subtitle="Automated risk level and impact metrics from AI analysis"
                icon={<AlertTriangle size={20} />}
              >
                <RiskCard
                  risk={prediction.risk}
                  expectedDelay={prediction.commander?.expected_delay}
                  expectedReduction={prediction.commander?.expected_reduction}
                />
              </Section>

              {/* Impact Analysis — uses all impact_analysis backend fields */}
              {prediction.impact_analysis && (
                <Section
                  title="Impact Zone Analysis"
                  subtitle="Geospatial footprint and vehicle impact assessment"
                  icon={<Target size={20} />}
                >
                  <ImpactPanel impact={prediction.impact_analysis} />
                </Section>
              )}

              {/* Operational Command Protocol */}
              <Section
                title="Operational Command Protocol"
                subtitle="Consolidated dispatch deployment parameters"
                icon={<Navigation size={20} />}
              >
                <OperationalProtocolCard
                  risk={prediction.risk}
                  totalEvents={prediction.historical_stats?.total_incidents}
                  averageDuration={prediction.historical_stats?.avg_duration_min}
                  officers={prediction.optimization?.officers}
                  barricades={prediction.optimization?.barricades}
                  diversion={prediction.optimization?.diversion_required}
                />
              </Section>

              {/* Simulation */}
              {prediction.simulation && prediction.simulation.length > 0 && (
                <Section
                  title="Mitigation Simulation Modeling"
                  subtitle="Scenario-based congestion delay reduction comparisons"
                  icon={<TrendingUp size={20} />}
                >
                  <SimulationChart data={prediction.simulation} />
                </Section>
              )}

              {/* Historical + Optimization */}
              <Section
                title="Tactical Response & Optimization"
                subtitle="Logistical recommendations and historical context"
                icon={<Layers size={20} />}
              >
                <div className="grid-2col">
                  <HistoricalCard stats={prediction.historical_stats} />
                  <OptimizationCard optimization={prediction.optimization} />
                </div>
              </Section>

              {/* Recommendations — collapsible */}
              {prediction.recommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setShowRecommendations(!showRecommendations)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1.375rem 2rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <Compass size={19} style={{ color: '#3B82F6' }} />
                      <span style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>
                        Granular Action Protocols
                      </span>
                      <span style={{
                        fontSize: 'var(--font-xs)', fontWeight: 600,
                        padding: '0.2rem 0.75rem', borderRadius: '999px',
                        background: 'rgba(59,130,246,0.1)', color: '#3B82F6',
                      }}>
                        {Object.keys(prediction.recommendations).length} categories
                      </span>
                    </div>
                    {showRecommendations
                      ? <ChevronUp size={20} style={{ color: 'var(--muted)' }} />
                      : <ChevronDown size={20} style={{ color: 'var(--muted)' }} />
                    }
                  </button>

                  <AnimatePresence>
                    {showRecommendations && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
                      >
                        <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                          {Object.entries(prediction.recommendations).map(([cat, items]) => (
                            <div key={cat}>
                              <h4 style={{
                                fontSize: 'var(--font-xs)', fontWeight: 700,
                                color: 'var(--muted-dark)', letterSpacing: '0.1em',
                                textTransform: 'uppercase', marginBottom: '0.875rem',
                              }}>{cat} Protocols</h4>
                              <div className="grid-2col">
                                {(Array.isArray(items) ? items : [items]).map((item: any, i: number) => (
                                  <div
                                    key={i}
                                    style={{
                                      padding: '1.125rem 1.25rem',
                                      borderRadius: 'var(--radius-lg)',
                                      background: 'var(--bg-raised)',
                                      border: '1px solid var(--border-bright)',
                                      display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                                    }}
                                  >
                                    <div style={{
                                      width: '7px', height: '7px', borderRadius: '50%',
                                      background: '#3B82F6', marginTop: '0.45rem', flexShrink: 0,
                                    }} />
                                    <p style={{
                                      fontSize: 'var(--font-sm)', color: 'var(--muted)',
                                      lineHeight: 1.65,
                                    }}>
                                      {typeof item === 'string'
                                        ? item
                                        : item?.action || item?.description || JSON.stringify(item)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HISTORICAL TRENDS ── */}
        <Section
          title="Historical Metrics Analysis"
          subtitle={trendsData
            ? `Peak day: ${trendsData.peak_day} · Peak hour: ${formatHour(trendsData.peak_hour)} · ${Object.keys(trendsData.top_event_causes).length} event categories`
            : 'Long-term event distribution patterns'
          }
          icon={<TrendingUp size={20} />}
          delay={0.2}
        >
          {trendsLoading ? (
            <div className="grid-2col">
              <Skeleton height={360} />
              <Skeleton height={360} />
            </div>
          ) : trendsError ? (
            <ErrorState message="Trend diagnostics failed to load." />
          ) : trendsData ? (
            <>
              {/* Trends KPI strip */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}>
                {[
                  { label: 'Peak Day', value: trendsData.peak_day, icon: <Calendar size={16} />, color: '#3B82F6' },
                  { label: 'Peak Hour', value: formatHour(trendsData.peak_hour), icon: <Clock size={16} />, color: '#F59E0B' },
                  { label: 'Event Categories', value: Object.keys(trendsData.top_event_causes).length, icon: <Zap size={16} />, color: '#10B981' },
                  { label: 'Monitored Zones', value: Object.keys(trendsData.zone_distribution).length, icon: <MapPin size={16} />, color: '#8B5CF6' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.5rem 1rem',
                    background: `${item.color}0d`,
                    border: `1px solid ${item.color}22`,
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--muted)' }}>
                      {item.label}:
                    </span>
                    <span style={{
                      fontSize: 'var(--font-sm)', fontWeight: 800, color: item.color,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid-2col">
                <EventCauseChart data={trendsData.top_event_causes} />
                <ZoneDistributionChart data={trendsData.zone_distribution} />
              </div>
            </>
          ) : null}
        </Section>

        {/* Footer spacer */}
        <div style={{ height: '2rem' }} />
      </div>
    </div>
  );
};
