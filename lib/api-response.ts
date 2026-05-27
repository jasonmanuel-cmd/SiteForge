/**
 * Standardized API response shape for all routes.
 * Ensures consistent error handling and data serialization across the app.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Wrap successful API response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wrap error API response
 */
export function errorResponse(
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ApiResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Convert Error to standardized response
 */
export function handleApiError(error: unknown): ApiResponse {
  if (error instanceof Error) {
    return errorResponse(error.message, 'INTERNAL_ERROR', {
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }

  return errorResponse('Unknown error occurred', 'UNKNOWN_ERROR');
}
