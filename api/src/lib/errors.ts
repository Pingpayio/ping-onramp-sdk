import type { StatusCode } from "hono/utils/http-status";

type ContentfulStatusCode = Exclude<
  StatusCode,
  100 | 101 | 102 | 103 | 204 | 205 | 304
>;

export class ApiError extends Error {
  public readonly status: ContentfulStatusCode;
  public readonly details: any;

  constructor(message: string, status: ContentfulStatusCode, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProviderError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 502, details); // 502 Bad Gateway
  }
}

export class ServiceError extends ApiError {
  constructor(
    message: string,
    status: ContentfulStatusCode = 400,
    details?: any,
  ) {
    super(message, status, details);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
