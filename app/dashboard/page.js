"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';

/**
 * /dashboard Next.js Route
 * Protected route entry point for direct URL visits.
 */
export default function DashboardRoutePage() {
  const router = useRouter();

  return (
    <ProtectedRoute redirectTo="/#login">
      <div 
        style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h2>Redirecting to Member Dashboard...</h2>
          <p style={{ color: 'var(--text-secondary, #64748b)', marginTop: '8px' }}>
            Session authenticated. Loading your analytics and inquiries.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
