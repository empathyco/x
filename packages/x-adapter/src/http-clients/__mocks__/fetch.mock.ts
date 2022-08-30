export const okFetchMock = jest.fn(fetchMock({}));

export const koFetchMock = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({}),
    status: 500,
    statusText: 'Unexpected error'
  })
);
/**
 * The `fetchMock()` method mocks a `fetch` API call.
 *
 * @param response - The expected response resolved by calling `fetch()`.
 * @returns A Promise object.
 *
 * @internal
 */
export function fetchMock(
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
