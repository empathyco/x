/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export class RequestError extends Error {
  constructor(
    public readonly message: string,
    public readonly response: Response
  ) {
    super(message);
  }
}
