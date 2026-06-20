'use client';
import { useEffect, useState, useRef } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, Circle,
  Polygon, Polyline, useMap
} from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hotspot, ImpactAnalysis } from '@/types';
import { Check, Layers as LayersIcon, Map as MapIcon, Maximize2, Crosshair, RotateCcw, Minimize2 } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createHotspotIcon = (count: number) => {
  const color = count > 30 ? '#EF4444' : count > 15 ? '#F59E0B' : '#10B981';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="width:32px;height:32px;border-radius:50%;background:${color}2A;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#FFF;text-shadow:0 1px 3px rgba(0,0,0,0.8);font-family:'Inter',sans-serif;box-shadow:0 0 16px ${color}50;">${count}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const centerIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="width:18px;height:18px;border-radius:50%;background:#EF4444;border:3px solid white;box-shadow:0 0 24px rgba(239,68,68,0.9);"></div>
      <div style="position:absolute;width:40px;height:40px;border-radius:50%;border:2px solid #EF4444;opacity:0.6;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const policeStationIcon = L.divIcon({
  className: '',
  html: `
    <div style="background:#3B82F6;border:2.5px solid white;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.6);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

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

  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('street');
  const [panelOpen, setPanelOpen] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasImpact = !!impact?.center?.latitude;
  const center: [number, number] = hasImpact
    ? [impact!.center.latitude, impact!.center.longitude]
    : hotspots.length > 0
      ? [hotspots[0].latitude, hotspots[0].longitude]
      : [12.9716, 77.5946];

  const defaultZoom = hasImpact ? 13 : 12;

  const handleCenter = () => {
    map?.setView(center, defaultZoom, { animate: true });
  };

  const handleReset = () => {
    setLayers({
      hotspots: true,
      impactZone: true,
      impactPolygon: true,
      policeStation: true,
      alternativeRoute: true,
    });
    setMapStyle('street');
    map?.setView(center, defaultZoom, { animate: true });
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      map?.invalidateSize();
    }, 300);
  };

  const polygonPositions: [number, number][] = (impact?.polygon || []).map(
    ([lat, lng]) => [lat, lng] as [number, number]
  );

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

  const stationLocation: [number, number] | null = hasImpact
    ? [center[0] + 0.008, center[1] - 0.018]
    : null;

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : undefined,
        left: isFullscreen ? 0 : undefined,
        right: isFullscreen ? 0 : undefined,
        bottom: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 9999 : 1,
        borderRadius: isFullscreen ? '0' : 'var(--radius-card)',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--border)',
        height: isFullscreen ? '100vh' : '680px',
        width: isFullscreen ? '100vw' : '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      <div ref={panelRef} style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          title="Map Layers & Styles"
          style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: panelOpen ? '#3B82F6' : 'rgba(15,22,35,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)', cursor: 'pointer', color: panelOpen ? '#FFF' : 'var(--text)',
            transition: 'all 0.2s',
          }}
        >
          <LayersIcon size={18} />
        </button>
        <button
          onClick={handleCenter}
          title="Center Map"
          style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,22,35,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)',
            transition: 'all 0.2s',
          }}
        >
          <Crosshair size={18} />
        </button>
        <button
          onClick={handleReset}
          title="Reset Map"
          style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,22,35,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)',
            transition: 'all 0.2s',
          }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={handleFullscreen}
          title="Toggle Fullscreen"
          style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,22,35,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)',
            transition: 'all 0.2s',
          }}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 10 }}
              style={{
                position: 'absolute', right: '52px', top: 0,
                width: '220px', padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(15,22,35,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#3B82F6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapIcon size={12} /> Map Type
                </div>
                {Object.entries(MAP_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setMapStyle(key as keyof typeof MAP_STYLES)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-xs)', fontWeight: 600, cursor: 'pointer',
                      color: mapStyle === key ? '#3B82F6' : 'var(--text-secondary)',
                      background: mapStyle === key ? 'rgba(59,130,246,0.12)' : 'transparent',
                      border: mapStyle === key ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {style.name}
                    {mapStyle === key && <Check size={12} color="#3B82F6" />}
                  </button>
                ))}
              </div>

              <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />

              <div>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LayersIcon size={12} /> Data Layers
                </div>
                {Object.entries(layers).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setLayers(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '0.4rem 0.25rem',
                      fontSize: 'var(--font-xs)', fontWeight: 500, cursor: 'pointer',
                      color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: value ? '#10B981' : 'transparent',
                      border: value ? '1px solid #10B981' : '1px solid var(--border)',
                    }}>
                      {value && <Check size={11} color="white" strokeWidth={3} />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        zoomControl={false}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          key={mapStyle}
          url={MAP_STYLES[mapStyle].url}
          attribution={mapStyle === 'dark' ? '&copy; CARTO' : '&copy; Google Maps'}
          maxZoom={20}
        />

        <MapUpdater center={center} zoom={defaultZoom} />

        {layers.hotspots &&
          hotspots.map((h, i) => (
            <Marker key={i} position={[h.latitude, h.longitude]} icon={createHotspotIcon(h.incident_count)}>
              <Popup>
                <div style={{ padding: '0.5rem', minWidth: '180px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{h.junction}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{h.zone}</div>
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Incidents</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EF4444' }}>{h.incident_count}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {hasImpact && layers.impactZone && (
          <Circle
            center={[impact!.center.latitude, impact!.center.longitude]}
            radius={impact!.impact_radius_km * 1000}
            pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.08, weight: 2, dashArray: '8, 8' }}
          />
        )}

        {hasImpact && layers.impactPolygon && polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.12, weight: 2 }}
          />
        )}

        {hasImpact && layers.alternativeRoute && affectedPath.length > 0 && (
          <>
            <Polyline positions={affectedPath} pathOptions={{ color: '#EF4444', weight: 5, opacity: 0.8 }} />
            <Polyline positions={diversionPath} pathOptions={{ color: '#10B981', weight: 5, opacity: 0.9, dashArray: '10, 10' }} />
          </>
        )}

        {hasImpact && layers.policeStation && stationLocation && (
          <Marker position={stationLocation} icon={policeStationIcon}>
            <Popup>
              <div style={{ padding: '0.5rem', minWidth: '160px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Active Dispatch Hub</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{policeStationName || 'Recommended Station'}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {hasImpact && <Marker position={center} icon={centerIcon} />}
      </MapContainer>

      {hasImpact && (
        <div style={{
          position: 'absolute', bottom: 16, left: 16,
          display: 'flex', gap: '0.5rem', zIndex: 1000,
          flexWrap: 'wrap',
          maxWidth: 'calc(100% - 32px)',
        }}>
          {[
            { color: '#EF4444', label: 'Congested Route' },
            { color: '#10B981', label: 'Diversion Route', dashed: true },
            { color: '#F59E0B', label: 'Impact Zone' },
            { color: '#3B82F6', label: 'Dispatch Station' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.75rem', borderRadius: '999px',
                background: 'rgba(15,22,35,0.9)', backdropFilter: 'blur(8px)',
                border: '1px solid var(--border)',
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
              }}
            >
              <div style={{
                width: '20px', height: '3px', borderRadius: '999px',
                background: item.color,
                borderTop: item.dashed ? `2px dashed ${item.color}` : 'none',
              }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
