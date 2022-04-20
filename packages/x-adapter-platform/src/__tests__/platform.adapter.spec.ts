import { platformAdapter } from '../platform.adapter';

const mockedHttpClient = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
);
window.fetch = mockedHttpClient as any;

describe('platformAdapter tests', () => {
  it('Should search', async () => {
    await platformAdapter.search({
      query: 'chips',
      filter: [],
      lang: 'es',
      env: 'test'
    });
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledWith(
      'https://api.test.empathy.co/search/v1/query/empathy/search?query=chips&lang=es&env=test',
      { signal: expect.anything() }
    );
  });
});
