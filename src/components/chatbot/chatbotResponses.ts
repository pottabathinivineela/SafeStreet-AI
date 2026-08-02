// Predefined chatbot knowledge base. Each entry is matched against the
// user's message by simple keyword scoring — no external NLP API needed
// for this prototype.
export interface ChatbotTopic {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
}

export const CHATBOT_TOPICS: ChatbotTopic[] = [
  {
    id: 'how-it-works',
    keywords: ['work', 'works', 'how does', 'function'],
    question: 'How does SafeStreet AI work?',
    answer:
      'SafeStreet AI monitors camera, image, and audio inputs for signs of danger. Each input is scored for risk every few seconds; anything high-risk automatically raises a map alert and an emergency email.',
  },
  {
    id: 'smart-cities',
    keywords: ['smart city', 'smart cities', 'city', 'infrastructure'],
    question: 'How does this fit into smart cities?',
    answer:
      'It reuses infrastructure cities already own — street lights, poles, and public cameras — and adds a detection and alerting layer on top, instead of requiring new hardware everywhere.',
  },
  {
    id: 'womens-safety',
    keywords: ['women', 'woman', 'safety', 'harassment'],
    question: "How does it help women's safety?",
    answer:
      "Audio detection listens for distress keywords and camera detection watches for aggressive or panicked behavior, so incidents in public spaces can be flagged and responded to faster.",
  },
  {
    id: 'emergency-process',
    keywords: ['emergency', 'alert', 'process', 'respond', 'response'],
    question: 'What happens during an emergency?',
    answer:
      'A high-risk detection creates an alert with type, confidence, time, and location, shows a red popup, pings the notification bell, logs it in Alert History, and sends an emergency email.',
  },
  {
    id: 'future-scope',
    keywords: ['future', 'roadmap', 'next', 'plan', 'expand'],
    question: "What's the future scope?",
    answer:
      'The simulated detection engine is built to be swapped for real models — YOLO or Roboflow for vision, Whisper for audio — plus integrations with dispatch systems and city control rooms.',
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'data', 'store', 'record'],
    question: 'What about privacy?',
    answer:
      "This prototype processes video and audio in the browser for the demo and doesn't persist raw footage anywhere — only detection metadata (type, confidence, time) is logged.",
  },
];

export const FALLBACK_ANSWER =
  "I'm not sure about that one yet. Try asking how SafeStreet AI works, how it supports women's safety, or what happens during an emergency.";

export function matchTopic(message: string): ChatbotTopic | null {
  const lower = message.toLowerCase();
  let best: { topic: ChatbotTopic; score: number } | null = null;
  for (const topic of CHATBOT_TOPICS) {
    const score = topic.keywords.filter((k) => lower.includes(k)).length;
    if (score > 0 && (!best || score > best.score)) {
      best = { topic, score };
    }
  }
  return best?.topic ?? null;
}
