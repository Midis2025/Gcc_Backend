import { NextRequest } from 'next/server';
import { TooManyRequestsError } from '@/utils/errors';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private stores = new Map<string, RateLimitStore>();

  check(ip: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const storeKey = `${ip}`;
    const current = this.stores.get(storeKey);

    if (!current || now > current.resetTime) {
      const resetTime = now + windowMs;
      this.stores.set(storeKey, { count: 1, resetTime });
      return { allowed: true, remaining: limit - 1, resetTime };
    }

    if (current.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: current.resetTime };
    }

    current.count += 1;
    this.stores.set(storeKey, current);
    return { allowed: true, remaining: limit - current.count, resetTime: current.resetTime };
  }

  // Cleanup old records periodically to prevent memory leaks
  cleanup() {
    const now = Date.now();
    for (const [key, store] of this.stores.entries()) {
      if (now > store.resetTime) {
        this.stores.delete(key);
      }
    }
  }
}

const contactLimiter = new InMemoryRateLimiter();
const loginLimiter = new InMemoryRateLimiter();

// Run periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    contactLimiter.cleanup();
    loginLimiter.cleanup();
  }, 5 * 60 * 1000);
}

export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Rate limiting guard for public contact form: 300 submissions per IP per 10 minutes
 */
export function checkContactRateLimit(req: NextRequest) {
  const ip = getClientIp(req);
  const LIMIT = 300;
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

  const result = contactLimiter.check(ip, LIMIT, WINDOW_MS);

  if (!result.allowed) {
    const retrySeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
    throw new TooManyRequestsError(
      `Too many contact form submissions from this IP. Rate limit exceeded (300 per 10 mins). Please try again in ${retrySeconds} seconds.`
    );
  }

  return result;
}

/**
 * Rate limiting guard for admin login: 5 attempts per IP per 1 minute
 */
export function checkLoginRateLimit(req: NextRequest) {
  const ip = getClientIp(req);
  const LIMIT = 5;
  const WINDOW_MS = 1 * 60 * 1000; // 1 minute

  const result = loginLimiter.check(ip, LIMIT, WINDOW_MS);

  if (!result.allowed) {
    const retrySeconds = Math.ceil((result.resetTime - Date.now()) / 1000);
    throw new TooManyRequestsError(
      `Too many failed login attempts. Rate limit exceeded (5 attempts per minute). Please try again in ${retrySeconds} seconds.`
    );
  }

  return result;
}
