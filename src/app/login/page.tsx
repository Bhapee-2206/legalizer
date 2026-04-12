"use client";
import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'Client' | 'Advocate'>('Client');
  const [form, setForm] = useState({ name: '', email: '', barcode: '' });
  const { login, requestAdvocateVerification } = useSimulation();
  const router = useRouter();

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('Client', { name: form.name, email: form.email });
    router.push('/dashboard');
  };

  const handleAdvocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestAdvocateVerification({
      name: form.name,
      email: form.email,
      barcode: form.barcode
    });
    router.push('/dashboard');
  };

  return (
    <main style={{ padding: '120px 5% 4rem 5%', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '3rem', backgroundColor: 'var(--bg-primary)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Access Legalizer</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Choose your account type to continue.</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '12px', marginBottom: '2.5rem' }}>
          {(['Client', 'Advocate'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setForm({ name: '', email: '', barcode: '' });
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === tab ? 'var(--accent-navy)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                transition: 'var(--transition-smooth)'
              }}
            >
              For {tab}s
            </button>
          ))}
        </div>

        {activeTab === 'Client' ? (
          <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
              <input required className="input-elegant" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
              <input required type="email" className="input-elegant" placeholder="john@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
              <input required type="password" className="input-elegant" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginTop: '1rem' }}>
              Create Client Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdvocateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
              <input required className="input-elegant" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Gmail Address</label>
              <input required type="email" className="input-elegant" placeholder="john@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Court Barcode Number</label>
              <input required className="input-elegant" placeholder="BC-IND-12345" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} />
            </div>
            
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '15px', marginTop: '1rem' }}>
              Submit for Verification
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Advocate accounts require Admin approval based on the provided barcode.
            </p>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <Link href="/admin-login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Access</Link>
        </div>

      </div>

    </main>
  );
}
