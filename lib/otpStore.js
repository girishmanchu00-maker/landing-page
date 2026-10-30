/**
 * Fin2ools Secure OTP Store
 * Manages in-memory storage, expiration, and rate-limiting for 6-digit Email OTPs.
 * Uses globalThis to preserve state across Next.js dev server reloads.
 */

if (!globalThis.__fin2ools_otp_store) {
  globalThis.__fin2ools_otp_store = new Map();
}

const otpStore = globalThis.__fin2ools_otp_store;

// Configuration
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000;  // 30 seconds cooldown between requests
const MAX_VERIFY_ATTEMPTS = 5;         // Max wrong attempts before invalidation

/**
 * Generate a cryptographically random 6-digit numeric OTP
 */
export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store a new OTP for an email address with rate limiting
 * @param {string} email 
 * @returns {{ code: string, expiresAt: number, cooldownRemaining: number }}
 */
export function saveOtp(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const existing = otpStore.get(normalizedEmail);

  // Check resend cooldown
  if (existing && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const cooldownRemaining = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    const error = new Error(`Please wait ${cooldownRemaining}s before requesting a new code.`);
    error.code = 'COOLDOWN_ACTIVE';
    error.cooldownRemaining = cooldownRemaining;
    throw error;
  }

  const code = generateOtpCode();
  const record = {
    code,
    email: normalizedEmail,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0
  };

  otpStore.set(normalizedEmail, record);

  return {
    code,
    expiresAt: record.expiresAt,
    cooldownRemaining: 0
  };
}

/**
 * Verify an entered OTP code against stored record
 * @param {string} email 
 * @param {string} inputCode 
 * @returns {{ valid: boolean, message: string }}
 */
export function verifyOtp(email, inputCode) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const cleanInput = (inputCode || '').toString().trim().replace(/\D/g, '');

  if (!cleanInput || cleanInput.length !== 6) {
    return { valid: false, message: 'Please enter a valid 6-digit verification code.' };
  }

  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return { valid: false, message: 'No active OTP found for this email. Please request a new code.' };
  }

  // Check expiration
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, message: 'This verification code has expired. Please request a fresh OTP.' };
  }

  // Check maximum attempts
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new code for security.' };
  }

  // Verify code
  if (record.code === cleanInput) {
    // Validated! Clear OTP from store
    otpStore.delete(normalizedEmail);
    return { valid: true, message: 'Verification successful.' };
  }

  // Increment failed attempts
  record.attempts += 1;
  const remainingAttempts = MAX_VERIFY_ATTEMPTS - record.attempts;
  return { 
    valid: false, 
    message: `Invalid code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.` 
  };
}
