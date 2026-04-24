"use client";
import React, { useState, useEffect, useRef } from 'react';
import localTemplates from '@/data/templates.json';
import { useSimulation } from '@/context/SimulationContext';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

export default function DocumentEditor() {
  const { activeCase, role, addActivity } = useSimulation();
  const [content, setContent] = useState('');
  const [baseContent, setBaseContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [loading, setLoading] = useState(true);
  const [autoFillFields, setAutoFillFields] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const router = useRouter();
  const documentRef = useRef<HTMLDivElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // 1. Simulate Online Free API Fetch
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setAutoFillFields([]); // Reset fields for new template
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (activeCase && activeCase.status === 'Accepted') {
        const template = (localTemplates as any)[activeCase.type] || localTemplates.Default;
        let generatedContent = template.content;
        
        generatedContent = generatedContent.replace(/\[CLIENT_NAME\]/g, 'User'); 
        generatedContent = generatedContent.replace(/\[ADVOCATE_NAME\]/g, activeCase.advocateName || 'Your Advocate');
        generatedContent = generatedContent.replace(/\[DATE\]/g, new Date().toLocaleDateString());
        
        setContent(generatedContent);
        setBaseContent(generatedContent);
        setTitle(template.title);
      } else {
        setContent(localTemplates.Default.content);
        setBaseContent(localTemplates.Default.content);
        setTitle(localTemplates.Default.title);
      }
      setLoading(false);
    };
    fetchTemplates();
  }, [activeCase]);

  // 2. Scan Content for Placeholders (Run only once when template loads)
  useEffect(() => {
    if (content && autoFillFields.length === 0) {
      const matches = content.match(/\[[A-Z0-9_]+\]/g);
      if (matches) {
        const unique = Array.from(new Set(matches.map(m => m.slice(1, -1))));
        setAutoFillFields(unique);
      }
    }
  }, [content, autoFillFields.length]);

  const handleFieldChange = (field: string, val: string) => {
    setFieldValues(prev => {
      const newFieldValues = { ...prev, [field]: val };
      
      // Rebuild content from base template to prevent losing placeholders
      let newContent = baseContent;
      for (const key of Object.keys(newFieldValues)) {
        if (newFieldValues[key]) {
          newContent = newContent.split(`[${key}]`).join(newFieldValues[key]);
        }
      }
      setContent(newContent);
      
      return newFieldValues;
    });
  };

  const clearAutoFill = () => {
    setFieldValues({});
    setContent(baseContent);
    setShowAutoFill(false);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const baseName = title
      .replace(/\.[^/.]+$/, '')
      .replace(/[\\/:*?"<>|]/g, '')
      .trim()
      .replace(/\s+/g, '_') || 'legal_document';

    setIsExporting(true);
    
    // Log Activity
    addActivity('Document Drafted', `${title} created and exported as ${exportType.toUpperCase()}`, '📝');

    try {
      if (exportType === 'pdf') {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const margin = 20;
        const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        let y = margin;
        const lineHeight = 7;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.setFont('times', 'normal');
        pdf.setFontSize(11);

        const paragraphs = content.split('\n');
        for (const para of paragraphs) {
          const lines: string[] = pdf.splitTextToSize(para || ' ', maxWidth);
          for (const line of lines) {
            if (y + lineHeight > pageHeight - margin) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(line, margin, y);
            y += lineHeight;
          }
          y += 2;
        }

        pdf.save(`${baseName}.pdf`);

      } else {
        const wordHtml = [
          "<html xmlns:o='urn:schemas-microsoft-com:office:office'",
          " xmlns:w='urn:schemas-microsoft-com:office:word'",
          " xmlns='http://www.w3.org/TR/REC-html40'>",
          "<head><meta charset='utf-8'>",
          "<style>body{font-family:'Times New Roman',serif;padding:60px;line-height:1.8;font-size:12pt;}</style>",
          "</head><body>",
          content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'),
          "</body></html>"
        ].join('');

        const blob = new Blob(['\ufeff', wordHtml], {
          type: 'application/vnd.ms-word;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);

        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = `${baseName}.doc`;
          downloadLinkRef.current.click();
          
          // Cleanup after a delay
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 60000);
        }
      }
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '120px 5%', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>Connecting to Remote Template API...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  return (
    <main style={{ padding: '100px 2% 4rem 2%', backgroundColor: 'var(--bg-tertiary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div className="animate-fade-in" style={{ 
        maxWidth: '1200px', 
        width: '100%', 
        margin: '0 auto 1.5rem auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem' 
      }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Drafting Suite</span>
          <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={() => setShowAutoFill(!showAutoFill)} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            {showAutoFill ? 'Close Wizard' : '🪄 Smart Fill'}
          </button>
          <button type="button" onClick={() => router.push('/dashboard')} className="btn-primary" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Exit</button>
          
          <div style={{ display: 'flex', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <select 
              value={exportType} 
              onChange={(e) => setExportType(e.target.value)}
              style={{ 
                padding: '8px', 
                border: 'none', 
                background: 'var(--bg-primary)', 
                fontSize: '0.8rem',
                outline: 'none',
                color: 'var(--text-primary)'
              }}
            >
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
            </select>
            <button type="button" onClick={handleExport} disabled={isExporting} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 0, border: 'none', borderLeft: '1px solid var(--border-strong)', fontSize: '0.8rem', opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}>
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap-reverse' }}>
        
        <div ref={documentRef} className="animate-fade-in" style={{ 
          flex: '1',
          width: '100%',
          maxWidth: '850px', 
          minHeight: '1000px', 
          backgroundColor: '#fff', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
          padding: 'clamp(1rem, 5%, 4rem)',
          borderRadius: '2px',
          position: 'relative',
          borderTop: '5px solid var(--accent-gold)',
          backgroundImage: 'linear-gradient(#f1f1f1 1.1rem, #ccc 1.2rem, transparent 1.2rem)',
          backgroundSize: '100% 1.2rem',
          lineHeight: '1.2rem'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) rotate(-45deg)', 
            fontSize: '8rem', 
            fontWeight: 900, 
            color: 'rgba(0,0,0,0.03)', 
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}>
            LEGALIZER DRAFT
          </div>

          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ 
              width: '100%', 
              minHeight: '900px', 
              border: 'none', 
              background: 'transparent', 
              color: '#1a1a1a',
              fontSize: 'clamp(0.9rem, 3vw, 1.05rem)',
              lineHeight: '1.7',
              resize: 'none',
              outline: 'none',
              fontFamily: 'serif',
              fontWeight: 500,
              paddingLeft: '15px',
              borderLeft: '1px solid #fee2e2'
            }}
          />
        </div>

        <div style={{ width: '100%', maxWidth: '300px' }} className="animate-fade-in">
          {showAutoFill && autoFillFields.length > 0 ? (
            <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)', position: 'sticky', top: '120px', border: '1px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-gold-dark)' }}>Auto-Fill Wizard</h3>
                <button type="button" onClick={clearAutoFill} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We've detected {autoFillFields.length} fields. Enter details below to populate the document.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                {autoFillFields.map(field => (
                  <div key={field}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>{field.replace(/_/g, ' ')}</label>
                    <input 
                      className="input-elegant" 
                      style={{ padding: '8px', fontSize: '0.85rem' }} 
                      placeholder={`Enter ${field.toLowerCase().replace(/_/g, ' ')}`}
                      value={fieldValues[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setShowAutoFill(false)} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.85rem' }}>Finish Filling</button>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)', position: 'sticky', top: '120px' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Drafting Intelligence</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRESET TEMPLATE</label>
                <select 
                  className="input-elegant" 
                  style={{ padding: '10px', fontSize: '0.8rem', marginTop: '0.5rem' }}
                  onChange={(e) => {
                    const t = (localTemplates as any)[e.target.value];
                    if (t) { 
                      setContent(t.content); 
                      setBaseContent(t.content);
                      setTitle(t.title); 
                      setFieldValues({}); 
                    }
                  }}
                >
                  <option value="Default">Choose Blueprint</option>
                  {Object.keys(localTemplates).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="button" onClick={() => alert('Real-time Clause Verification Active...')} className="btn-gold" style={{ fontSize: '0.75rem', padding: '10px' }}>Verify Legal Syntax</button>
                <button type="button" onClick={() => router.push('/vault/signature')} className="btn-gold" style={{ fontSize: '0.75rem', padding: '10px', background: 'var(--accent-navy)' }}>Seal with Sign</button>
              </div>
              {activeCase && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.5rem' }}>LINKED CASE</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><strong>ID:</strong> {activeCase.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><strong>Ref:</strong> {activeCase.title}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <a ref={downloadLinkRef} style={{ display: 'none' }} aria-hidden="true" />
    </main>
  );
}
