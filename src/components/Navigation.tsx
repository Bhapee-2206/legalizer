"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { role, user, logout } = useSimulation();
  const [theme, setTheme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      transition: 'var(--transition-smooth)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Legalizer Logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              marginRight: '12px',
              objectFit: 'cover'
            }} 
          />
          <span style={{ 
            fontSize: '1.4rem', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)'
          }}>
            Legalizer
          </span>
        </Link>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
        {role === 'Client' && <Link href="/connect" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Find Advocate</Link>}
        {role && <Link href="/editor" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Smart Editor</Link>}
        <Link href="/vault" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Vault</Link>
        <Link href="/templates" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
        {role && <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link>}
        <Link href="/ai" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Legal AI</Link>
        
        <div style={{ height: '24px', width: '1px', background: 'var(--border-strong)', margin: '0 0.5rem' }}></div>
        
        <button 
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'var(--transition-smooth)'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {role ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-gold-dark)' }}>{user?.name || role}</span>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}>Logout</button>
          </div>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--accent-navy)',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}>Login</button>
          </Link>
        )}
      </nav>
    </header>
  );
}
