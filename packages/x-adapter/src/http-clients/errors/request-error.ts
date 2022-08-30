/**
 * The `RequestError` object is thrown when a runtime `request` error occurs.
 *
 * @public
 */
export class RequestError extends Error {
  /**
   * Creates a new `RequestError` object.
   *
   * @param message - The error message.
   * @param response - The response from the request that triggered the error.
   *
   * @public
   */
  public constructor(public readonly message: string, public readonly response: Response) {
    super(message);
  }
}
