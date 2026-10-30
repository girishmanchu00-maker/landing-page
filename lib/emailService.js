import nodemailer from 'nodemailer';

/**
 * Creates and caches the nodemailer transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Check for Gmail App Password shorthand
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
  }

  return null;
}

/**
 * Generate a luxury, high-conversion statutory email template
 */
function buildOtpEmailHtml(otpCode) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Fin2ools Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1329; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1329; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background: #131d36; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                Fin<span style="color: #60a5fa;">2ools</span>
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-top: 4px; font-weight: 600;">
                Chartered Accountant SaaS Portal
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #ffffff;">
                Statutory Access Verification
              </h2>
              <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Use the following 6-digit One-Time Password (OTP) to verify your email and unlock the Fin2ools portal.
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: rgba(15, 23, 42, 0.8); border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; margin: 0 auto 28px; max-width: 280px; text-align: center;">
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #60a5fa; font-family: 'Courier New', Courier, monospace; margin-left: 10px;">
                  ${otpCode}
                </div>
              </div>

              <p style="margin: 0 0 20px; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                ⏰ <strong>This code expires in 10 minutes.</strong><br/>
                For your security, never share this OTP with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background: #0c1427; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                If you did not request this verification code, you can safely ignore this email.<br/>
                &copy; ${new Date().getFullYear()} Fin2ools. Compliant with IT Act 2000 Statutory Security Norms.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Dispatch OTP email to recipient
 * @param {string} toEmail 
 * @param {string} otpCode 
 * @returns {Promise<{ success: boolean, simulated: boolean, messageId?: string, devOtp?: string }>}
 */
export async function sendOtpEmail(toEmail, otpCode) {
  const transporter = getTransporter();

  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@fin2ools.online';
      const info = await transporter.sendMail({
        from: `"Fin2ools Security" <${fromAddress}>`,
        to: toEmail,
        subject: `${otpCode} is your Fin2ools verification code`,
        text: `Your Fin2ools 6-digit verification code is: ${otpCode}. Valid for 10 minutes.`,
        html: buildOtpEmailHtml(otpCode)
      });
      console.log(`[Fin2ools] OTP email delivered to ${toEmail}. Message ID: ${info.messageId}`);
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (err) {
      console.error('[Fin2ools] SMTP sendMail failed:', err);
      // Fallback to simulated delivery in dev/testing mode
      return { 
        success: true, 
        simulated: true, 
        smtpError: err.message, 
        devOtp: otpCode 
      };
    }
  }

  // When SMTP is not configured yet (e.g. dev/local testing)
  console.log(`\n==========================================`);
  console.log(`🔐 [Fin2ools Email OTP Service]`);
  console.log(`Recipient: ${toEmail}`);
  console.log(`6-Digit OTP Code: ${otpCode}`);
  console.log(`Notice: Configure SMTP in .env.local for live inbox dispatch.`);
  console.log(`==========================================\n`);

  return { 
    success: true, 
    simulated: true, 
    devOtp: otpCode 
  };
}
