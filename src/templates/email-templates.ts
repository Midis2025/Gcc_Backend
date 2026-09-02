const marketMap: Record<string, string> = {
  ae: 'United Arab Emirates (UAE)',
  sa: 'Saudi Arabia (KSA)',
  qa: 'Qatar',
  kw: 'Kuwait',
  bh: 'Bahrain',
  om: 'Oman',
  intl: 'International',
};

function getMarketLabel(market?: string): string {
  if (!market) return 'N/A';
  const key = market.toLowerCase();
  return marketMap[key] || market;
}

const LOGO_HEADER_HTML = `
  <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
    <tr>
      <td style="vertical-align: middle; padding-right: 12px;">
        <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#c8a670" stroke-width="6" fill="#0b131e"/>
          <path d="M68 32 C60 22, 38 22, 30 32 C20 44, 20 56, 30 68 C38 78, 60 78, 68 68 C74 60, 74 52, 68 46 L50 46 L50 54 L64 54 C65 58, 62 64, 56 68 C48 72, 36 72, 32 64 C28 56, 28 44, 32 36 C36 28, 48 28, 56 32 C60 35, 63 40, 64 42" stroke="#c8a670" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </td>
      <td style="vertical-align: middle;">
        <div style="color: #c8a670; font-size: 19px; font-weight: 700; letter-spacing: 2.5px; line-height: 1.1; font-family: 'Helvetica Neue', Arial, sans-serif;">GULF CONNECT</div>
        <div style="color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 3.5px; line-height: 1.1; font-family: 'Helvetica Neue', Arial, sans-serif; margin-top: 2px;">CONSULTANCY</div>
      </td>
    </tr>
  </table>
`;

const FOOTER_HTML = `
  <div style="height: 1px; background: linear-gradient(90deg, #c8a670 0%, rgba(200, 166, 112, 0.15) 100%); margin: 32px 0 24px 0;"></div>
  
  <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
    <tr>
      <td style="vertical-align: middle; padding-right: 10px;">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#c8a670" stroke-width="6" fill="#0b131e"/>
          <path d="M68 32 C60 22, 38 22, 30 32 C20 44, 20 56, 30 68 C38 78, 60 78, 68 68 C74 60, 74 52, 68 46 L50 46 L50 54 L64 54 C65 58, 62 64, 56 68 C48 72, 36 72, 32 64 C28 56, 28 44, 32 36 C36 28, 48 28, 56 32 C60 35, 63 40, 64 42" stroke="#c8a670" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </td>
      <td style="vertical-align: middle;">
        <div style="color: #c8a670; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; line-height: 1.1;">GULF CONNECT</div>
        <div style="color: #ffffff; font-size: 10px; font-weight: 600; letter-spacing: 2px; line-height: 1.1; margin-top: 1px;">CONSULTANCY</div>
      </td>
    </tr>
  </table>

  <p style="font-size: 12px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.4;">
    Investor communications, events and media services for Gulf capital markets.
  </p>

  <p style="font-size: 11px; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
    Gulf Connect provides investor communications, events and media services for fixed professional fees. Nothing on this site is an offer, solicitation, recommendation or investment advice, and it should not be relied upon in making any investment decision. Gulf Connect is not licensed to conduct financial services activity in the UAE and does not solicit investment or hold client funds. Where content relates to a company that has engaged Gulf Connect, the commercial relationship is disclosed on that content.
  </p>

  <p style="font-size: 12px; color: #94a3b8; font-weight: 600; margin: 0;">
    © 2026 Gulf Connect. All rights reserved.
  </p>
`;

export interface EmailData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  market?: string;
  area?: string;
  message?: string;
  jobTitle?: string;
  investorType?: string;
  preferredDate?: string;
  preferredTime?: string;
  enquiryId?: string;
}

/**
 * PDF Template 1: GCC Mail Template Investor Registration — Admin
 */
