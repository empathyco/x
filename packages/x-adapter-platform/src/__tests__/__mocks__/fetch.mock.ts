/**
 * Provides a mock for the window.fetch API.
 *
 * @param response - The value to return.
 * @returns A Promise that will resolve to the response given.
 */
export function getFetchMock(response: any): any {
  return (_url: string, { signal }: any) => {
    return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        if (signal?.aborted) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          resolve({ ok: true, json: () => Promise.resolve(response) });
        }
      });
    });
  };
}
