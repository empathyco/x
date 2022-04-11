import { AnyFunction } from '@empathyco/x-utils';

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
 * The `fetchMock()` method mocks a the `fetch` API.
 *
 * @param response - The expected response resolved by calling `fetch()`.
 * @returns A Promise object.
 *
 * @internal
 */
export function fetchMock(response: any): any {
  return (_url: string, { signal }: any) => {
    return new Promise((resolve: AnyFunction, reject: AnyFunction) => {
      setTimeout(() => {
        if (signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          resolve({ ok: true, json: () => Promise.resolve(response) });
        }
      });
    });
  };
}
