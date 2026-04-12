"use client";
import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<'Client' | 'Advocate'>('Client');
  const [form, setForm] = useState({ name: '', email: '', password: '', barcode: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, requestAdvocateVerification } = useSimulation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          password: form.password, 
          role: activeTab, 
          barcode: form.barcode 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.user.role === 'Advocate' && !data.user.isVerified) {
        requestAdvocateVerification({
          name: data.user.name,
          email: data.user.email,
          barcode: data.user.barcode
        });
      } else {
        login(data.user.role, data.user);
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '120px 5% 4rem 5%', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '3rem', backgroundColor: 'var(--bg-primary)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure Registration for Legal Entities.</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '12px', marginBottom: '2rem' }}>
          {(['Client', 'Advocate'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setErrorMsg('');
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

        {errorMsg && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
            <input required className="input-elegant" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input required type="email" className="input-elegant" placeholder="name@domain.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input required type="password" className="input-elegant" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>

          {activeTab === 'Advocate' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Court Barcode Number</label>
              <input required className="input-elegant" placeholder="BC-IND-12345" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} />
            </div>
          )}
          
          <button type="submit" disabled={loading} className={activeTab === 'Client' ? "btn-primary" : "btn-gold"} style={{ width: '100%', padding: '15px', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : `Create ${activeTab} Account`}
          </button>
          
          {activeTab === 'Advocate' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Advocate accounts require Admin approval based on the provided barcode.
            </p>
          )}
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/signin" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Already have an account? Sign In
          </Link>
        </div>

      </div>

    </main>
  );
}
