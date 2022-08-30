/**
 * Provides a mock for the window.fetch API.
 *
 * @param response - The value to return.
 * @returns A Promise that will resolve to the response given.
 */
export function getFetchMock(
  response: unknown
): (url: string, params: RequestInit) => Promise<Response> {
  return (_url, { signal }) => {
    return new Promise<Response>((resolve, reject) => {
      setTimeout(() => {
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response))
          } as Response);
        }
      });
    });
  };
}
