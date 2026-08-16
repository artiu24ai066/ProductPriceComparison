import nodemailer from "nodemailer";

// ─── Transporter (created once, reused) ───────────────────────────────────
const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false,       // STARTTLS on port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── Helpers ───────────────────────────────────────────────────────────────

const APP_NAME   = "PriceWise";
const BRAND_COLOR = "#4F8DFF";
const DARK_BG     = "#0F1521";
const CARD_BG     = "#151B25";

/**
 * Sends a password-reset email.
 *
 * @param {string} toEmail       - recipient email address
 * @param {string} toName        - recipient full name
 * @param {string} resetUrl      - full reset link (frontend URL + token)
 * @param {number} expiryMinutes - how many minutes the link is valid
 */
export const sendPasswordResetEmail = async (
    toEmail,
    toName,
    resetUrl,
    expiryMinutes = 60
) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password – ${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:${DARK_BG};font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK_BG};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:${CARD_BG};border-radius:24px;overflow:hidden;
                      border:1px solid rgba(255,255,255,.08);max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2540,#0f1e38);
                       padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:28px;font-weight:700;
                         letter-spacing:-0.5px;">
                Price<span style="color:${BRAND_COLOR};">Wise</span>
              </h1>
              <p style="margin:8px 0 0;color:#8B96A8;font-size:13px;">
                Smart Shopping, Smarter Prices
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin:0 0 12px;color:white;font-size:22px;font-weight:600;">
                Reset Your Password
              </h2>

              <p style="margin:0 0 20px;color:#A7B0BF;font-size:15px;line-height:1.6;">
                Hi ${toName || "there"},
              </p>

              <p style="margin:0 0 28px;color:#A7B0BF;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your ${APP_NAME} account.
                Click the button below to set a new password. This link will expire in
                <strong style="color:white;">${expiryMinutes} minutes</strong>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 32px;">
                    <a href="${resetUrl}"
                       style="display:inline-block;background:${BRAND_COLOR};
                              color:white;text-decoration:none;font-weight:600;
                              font-size:16px;padding:16px 40px;border-radius:14px;
                              letter-spacing:0.2px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;color:#8B96A8;font-size:13px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 32px;word-break:break-all;">
                <a href="${resetUrl}" style="color:${BRAND_COLOR};font-size:13px;">
                  ${resetUrl}
                </a>
              </p>

              <!-- Security notice -->
              <div style="background:rgba(255,193,7,.07);border:1px solid rgba(255,193,7,.2);
                          border-radius:14px;padding:18px 20px;">
                <p style="margin:0;color:#FFC107;font-size:13px;line-height:1.6;">
                  ⚠️ If you did not request a password reset, please ignore this email.
                  Your account is safe and your password has not been changed.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 36px;border-top:1px solid rgba(255,255,255,.06);">
              <p style="margin:0;color:#525E6E;font-size:12px;text-align:center;
                         line-height:1.6;">
                This email was sent by ${APP_NAME}. Please do not reply to this email.<br/>
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

    await transporter.sendMail({
        from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
        to:   toEmail,
        subject: `Reset your ${APP_NAME} password`,
        html,
    });
};
