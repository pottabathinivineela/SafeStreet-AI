import { useRef, useState } from 'react';
import { FiUploadCloud, FiImage, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { analyzeUploadedImage } from '@/services/imageDetectionService';
import { isDangerDetection, AnalysisError } from '@/services/aiClient';
import { useAlerts } from '@/context/AlertContext';
import { formatTime } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { RiskBadge } from '@/components/ui/Badge';
import type { DetectionResult } from '@/types';

export default function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { raiseAlert } = useAlerts();
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setPreview(reader.result as string);
      setResult(null);
      setError(null);
      setAnalyzing(true);

      try {
        // Real AI call — the dashboard waits for this before showing anything.
        const detection = await analyzeUploadedImage(file);
        setResult(detection);
        if (isDangerDetection(detection)) {
          await raiseAlert(detection);
        }
      } catch (err) {
        setError(err instanceof AnalysisError ? err.message : 'Image analysis failed. Please try again.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <GlassCard>
        <h2 className="font-semibold text-white">Image Upload Analysis</h2>
        <p className="mt-1 text-xs text-slate-500">Upload a photo — it's sent to the SafeStreet AI backend for a real AI threat scan.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            dragOver ? 'border-signal bg-signal/5' : 'border-white/15 hover:border-white/25'
          }`}
        >
          {preview ? (
            <img src={preview} alt="Uploaded preview" className="max-h-72 rounded-xl border border-white/10" />
          ) : (
            <>
              <FiUploadCloud className="text-3xl text-slate-500" />
              <p className="text-sm text-slate-400">Drag & drop an image, or click to browse</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {preview && (
          <Button variant="ghost" className="mt-4" onClick={() => inputRef.current?.click()}>
            Upload another image
          </Button>
        )}
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-white">Analysis Result</h3>
        {analyzing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <FiLoader className="animate-spin" />
            Running AI image analysis...
          </div>
        )}
        {error && !analyzing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-danger">
            <FiAlertCircle /> {error}
          </div>
        )}
        {!analyzing && !result && !error && (
          <div className="mt-4 flex flex-col items-center py-10 text-center text-slate-500">
            <FiImage className="mb-2 text-2xl" />
            <p className="text-sm">No image analyzed yet.</p>
          </div>
        )}
        {result && !analyzing && (
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{result.label}</span>
              <RiskBadge risk={result.riskLevel} />
            </div>
            <Row label="Confidence" value={`${result.confidence}%`} />
            <Row label="Threat level" value={result.riskLevel.toUpperCase()} />
            <Row label="Risk score" value={`${Math.round(result.confidence * 0.9)}/100`} />
            <Row label="Recommendation" value={result.recommendation ?? '—'} />
            <Row label="Timestamp" value={formatTime(result.timestamp)} />
            {result.reasoning && <Row label="AI note" value={result.reasoning} />}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-white">{value}</span>
    </div>
  );
}
