/**
 * Gulf Connect Consultancy — transactional e-mail templates.
 *
 * The markup here mirrors the two approved artboards:
 *   email_template/GCC Mail Template Company Registration — Confirmation Email.pdf
 *   email_template/GCC Mail Template Investor Registration — Admin.pdf
 *
 * Readable, class-based previews of the same design live next to those PDFs
 * (email_template/*.html + email_template/email.css). Everything below is the
 * inlined production equivalent — Outlook, Gmail web and Yahoo strip <style>
 * blocks, so each rule has to travel on the element itself.
 */

export interface EmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  market?: string;
  jobTitle?: string;
  location?: string;
  investorType?: string;
  investmentInterests?: string;
  area?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  enquiryId?: string;
}

/* -------------------------------------------------------------------------- */
/* Design tokens — sampled directly from the PDFs                             */
/* -------------------------------------------------------------------------- */

const GOLD = '#b8945f';
const GOLD_DIM = '#7a6340';
const PAGE = '#080d13';
const SURFACE = '#0a0f16';
const CELL_LABEL = '#0a1119';
const CELL_VALUE = '#0b121a';
const INK = '#ffffff';
const RULE = 'rgba(255,255,255,0.22)';
const RULE_SOFT = 'rgba(255,255,255,0.07)';

const FONT = "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif";

/** 640px container = the 680pt artboard scaled by 0.94. */
const WIDTH = 640;
const GUTTER = 30;

const TAGLINE = 'Investor communications, events and media services for Gulf capital markets.';

const LEGAL =
  'Gulf Connect provides investor communications, events and media services for fixed ' +
  'professional fees. Nothing on this site is an offer, solicitation, recommendation or ' +
  'investment advice, and it should not be relied upon in making any investment decision. ' +
  'Gulf Connect is not licensed to conduct financial services activity in the UAE and does not ' +
  'solicit investment or hold client funds. Where content relates to a company that has engaged ' +
  'Gulf Connect, the commercial relationship is disclosed on that content.';

const COPYRIGHT = `&copy; ${new Date().getFullYear()} Gulf Connect. All rights reserved.`;

const P = `margin:0 0 22px 0;color:${INK};font-family:${FONT};font-size:18px;font-weight:400;line-height:1.35;`;
const P_TIGHT = `margin:0 0 4px 0;color:${INK};font-family:${FONT};font-size:18px;font-weight:400;line-height:1.35;`;
const P_LAST = `margin:0;color:${INK};font-family:${FONT};font-size:18px;font-weight:400;line-height:1.35;`;
const H1 = `margin:0 0 28px 0;color:${GOLD};font-family:${FONT};font-size:29px;font-weight:700;line-height:1.2;letter-spacing:-0.2px;`;
const H2 = `margin:0 0 18px 0;color:${GOLD};font-family:${FONT};font-size:19px;font-weight:700;line-height:1.25;`;
const STRONG = `color:${INK};font-weight:700;`;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Escapes values that originate from a public form before they are dropped into
 * markup — without this a submitted `<script>` or broken tag lands in the
 * admin inbox and can rewrite the rest of the message.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escaped value, or an em dash when the field was not captured. */
function field(value: unknown): string {
  const text = String(value ?? '').trim();
  return text ? escapeHtml(text) : '&mdash;';
}

const MARKET_LABELS: Record<string, string> = {
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  qa: 'Qatar',
  kw: 'Kuwait',
  bh: 'Bahrain',
  om: 'Oman',
  intl: 'International',
};

/** Turns the stored market code into the readable label used in the artboards. */
export function marketLabel(market?: string): string {
  if (!market) return '';
  return MARKET_LABELS[market.toLowerCase()] || market;
}

/**
 * Mail clients block or flag plain-HTTP images. Anything that is not HTTPS is
 * dropped so the templates fall back to the live-text wordmark rather than
 * shipping a source the client will refuse.
 */
function httpsOnly(url: string): string {
  if (url.startsWith('https://')) return url;
  console.warn(`[email-templates] Ignoring non-HTTPS logo URL: ${url}`);
  return '';
}

