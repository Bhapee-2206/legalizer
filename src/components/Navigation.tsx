"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { role, user, logout } = useSimulation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height, 80px)',
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
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} onClick={() => setIsMenuOpen(false)}>
            <img 
              src="/logo.png" 
              alt="Legalizer Logo" 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                marginRight: '10px',
                objectFit: 'cover'
              }} 
            />
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)'
            }}>
              Legalizer
            </span>
          </Link>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {role === 'Client' && <Link href="/connect" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Find Advocate</Link>}
            {role && <Link href="/editor" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Smart Editor</Link>}
            <Link href="/vault" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Vault</Link>
            <Link href="/templates" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Templates</Link>
            {role && <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link>}
            <Link href="/ai" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Legal AI</Link>
          </div>
          
          <div className="hide-on-mobile" style={{ height: '24px', width: '1px', background: 'var(--border-strong)', margin: '0 0.5rem' }}></div>
          
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

          <div className="hide-on-mobile">
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <Link href="/signin" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  Sign In
                </Link>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'var(--accent-navy)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none' }}></span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <Link href="/ai" className="mobile-nav-link">Legal AI</Link>
        <Link href="/vault" className="mobile-nav-link">Evidence Vault</Link>
        <Link href="/templates" className="mobile-nav-link">Templates</Link>
        {role && (
          <>
            <Link href="/editor" className="mobile-nav-link">Smart Editor</Link>
            <Link href="/dashboard" className="mobile-nav-link">Dashboard</Link>
            {role === 'Client' && <Link href="/connect" className="mobile-nav-link">Find Advocate</Link>}
          </>
        )}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {role ? (
            <>
              <div style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{user?.name || role}</div>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn-gold" style={{ textDecoration: 'none', textAlign: 'center' }}>Sign In</Link>
              <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
