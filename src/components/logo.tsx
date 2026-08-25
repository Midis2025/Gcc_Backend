import React from 'react';

const MARK_BRONZE_OUTER =
  'M72.75,26.16h-5.53c-.66-1.82-1.48-3.56-2.45-5.21-5.54-9.41-15.83-15.75-27.59-15.75-17.6,0-31.92,14.21-31.92,31.68,0,14.14,9.38,26.14,22.3,30.2,1.69.53,3.45.93,5.25,1.18v5.25c-1.79-.21-3.54-.54-5.25-1C11.68,68.3,0,53.94,0,36.88,0,16.51,16.64,0,37.17,0c14.78,0,27.55,8.56,33.54,20.96.81,1.67,1.49,3.41,2.04,5.21Z';

const MARK_BRONZE_INNER =
  'M72.75,36.98v.19c0,1.68-.11,3.33-.33,4.94-2.15,15.82-14.48,28.41-30.17,30.96-1.67.27-3.39.43-5.13.46v-5.13c1.75-.04,3.47-.23,5.13-.55,12.83-2.45,22.91-12.78,24.98-25.74h-5.21c-1.95,10.13-9.77,18.19-19.77,20.5-1.66.38-3.37.61-5.13.65v-26.29h5.13v20.32c7.16-2.09,12.74-7.9,14.51-15.19h-9.79v-5.13h25.78Z';

const MARK_FOREGROUND =
  'M61.56,26.16h-5.89c-1.15-1.96-2.61-3.71-4.31-5.21-3.78-3.32-8.75-5.34-14.19-5.34-11.82,0-21.43,9.54-21.43,21.27,0,8.29,4.81,15.49,11.8,18.99,1.64.82,3.4,1.44,5.25,1.82v5.3c-1.82-.3-3.57-.78-5.25-1.42-9.97-3.84-17.05-13.46-17.05-24.69,0-14.6,11.97-26.47,26.68-26.47,8.69,0,16.43,4.15,21.3,10.55,1.22,1.6,2.26,3.35,3.09,5.21Z';

const WORDMARK_FONT = "var(--font-sans), 'Plus Jakarta Sans', system-ui, sans-serif";

function Mark() {
  return (
    <>
      <g fill="var(--color-accent)">
        <path d={MARK_BRONZE_OUTER} />
        <path d={MARK_BRONZE_INNER} />
      </g>
      <path fill="currentColor" d={MARK_FOREGROUND} />
    </>
  );
}

export interface LogoProps {
  /** `full` renders the complete lockup, `mark` renders the monogram alone. */
  variant?: 'full' | 'mark';
  /** Rendered height, any CSS length. */
  height?: string;
  className?: string;
}

/**
 * Gulf Connect Consultancy logo, matching the public site lockup.
 * Bronze strokes follow `--color-accent`; the rest inherits `currentColor`.
 */
export function Logo({ variant = 'full', height = '2rem', className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 72.75 73.53"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Gulf Connect Consultancy"
        className={className}
        style={{ display: 'block', height, width: 'auto' }}
      >
        <Mark />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 289.19 73.53"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gulf Connect Consultancy"
      className={className}
      style={{ display: 'block', height, width: 'auto' }}
    >
      <Mark />
      <g fontFamily={WORDMARK_FONT} fontSize="26.07" fontWeight="700">
        <text fill="var(--color-accent)" transform="translate(83.85 32.28)">
          <tspan x="0" y="0">
            GULF CONNECT
          </tspan>
        </text>
        <text fill="currentColor" transform="translate(83.85 61.14)">
          <tspan x="0" y="0">
            CONSU
          </tspan>
          <tspan x="97.95" y="0" letterSpacing="-.06em">
            L
          </tspan>
          <tspan x="110.54" y="0" letterSpacing="-.05em">
            T
          </tspan>
          <tspan x="123.36" y="0" letterSpacing="0em">
            AN
          </tspan>
          <tspan x="161.24" y="0" letterSpacing="-.01em">
            C
          </tspan>
          <tspan x="181.15" y="0" letterSpacing="0em">
            Y
          </tspan>
        </text>
      </g>
    </svg>
  );
}
