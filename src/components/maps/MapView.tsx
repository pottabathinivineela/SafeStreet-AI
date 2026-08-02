import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER } from '@/utils/constants';
import { getCurrentPosition } from '@/services/geoService';
import { formatDateTime } from '@/utils/helpers';
import type { EmergencyAlert } from '@/types';

// Leaflet's default marker icons reference image files that don't resolve
// correctly under Vite's bundling — rebuild them from CDN URLs instead.
const currentIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563EB;box-shadow:0 0 0 6px rgba(37,99,235,0.25)"></div>`,
  iconSize: [16, 16],
});

function dangerIcon(risk: string) {
  const color = risk === 'critical' ? '#EF4444' : '#F97316';
  return new L.DivIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 6px ${color}33;border:2px solid #0F172A"></div>`,
    iconSize: [18, 18],
  });
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface MapViewProps {
  alerts: EmergencyAlert[];
  heightClass?: string;
}

export default function MapView({ alerts, heightClass = 'h-[420px]' }: MapViewProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);

  useEffect(() => {
    getCurrentPosition().then((c) => setCenter([c.latitude, c.longitude]));
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 ${heightClass}`}>
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={center[0]} lng={center[1]} />
        <Marker position={center} icon={currentIcon}>
          <Popup>Current sensor location</Popup>
        </Marker>
        {alerts.map((alert) => (
          <Marker key={alert.id} position={[alert.latitude, alert.longitude]} icon={dangerIcon(alert.riskLevel)}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{alert.threatType}</p>
                <p>Risk: {alert.riskLevel}</p>
                <p>Time: {formatDateTime(alert.timestamp)}</p>
                <p>
                  Lat/Lng: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
