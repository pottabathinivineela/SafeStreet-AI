"""
Audio service — real, local speech-to-text using faster-whisper.

faster-whisper (a CTranslate2 reimplementation of OpenAI's Whisper) was
chosen over the original openai-whisper package because it runs
noticeably faster and lighter on CPU-only, low-RAM machines like an
Intel Celeron N3350 — exactly the target hardware here. "tiny.en" with
int8 quantization is the lightest usable model; bump WHISPER_MODEL_SIZE
up (e.g. "base.en") in .env if you have more headroom and want better
accuracy.

The model is loaded once at startup, same as the vision models.
"""

from faster_whisper import WhisperModel


class AudioService:
    def __init__(self, model_size: str = "tiny.en", device: str = "cpu", compute_type: str = "int8"):
        print(f"[AudioService] Loading faster-whisper model '{model_size}' ({device}/{compute_type})...")
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        print("[AudioService] Whisper model loaded and ready.")
    def transcribe(self, audio_file) -> str:
        """
        Transcribes an audio file-like object (e.g. io.BytesIO) or path.
        Returns the concatenated transcript text.
        """

        segments, info = self.model.transcribe(audio_file, beam_size=1)

        text_parts = []

        for segment in segments:
            print(f"[Whisper] {segment.start:.2f}s -> {segment.end:.2f}s : {segment.text}")
            text_parts.append(segment.text.strip())

        text = " ".join(part for part in text_parts if part).strip()

        print("=" * 60)
        print("FINAL TRANSCRIPT:", text)
        print("=" * 60)

        return text