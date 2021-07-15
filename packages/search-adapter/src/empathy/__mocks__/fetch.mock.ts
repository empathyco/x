export const okFetchMock = jest.fn(getFetchMock({}));

export const koFetchMock = jest.fn(() => Promise.resolve({
  ok: false,
  json: () => Promise.resolve({}),
  status: 500,
  statusText: 'No pitufa'
}));

export function getFetchMock(response: any): any {
  return (_url: string, { signal }: any) => {
    return new Promise((resolve: any, reject: any) => {
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
