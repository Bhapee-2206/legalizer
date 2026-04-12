import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '120px 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'var(--bg-secondary)' }}>
      
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '900px', width: '100%', padding: '5rem 3rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'rgba(206, 176, 112, 0.15)', 
            color: 'var(--accent-gold-dark)', 
            fontWeight: 'bold', 
            padding: '10px 24px', 
            borderRadius: '24px',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Next-Gen Legal Drafting
          </div>
        </div>

        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1', fontWeight: 900, letterSpacing: '-0.04em' }}>
          Real-time Legal <br/><span style={{ color: 'var(--accent-gold)' }}>Intelligence.</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
          Generate court-ready templates, consult our AI legal engine, and securely sign documents with our enterprise-grade suite.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 36px', textDecoration: 'none' }}>
            Go to Dashboard
          </Link>
          <Link href="/templates" className="btn-gold" style={{ fontSize: '1.1rem', padding: '18px 36px', textDecoration: 'none' }}>
            View Templates
          </Link>
        </div>
      </div>

      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', marginTop: '4rem', animationDelay: '0.2s' }}>
        {[
          { title: 'AI Legal Assistant', desc: 'Ask complex legal questions and get instant references to constitutional articles.', icon: '🧠', link: '/ai' },
          { title: 'Digital Signatures', desc: 'Securely sign your documents with our integrated digital signature pad technology.', icon: '🖋️', link: '/vault/signature' },
          { title: 'Evidence Vault', desc: 'Store and manage critical case evidence with end-to-end encryption.', icon: '🔐', link: '/vault' }
        ].map((feat, i) => (
          <Link key={i} href={feat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{feat.icon}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}
