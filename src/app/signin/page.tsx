"use client";
import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useSimulation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.user.role, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '100px 5% 4rem 5%', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '2rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Secure Sign In for Legal Entities.</p>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input required type="email" className="input-elegant" placeholder="name@domain.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input required type="password" className="input-elegant" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '15px', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : 'Secure Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/signup" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Don't have an account? Sign Up
          </Link>
          <Link href="/admin-login" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Access</Link>
        </div>

      </div>

    </main>
  );
}
