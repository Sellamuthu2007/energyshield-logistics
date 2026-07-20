import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'What is the current inventory status across all refineries?',
  'Which refinery has the highest production risk?',
  'Show me upcoming maintenance schedules',
  'Recommend optimal production mix for Mumbai Refinery',
];

export const OperationsAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Welcome to the Refinery Operations Assistant. How can I help you manage your refinery operations today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (text: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');

    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 800);
  };

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('inventory')) {
      return 'Current aggregate inventory across all refineries is 6.97M barrels. Mumbai Refinery has 9 days of cover (lowest), while Jamnagar has 12 days. I recommend monitoring Visakhapatnam closely as it has only 8 days remaining.';
    }
    if (q.includes('risk') || q.includes('critical')) {
      return 'Visakhapatnam Refinery has the highest risk profile with only 8 days of inventory cover and incoming shipment expected in 3 days. Mumbai Refinery is at medium risk with 9 days cover and 5 days until next shipment.';
    }
    if (q.includes('maintenance')) {
      return 'There are 4 maintenance schedules across the network. CDU-1 at Mumbai is due in 30 days (72h downtime). FCC-2 at Paradip is due in 45 days. HT-3 at Jamnagar is currently in progress. VDU-1 at Vadinar is due in 60 days.';
    }
    if (q.includes('production') || q.includes('mix')) {
      return 'Based on current demand forecasts, Mumbai Refinery should consider shifting 3% from petrol to ATF for the upcoming holiday season. Jamnagar and Paradip refineries are operating at optimal mix.';
    }
    return 'I can help with inventory status, production risks, maintenance schedules, and production optimization. Please select a suggested question or type your query above.';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-primary/80 transition-colors flex items-center justify-center"
        title="Operations Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded border border-brand-border bg-brand-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brand-border p-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-teal" />
                <span className="text-sm font-bold text-white">Operations Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-brand-muted hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white'
                      : 'bg-[#1a2130] text-brand-text border border-brand-border/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-[9px] text-brand-muted uppercase tracking-wider font-bold mb-2">Suggested Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[10px] bg-[#1a2130] text-brand-muted border border-brand-border/50 px-2 py-1 rounded hover:bg-brand-card hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-brand-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
                  placeholder="Ask about refinery operations..."
                  className="flex-1 bg-[#0e131d] text-white text-xs border border-brand-border rounded px-3 py-2 focus:outline-none focus:border-brand-primary placeholder-brand-muted"
                />
                <button
                  onClick={() => handleSend('')}
                  className="bg-brand-primary text-white px-3 py-2 rounded hover:bg-brand-primary/80 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OperationsAssistant;
