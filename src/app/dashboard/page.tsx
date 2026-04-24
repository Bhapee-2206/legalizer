"use client";
import React, { useState, useEffect } from 'react';
import { ActivityChart, TemplateUsageChart } from '@/components/DashboardCharts';
import Link from 'next/link';
import { useSimulation } from '@/context/SimulationContext';

export default function Dashboard() {
  const { role, user, activeCase, respondToCase, login, activities } = useSimulation();
  const [realPendingAdvocates, setRealPendingAdvocates] = useState<any[]>([]);
  const [allAdvocates, setAllAdvocates] = useState<any[]>([]);

  useEffect(() => {
    if (role === 'Admin') {
      fetch('/api/advocates/pending')
        .then(res => res.json())
        .then(data => {
          if (data.advocates) setRealPendingAdvocates(data.advocates);
        })
        .catch(err => console.error("Error fetching pending advocates:", err));
        
      fetch('/api/advocates/all')
        .then(res => res.json())
        .then(data => {
          if (data.advocates) setAllAdvocates(data.advocates);
        })
        .catch(err => console.error("Error fetching all advocates:", err));
    }
  }, [role]);

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const res = await fetch('/api/advocates/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approve })
      });
      if (res.ok) {
        setRealPendingAdvocates(prev => prev.filter(a => a.id !== id));
        if (approve) {
          // Update the all advocates list to show as verified
          setAllAdvocates(prev => prev.map(a => a.id === id ? { ...a, isVerified: true } : a));
        } else {
          // Remove from all advocates list if rejected
          setAllAdvocates(prev => prev.filter(a => a.id !== id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefreshStatus = async () => {
    if (!user || !user.id) return;
    try {
      const res = await fetch(`/api/auth/status?id=${user.id}`);
      const data = await res.json();
      if (res.ok && data.isVerified) {
        login(role!, { ...user, isVerified: true, status: 'Approved' });
        window.location.reload();
      } else {
        alert("Status is still pending. The admin has not verified you yet.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const roleStyles: any = {

    Admin: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    Advocate: { color: '#ceb070', bg: 'rgba(206, 176, 112, 0.1)' },
    Client: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
  };

  if (!role) {
    return (
      <main style={{ padding: '120px 5%', textAlign: 'center' }}>
        <h2>Please Sign In</h2>
        <p>You need to be signed in to view the dashboard.</p>
        <Link href="/signin" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block', textDecoration: 'none' }}>Go to Sign In</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem 5%', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-secondary)', marginTop: 'var(--nav-height, 80px)' }}>
      
      <div className="animate-fade-in stack-on-mobile" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>Executive Dashboard</h1>
            <div style={{ 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: roleStyles[role]?.color, 
              background: roleStyles[role]?.bg,
              border: `1px solid ${roleStyles[role]?.color}44`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {role} View
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome back, {user?.name || 'User'}. Managing your legal operations.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="full-width-on-mobile">
          {role === 'Client' && !activeCase && (
            <Link href="/connect" className="btn-gold" style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '0.9rem' }}>Connect</Link>
          )}
          <Link href="/editor" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '0.9rem' }}>
            + New Doc
          </Link>
        </div>
      </div>

      {/* ADMIN PANEL */}
      {role === 'Admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', border: '1px solid var(--border-strong)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>🛡️ Advocate Verification Requests</h2>
            {realPendingAdvocates.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending advocate verification requests.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {realPendingAdvocates.map(adv => (
                  <div key={adv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <h4 style={{ marginBottom: '0.2rem' }}>{adv.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: {adv.email} | Barcode: <strong>{adv.barcode}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleApprove(adv.id, false)} className="btn-primary" style={{ background: '#ef4444', fontSize: '0.8rem', padding: '8px 16px' }}>Reject</button>
                      <button onClick={() => handleApprove(adv.id, true)} className="btn-primary" style={{ background: '#10b981', fontSize: '0.8rem', padding: '8px 16px' }}>Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', border: '1px solid var(--border-strong)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>📚 All Registered Advocates</h2>
            {allAdvocates.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No advocates registered yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {allAdvocates.map(adv => (
                  <div key={adv.id} style={{ padding: '1.2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${adv.isVerified ? '#10b981' : '#f59e0b'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0 }}>{adv.name}</h4>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: adv.isVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: adv.isVerified ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {adv.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem 0' }}>{adv.email}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Barcode: <strong>{adv.barcode}</strong></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADVOCATE WAITING ROOM */}
      {role === 'Advocate' && (!user || !user.isVerified) && (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', marginBottom: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⏳</div>
          <h2 style={{ marginBottom: '1rem' }}>Verification in Progress</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            Account Status: <strong>{user?.status || 'Pending Review'}</strong>. Your credentials (Barcode: {user?.barcode}) are being verified by the Admin. You will have full access once approved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/" className="btn-primary" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', textDecoration: 'none' }}>Back to Home</Link>
            <button className="btn-gold" onClick={handleRefreshStatus}>Refresh Status</button>
          </div>
        </div>
      )}

      {/* Case Management Section for Advocates (Verified Only) */}
      {role === 'Advocate' && user?.isVerified && activeCase && activeCase.status === 'Pending' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--accent-gold)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🔔 New Representation Request</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p><strong>Client:</strong> User (Simulated)</p>
              <p><strong>Case:</strong> {activeCase.title} ({activeCase.type})</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => respondToCase('Rejected')} className="btn-primary" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Decline</button>
              <button onClick={() => respondToCase('Accepted')} className="btn-primary">Accept Case</button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Logic continues... (Charts, Stats) */}
      {(role === 'Admin' || (role === 'Advocate' && user?.isVerified) || role === 'Client') && (
        <>
          <div className="animate-fade-in dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
            {[
              { title: 'Total Documents', val: activeCase ? '1' : '0', inc: 'Live', show: ['Admin', 'Advocate'] },
              { title: 'Active Cases', val: activeCase?.status === 'Accepted' ? '1' : '0', inc: 'Live', show: ['Admin', 'Advocate', 'Client'] },
              { title: 'Compliance Score', val: activeCase ? '100%' : '0%', inc: 'Live', show: ['Admin'] },
              { title: 'Pending Signatures', val: '0', inc: 'Live', show: ['Admin', 'Advocate', 'Client'] },
              { title: 'Vault Storage', val: '0 GB', inc: 'Live', show: ['Admin'] },
            ].filter((s:any) => s.show.includes(role)).map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{stat.title}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.val}</span>
                  <span style={{ fontSize: '0.85rem', color: stat.inc.startsWith('+') ? '#10b981' : (stat.inc.startsWith('-') ? '#ef4444' : 'var(--accent-gold)'), fontWeight: 600 }}>{stat.inc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fade-in dashboard-grid" style={{ display: 'grid', gridTemplateColumns: role === 'Admin' ? '1fr 1fr' : '2fr 1fr', gap: '1.5rem', animationDelay: '0.2s', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>System Utilization</h2>
              <ActivityChart />
            </div>
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Template Popularity</h2>
              <TemplateUsageChart />
            </div>
          </div>

          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', animationDelay: '0.3s', paddingBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Activity Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(() => {
                const filteredActivities = role === 'Admin' ? activities : activities.filter((a: any) => a.userId === user?.email || a.userId === user?.id || a.global);
                
                if (!filteredActivities || filteredActivities.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      No recent activity found.
                    </div>
                  );
                }
                
                return filteredActivities.map((activity: any, i: number) => {
                  const diffMin = Math.round((Date.now() - activity.timestamp) / 60000);
                  const timeStr = diffMin < 1 ? 'Just now' : diffMin < 60 ? `${diffMin} min ago` : diffMin < 1440 ? `${Math.floor(diffMin/60)} hours ago` : `${Math.floor(diffMin/1440)} days ago`;
                  
                  return (
                    <div key={activity.id} className="stack-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '1.25rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', borderRadius: '50%' }}>{activity.icon}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{activity.event}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{activity.details}</p>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{timeStr}</div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </>
      )}

    </main>
  );
}
