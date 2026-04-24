"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'Admin' | 'Advocate' | 'Client';

export interface Case {
  id: string;
  title: string;
  type: string;
  description: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  advocateId?: string;
  advocateName?: string;
  clientId?: string;
}

export interface AdvocateRequest {
  id: string;
  name: string;
  email: string;
  barcode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Activity {
  id: string;
  event: string;
  details: string;
  timestamp: number;
  icon: string;
  userId?: string;
  global?: boolean;
}

interface SimulationContextType {
  role: Role | null;
  user: any | null;
  activeCase: Case | null;
  pendingAdvocates: AdvocateRequest[];
  login: (role: Role, userData?: any) => void;
  logout: () => void;
  submitCase: (caseData: Omit<Case, 'id' | 'status' | 'clientId'>) => void;
  respondToCase: (status: 'Accepted' | 'Rejected') => void;
  requestAdvocateVerification: (details: Omit<AdvocateRequest, 'id' | 'status'>) => void;
  approveAdvocate: (id: string, approve: boolean) => void;
  activities: Activity[];
  addActivity: (event: string, details: string, icon: string, global?: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [pendingAdvocates, setPendingAdvocates] = useState<AdvocateRequest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load from localStorage on mount and sync across tabs
  useEffect(() => {
    const syncState = () => {
      const savedRole = localStorage.getItem('sim_role') as Role;
      const savedUser = localStorage.getItem('sim_user');
      const savedCase = localStorage.getItem('sim_case');
      const savedPending = localStorage.getItem('sim_pending_advs');
      
      const parsedPending = savedPending ? JSON.parse(savedPending) : [];
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      if (savedRole) setRole(savedRole);
      setPendingAdvocates(parsedPending);
      
      // Critical: Re-verify user status if advocate
      if (savedRole === 'Advocate' && parsedUser) {
        const matchingRequest = parsedPending.find((a: any) => a.barcode === parsedUser.barcode);
        if (matchingRequest && matchingRequest.status === 'Approved') {
          const verifiedUser = { ...parsedUser, isVerified: true, status: 'Approved' };
          setUser(verifiedUser);
          localStorage.setItem('sim_user', JSON.stringify(verifiedUser));
        } else {
          setUser(parsedUser);
        }
      } else {
        setUser(parsedUser);
      }

      const savedCasesStr = localStorage.getItem('sim_cases');
      const parsedCases = savedCasesStr ? JSON.parse(savedCasesStr) : [];
      
      let currentCase = null;
      if (parsedUser) {
        if (savedRole === 'Client') {
          currentCase = parsedCases.find((c: any) => c.clientId === parsedUser.email);
        } else if (savedRole === 'Advocate') {
          currentCase = parsedCases.find((c: any) => c.advocateName === parsedUser.name || c.advocateId === parsedUser.id);
        }
      }
      setActiveCase(currentCase || null);
      
      const savedActivities = localStorage.getItem('sim_activities');
      const parsedActivities = savedActivities ? JSON.parse(savedActivities) : [];
      setActivities(parsedActivities);
    };

    syncState();
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const login = (newRole: Role, userData: any = {}) => {
    setRole(newRole);
    setUser(userData);
    localStorage.setItem('sim_role', newRole);
    localStorage.setItem('sim_user', JSON.stringify(userData));
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    localStorage.removeItem('sim_role');
    localStorage.removeItem('sim_user');
  };

  const requestAdvocateVerification = (details: Omit<AdvocateRequest, 'id' | 'status'>) => {
    // Check if this advocate already exists
    const existing = pendingAdvocates.find(a => a.barcode === details.barcode);
    
    if (existing) {
      if (existing.status === 'Approved') {
        login('Advocate', { ...existing, isVerified: true });
        return;
      } else if (existing.status === 'Pending') {
        login('Advocate', { ...existing, isVerified: false });
        return;
      }
      // If rejected, we allow a new request (re-submission)
    }

    const newRequest: AdvocateRequest = {
      ...details,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending'
    };
    const updated = [...pendingAdvocates, newRequest];
    setPendingAdvocates(updated);
    localStorage.setItem('sim_pending_advs', JSON.stringify(updated));
    login('Advocate', { ...newRequest, isVerified: false });
  };

  const approveAdvocate = (id: string, approve: boolean) => {
    const updated = pendingAdvocates.map(adv => 
      adv.id === id ? { ...adv, status: approve ? 'Approved' : 'Rejected' as any } : adv
    );
    setPendingAdvocates(updated);
    localStorage.setItem('sim_pending_advs', JSON.stringify(updated));
    
    // If the approved advocate is currently logged in, update their user state
    if (user && user.id === id && role === 'Advocate') {
      const updatedUser = { ...user, isVerified: approve, status: approve ? 'Approved' : 'Rejected' };
      setUser(updatedUser);
      localStorage.setItem('sim_user', JSON.stringify(updatedUser));
    }
  };

  const submitCase = (caseData: Omit<Case, 'id' | 'status' | 'clientId'>) => {
    const newCase: Case = {
      ...caseData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      clientId: user?.email || 'unknown'
    };
    
    const savedCasesStr = localStorage.getItem('sim_cases');
    const parsedCases = savedCasesStr ? JSON.parse(savedCasesStr) : [];
    
    // Replace old case for this client to prevent duplicates
    const updatedCases = parsedCases.filter((c: any) => c.clientId !== newCase.clientId);
    updatedCases.push(newCase);
    
    localStorage.setItem('sim_cases', JSON.stringify(updatedCases));
    setActiveCase(newCase);
    
    addActivity(
      'Case Connection', 
      `Consultation request sent to Advocate for ${newCase.title}`, 
      '⚖️', 
      false
    );
  };

  const respondToCase = (status: 'Accepted' | 'Rejected') => {
    if (activeCase) {
      const updatedCase = { ...activeCase, status };
      
      const savedCasesStr = localStorage.getItem('sim_cases');
      const parsedCases = savedCasesStr ? JSON.parse(savedCasesStr) : [];
      const updatedCases = parsedCases.map((c: any) => c.id === updatedCase.id ? updatedCase : c);
      
      localStorage.setItem('sim_cases', JSON.stringify(updatedCases));
      setActiveCase(updatedCase);
      
      addActivity(
        'Case Response', 
        `Consultation request was ${status.toLowerCase()} for ${updatedCase.title}`, 
        status === 'Accepted' ? '✅' : '❌', 
        false
      );
    }
  };

  const addActivity = (event: string, details: string, icon: string, global = false) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      event,
      details,
      timestamp: Date.now(),
      icon,
      userId: user?.email || user?.id || 'unknown',
      global
    };
    
    const savedActivitiesStr = localStorage.getItem('sim_activities');
    const parsedActivities = savedActivitiesStr ? JSON.parse(savedActivitiesStr) : [];
    
    const updated = [newActivity, ...parsedActivities].slice(0, 50); // Keep last 50
    setActivities(updated);
    localStorage.setItem('sim_activities', JSON.stringify(updated));
  };

  return (
    <SimulationContext.Provider value={{ 
      role, user, activeCase, pendingAdvocates, activities,
      login, logout, submitCase, respondToCase, 
      requestAdvocateVerification, approveAdvocate, addActivity 
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
