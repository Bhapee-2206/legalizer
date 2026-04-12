"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function DigitalSignaturePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#0f172a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath(); // Reset path so next stroke is separate
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
    setHasSigned(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
      ctx.beginPath();
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSigned) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'legal-signature.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <main style={{ padding: '120px 5% 4rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Digital Signature Pad</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Securely draw your signature below. This simulation creates high-resolution transparent signatures ready for legal document placement.
        </p>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', animationDelay: '0.1s' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Signature Area</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use mouse or touch to sign</p>
          </div>
          <button onClick={clearCanvas} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            Clear Canvas
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            disabled={!hasSigned}
            onClick={saveSignature}
            className="btn-gold" 
            style={{ 
              opacity: hasSigned ? 1 : 0.5, 
              cursor: hasSigned ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>💾</span> Save Signature as PNG
          </button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px', animationDelay: '0.2s' }}>
        {[
          { icon: '🔒', title: 'End-to-End Encryption', desc: 'Secure local generation' },
          { icon: '📜', title: 'Anti-Tamper Tech', desc: 'Verified audit trails' },
          { icon: '⚖️', title: 'Legal Compliance', desc: 'Meets IT Act standards' }
        ].map((feat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feat.icon}</div>
            <h4 style={{ marginBottom: '0.5rem' }}>{feat.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feat.desc}</p>
          </div>
        ))}
      </div>

    </main>
  );
}
