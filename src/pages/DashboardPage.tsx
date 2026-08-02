import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Analytics from '@/components/dashboard/Analytics';
import CameraDetection from '@/components/dashboard/CameraDetection';
import ImageUpload from '@/components/dashboard/ImageUpload';
import AudioDetection from '@/components/dashboard/AudioDetection';
import AlertHistory from '@/components/dashboard/AlertHistory';
import MapView from '@/components/maps/MapView';
import { useAlerts } from '@/context/AlertContext';
import GlassCard from '@/components/ui/GlassCard';
import AlertBanner from '@/components/alerts/AlertBanner';

function LiveMapPage() {
  const { alerts } = useAlerts();
  return (
    <GlassCard>
      <h2 className="mb-4 font-semibold text-white">Live Threat Map</h2>
      <MapView alerts={alerts} heightClass="h-[560px]" />
    </GlassCard>
  );
}

export default function DashboardPage() {
  return (
    <>
      <AlertBanner />
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Analytics />} />
          <Route path="camera" element={<CameraDetection />} />
          <Route path="image" element={<ImageUpload />} />
          <Route path="audio" element={<AudioDetection />} />
          <Route path="map" element={<LiveMapPage />} />
          <Route path="history" element={<AlertHistory />} />
        </Route>
      </Routes>
    </>
  );
}
