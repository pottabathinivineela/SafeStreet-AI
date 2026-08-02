import { useCallback, useRef, useState } from 'react';
import { FiCamera, FiCameraOff, FiCrop, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useCamera } from '@/hooks/useCamera';
import { useThreatSimulation } from '@/hooks/useThreatSimulation';
import { analyzeCameraFrame } from '@/services/cameraDetectionService';
import { isDangerDetection, AnalysisError } from '@/services/aiClient';
import { useAlerts } from '@/context/AlertContext';
import { formatTime } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { RiskBadge } from '@/components/ui/Badge';
import clsx from '@/utils/clsx';
import type { DetectionResult } from '@/types';

/** Converts a data URL from canvas.toDataURL() into a real Blob for upload. */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export default function CameraDetection() {
  const { videoRef, isActive, error, start, stop, captureFrame } = useCamera();
  const { raiseAlert } = useAlerts();
  const [latest, setLatest] = useState<DetectionResult | null>(null);
  const [log, setLog] = useState<DetectionResult[]>([]);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const runDetection = useCallback(async () => {
    // Never overlap two in-flight requests — wait for the previous frame's
    // real AI response before sending the next one.
    if (inFlightRef.current) return;
    const dataUrl = captureFrame();
    if (!dataUrl) return;

    inFlightRef.current = true;
    setAnalyzing(true);
    setApiError(null);
    try {
      const blob = await dataUrlToBlob(dataUrl);
      const result = await analyzeCameraFrame(blob);
      setLatest(result);
      setLog((prev) => [result, ...prev].slice(0, 25));
      if (isDangerDetection(result)) {
        await raiseAlert(result);
      }
    } catch (err) {
      setApiError(err instanceof AnalysisError ? err.message : 'Camera analysis failed.');
    } finally {
      setAnalyzing(false);
      inFlightRef.current = false;
    }
  }, [captureFrame, raiseAlert]);

  // Every 5 seconds, send the current frame to the real backend AI while
  // the camera is active.
  useThreatSimulation(isActive, 5000, runDetection);

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) setCapturedFrame(frame);
  };

  const isDanger = latest ? isDangerDetection(latest) : false;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <GlassCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div>
            <h2 className="font-semibold text-white">AI Camera Detection</h2>
            <p className="text-xs text-slate-500">Every 5 seconds, the live frame is sent to the SafeStreet AI backend for real analysis.</p>
          </div>
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs text-safe">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe" /> LIVE
            </span>
          )}
        </div>

        <div
          className={clsx(
            'relative aspect-video bg-base-950 transition-shadow duration-300',
            isDanger && 'shadow-[inset_0_0_0_3px_#EF4444]',
          )}
        >
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
              <FiCamera size={32} />
              <p className="text-sm">Camera is off</p>
            </div>
          )}
          {analyzing && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-base-900/80 px-3 py-1.5 text-xs text-signal-soft">
              <FiLoader className="animate-spin" size={12} /> Analyzing frame...
            </div>
          )}
          {isDanger && latest && (
            <div className="absolute left-3 top-3 rounded-full bg-danger px-3 py-1.5 font-mono text-[11px] text-white shadow-glow-danger">
              {latest.label} · {latest.confidence}%
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-4">
          {!isActive ? (
            <Button icon={<FiCamera />} onClick={start}>Start Camera</Button>
          ) : (
            <Button icon={<FiCameraOff />} variant="danger" onClick={stop}>Stop Camera</Button>
          )}
          <Button icon={<FiCrop />} variant="ghost" onClick={handleCapture} disabled={!isActive}>
            Capture Frame
          </Button>
          {(error || apiError) && (
            <span className="flex items-center gap-1.5 text-xs text-danger"><FiAlertCircle /> {error || apiError}</span>
          )}
        </div>

        {capturedFrame && (
          <div className="border-t border-white/10 p-4">
            <p className="mb-2 text-xs text-slate-500">Last captured frame</p>
            <img src={capturedFrame} alt="Captured frame" className="max-h-40 rounded-lg border border-white/10" />
          </div>
        )}
      </GlassCard>

      <GlassCard className="flex flex-col">
        <h3 className="font-semibold text-white">Detection Feed</h3>
        {latest ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{latest.label}</span>
              <RiskBadge risk={latest.riskLevel} />
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-400">
              <p>Confidence: {latest.confidence}%</p>
              <p>Timestamp: {formatTime(latest.timestamp)}</p>
              {latest.reasoning && <p>AI note: {latest.reasoning}</p>}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Start the camera to begin real AI detection.</p>
        )}

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {log.slice(1).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-xs">
              <span className="text-slate-300">{item.label}</span>
              <span className="text-slate-500">{formatTime(item.timestamp)}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
