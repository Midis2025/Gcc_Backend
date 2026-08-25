import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors';
import { ApiResponse } from '@/utils/api-response';

export function handleControllerError(error: unknown): NextResponse {
  console.error('[API Controller Error]:', error);

  if (error instanceof AppError) {
    return ApiResponse.error(error.message, error.statusCode, error.errors);
  }

  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    error.errors.forEach((err) => {
      const field = err.path.join('.') || 'body';
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(err.message);
    });

    return ApiResponse.error('Validation failed', 400, formattedErrors);
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return ApiResponse.error(message, 500);
}

/**
 * Async wrapper to wrap controller handlers with automatic error handling
 */
export function asyncHandler<T>(handler: () => Promise<NextResponse<T>>): Promise<NextResponse<T>> | NextResponse {
  return handler().catch((error) => handleControllerError(error)) as Promise<NextResponse<T>>;
}
