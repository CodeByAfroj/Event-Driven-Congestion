
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

import { MissionStatusBanner } from '../components/dashboard/MissionStatusBanner';
import { AICommanderBriefing } from '../components/dashboard/AICommanderBriefing';
import { ImpactCommunication } from '../components/dashboard/ImpactCommunication';
import { WhyAIRecommended } from '../components/dashboard/WhyAIRecommended';
import { SimulationCenter } from '../components/dashboard/SimulationCenter';
import { PublicAdvisory } from '../components/dashboard/PublicAdvisory';
import { Skeleton } from '../components/dashboard/Skeleton';
import { SectionLabel } from '../components/dashboard/SectionLabel';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '82px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient Dribbble-style Glows */}
      <div className="animate-blob" style={{ position: 'absolute', top: '5%', left: '10%', width: '600px', height: '600px', background: 'rgba(0, 240, 255, 0.04)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div className="animate-blob animation-delay-2000" style={{ position: 'absolute', top: '40%', right: '5%', width: '700px', height: '700px', background: 'rgba(0, 255, 157, 0.03)', filter: 'blur(140px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div className="animate-blob animation-delay-4000" style={{ position: 'absolute', bottom: '0', left: '20%', width: '800px', height: '800px', background: 'rgba(255, 0, 85, 0.03)', filter: 'blur(160px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1600px', margin: '0 auto', padding: '3rem 1.75rem',
        display: 'flex', flexDirection: 'column', gap: '3rem',
      }}>

        {/* ── 1. MISSION STATUS BANNER ── */}
        <MissionStatusBanner prediction={prediction} />

        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
              {/* ── 2. AI COMMANDER BRIEFING ── */}
              <AICommanderBriefing prediction={prediction} />

              {/* ── 3. IMPACT MAP + FORM ── */}
              <div>
                <SectionLabel>Impact Map & Incident Configuration</SectionLabel>
                <div className="grid-map" style={{ alignItems: 'start' }}>
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
              {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <OperationalResponsePlan prediction={prediction} />
                <DecisionTimeline />
              </div> */}

              {/* ── 5. SIMULATION CENTER + WHY AI ── */}
              <div className="grid-2col">
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
            <div className="grid-map" style={{ alignItems: 'start' }}>
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
                      <div className="grid-2col">
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
