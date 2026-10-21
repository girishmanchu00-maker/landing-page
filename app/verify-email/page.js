"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  applyActionCode, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error' | 'prompt_email'
  const [message, setMessage] = useState('Validating your verification link with Firebase...');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      if (!auth) {
        setStatus('error');
        setMessage('Firebase is not initialized. Please check your setup.');
        return;
      }

      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      const href = typeof window !== 'undefined' ? window.location.href : '';

      // 1. Passwordless Magic Link Sign In Flow
      if (isSignInWithEmailLink(auth, href)) {
        let email = typeof window !== 'undefined' ? window.localStorage.getItem('emailForSignIn') : null;
        if (!email) {
          // If user opened link on a different device/browser, prompt for email
          setStatus('prompt_email');
          setMessage('Please confirm your email address to complete sign in.');
          return;
        }

        try {
          await signInWithEmailLink(auth, email, href);
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('emailForSignIn');
          }
          setStatus('success');
          setMessage(`Signed in successfully as ${email}! Entering Fin2ools portal...`);
          setTimeout(() => {
            router.push('/#home');
          }, 1500);
          return;
        } catch (err) {
          console.error('signInWithEmailLink error:', err);
          setStatus('error');
          setMessage(err.message || 'The magic link has expired or is invalid. Please request a new one.');
          return;
        }
      }

      // 2. Email Address Verification Flow
      if (oobCode) {
        try {
          await applyActionCode(auth, oobCode);
          setStatus('success');
          setMessage('Your email address has been successfully verified! You now have full access to Fin2ools.');
          return;
        } catch (err) {
          console.error('applyActionCode error:', err);
          let errText = err.message;
          if (err.code === 'auth/invalid-action-code') {
            errText = 'This verification link is invalid or has already been used.';
          } else if (err.code === 'auth/expired-action-code') {
            errText = 'This verification link has expired. Please sign in and request a fresh verification link.';
          }
          setStatus('error');
          setMessage(errText);
          return;
        }
      }

      // 3. Fallback: No parameters found
      setStatus('error');
      setMessage('No verification code found in this link. Please check your email for the correct link.');
    };

    handleVerification();
  }, [searchParams, router]);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setStatus('verifying');
    setMessage('Signing in with magic link...');
    try {
      const href = typeof window !== 'undefined' ? window.location.href : '';
      await signInWithEmailLink(auth, emailInput.trim(), href);
      setStatus('success');
      setMessage(`Signed in successfully as ${emailInput.trim()}! Entering Fin2ools portal...`);
      setTimeout(() => {
        router.push('/#home');
      }, 1500);
    } catch (err) {
      console.error('Manual email sign-in error:', err);
      setStatus('error');
      setMessage(err.message || 'Failed to verify email link.');
    }
  };

  return (
    <div 
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div 
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}
      >
        {status === 'verifying' && (
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
              <Loader2 size={48} className="animate-spin" style={{ color: '#1a73e8', animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Verifying Email
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={52} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Verification Complete!
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {message}
            </p>
            <button
              type="button"
              onClick={() => router.push('/#dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <span>Go to Team Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === 'prompt_email' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Confirm Your Email
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {message}
            </p>
            <form onSubmit={handlePromptSubmit}>
              <input 
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#1a73e8',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Complete Sign In
              </button>
            </form>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
              <AlertCircle size={52} style={{ color: '#ef4444' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {message}
            </p>
            <button
              type="button"
              onClick={() => router.push('/#login')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <span>Return to Sign In</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading verification service...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