/**
 * Permanently hosted HTTPS URL of the logo bitmap extracted from the PDFs.
 *
 * This app serves the file itself from public/email/gcc-logo.png, so
 * EMAIL_ASSET_BASE_URL just needs to name the deployed origin. EMAIL_LOGO_URL
 * overrides it outright if the asset ever moves to a CDN.
 *
 * The URL must be a plain remote one: Gmail, Outlook.com and Yahoo strip
 * `data:image/png;base64,...` sources, which is what produced the broken-image
 * icon in the header and footer, so the logo is never inlined. When no origin
 * is configured the templates fall back to the live-text wordmark — a guessed
 * URL that 404s would reproduce the very bug this avoids.
 */
export function getLogoUrl(): string {
  const explicit = process.env.EMAIL_LOGO_URL;
  if (explicit) return httpsOnly(explicit);

  const base = process.env.EMAIL_ASSET_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  if (base) {
    return httpsOnly(`${base.replace(/\/+$/, '')}/email/gcc-logo.png`);
  }

  return '';
}

function logoBlock(width: number): string {
  const url = getLogoUrl();
  if (url) {
    return `<img src="${escapeHtml(url)}" width="${width}" alt="Gulf Connect Consultancy" style="display:block;border:0;outline:none;width:${width}px;max-width:100%;height:auto;">`;
  }

  // Live-text lock-up: gold "GULF CONNECT" over white "CONSULTANCY".
  const scale = width / 180;
  const top = Math.round(19 * scale);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${FONT};line-height:1.15;">
              <span style="display:block;color:${GOLD};font-size:${top}px;font-weight:700;letter-spacing:2.6px;">GULF CONNECT</span>
              <span style="display:block;color:${INK};font-size:${top}px;font-weight:700;letter-spacing:1.6px;">CONSULTANCY</span>
            </td></tr></table>`;
}

function spacer(height: number): string {
  return `<div style="height:${height}px;font-size:0;line-height:${height}px;">&nbsp;</div>`;
}

function hairline(): string {
  return `<div style="height:1px;font-size:0;line-height:1px;background-color:${RULE_SOFT};">&nbsp;</div>`;
}

/** The gold rule that closes the content area on both artboards. */
function goldDivider(): string {
  return `<tr>
            <td style="padding:0 ${GUTTER}px;">
              <div style="height:1px;font-size:0;line-height:1px;background-color:${GOLD_DIM};background-image:linear-gradient(90deg,rgba(184,148,95,0) 0%,${GOLD} 26%,${GOLD} 58%,rgba(184,148,95,0.04) 100%);">&nbsp;</div>
            </td>
          </tr>`;
}

function header(): string {
  return `<tr>
            <td style="padding:20px ${GUTTER}px;border-bottom:1px solid ${RULE_SOFT};">
              ${logoBlock(180)}
            </td>
          </tr>`;
}

/**
 * @param full  the client-facing footer carries the tagline and the regulatory
 *              paragraph; the internal admin footer keeps just the lock-up.
 */
function footer(full: boolean): string {
  const legalBlock = full
    ? `${spacer(18)}${hairline()}${spacer(18)}
              <p style="margin:0;color:${INK};font-family:${FONT};font-size:12px;line-height:1.55;">${LEGAL}</p>`
    : '';

  return `<tr>
            <td style="padding:26px ${GUTTER}px 28px ${GUTTER}px;background-color:${PAGE};">
              ${logoBlock(150)}
              <p style="margin:16px 0 0 0;color:${INK};font-family:${FONT};font-size:12px;line-height:1.45;">${TAGLINE}</p>
              ${legalBlock}
              ${spacer(18)}${hairline()}${spacer(18)}
              <p style="margin:0;color:${INK};font-family:${FONT};font-size:14px;font-weight:700;line-height:1.4;">${COPYRIGHT}</p>
            </td>
          </tr>`;
}

/** Wraps body markup in the shared shell: page background, card, header, footer. */
function layout(options: { title: string; preheader: string; body: string; fullFooter: boolean }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE};color:${INK};font-family:${FONT};-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(options.preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAGE};border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:${WIDTH}px;max-width:100%;border-collapse:collapse;background-color:${SURFACE};background-image:radial-gradient(120% 78% at 78% 26%,#17212d 0%,#0c131b 46%,${PAGE} 100%);">
          ${header()}
          <tr>
            <td style="padding:38px ${GUTTER}px 34px ${GUTTER}px;">
              ${options.body}
            </td>
          </tr>
          ${goldDivider()}
          ${footer(options.fullFooter)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** One bordered label/value row from the investor artboard's detail block. */
function detailRow(label: string, valueHtml: string): string {
  return `<tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid ${RULE};">
                      <tr>
                        <td width="36%" style="width:36%;padding:12px 16px;background-color:${CELL_LABEL};border-right:1px solid ${RULE};color:${INK};font-family:${FONT};font-size:17px;font-weight:700;line-height:1.3;">${label}</td>
                        <td style="padding:12px 16px;background-color:${CELL_VALUE};color:${INK};font-family:${FONT};font-size:17px;font-weight:400;line-height:1.3;word-break:break-word;">${valueHtml}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`;
}

function detailTable(rows: Array<[string, string]>): string {
  const body = rows
    .map(([label, valueHtml]) => detailRow(label, valueHtml))
    .join(`<tr><td style="height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>`);

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:0 0 24px 0;">
                ${body}
              </table>`;
}

/** Square gold call-to-action button, matching the artboard. */
function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 32px 0;border-collapse:collapse;">
                <tr>
                  <td bgcolor="${GOLD}" style="background-color:${GOLD};">
                    <a href="${escapeHtml(href)}" target="_blank" rel="noopener" style="display:inline-block;padding:13px 22px;color:#090e14;font-family:${FONT};font-size:18px;font-weight:700;line-height:1;text-decoration:none;">${label}</a>
                  </td>
                </tr>
              </table>`;
}