export function generateInvestorAdminEmail(data: EmailData): string {
  const location = getMarketLabel(data.market);
  const investorType = data.investorType || 'Institutional / High-Net-Worth Investor';
  const interests = data.area || data.message || 'Investor Relations & Capital Access';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Investor Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080d14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080d14; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: linear-gradient(180deg, #0d1826 0%, #09101a 100%); border: 1px solid #1a2838; border-radius: 8px; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Logo Header -->
          <tr>
            <td>
              ${LOGO_HEADER_HTML}
            </td>
          </tr>

          <!-- Main Title -->
          <tr>
            <td>
              <h1 style="color: #c8a670; font-size: 26px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.01em;">
                New Investor Registration
              </h1>
              <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                A new investor registration has been submitted through the Gulf Connect website.
              </p>
            </td>
          </tr>

          <!-- Section Subtitle -->
          <tr>
            <td>
              <h2 style="color: #c8a670; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">
                Investor Details
              </h2>
            </td>
          </tr>

          <!-- Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #1e2f42; border-radius: 6px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Name:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.name}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Email:</td>
                  <td style="background-color: #0b1420; color: #c8a670; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;"><a href="mailto:${data.email}" style="color: #c8a670; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Phone:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Company/Fund:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.company}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Job Title:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.jobTitle || 'Executive / Principal'}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Location:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${location}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Investor Type:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${investorType}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px;">Investment Interests:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px;">${interests}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Follow Up Note -->
          <tr>
            <td>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Please review the registration and follow up where appropriate.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              ${FOOTER_HTML}
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
 * PDF Template 2: GCC Mail Template Company Registration — Confirmation Email
 */
export function generateCompanyConfirmationEmail(data: EmailData, calendlyLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Gulf Connect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080d14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080d14; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: linear-gradient(180deg, #0d1826 0%, #09101a 100%); border: 1px solid #1a2838; border-radius: 8px; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Logo Header -->
          <tr>
            <td>
              ${LOGO_HEADER_HTML}
            </td>
          </tr>

          <!-- Main Headline -->
          <tr>
            <td>
              <h1 style="color: #c8a670; font-size: 26px; font-weight: 700; margin: 0 0 20px 0; letter-spacing: -0.01em;">
                Thank You for Contacting Gulf Connect
              </h1>
              
              <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
                Hi ${data.name},
              </p>

              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                Thank you for registering your company with <strong style="color: #ffffff;">Gulf Connect Consultancy</strong>.
              </p>

              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                We have received your details and our team will review your requirements to understand where Gulf Connect may be able to support your investor engagement, regional positioning and communications objectives.
              </p>

              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                To discuss your requirements directly with our team, schedule a meeting at a convenient time.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="left" style="padding-bottom: 28px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 4px; background-color: #c8a670;">
                    <a href="${calendlyLink}" target="_blank" style="font-size: 15px; font-weight: 700; font-family: inherit; color: #080d14; text-decoration: none; padding: 14px 28px; border-radius: 4px; border: 1px solid #c8a670; display: inline-block; letter-spacing: 0.01em;">
                      📅 Schedule a Meeting
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                We look forward to learning more about your company.
              </p>

              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 4px 0;">
                Kind regards,
              </p>
              <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0 0 2px 0;">
                Gulf Connect Team
              </p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px 0;">
                Dubai, UAE
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              ${FOOTER_HTML}
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
 * Company Admin Email Notification
 */
export function generateCompanyAdminEmail(data: EmailData): string {
  const location = getMarketLabel(data.market);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Company Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080d14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080d14; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: linear-gradient(180deg, #0d1826 0%, #09101a 100%); border: 1px solid #1a2838; border-radius: 8px; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Logo Header -->
          <tr>
            <td>
              ${LOGO_HEADER_HTML}
            </td>
          </tr>

          <!-- Main Title -->
          <tr>
            <td>
              <h1 style="color: #c8a670; font-size: 26px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: -0.01em;">
                🔔 New Company Registration
              </h1>
              <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                A new company consultation enquiry has been submitted through the Gulf Connect website.
              </p>
            </td>
          </tr>

          <!-- Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #1e2f42; border-radius: 6px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Contact Name:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.name}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Company:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.company}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Work Email:</td>
                  <td style="background-color: #0b1420; color: #c8a670; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;"><a href="mailto:${data.email}" style="color: #c8a670; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Phone:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Target Market:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${location}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">Area of Interest:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #1e2f42;">${data.area || 'General Engagement'}</td>
                </tr>
                <tr>
                  <td style="background-color: #121e2c; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px;">Message Outline:</td>
                  <td style="background-color: #0b1420; color: #cbd5e1; font-size: 14px; padding: 12px 16px;">${data.message || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Follow Up Note -->
          <tr>
            <td>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                The client has been sent the Calendly scheduling link to confirm their consultation slot.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              ${FOOTER_HTML}
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
