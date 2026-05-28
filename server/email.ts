import { ENV } from "./_core/env";

const RESEND_API_URL = "https://api.resend.com/emails";
const OWNER_EMAIL = "melissacuartas1113@gmail.com";

export interface SendLeadEmailParams {
  name: string;
  email: string;
  whatsapp?: string;
  country?: string;
  source: string;
}

/**
 * Send an email notification when a new lead is captured
 */
export async function sendLeadNotificationEmail(lead: SendLeadEmailParams) {
  if (!ENV.resendApiKey) {
    console.warn("[Email] Resend API key not configured");
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.resendApiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@melissa-cuartas.com",
        to: OWNER_EMAIL,
        subject: `Nuevo Lead: ${lead.name}`,
        html: generateLeadEmailHTML(lead),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Email] Failed to send lead email:", error);
      return false;
    }

    console.log("[Email] Lead notification sent successfully");
    return true;
  } catch (error) {
    console.error("[Email] Error sending lead email:", error);
    return false;
  }
}

/**
 * Generate HTML email template for lead notification
 */
function generateLeadEmailHTML(lead: SendLeadEmailParams): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; margin-top: 5px; }
          .footer { font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nuevo Lead Capturado</h2>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${escapeHtml(lead.name)}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></div>
            </div>
            
            ${lead.whatsapp ? `
            <div class="field">
              <div class="label">WhatsApp:</div>
              <div class="value">${escapeHtml(lead.whatsapp)}</div>
            </div>
            ` : ""}
            
            ${lead.country ? `
            <div class="field">
              <div class="label">País:</div>
              <div class="value">${escapeHtml(lead.country)}</div>
            </div>
            ` : ""}
            
            <div class="field">
              <div class="label">Origen:</div>
              <div class="value">${escapeHtml(lead.source)}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Este email fue generado automáticamente por tu sistema de captura de leads.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