/* -------------------------------------------------------------------------- */
/* Template 1 — Company Registration, confirmation to the client              */
/* -------------------------------------------------------------------------- */

export function generateCompanyConfirmationEmail(data: EmailData, meetingLink: string): string {
  const name = data.name?.trim() ? escapeHtml(data.name.trim()) : 'there';

  const body = `
              <h1 style="${H1}">Thank You for Contacting Gulf Connect</h1>

              <p style="${P}">Hi ${name},</p>

              <p style="${P}">Thank you for registering your company with <span style="${STRONG}">Gulf Connect Consultancy</span>.</p>

              <p style="${P}">We have received your details and our team will review your requirements to understand where Gulf Connect may be able to support your investor engagement, regional positioning and communications objectives.</p>

              <p style="${P}">To discuss your requirements directly with our team, schedule a meeting at a convenient time.</p>

              ${ctaButton(meetingLink, 'Schedule a Meeting')}

              <p style="${P}">We look forward to learning more about your company.</p>

              <p style="${P_TIGHT}">Kind regards,</p>
              <p style="${P_TIGHT}"><span style="${STRONG}">Gulf Connect Team</span></p>
              <p style="${P_LAST}">Dubai, UAE</p>`;

  return layout({
    title: 'Thank You for Contacting Gulf Connect',
    preheader: 'We have received your details and our team will review your requirements.',
    body,
    fullFooter: true,
  });
}

/** Same artboard, investor wording — used for the investor-side confirmation. */
export function generateInvestorConfirmationEmail(data: EmailData, meetingLink: string): string {
  const name = data.name?.trim() ? escapeHtml(data.name.trim()) : 'there';

  const body = `
              <h1 style="${H1}">Thank You for Contacting Gulf Connect</h1>

              <p style="${P}">Hi ${name},</p>

              <p style="${P}">Thank you for registering your interest with <span style="${STRONG}">Gulf Connect Consultancy</span>.</p>

              <p style="${P}">We have received your details and our team will review your investment interests to understand where Gulf Connect may be able to support your access to Gulf issuers, events and market intelligence.</p>

              <p style="${P}">To discuss your requirements directly with our team, schedule a meeting at a convenient time.</p>

              ${ctaButton(meetingLink, 'Schedule a Meeting')}

              <p style="${P}">We look forward to learning more about your mandate.</p>

              <p style="${P_TIGHT}">Kind regards,</p>
              <p style="${P_TIGHT}"><span style="${STRONG}">Gulf Connect Team</span></p>
              <p style="${P_LAST}">Dubai, UAE</p>`;

  return layout({
    title: 'Thank You for Contacting Gulf Connect',
    preheader: 'We have received your details and our team will review your interests.',
    body,
    fullFooter: true,
  });
}

