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

    // Simulate AI thinking and searching the local JSON "Knowledge Base"
    setTimeout(() => {
      const query = text.toLowerCase();
      const matchedArticles = constitutionData.filter(doc => 
        doc.article.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );

      let responseContent = "";
      if (matchedArticles.length > 0) {
        const primary = matchedArticles[0];
        responseContent = `Based on my analysis of the Indian Constitution, the most relevant provision for your query is ${primary.article}: ${primary.title}. \n\n${primary.description}\n\nThis falls under ${primary.category}. Would you like to know how this specifically applies to a case, or should I look up related case laws?`;
      } else if (query.includes('hello') || query.includes('hi')) {
        responseContent = "Greetings! I am the Legalizer AI. I'm equipped with a comprehensive knowledge base of the Indian Constitution and standard legal procedures. How can I assist your research today?";
      } else if (query.includes('draft') || query.includes('template')) {
        responseContent = "I can certainly assist with that. While I analyze the legal requirements, you can browse our verified blueprints in the 'Templates' section or use the 'Smart Editor' to start a custom draft. What specific document type are you looking for?";
      } else {
        responseContent = "That's an interesting legal point. While I couldn't find a direct match in my primary Constitutional Knowledge Base, I can suggest looking into related Supreme Court precedents or exploring terms like 'Fundamental Rights' or 'Directive Principles' for more context. Would you like me to try searching for a different term?";
      }

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseContent,
        articles: matchedArticles.slice(0, 3) 
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestions = ["What is Article 21?", "Freedom of Speech", "Constitutional Remedies", "Right to Equality"];

  return (
    <main style={{ padding: '80px 0 0 0', display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      
      {/* Chat Header */}
      <div style={{ 
        padding: '1.5rem 5%', 
        borderBottom: '1px solid var(--border-light)', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚖️</div>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Smart Legal Assistant</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Knowledge Engine • Indian Constitution</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '2rem 5%', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
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
              maxWidth: '80%', 
              padding: '1rem 1.5rem', 
              borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: msg.role === 'user' ? 'var(--accent-navy)' : 'var(--bg-primary)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: msg.role === 'assistant' ? '1px solid var(--border-light)' : 'none'
            }}>
              {msg.content}
            </div>

            {msg.articles && msg.articles.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto', width: '100%', paddingBottom: '0.5rem' }}>
                {msg.articles.map((art, idx) => (
                  <div key={idx} className="glass-panel" style={{ minWidth: '280px', padding: '1rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-gold-dark)', marginBottom: '0.5rem' }}>{art.article}</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{art.title}</div>
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
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Assistant is searching documents...</div>
        )}
      </div>

      {/* Suggested Questions */}
      <div style={{ padding: '0.5rem 5%', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'var(--bg-secondary)' }}>
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
              fontSize: '0.85rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '1.5rem 5%', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Ask a legal question..." 
            className="input-elegant"
            style={{ padding: '12px 20px' }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={() => handleSend()} className="btn-primary" style={{ padding: '0 25px' }}>Send</button>
        </div>
      </div>

    </main>
  );
}
