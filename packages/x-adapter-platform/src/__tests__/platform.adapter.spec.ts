import { DeepPartial } from '@empathyco/x-utils';
import { platformAdapter } from '../platform.adapter';
import { PlatformSearchResponse } from '../types';

const rawResponse: DeepPartial<PlatformSearchResponse> = {
  banner: {
    content: [{ id: '5af08ea2d5d534000bcc27fb', title: 'test' }]
  },
  catalog: {
    numFound: 0,
    tagging: {
      query: 'https://api.test.empathy.co/search/v1/query/empathy/search?query=chips'
    }
  }
};

const mockedHttpClient = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(rawResponse)
  })
);
window.fetch = mockedHttpClient as any;

describe('platformAdapter tests', () => {
  it('Should search', async () => {
    const response = await platformAdapter.search({
      device: 'mobile',
      env: 'test',
      filters: {},
      instance: 'empathy',
      lang: 'es',
      origin: 'popular_search:predictive_layer',
      query: 'chips',
      relatedTags: [],
      rows: 0,
      scope: 'mobile',
      sort: '',
      start: 0
    });
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/search?device=mobile&query=chips&env=test&scope=mobile&origin=popular_search%3Apredictive_layer&start=0&rows=0&lang=es',
      { signal: expect.anything() }
    );
    expect(response?.totalResults).toBe(0);
  });
});
