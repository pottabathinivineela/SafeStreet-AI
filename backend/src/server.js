import 'dotenv/config';
import app from './app.js';
import { pingAiService } from './services/aiServiceClient.js';

const PORT = process.env.PORT || 5000;
const FLASK_AI_URL = process.env.FLASK_AI_URL || 'http://localhost:6000';

app.listen(PORT, async () => {
  console.log(`SafeStreet AI backend listening on http://localhost:${PORT}`);
  console.log(`Expecting Flask AI service at ${FLASK_AI_URL}`);

  const reachable = await pingAiService();
  if (!reachable) {
    console.warn(
      `\n[SafeStreet AI backend] WARNING: could not reach the Flask AI service at ${FLASK_AI_URL}.\n` +
      'Start it with: cd ai_service && python app.py\n',
    );
  } else {
    console.log('Flask AI service is reachable. Ready to analyze.');
  }
});
