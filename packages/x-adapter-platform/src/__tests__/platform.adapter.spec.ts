import { DeepPartial } from '@empathyco/x-utils';
import { Filter } from '@empathyco/x-types';
import { platformAdapter } from '../platform.adapter';
import { PlatformSearchResponse } from '../types';

const rawResponse: DeepPartial<PlatformSearchResponse> = {
  banner: {
    content: [{ id: '5af08ea2d5d534000bcc27fb', title: 'test' }]
  },
  catalog: {
    facets: [
      {
        facet: 'price',
        values: [
          {
            id: '10.0-20.0',
            value: '10.0-20.0',
            count: 97,
            filter: 'price:10.0-20.0'
          },
          {
            id: '20.0-30.0',
            value: '20.0-30.0',
            count: 80,
            filter: 'price:20.0-30.0'
          }
        ]
      }
    ],
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
      filters: {
        categoryPaths: [
          {
            facetId: 'categoryPaths',
            id: 'categoryIds:ffc61e1e9__be257cb26',
            label: 'Fragrance',
            modelName: 'HierarchicalFilter',
            parentId: 'categoryIds:ffc61e1e9',
            selected: true,
            totalResults: 1
          },
          {
            children: ['categoryIds:ffc61e1e9__be257cb26'],
            facetId: 'categoryPaths',
            id: 'categoryIds:ffc61e1e9',
            label: 'Personal Care',
            modelName: 'HierarchicalFilter',
            parentId: null,
            selected: true,
            totalResults: 1
          },
          {
            facetId: 'gender',
            id: 'gender:men',
            label: 'men',
            modelName: 'SimpleFilter',
            selected: true,
            totalResults: 1
          },
          {
            facetId: 'price',
            id: 'price:10.0-20.0',
            label: '10.0-20.0',
            modelName: 'NumberRangeFilter',
            range: {
              max: 20,
              min: 10
            },
            selected: true,
            totalResults: 1
          } as Filter
        ] as Filter[]
      },
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
      'https://api.test.empathy.co/search/v1/query/empathy/search?device=mobile&query=chips&env=test&scope=mobile&origin=popular_search%3Apredictive_layer&start=0&rows=0&lang=es&filter=categoryIds%3Affc61e1e9__be257cb26&filter=gender%3Amen&filter=price%3A10.0-20.0',
      { signal: expect.anything() }
    );
    expect(response?.totalResults).toBe(0);
    expect(response.facets).toStrictEqual([
      {
        id: 'price',
        label: 'price',
        modelName: 'NumberRangeFacet',
        filters: [
          {
            facetId: '10.0-20.0',
            id: 'price:10.0-20.0',
            label: '10.0-20.0',
            modelName: 'NumberRangeFilter',
            range: {
              max: 20,
              min: 10
            },
            selected: false,
            totalResults: 97
          },
          {
            facetId: '20.0-30.0',
            id: 'price:20.0-30.0',
            label: '20.0-30.0',
            modelName: 'NumberRangeFilter',
            range: {
              max: 30,
              min: 20
            },
            selected: false,
            totalResults: 80
          }
        ]
      }
    ]);
  });
});
