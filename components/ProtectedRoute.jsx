"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Client-side route guard that validates Firebase authentication state.
 * Displays a clean "Verifying session..." spinner during authentication resolution
 * and redirects unauthenticated users to the login route.
 */
export default function ProtectedRoute({ children, onRedirect, redirectTo = '/login' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      if (onRedirect) {
        onRedirect();
      } else {
        router.push(redirectTo);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAuthenticatedUser(currentUser);
        setLoading(false);
      } else {
        setAuthenticatedUser(null);
        setLoading(false);

        // Immediate client-side redirection
        if (onRedirect) {
          onRedirect();
        } else {
          // Support both hash navigation (#login) and direct route (/login)
          try {
            if (typeof window !== 'undefined' && window.location.hash.includes('dashboard')) {
              window.location.hash = 'login';
            }
            router.push(redirectTo);
          } catch (navErr) {
            if (typeof window !== 'undefined') {
              window.location.href = redirectTo;
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router, onRedirect, redirectTo]);

  // Clean "Verifying session..." loading spinner during auth resolution
  if (loading) {
    return (
      <div 
        className="protected-route-loading-wrapper" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          width: '100%',
          padding: '4rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(26, 115, 232, 0.15)',
              borderTopColor: '#1a73e8',
              animation: 'spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite'
            }} 
          />
          <ShieldCheck size={28} style={{ color: '#1a73e8' }} />
        </div>
        
        <h3 
          style={{ 
            fontSize: '1.2rem', 
            fontWeight: 600, 
            color: 'var(--text-primary, #0f172a)', 
            marginBottom: '0.4rem',
            letterSpacing: '-0.01em'
          }}
        >
          Verifying session...
        </h3>
        
        <p 
          style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary, #64748b)',
            maxWidth: '320px',
            lineHeight: 1.5
          }}
        >
          Checking your authentication status and permissions securely with Fintezy.
        </p>
      </div>
    );
  }

  // If unauthenticated after check, suppress content flash while redirect completes
  if (!authenticatedUser) {
    return null;
  }

  // Render protected Dashboard content
  return <>{children}</>;
}
