export class RequestError extends Error {
  constructor(
    public readonly message: string,
    public readonly response: Response
  ) {
    super(message);
  }
}
