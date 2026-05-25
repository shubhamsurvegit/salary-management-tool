type NestErrorBody = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export class ApiError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

function messageFromBody(body: NestErrorBody): string {
  if (Array.isArray(body.message)) {
    return body.message.join(', ');
  }
  if (typeof body.message === 'string' && body.message.length > 0) {
    return body.message;
  }
  if (body.error) {
    return body.error;
  }
  return 'Something went wrong. Please try again.';
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Check your input and try again.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This record conflicts with existing data.';
    default:
      return status >= 500
        ? 'Server error. Please try again later.'
        : 'Something went wrong. Please try again.';
  }
}

export async function normalizeApiError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => ({}))) as NestErrorBody;
  const message =
    body.message || body.error
      ? messageFromBody(body)
      : defaultMessageForStatus(response.status);

  return new ApiError(message, response.status);
}
