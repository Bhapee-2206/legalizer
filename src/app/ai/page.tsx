"use client";
import React, { useState, useRef, useEffect } from 'react';
import constitutionData from '@/data/indianConstitution.json';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  articles?: typeof constitutionData;
};

export default function AILegalKnowledgeBoard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI Legal Assistant. You can ask me about Indian Constitutional law, fundamental rights, or specific articles. How can I help you today?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string = userInput) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // Real AI API Call
    (async () => {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });

        const data = await res.json();
        
        if (!res.ok && !data.isSimulated) {
          throw new Error(data.error || "AI Service Unavailable");
        }

        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: data.content,
          articles: data.articles
        };
        
        setMessages(prev => [...prev, aiMsg]);
      } catch (err: any) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Connection Issue: ${err.message}. I've switched to local limited mode. Please try asking about specific Indian Constitution articles like 'Article 21' or 'Fundamental Rights'.`
        }]);
      } finally {
        setIsTyping(false);
      }
    })();
  };

  const suggestions = ["What is Article 21?", "Freedom of Speech", "Constitutional Remedies", "Right to Equality"];

  return (
    <main style={{ padding: '80px 0 0 0', display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      
      {/* Chat Header */}
      <div style={{ 
        padding: '1rem 5%', 
        borderBottom: '1px solid var(--border-light)', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚖️</div>
        <div>
          <h1 style={{ fontSize: '1.1rem', margin: 0 }}>Smart Legal Assistant</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Knowledge Engine • Indian Constitution</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem 5%', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.2rem',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '100%'
          }}>
            <div style={{ 
              maxWidth: '90%', 
              padding: '0.8rem 1.2rem', 
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'var(--accent-navy)' : 'var(--bg-primary)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: msg.role === 'assistant' ? '1px solid var(--border-light)' : 'none',
              fontSize: '0.95rem'
            }}>
              {msg.content}
            </div>

            {msg.articles && msg.articles.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto', width: '100%', paddingBottom: '0.5rem' }}>
                {msg.articles.map((art, idx) => (
                  <div key={idx} className="glass-panel" style={{ minWidth: '260px', maxWidth: '300px', padding: '1rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-gold-dark)', marginBottom: '0.4rem' }}>{art.article}</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{art.title}</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Assistant is searching documents...</div>
        )}
      </div>

      {/* Suggested Questions */}
      <div style={{ padding: '0.75rem 5%', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
        {suggestions.map((s, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(s)}
            style={{ 
              whiteSpace: 'nowrap', 
              padding: '6px 14px', 
              borderRadius: '16px', 
              border: '1px solid var(--border-strong)', 
              background: 'var(--bg-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'var(--transition-smooth)'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem 5%', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '1000px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Ask a legal question..." 
            className="input-elegant"
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={() => handleSend()} className="btn-primary" style={{ padding: '0 20px', fontSize: '0.9rem' }}>Send</button>
        </div>
      </div>

    </main>
  );
}
