import { useEffect, useRef, useState } from 'react';
import { FiMic, FiMicOff, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useMicrophone } from '@/hooks/useMicrophone';
import { analyzeAudioSegment } from '@/services/audioDetectionService';
import { isDangerDetection, AnalysisError } from '@/services/aiClient';
import { useAlerts } from '@/context/AlertContext';
import { formatTime } from '@/utils/helpers';
import { AUDIO_KEYWORD_HINTS } from '@/utils/constants';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Badge, RiskBadge } from '@/components/ui/Badge';
import type { DetectionResult } from '@/types';

const SEGMENT_MS = 5000; // length of each recorded chunk sent for transcription

export default function AudioDetection() {
  const { isListening, error, levels, start, stop, stream } = useMicrophone();
  const { raiseAlert } = useAlerts();
  const [latest, setLatest] = useState<DetectionResult | null>(null);
  const [log, setLog] = useState<DetectionResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  // While listening, continuously record ~5s segments from the real
  // microphone stream and send each one to the backend for a real Whisper
  // transcription + keyword scan. No timers ever invent a result here.
  useEffect(() => {
    if (!isListening || !stream) return;
    cancelledRef.current = false;
    let recorder: MediaRecorder | null = null;
    let segmentTimer: ReturnType<typeof setTimeout> | null = null;

    const recordSegment = () => {
      if (cancelledRef.current) return;
      const chunks: BlobPart[] = [];
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } catch {
        return; // MediaRecorder / codec unsupported in this browser
      }

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        if (cancelledRef.current) return;
        const blob = new Blob(chunks, { type: 'audio/webm' });
        console.log("Audio blob size:", blob.size);
        if (blob.size > 2000) {
          setAnalyzing(true);
          setApiError(null);
          try {
            const result = await analyzeAudioSegment(blob);
            if (!cancelledRef.current) {
              setLatest(result);
              setLog((prev) => [result, ...prev].slice(0, 25));
              if (isDangerDetection(result)) {
                await raiseAlert(result);
              }
            }
          } catch (err) {
            if (!cancelledRef.current) {
              setApiError(err instanceof AnalysisError ? err.message : 'Audio analysis failed.');
            }
          } finally {
            if (!cancelledRef.current) setAnalyzing(false);
          }
        }

        if (!cancelledRef.current) recordSegment();
      };

      recorder.start();
      segmentTimer = setTimeout(() => {
        if (recorder && recorder.state !== 'inactive') recorder.stop();
      }, SEGMENT_MS);
    };

    recordSegment();

    return () => {
      cancelledRef.current = true;
      if (segmentTimer) clearTimeout(segmentTimer);
      if (recorder && recorder.state !== 'inactive') recorder.stop();
    };
  }, [isListening, stream, raiseAlert]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Audio Detection</h2>
            <p className="mt-1 text-xs text-slate-500">Transcribes live audio with Whisper and scans the transcript for danger keywords.</p>
          </div>
          {isListening && (
            <span className="flex items-center gap-1.5 text-xs text-safe">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe" /> LISTENING
            </span>
          )}
        </div>

        <div className="mt-6 flex h-32 items-end justify-center gap-1 rounded-xl border border-white/10 bg-base-950 p-4">
          {levels.map((lvl, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-signal to-signal-soft transition-all duration-100"
              style={{ height: `${isListening ? lvl : 4}%` }}
            />
          ))}
        </div>

        {analyzing && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <FiLoader className="animate-spin" size={12} /> Transcribing segment...
          </div>
        )}

        {latest && isDangerDetection(latest) && (
          <div className="mt-4 animate-flashBanner rounded-xl border border-danger/40 px-4 py-3 text-sm text-danger">
            🚨 Detected keyword: <strong>{latest.label}</strong> — {latest.confidence}% confidence at {formatTime(latest.timestamp)}
            {latest.transcript && <p className="mt-1 text-xs text-danger/80">"{latest.transcript}"</p>}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!isListening ? (
            <Button icon={<FiMic />} onClick={start}>Start Listening</Button>
          ) : (
            <Button icon={<FiMicOff />} variant="danger" onClick={stop}>Stop Listening</Button>
          )}
          {(error || apiError) && (
            <span className="flex items-center gap-1.5 text-xs text-danger"><FiAlertCircle /> {error || apiError}</span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Listening for:</span>
          {AUDIO_KEYWORD_HINTS.map((k) => <Badge key={k}>{k}</Badge>)}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col">
        <h3 className="font-semibold text-white">Detected Segments</h3>
        {log.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Start listening to begin real-time transcription.</p>
        ) : (
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
            {log.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/5 px-3 py-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={item.riskLevel} />
                    <span className="text-slate-500">{formatTime(item.timestamp)}</span>
                  </div>
                </div>
                {item.transcript && <p className="mt-1 text-slate-500">"{item.transcript}"</p>}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
