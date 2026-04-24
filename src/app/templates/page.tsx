"use client";
import React from 'react';
import localTemplates from '@/data/templates.json';
import Link from 'next/link';
import { useSimulation } from '@/context/SimulationContext';

export default function TemplatesPage() {
  const { activeCase } = useSimulation();

  return (
    <main style={{ padding: '80px 5% 4rem 5%', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="animate-fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(206, 176, 112, 0.1)', color: 'var(--accent-gold-dark)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
          Document Marketplace
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Legal <span style={{ color: 'var(--accent-gold)' }}>Blueprints.</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', maxWidth: '700px', margin: '0 auto' }}>
          Browse our collection of court-ready legal templates, meticulously drafted by legal experts for compliance and clarity.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {Object.entries(localTemplates).map(([key, template]: [string, any]) => (
          <div key={key} className="glass-panel animate-fade-in" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
              {key === 'Property Dispute' && '🏠'}
              {key === 'House Rent Agreement' && '📜'}
              {key === 'Criminal Defense' && '⚖️'}
              {key === 'Corporate Contract' && '🏢'}
              {key === 'Default' && '📝'}
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{key}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
              Professional {key.toLowerCase()} blueprint including standard clauses and compliance headers for Indian courts.
            </p>
            
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Format</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>PDF / DOC / TXT</span>
              </div>
              <Link href="/editor" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Use Template</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel animate-fade-in" style={{ marginTop: '5rem', padding: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent-navy) 0%, #020617 100%)', color: 'white' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>Can't find what you're looking for?</h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Our AI assistant can help you draft custom documents from scratch based on your specific legal requirements.
        </p>
        <Link href="/ai" style={{ textDecoration: 'none' }}>
          <button className="btn-gold" style={{ padding: '18px 40px' }}>Consult AI Assistant</button>
        </Link>
      </div>

    </main>
  );
}
