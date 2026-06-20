// API Response Types

export interface Hotspot {
  junction: string;
  zone: string;
  latitude: number;
  longitude: number;
  incident_count: number;
}

export interface HotspotsResponse {
  hotspots: Hotspot[];
}

export interface TrendsResponse {
  peak_hour: number;
  peak_day: string;
  top_event_causes: Record<string, number>;
  zone_distribution: Record<string, number>;
}

export interface HistoricalStats {
  total_events?: number;
  road_closure_rate?: number;
  average_duration?: number;
  peak_hour?: number;
  most_common_corridor?: string;
  most_common_station?: string;
  [key: string]: unknown;
}

export interface OptimizationResult {
  officers?: number;
  barricades?: number;
  diversion?: boolean;
  reasoning?: {
    historical_events?: number;
    avg_duration?: number;
    road_closure_rate?: number;
  };
  [key: string]: unknown;
}

export interface SimulationScenario {
  scenario: string;
  delay_minutes?: number;
  reduction?: string;
  [key: string]: unknown;
}

export interface Recommendations {
  critical_corridor?: string;
  recommended_station?: string;
  peak_incident_hour?: number;
  historical_incidents?: number;
  average_resolution_time?: number;
  actions?: string[];
  [key: string]: unknown;
}

export interface CommanderBriefing {
  summary?: string;
  risk?: number;
  recommended_station?: string;
  critical_corridor?: string;
  officers?: number;
  barricades?: number;
  expected_delay?: number;
  expected_reduction?: string;
  [key: string]: unknown;
}

export interface ImpactCenter {
  latitude: number;
  longitude: number;
}

export interface ImpactAnalysis {
  event_cause?: string;
  historical_incidents?: number;
  impact_radius_km: number;
  estimated_vehicle_impact: number;
  affected_junctions: string[];
  center: ImpactCenter;
  polygon: [number, number][];
  [key: string]: unknown;
}

export interface PredictRequest {
  event_type: string;
  event_cause: string;
  requires_road_closure: string;
  priority: string;
  corridor: string;
  police_station: string;
  hour: number;
  day_of_week: number;
  month: number;
}

export interface PredictResponse {
  risk: number;
  historical_stats: HistoricalStats;
  optimization: OptimizationResult;
  simulation: SimulationScenario[];
  recommendations: Recommendations;
  plan: string;
  commander: CommanderBriefing;
  impact_analysis: ImpactAnalysis;
}

export type RiskLevel =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | number
  | string;

export const riskToLabel = (
  risk: number | string | undefined
): string => {
  if (typeof risk === 'number') {
    if (risk === 2) return 'HIGH';
    if (risk === 1) return 'MEDIUM';
    return 'LOW';
  }

  return String(risk ?? 'LOW').toUpperCase();
};