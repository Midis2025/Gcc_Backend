import { NextResponse } from 'next/server';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(data: T, message = 'Success', status = 200): NextResponse<ApiResponsePayload<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  }

  static created<T>(data: T, message = 'Resource created successfully'): NextResponse<ApiResponsePayload<T>> {
    return this.success(data, message, 201);
  }

  static error(
    message = 'An unexpected error occurred',
    status = 500,
    errors?: Record<string, string[]>
  ): NextResponse<ApiResponsePayload> {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  }
}
