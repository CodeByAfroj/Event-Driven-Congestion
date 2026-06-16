'use client';
import { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, Circle,
  Polygon, Polyline, useMap
} from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hotspot, ImpactAnalysis } from '@/types';
import { MapPin, Settings, Eye, Check, Layers as LayersIcon, Map as MapIcon } from 'lucide-react';

// Fix default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom hotspot icon
const createHotspotIcon = (count: number) => {
  const color = count > 30 ? '#EF4444' : count > 15 ? '#F59E0B' : '#10B981';
  return L.divIcon({
    className: '',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${color}2A; border: 2px solid ${color};
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: #FFF;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          font-family: 'Inter', sans-serif;
          box-shadow: 0 0 16px ${color}50;
        ">${count}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Custom center epicentre icon
const centerIcon = L.divIcon({
  className: '',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 18px; height: 18px; border-radius: 50%;
        background: #EF4444; border: 3px solid white;
        box-shadow: 0 0 24px rgba(239,68,68,0.9);
      "></div>
      <div style="
        position: absolute; width: 40px; height: 40px;
        border-radius: 50%; border: 2px solid #EF4444;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        opacity: 0.8;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Custom Police Station Icon
const policeStationIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background: #3B82F6; border: 2.5px solid white;
      width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(59,130,246,0.6);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Auto-center map helper
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

const MAP_STYLES = {
  dark: { name: 'Command Center Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
  street: { name: 'Google Streets', url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}' },
  hybrid: { name: 'Google Hybrid', url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}' },
  satellite: { name: 'Google Satellite', url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}' },
  terrain: { name: 'Google Terrain', url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}' },
};

interface TrafficMapProps {
  hotspots?: Hotspot[];
  impact?: ImpactAnalysis;
  policeStationName?: string;
}

export const TrafficMap = ({ hotspots = [], impact, policeStationName }: TrafficMapProps) => {
  const [layers, setLayers] = useState({
    hotspots: true,
    impactZone: true,
    impactPolygon: true,
    policeStation: true,
    alternativeRoute: true,
  });

  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('dark');
  const [panelOpen, setPanelOpen] = useState(false);

  const hasImpact = !!impact?.center?.latitude;
  const center: [number, number] = hasImpact
    ? [impact!.center.latitude, impact!.center.longitude]
    : hotspots.length > 0
    ? [hotspots[0].latitude, hotspots[0].longitude]
    : [12.9716, 77.5946];

  const polygonPositions: [number, number][] = (impact?.polygon || []).map(
    ([lat, lng]) => [lat, lng] as [number, number]
  );

  // Hardcode representative coordinates representing route polylines near epicentre for simulated flow
  const affectedPath: [number, number][] = hasImpact
    ? [
        [center[0] - 0.012, center[1] - 0.015],
        [center[0] - 0.004, center[1] - 0.005],
        [center[0], center[1]],
        [center[0] + 0.006, center[1] + 0.008],
        [center[0] + 0.015, center[1] + 0.015],
      ]
    : [];

  const diversionPath: [number, number][] = hasImpact
    ? [
        [center[0] - 0.012, center[1] - 0.015],
        [center[0] - 0.018, center[1] - 0.005],
        [center[0] - 0.015, center[1] + 0.01],
        [center[0] + 0.005, center[1] + 0.022],
        [center[0] + 0.015, center[1] + 0.015],
      ]
    : [];

  // Simulated location for Yelahanka/recommended police station near epicenter
  const stationLocation: [number, number] | null = hasImpact
    ? [center[0] + 0.008, center[1] - 0.018]
    : null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-2xl"
      style={{ border: '1px solid var(--border)', height: '620px' }}
    >
      {/* Map Control Settings Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="w-12 h-12 rounded-xl flex items-center justify-center glass cursor-pointer hover:bg-gray-800 transition-all border border-gray-700 shadow-lg"
        >
          <MapIcon size={20} className="text-white" />
        </button>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-3 p-5 w-64 rounded-2xl glass-strong border border-gray-700 shadow-2xl"
              style={{ background: 'rgba(15,22,35,0.95)', backdropFilter: 'blur(20px)' }}
            >
              {/* Map Styles */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapIcon size={14} className="text-blue-400" />
                  <h4 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Map Type</h4>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(MAP_STYLES).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setMapStyle(key as keyof typeof MAP_STYLES)}
                      className={`flex items-center justify-between w-full text-[13px] font-medium text-left cursor-pointer py-2 px-3 rounded-lg transition-all ${
                        mapStyle === key ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-gray-800/80 border border-transparent'
                      }`}
                    >
                      <span>{style.name}</span>
                      {mapStyle === key && <Check size={14} color="#3B82F6" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-gray-800 my-4" />

              {/* Data Layers */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LayersIcon size={14} className="text-emerald-400" />
                  <h4 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Data Layers</h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(layers).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setLayers(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className="flex items-center justify-between w-full text-[13px] font-medium text-left cursor-pointer py-1.5 px-1 text-gray-300 hover:text-white transition-colors"
                    >
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        value ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-600 bg-gray-900/50'
                      }`}>
                        {value && <Check size={12} color="white" strokeWidth={3} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={mapStyle} // Force re-render of tile layer when style changes
          url={MAP_STYLES[mapStyle].url}
          attribution={mapStyle === 'dark' ? '&copy; CARTO' : '&copy; Google Maps'}
          maxZoom={20}
        />

        <MapUpdater center={center} zoom={hasImpact ? 13 : 12} />

        {/* Hotspots layer */}
        {layers.hotspots &&
          hotspots.map((h, i) => (
            <Marker key={i} position={[h.latitude, h.longitude]} icon={createHotspotIcon(h.incident_count)}>
              <Popup>
                <div className="p-2 space-y-1.5 font-sans min-w-[180px]">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">{h.junction}</h4>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{h.zone}</p>
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Incidents</span>
                    <p className="text-lg font-black text-red-500">{h.incident_count}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Impact zone circle */}
        {hasImpact && layers.impactZone && (
          <Circle
            center={[impact!.center.latitude, impact!.center.longitude]}
            radius={impact!.impact_radius_km * 1000}
            pathOptions={{
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Impact Polygon */}
        {hasImpact && layers.impactPolygon && polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: '#F59E0B',
              fillColor: '#F59E0B',
              fillOpacity: 0.15,
              weight: 2,
            }}
          />
        )}

        {/* Alternative & Congested Route Visualization */}
        {hasImpact && layers.alternativeRoute && affectedPath.length > 0 && (
          <>
            <Polyline
              positions={affectedPath}
              pathOptions={{
                color: '#EF4444',
                weight: 6,
                opacity: 0.8,
              }}
            />
            <Polyline
              positions={diversionPath}
              pathOptions={{
                color: '#10B981',
                weight: 6,
                opacity: 0.9,
                dashArray: '10, 10',
              }}
            />
          </>
        )}

        {/* Recommended police station marker */}
        {hasImpact && layers.policeStation && stationLocation && (
          <Marker position={stationLocation} icon={policeStationIcon}>
            <Popup>
              <div className="p-2 space-y-1.5 min-w-[160px]">
                <div className="text-[10px] font-bold text-blue-500 tracking-wider uppercase mb-1">
                  Active Dispatch Hub
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {policeStationName || 'Recommended Station'}
                </h4>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Epicenter Marker */}
        {hasImpact && <Marker position={center} icon={centerIcon} />}
      </MapContainer>
    </div>
  );
};