/* -------------------------------------------------------------------------- */
/* Template 2 — Investor Registration, notification to the admin              */
/* -------------------------------------------------------------------------- */

export function generateInvestorAdminEmail(data: EmailData): string {
  const email = String(data.email ?? '').trim();
  const emailCell = email
    ? `<a href="mailto:${escapeHtml(email)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(email)}</a>`
    : '&mdash;';

  const rows: Array<[string, string]> = [
    ['Name:', field(data.name)],
    ['Email:', emailCell],
    ['Phone:', field(data.phone)],
    ['Company/Fund:', field(data.company)],
    ['Job Title:', field(data.jobTitle)],
    ['Location:', field(data.location || marketLabel(data.market))],
    ['Investor Type:', field(data.investorType || data.area)],
    ['Investment Interests:', field(data.investmentInterests || data.message)],
  ];

  const body = `
              <h1 style="${H1}">New Investor Registration</h1>

              <p style="${P}">A new investor registration has been submitted through the Gulf Connect website.</p>

              <h2 style="${H2}">Investor Details</h2>

              ${detailTable(rows)}

              <p style="${P_LAST}">Please review the registration and follow up where appropriate.</p>`;

  return layout({
    title: 'New Investor Registration',
    preheader: `New investor registration: ${String(data.name ?? '').trim() || 'Unknown'}`,
    body,
    fullFooter: false,
  });
}

/* -------------------------------------------------------------------------- */
/* Company Registration, notification to the admin                            */
/* -------------------------------------------------------------------------- */

export function generateCompanyAdminEmail(data: EmailData): string {
  const email = String(data.email ?? '').trim();
  const emailCell = email
    ? `<a href="mailto:${escapeHtml(email)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(email)}</a>`
    : '&mdash;';

  const rows: Array<[string, string]> = [
    ['Name:', field(data.name)],
    ['Email:', emailCell],
    ['Phone:', field(data.phone)],
    ['Company:', field(data.company)],
    ['Market:', field(data.location || marketLabel(data.market))],
    ['Area of Interest:', field(data.area)],
    ['Message / Details:', field(data.message)],
  ];

  const body = `
              <h1 style="${H1}">New Company Registration</h1>

              <p style="${P}">A new company registration has been submitted through the Gulf Connect website.</p>

              <h2 style="${H2}">Company Details</h2>

              ${detailTable(rows)}

              <p style="${P_LAST}">Please review the registration and follow up where appropriate.</p>`;

  return layout({
    title: 'New Company Registration',
    preheader: `New company registration: ${String(data.name ?? '').trim() || 'Unknown'}`,
    body,
    fullFooter: false,
  });
}

/* -------------------------------------------------------------------------- */
/* Plain-text alternatives                                                     */
/* -------------------------------------------------------------------------- */

const TEXT_FOOTER = `\n\nGULF CONNECT CONSULTANCY\n${TAGLINE}\n${COPYRIGHT.replace('&copy;', '(c)')}`;

export function generateConfirmationText(data: EmailData, meetingLink: string, investor = false): string {
  const name = data.name?.trim() || 'there';
  const what = investor ? 'your interest' : 'your company';
  const scope = investor
    ? 'your access to Gulf issuers, events and market intelligence'
    : 'your investor engagement, regional positioning and communications objectives';

  return `Thank You for Contacting Gulf Connect

Hi ${name},

Thank you for registering ${what} with Gulf Connect Consultancy.

We have received your details and our team will review your requirements to understand where Gulf Connect may be able to support ${scope}.

To discuss your requirements directly with our team, schedule a meeting at a convenient time:
${meetingLink}

Kind regards,
Gulf Connect Team
Dubai, UAE${TEXT_FOOTER}`;
}

export function generateAdminText(heading: string, rows: Array<[string, string]>): string {
  const lines = rows.map(([label, value]) => `${label} ${value || '-'}`).join('\n');
  return `${heading}\n\n${lines}\n\nPlease review the registration and follow up where appropriate.${TEXT_FOOTER}`;
}
