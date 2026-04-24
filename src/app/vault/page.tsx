"use client";
import React, { useState } from 'react';

export default function EvidenceVault() {
  const [files, setFiles] = useState<any[]>([
    { id: '1', name: 'Identity_Proof_Pan_Card.pdf', type: 'Identification', size: '1.2 MB', date: '2026-03-15' },
    { id: '2', name: 'Property_Sale_Deed_Draft_v1.docx', type: 'Legal Document', size: '4.5 MB', date: '2026-04-02' },
    { id: '3', name: 'Evidence_Site_Photo_01.jpg', type: 'Evidence', size: '2.8 MB', date: '2026-04-10' },
    { id: '4', name: 'Signed_Rent_Agreement_2026.pdf', type: 'Signed Contract', size: '0.8 MB', date: '2026-04-11' },
  ]);

  return (
    <main style={{ padding: '2rem 5%', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-secondary)' }}>
      
      <div className="animate-fade-in stack-on-mobile" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Evidence Vault</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Highly secure, encrypted storage for case files and signed documents.</p>
        </div>
        <button className="btn-primary" style={{ padding: '12px 24px' }}>
          + Upload File
        </button>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', animationDelay: '0.1s' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }} className="stack-on-mobile">
          <input 
            type="text" 
            placeholder="Search evidence..." 
            className="input-elegant full-width-on-mobile"
            style={{ maxWidth: '400px' }}
          />
          <button className="btn-gold" style={{ padding: '12px 24px' }}>Search</button>
        </div>

        <div className="table-responsive" style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>File Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Size</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={f.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{f.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{f.type}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{f.size}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{f.date}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button style={{ 
                      background: 'none', border: 'none', color: 'var(--accent-gold-dark)', 
                      cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' 
                    }}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </main>
  );
}
