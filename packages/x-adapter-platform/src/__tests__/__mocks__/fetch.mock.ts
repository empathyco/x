/**
 * Provides a mock for the window.fetch API.
 *
 * @param response - The value to return.
 * @returns A Promise that will resolve to the response given.
 */
export function getFetchMock(
  response: unknown,
): (url: string, params: RequestInit) => Promise<Response> {
  return async (_url, { signal }) => {
    return new Promise<Response>((resolve, reject) => {
      setTimeout(() => {
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'))
        } else {
          resolve({
            ok: true,
            status: 200,
            json: async () => Promise.resolve(response),
            text: async () => Promise.resolve(JSON.stringify(response)),
          } as Response)
        }
      })
    })
  }
}
