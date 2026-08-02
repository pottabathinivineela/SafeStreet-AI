import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { CHATBOT_TOPICS, FALLBACK_ANSWER, matchTopic } from './chatbotResponses';
import { generateId } from '@/utils/helpers';
import type { ChatMessage } from '@/types';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "Hi, I'm the SafeStreet AI assistant. Ask me how the system works, or tap a suggestion below.",
  timestamp: new Date().toISOString(),
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const respond = (text: string) => {
    const userMsg: ChatMessage = { id: generateId('msg'), role: 'user', text, timestamp: new Date().toISOString() };
    const topic = matchTopic(text);
    const botMsg: ChatMessage = {
      id: generateId('msg'),
      role: 'bot',
      text: topic ? topic.answer : FALLBACK_ANSWER,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    respond(input.trim());
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-card mb-3 flex h-[28rem] w-[22rem] flex-col overflow-hidden p-0 shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">SafeStreet Assistant</p>
                <p className="text-xs text-safe">● Online</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-slate-400 hover:text-white">
                <FiX />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === 'bot'
                      ? 'bg-white/[0.06] text-slate-200'
                      : 'ml-auto bg-signal text-white'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 py-2">
              {CHATBOT_TOPICS.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => respond(t.question)}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {t.question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-white/10 bg-base-900/60 px-3 py-2 text-sm text-white outline-none focus:border-signal"
              />
              <button
                onClick={handleSend}
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-signal text-white hover:bg-signal-soft"
              >
                <FiSend size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle chatbot"
        className="grid h-14 w-14 place-items-center rounded-full bg-signal text-white shadow-glow"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>
    </div>
  );
}
