# Gulf Connect — e-mail templates

The two PDFs in this folder are the approved artboards. Everything else here was
extracted from them.

```
email_template/
├─ GCC Mail Template Company Registration — Confirmation Email.pdf   (source)
├─ GCC Mail Template Investor Registration — Admin.pdf               (source)
├─ email.css                                  shared design system
├─ company-registration-confirmation.html     preview of PDF 1
├─ investor-registration-admin.html           preview of PDF 2
└─ assets/gcc-logo.png                        logo lifted from the PDFs
```

The `.html` files here are **previews**: readable, class-based markup driven by
`email.css`. They are handy for reviewing the design in a browser and for
diffing against the PDFs.

The **production** templates live in `src/templates/email-templates.ts` with
every rule inlined on the element, because Outlook, Gmail web and Yahoo strip
`<style>` blocks and external stylesheets. Change the design in both places, or
change `email-templates.ts` and re-sync `email.css` after.

## Design tokens (sampled from the PDFs)

| Token | Value | Used for |
| --- | --- | --- |
| Gold | `#b8945f` | headings, CTA fill, divider, links |
| Page | `#080d13` | outer background, footer |
| Surface | `#0a0f16` | message card |
| Label cell | `#0a1119` | detail-row label column |
| Value cell | `#0b121a` | detail-row value column |
| Ink | `#ffffff` | all body copy |
| Rule | `rgba(255,255,255,0.22)` | detail-row borders |

Type: 29px heading / 18px body / 17px table cells / 12px footer legal /
14px copyright, in `'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif`.
The 640px container is the PDF's 680pt artboard scaled by 0.94.

## Previewing the real templates

With the dev server running:

```
/api/test-email?template=company          client confirmation  (PDF 1)
/api/test-email?template=investor-admin   admin alert          (PDF 2)
/api/test-email?template=investor         investor confirmation
/api/test-email?template=company-admin    admin alert (company)
```

## Logo

Mail clients cannot resolve relative image paths, so the logo needs an absolute
URL. The bitmap is served from `public/email/gcc-logo.png`; point one of these
at the deployed origin:

```
EMAIL_ASSET_BASE_URL=https://www.gulfconnectconsultancy.com
# or, to use a CDN copy outright:
EMAIL_LOGO_URL=https://cdn.example.com/gcc-logo.png
```

`NEXT_PUBLIC_APP_URL` is used as a fallback. If none is set the templates
degrade to a live-text wordmark in the same gold/white lock-up, so the header
never renders as a broken image.

## Notes on fidelity

- The company artboard has a faint wireframe-globe illustration behind the
  hero. It is vector art inside the PDF and cannot be lifted cleanly, and
  background images are unreliable in email anyway (Outlook drops them). The
  ambient glow behind it is reproduced with a CSS radial gradient instead.
- Line leading in the PDFs is roughly 1.0. That is safe in a fixed PDF but
  clips in mail clients that substitute a font with a taller x-height, so body
  copy uses 1.35 here.
- The investor artboard ends at the gold divider with no footer. The templates
  add the compact Gulf Connect lock-up and copyright so the internal alert is a
  complete message.
- `Job Title`, `Location`, `Investor Type` and `Investment Interests` are not
  captured by `createInvestorSchema` today. `generateInvestorAdminEmail` falls
  back to `market`, `area` and `message`, and prints an em dash for anything
  genuinely missing. Add the fields to the investor form and schema to fill the
  table out completely.
