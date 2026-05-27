/**
 * Centralized error handler for API routes and server actions.
 * Handles validation errors, database errors, API errors, and auth errors.
 */

import { ZodError } from 'zod';
import { errorResponse } from './api-response';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, code, 401);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

function handleZodError(error: ZodError) {
  const fieldErrors = error.issues.reduce(
    (acc, err) => {
      const path = err.path.join('.');
      acc[path] = err.message;
      return acc;
    },
    {} as Record<string, string>
  );

  return new ValidationError('Validation failed', fieldErrors);
}

/**
 * Parse and return standardized error response
 */
export function formatErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const formatted = handleZodError(error);
    return {
      response: errorResponse(formatted.message, formatted.code, formatted.details),
      statusCode: formatted.statusCode,
    };
  }

  if (error instanceof AppError) {
    return {
      response: errorResponse(error.message, error.code, error.details),
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      response: errorResponse(
        error.message,
        'INTERNAL_ERROR',
        process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
      ),
      statusCode: 500,
    };
  }

  return {
    response: errorResponse('Unknown error occurred', 'UNKNOWN_ERROR'),
    statusCode: 500,
  };
}
