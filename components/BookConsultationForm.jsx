"use client";

import React, { useState } from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  FileText 
} from 'lucide-react';

const GOOGLE_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhTjvOCbUsY8nWj3HE0a7u9EzMnkabUsuDwSLxc7d2RDaK2nIZ7cj1K1AkUd0unof7/exec";

export default function BookConsultationForm({ onSuccess, onError, className = "" }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailId: '',
    requiredService: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear feedback when user starts typing again
    if (feedback.type) {
      setFeedback({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: null, message: '' });

    // Payload mapped exactly to Google Apps Script doPost(e) contract
    const payload = {
      formType: "consultation",
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      emailId: formData.emailId.trim(),
      selection: formData.requiredService,
      description: formData.description.trim(),
      // Additional safety aliases
      requiredService: formData.requiredService,
      service: formData.requiredService,
      sheet: "Book Consultation",
      sheetName: "Book Consultation",
      name: formData.fullName.trim(),
      phone: formData.phoneNumber.trim(),
      email: formData.emailId.trim(),
      message: formData.description.trim(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      submittedAt: new Date().toISOString()
    };

    try {
      /**
       * CRITICAL REQUIREMENT:
       * Set "Content-Type": "text/plain;charset=utf-8".
       * Do not use application/json, as it triggers a CORS preflight OPTIONS request
       * that Google Apps Script Web App endpoints will reject.
       */
      const targetUrl = `${GOOGLE_SCRIPT_WEBHOOK_URL}?sheet=Book%20Consultation&type=consultation`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch (parseErr) {
        // Fallback if response text isn't strictly JSON
      }

      if (responseData && responseData.status === 'success') {
        const successMsg = responseData.message || 'Your consultation request has been successfully submitted! Our chartered specialist will contact you shortly.';

        setFeedback({
          type: 'success',
          message: successMsg
        });

        // Reset form only on success
        setFormData({
          fullName: '',
          phoneNumber: '',
          emailId: '',
          requiredService: '',
          description: ''
        });

        if (onSuccess) {
          onSuccess(payload, responseData);
        }
      } else {
        const errorMsg = (responseData && responseData.message) || (!response.ok ? `Server error (Status: ${response.status})` : 'Unable to complete your submission. Please try again.');
        setFeedback({
          type: 'error',
          message: errorMsg
        });

        if (onError) {
          onError(new Error(errorMsg));
        }
      }
    } catch (err) {
      console.error('Failed to submit consultation to Google Apps Script:', err);
      const errorMsg = err.message || 'Unable to complete your submission right now. Please check your connection or try again.';
      setFeedback({
        type: 'error',
        message: errorMsg
      });

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`consultation-form-wrapper ${className}`} style={{ width: '100%' }}>
      <form 
        onSubmit={handleSubmit}
        className="contact-form"
        id="book-consultation-form"
        style={{ width: '100%' }}
      >
        {/* SUCCESS FEEDBACK BANNER */}
        {feedback.type === 'success' && (
          <div 
            className="form-feedback feedback-success" 
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ERROR FEEDBACK BANNER */}
        {feedback.type === 'error' && (
          <div 
            className="form-feedback feedback-error" 
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ROW 1: Full Name & Phone Number */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="consult-fullname" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} style={{ color: 'var(--primary)' }} />
              <span>Full Name</span>
            </label>
            <input 
              type="text" 
              id="consult-fullname" 
              name="fullName"
              placeholder="e.g. Rajesh Kumar" 
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="consult-phonenumber" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} style={{ color: 'var(--primary)' }} />
              <span>Phone Number</span>
            </label>
            <input 
              type="tel" 
              id="consult-phonenumber" 
              name="phoneNumber"
              placeholder="e.g. +91 98765 43210" 
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
              required 
            />
          </div>
        </div>

        {/* ROW 2: Email ID */}
        <div className="form-group">
          <label htmlFor="consult-emailid" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} style={{ color: 'var(--primary)' }} />
            <span>Email ID</span>
          </label>
          <input 
            type="email" 
            id="consult-emailid" 
            name="emailId"
            placeholder="e.g. rajesh@example.com" 
            value={formData.emailId}
            onChange={handleChange}
            disabled={loading}
            required 
          />
        </div>

        {/* ROW 3: Required Service (Dropdown) */}
        <div className="form-group">
          <label htmlFor="consult-service" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={14} style={{ color: 'var(--primary)' }} />
            <span>Required Service</span>
          </label>
          <select 
            id="consult-service" 
            name="requiredService"
            value={formData.requiredService}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="" disabled>Select Required Service...</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Taxation Compliance & Consultancy">Taxation Compliance &amp; Consultancy</option>
            <option value="CFO Services">CFO Services</option>
            <option value="Accounts & Bookkeeping">Accounts &amp; Bookkeeping</option>
          </select>
        </div>

        {/* ROW 4: Description (Textarea) */}
        <div className="form-group">
          <label htmlFor="consult-description" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} style={{ color: 'var(--primary)' }} />
            <span>Description</span>
          </label>
          <textarea 
            id="consult-description" 
            name="description"
            rows={4}
            placeholder="Describe your tax, compliance, or financial requirements..."
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            required
          ></textarea>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="submit-btn" 
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1
          }} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Book Consultation</span>
              <CalendarClock size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
