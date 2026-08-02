import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import analyzeRoutes from './routes/analyze.js';
import { pingAiService } from './services/aiServiceClient.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const aiServiceReachable = await pingAiService();
  res.json({
    status: 'ok',
    aiServiceReachable,
    flaskAiUrl: process.env.FLASK_AI_URL || 'http://localhost:6000',
  });
});

app.use('/api', analyzeRoutes);

// Fallback error handler (e.g. multer file-too-large errors that slip through)
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

export default app;
