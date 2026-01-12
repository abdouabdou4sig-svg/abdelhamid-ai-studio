import React, { useState } from 'react';
import { chatWithAi } from '../services/aiService';
import { MessageSquare, Send } from 'lucide-react';

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<{r: string, t: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setMessages(p => [...p, {r: 'u', t: msg}]);
    setLoading(true);
    const res = await chatWithAi(msg);
    setMessages(p => [...p, {r: 'b', t: res || "Erreur."}]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-panel rounded-[40px] overflow-hidden animate-fade-in border-brand-gold/20">
      <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30">
            <MessageSquare size={64} className="mb-4" />
            <p className="font-magic uppercase tracking-widest">L'Oracle est prêt</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.r === 'u' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-bold ${m.r === 'u' ? 'bg-brand-gold text-brand-dark rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/10'}`}>
              {m.t}
            </div>
          </div>
        ))}
        {loading && <div className="text-brand-gold animate-pulse text-[10px] uppercase font-black">L'IA réfléchit...</div>}
      </div>
      <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Consulter l'Oracle..." className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-gold/50" />
        <button onClick={handleSend} className="bg-brand-gold text-brand-dark p-4 rounded-2xl hover:scale-105 transition-transform">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default AiChat;