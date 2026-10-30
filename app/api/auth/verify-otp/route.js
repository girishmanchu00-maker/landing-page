import { NextResponse } from 'next/server';
import { verifyOtp } from '../../../../lib/otpStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body || {};

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = verifyOtp(normalizedEmail, otp);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Build verified user session payload
    const user = {
      uid: `fin2ools_${Buffer.from(normalizedEmail).toString('base64').replace(/=/g, '')}`,
      email: normalizedEmail,
      emailVerified: true,
      role: 'verified_member',
      authenticatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified. Welcome to Fin2ools!',
      user
    });
  } catch (err) {
    console.error('Error in /api/auth/verify-otp:', err);
    return NextResponse.json(
      { success: false, message: 'Server error during OTP verification. Please retry.' },
      { status: 500 }
    );
  }
}
