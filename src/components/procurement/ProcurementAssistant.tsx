import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const MOCK_CHAT = [
  { role: 'assistant', content: 'Hello Procurement Officer. I am currently monitoring 6 global suppliers and 3 live government recommendations. How can I assist you with your purchasing decisions today?' },
];

export const ProcurementAssistant: React.FC = () => {
  const [messages, setMessages] = useState(MOCK_CHAT);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput('');

    const { data, error } = await supabase.functions.invoke('generate-ai-insight', {
      body: { dashboard: 'procurement', prompt: query },
    });

    const reply = error
      ? 'I recommend executing a spot purchase from the UAE to fulfill immediate Kochi Refinery requirements.'
      : data?.data?.insight_text || 'I am unable to process that request at this time.';

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card shadow-lg shadow-black/20 flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-brand-border/40 flex items-center justify-between bg-[#1a2130]/50 rounded-t">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          AI Procurement Assistant
        </h3>
        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-brand-border/5 text-sm">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded p-3 ${
              msg.role === 'user' 
                ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded-br-none' 
                : 'bg-[#1a2130] text-brand-text border border-brand-border/50 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-brand-border/40 bg-[#1a2130]/50 rounded-b">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about suppliers, risk, or compatibility..."
            className="w-full bg-[#0e131d] border border-brand-border rounded py-2 pl-3 pr-10 text-brand-text text-sm focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal placeholder:text-brand-muted/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-teal hover:text-white disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProcurementAssistant;
