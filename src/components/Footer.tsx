import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--accent-navy)',
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '4rem 5% 2rem',
      marginTop: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '3rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
              fontSize: '1.4rem', 
              fontWeight: 800, 
              color: 'white'
            }}>
              Legalizer
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            The enterprise-grade platform for intelligent legal document generation and secure evidence tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/templates" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Smart Templates</Link>
              <Link href="/vault" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Evidence Vault</Link>
              <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Enterprise Pricing</Link>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Legal Knowledge</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/ai" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>AI Assistant</Link>
              <Link href="/dictionary" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>Legal Dictionary</Link>
              <Link href="/api" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>API Reference</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
        <p>© {new Date().getFullYear()} Legalizer System.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
