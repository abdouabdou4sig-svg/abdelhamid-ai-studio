
import React, { useState } from 'react';
import { chatWithAi } from '../services/aiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    try {
      const response = await chatWithAi(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response || "Erreur de réponse" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Désolé, une erreur s'est produite." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] glass rounded-[40px] overflow-hidden border border-white/5">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
            <Bot size={48} className="mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Prêt pour la conversation</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-red-600'}`}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-none' : 'bg-zinc-900 border border-white/5 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center"><Bot size={18} /></div>
            <div className="bg-zinc-900 p-4 rounded-3xl rounded-tl-none"><Loader2 className="animate-spin" size={18} /></div>
          </div>
        )}
      </div>
      <div className="p-6 bg-black/40 border-t border-white/5">
        <div className="relative">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question à l'IA..."
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:border-red-600 transition-all"
          />
          <button onClick={handleSend} className="absolute right-2 top-2 p-2 bg-red-600 rounded-xl text-white hover:bg-red-500 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
