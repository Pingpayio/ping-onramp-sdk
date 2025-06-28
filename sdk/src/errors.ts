export class PingpayOnrampError extends Error {
  public details?: any;
  public step?: string;

  constructor(message: string, details?: any, step?: string) {
    super(message);
    this.name = "PingpayOnrampError";
    this.details = details;
    this.step = step;

    // This line is to ensure the prototype chain is correctly set up for extending built-in classes like Error.
    Object.setPrototypeOf(this, PingpayOnrampError.prototype);
  }
}
