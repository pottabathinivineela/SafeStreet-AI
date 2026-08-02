import { useCallback, useEffect, useRef, useState } from 'react';

export function useMicrophone() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(Array(28).fill(4));
  const [stream, setStream] = useState<MediaStream | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const bars = 28;
    const chunk = Math.floor(data.length / bars) || 1;
    const next: number[] = [];
    for (let i = 0; i < bars; i++) {
      const slice = data.slice(i * chunk, (i + 1) * chunk);
      const avg = slice.reduce((a, b) => a + b, 0) / (slice.length || 1);
      next.push(Math.max(4, Math.round((avg / 255) * 100)));
    }
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(mediaStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      setIsListening(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError('Microphone access was denied or is unavailable on this device.');
      setIsListening(false);
    }
  }, [tick]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    setStream(null);
    setIsListening(false);
    setLevels(Array(28).fill(4));
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { isListening, error, levels, start, stop, stream };
}
