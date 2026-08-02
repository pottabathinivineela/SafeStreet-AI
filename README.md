# SafeStreet AI

**Transforming Street Lights into Intelligent Safety Networks**

A working prototype demonstrating how AI-powered smart street infrastructure
can detect suspicious activity — via camera, uploaded images, and audio —
and immediately alert authorities with a map location and an emergency
email. Every result on the dashboard comes from a real AI model call to
the included backend. Nothing is randomly generated.

## Project layout

```
safestreet-ai/
  src/            Frontend — React + Vite + TypeScript + Tailwind (unchanged UI)
  backend/        Backend — Node.js + Express, calls real OpenAI models
```

## 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and add your real OPENAI_API_KEY (https://platform.openai.com/api-keys)
npm run dev
```

The backend listens on `http://localhost:5000` by default and exposes:

- `POST /api/analyze-image` — uploaded photo → vision model prediction
- `POST /api/analyze-camera-frame` — one live webcam frame → vision model prediction
- `POST /api/analyze-audio` — recorded audio segment → Whisper transcript → keyword scan
- `GET /api/health` — reports whether an API key is configured

Every route calls a real OpenAI model (`gpt-4o-mini` for vision, `whisper-1`
for speech-to-text by default — configurable in `.env`) and returns a
structured JSON prediction. If the AI call fails, the route returns an
error — it never falls back to a made-up result.

## 2. Start the frontend

```bash
# from the project root
npm install
cp .env.example .env   # defaults already point at the local backend
npm run dev
```

Open the printed local URL. The webcam **never starts automatically** —
only when you press "Start Camera" — and is fully released the moment you
press "Stop Camera". The microphone works the same way.

## How the real pipeline works

```
User input (photo / camera frame / audio)
        │
        ▼
Frontend service layer (src/services/*DetectionService.ts)
        │  fetch() → multipart upload
        ▼
Backend route (backend/src/routes/analyze.js)
        │  calls a real model
        ▼
OpenAI (vision model for images/frames, Whisper for audio)
        │  real prediction
        ▼
Deterministic risk scoring (backend/src/utils/riskEngine.js)
        │  maps label → risk level → recommendation (no randomness)
        ▼
Dashboard displays the result
        │  only if risk is "high" or "critical"
        ▼
Emergency popup + Alert History + Live Map marker + EmailJS + Analytics
```

The frontend always waits for the backend's response before showing
anything — there's no "simulate while waiting" behavior.

## EmailJS setup

The app runs fully without EmailJS credentials — emergency emails are
simulated (logged to the console) so the alert flow still works end to end.
To send real emails:

1. Create a free account at https://www.emailjs.com/
2. Add an Email Service and an Email Template (see
   `src/emails/EMAIL_TEMPLATE.md` for the exact variables to use, including
   `threat_type`, `threat_source`, `confidence`, `location`, `time`,
   `latitude`, `longitude`, `suggested_action`, and `risk_level`).
3. Copy `.env.example` to `.env` at the project root and fill in your
   Service ID, Template ID, and Public Key.

No keys are hardcoded anywhere in the source.

## Frontend structure (unchanged from the original prototype)

```
src/
  components/
    layout/      Navbar, Footer
    ui/           Button, GlassCard, Badge, StatCounter
    landing/      Hero, About, Problem, Solution, Features, HowItWorks,
                   Technology, ImpactStats, Contact
    dashboard/    DashboardLayout, CameraDetection, ImageUpload,
                   AudioDetection, AlertHistory, Analytics
    chatbot/      Floating AI assistant + its knowledge base
    maps/         Leaflet MapView
    alerts/       AlertBanner (emergency popup), NotificationBell
    analytics/    Pie / bar / line chart components
  pages/          LandingPage, DashboardPage (nested routes)
  hooks/          useCamera, useMicrophone, useThreatSimulation
  services/       imageDetectionService, cameraDetectionService,
                   audioDetectionService — real backend AI calls
                   emailService — EmailJS integration
                   mapService — geolocation resolution for alert pins
                   analyticsService — derives dashboard counters from
                   real alert data
                   aiClient — shared fetch/error handling for the above
  context/        AlertContext — wires a real detection -> history ->
                   analytics -> email -> map together
  emails/         EmailJS template documentation
  types/          Shared TypeScript types
  utils/          Constants and helper functions (no random generators)
```

## Backend structure

```
backend/
  src/
    server.js          Entry point
    app.js              Express app, CORS, health check
    routes/analyze.js   POST /analyze-image, /analyze-camera-frame, /analyze-audio
    services/openaiService.js   The only file that calls OpenAI directly
    utils/riskEngine.js         Deterministic label -> risk level mapping
    middleware/upload.js        Multer config for image/audio uploads
```

## Swapping AI providers later

Everything AI-specific lives in `backend/src/services/openaiService.js`.
To use a different vision or speech model (Azure, a self-hosted YOLO
server, Roboflow, a different Whisper deployment), that's the only file
you need to change — the routes, risk engine, and entire frontend stay
the same.

## Tech stack

**Frontend:** React + Vite, TypeScript, Tailwind CSS, Framer Motion,
React Icons, Leaflet (OpenStreetMap), Recharts, EmailJS.
**Backend:** Node.js, Express, Multer, OpenAI SDK (vision + Whisper).
