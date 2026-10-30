import { NextResponse } from 'next/server';
import { saveOtp } from '../../../../lib/otpStore';
import { sendOtpEmail } from '../../../../lib/emailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate and store OTP (with rate limiting / cooldown)
    let otpRecord;
    try {
      otpRecord = saveOtp(normalizedEmail);
    } catch (storeErr) {
      if (storeErr.code === 'COOLDOWN_ACTIVE') {
        return NextResponse.json(
          { 
            success: false, 
            message: storeErr.message, 
            cooldownRemaining: storeErr.cooldownRemaining 
          },
          { status: 429 }
        );
      }
      throw storeErr;
    }

    // Send email via SMTP or simulated fallback
    const emailResult = await sendOtpEmail(normalizedEmail, otpRecord.code);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      expiresAt: otpRecord.expiresAt,
      simulated: emailResult.simulated,
      // Provide devOtp if SMTP is unconfigured or in development mode so user is never blocked
      ...(emailResult.simulated ? { devOtp: otpRecord.code } : {})
    });
  } catch (err) {
    console.error('Error in /api/auth/send-otp:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to dispatch verification email. Please try again.' },
      { status: 500 }
    );
  }
}
