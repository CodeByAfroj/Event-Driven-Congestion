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
  total_incidents?: number;
  avg_duration_min?: number;
  peak_hour?: number;
  common_corridor?: string;
  common_station?: string;
  [key: string]: unknown;
}

export interface OptimizationResult {
  officers?: number;
  barricades?: number;
  diversion_required?: boolean | string;
  [key: string]: unknown;
}

export interface SimulationScenario {
  scenario: string;
  delay_minutes?: number;
  reduction_percent?: number;
  effectiveness?: string;
  [key: string]: unknown;
}

export interface RecommendationItem {
  action?: string;
  priority?: string;
  description?: string;
  [key: string]: unknown;
}

export interface Recommendations {
  immediate?: RecommendationItem[] | string[];
  tactical?: RecommendationItem[] | string[];
  strategic?: RecommendationItem[] | string[];
  [key: string]: unknown;
}

export interface CommanderBriefing {
  summary?: string;
  risk?: string;
  recommended_station?: string;
  critical_corridor?: string;
  officers?: number;
  expected_delay?: string | number;
  expected_reduction?: string | number;
  [key: string]: unknown;
}

export interface ImpactCenter {
  latitude: number;
  longitude: number;
}

export interface ImpactAnalysis {
  impact_radius_km: number;
  estimated_vehicle_impact: number;
  center: ImpactCenter;
  polygon: [number, number][];
  affected_junctions?: string[];
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
  risk: string;
  historical_stats: HistoricalStats;
  optimization: OptimizationResult;
  simulation: SimulationScenario[];
  recommendations: Recommendations;
  plan: string;
  commander: CommanderBriefing;
  impact_analysis: ImpactAnalysis;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | string;
