"use client";
import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';

export default function AdvocateMarketplace() {
  const { role, activeCase, submitCase } = useSimulation();
  const [selectedAdvocate, setSelectedAdvocate] = useState<any>(null);
  const [caseForm, setCaseForm] = useState({ title: '', type: 'Property Dispute', description: '' });
  const [realAdvocates, setRealAdvocates] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/advocates/verified')
      .then(res => res.json())
      .then(data => {
        if (data.advocates) setRealAdvocates(data.advocates);
      })
      .catch(err => console.error(err));
  }, []);

  const handleConnect = (adv: any) => {
    setSelectedAdvocate(adv);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCase({
      ...caseForm,
      advocateId: selectedAdvocate.id,
      advocateName: selectedAdvocate.name
    });
    router.push('/dashboard');
  };

  if (role !== 'Client') {
    return (
      <main style={{ padding: '120px 5%', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Only Clients can browse the Advocate Marketplace.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '100px 5% 4rem 5%', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '0.75rem' }}>Advocate Marketplace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Connect with premium verified legal professionals tailored to your case type.</p>
      </div>

      {activeCase && activeCase.status !== 'Rejected' ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
          <h3>You already have an active connection request.</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Status: <strong>{activeCase.status}</strong> with {activeCase.advocateName}</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ marginTop: '1.5rem' }}>View on Dashboard</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedAdvocate ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {!selectedAdvocate ? (
            realAdvocates.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No verified advocates available at the moment. Please check back later.
              </div>
            ) : (
              realAdvocates.map((adv) => (
                <div key={adv.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⚖️</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 700 }}>{adv.rating} ⭐</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{adv.successRate} Success</div>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{adv.name}</h3>
                <p style={{ color: 'var(--accent-navy)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{adv.specialization || 'General Legal Practice'}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  <span>📍 {adv.location || 'Not Specified'}</span>
                  <span>💼 {adv.experience || 'Not Listed'}</span>
                </div>

                <button onClick={() => handleConnect(adv)} className="btn-gold" style={{ width: '100%' }}>Request Consultation</button>
              </div>
              ))
            )
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--bg-primary)' }}>
              <button onClick={() => setSelectedAdvocate(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', marginBottom: '1rem', cursor: 'pointer' }}>← Back to marketplace</button>
              <h2 style={{ marginBottom: '0.5rem' }}>Initiate Case with {selectedAdvocate.name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please provide preliminary details about your case.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Case Title</label>
                  <input 
                    required 
                    type="text" 
                    className="input-elegant" 
                    placeholder="e.g. Property Registration Issue"
                    value={caseForm.title}
                    onChange={e => setCaseForm({...caseForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Case Category</label>
                  <select 
                    className="input-elegant"
                    value={caseForm.type}
                    onChange={e => setCaseForm({...caseForm, type: e.target.value})}
                  >
                    <option>Property Dispute</option>
                    <option>Criminal Defense</option>
                    <option>Family & Divorce</option>
                    <option>Corporate Contract</option>
                    <option>Constitutional Rights</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                  <textarea 
                    required 
                    className="input-elegant" 
                    style={{ minHeight: '120px', resize: 'vertical' }} 
                    placeholder="Describe your legal requirement..."
                    value={caseForm.description}
                    onChange={e => setCaseForm({...caseForm, description: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '15px' }}>Send Request to Advocate</button>
              </form>
            </div>
          )}
        </div>
      )}

    </main>
  );
}
