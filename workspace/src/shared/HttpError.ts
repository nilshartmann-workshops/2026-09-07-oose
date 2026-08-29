export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`Request failed with HTTP ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
  }
}
