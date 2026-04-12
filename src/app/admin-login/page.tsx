"use client";
import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [pass, setPass] = useState('');
  const { login } = useSimulation();
  const router = useRouter();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') { // Simple simulation password
      login('Admin', { name: 'Super Admin' });
      router.push('/dashboard');
    } else {
      alert('Invalid admin credentials.');
    }
  };

  return (
    <main style={{ padding: '120px 5% 4rem 5%', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>

      <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', width: '100%', padding: '3rem', backgroundColor: 'var(--bg-primary)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Admin Access</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Restricted area for project administrators.</p>
        </div>

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Admin Master Key</label>
            <input
              type="password"
              className="input-elegant"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '15px' }}>Verify & Enter</button>
        </form>



      </div>

    </main>
  );
}
