import { DeepPartial } from '@empathyco/x-utils';
import { Filter, NextQueriesRequest, RelatedTagsRequest } from '@empathyco/x-types';
import { platformAdapter } from '../platform.adapter';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../types/responses/query-suggestions-response.model';
import { PlatformSearchResponse } from '../types/responses/search-response.model';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../types/responses/popular-searches-response.model';
import { PlatformRelatedTagsResponse } from '../types/responses/related-tags-response.model';
import { PlatformNextQueriesResponse } from '../types/responses/next-queries-response.model';
import { getFetchMock } from './__mocks__/fetch.mock';
import { platformIdentifierResultsResponse } from './__fixtures__/identifier-results.response';
import { platformRecommendationsResponse } from './__fixtures__/recommendations.response';

describe('platformAdapter tests', () => {
  beforeEach(jest.clearAllMocks);

  it('should call the search endpoint', async () => {
    const rawPlatformSearchResponse: DeepPartial<PlatformSearchResponse> = {
      banner: {
        content: [{ id: '5af08ea2d5d534000bcc27fb', title: 'test' }]
      },
      catalog: {
        facets: [
          {
            facet: 'price',
            type: 'range',
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

    const fetchMock = jest.fn(getFetchMock(rawPlatformSearchResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.search({
      query: 'chips',
      rows: 0,
      start: 0,
      origin: 'popular_search:predictive_layer',
      sort: 'price asc',
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
          } as Filter,
          {
            children: ['categoryIds:ffc61e1e9__be257cb26'],
            facetId: 'categoryPaths',
            id: 'categoryIds:ffc61e1e9',
            label: 'Personal Care',
            modelName: 'HierarchicalFilter',
            parentId: null,
            selected: true,
            totalResults: 1
          } as Filter
        ],
        gender: [
          {
            facetId: 'gender',
            id: 'gender:men',
            label: 'men',
            modelName: 'SimpleFilter',
            selected: true,
            totalResults: 1
          } as Filter
        ],
        price: [
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
        ]
      },
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'es',
        device: 'mobile',
        scope: 'mobile'
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/search?query=chips&origin=popular_search%3Apredictive_layer&start=0&rows=0&sort=price+asc&filter=categoryIds%3Affc61e1e9__be257cb26&filter=gender%3Amen&filter=price%3A10.0-20.0&instance=empathy&env=test&lang=es&device=mobile&scope=mobile',
      { signal: expect.anything() }
    );
    expect(response.totalResults).toBe(0);
    expect(response.facets).toStrictEqual([
      {
        id: 'price',
        label: 'price',
        modelName: 'NumberRangeFacet',
        filters: [
          {
            facetId: 'price',
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
            facetId: 'price',
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

  it('should call the popular searches endpoint', async () => {
    const rawPlatformPopularSearchesResponse: PlatformPopularSearchesResponse = {
      topTrends: {
        content: [
          {
            title_raw: 'shoes'
          }
        ]
      }
    };
    const fetchMock = jest.fn(getFetchMock(rawPlatformPopularSearchesResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.popularSearches({
      start: 0,
      rows: 24,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'tablet',
        scope: 'tablet'
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/empathize?start=0&rows=24&instance=empathy&env=test&lang=en&device=tablet&scope=tablet',
      { signal: expect.anything() }
    );

    expect(response).toStrictEqual({
      suggestions: [
        {
          query: 'shoes',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'shoes'
        }
      ]
    });
  });

  it('should call the query suggestions endpoint', async () => {
    const rawPlatformQuerySuggestionsResponse: PlatformQuerySuggestionsResponse = {
      topTrends: {
        content: [
          {
            title_raw: 'shoes'
          }
        ]
      }
    };

    const fetchMock = jest.fn(getFetchMock(rawPlatformQuerySuggestionsResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.querySuggestions({
      query: 'boots',
      start: 0,
      rows: 24,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'tablet',
        scope: 'tablet'
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/empathize?query=boots&start=0&rows=24&instance=empathy&env=test&lang=en&device=tablet&scope=tablet',
      { signal: expect.anything() }
    );

    expect(response).toStrictEqual({
      suggestions: [
        {
          query: 'shoes',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'shoes'
        }
      ]
    });
  });

  it('should call the next queries endpoint', async () => {
    const platformNextQueriesResponse: PlatformNextQueriesResponse = {
      data: {
        nextqueries: [
          {
            query: 'makeup remover',
            source: 'ORGANIC',
            position: 1000
          }
        ]
      }
    };
    const nextQueriesRequest: NextQueriesRequest = {
      query: 'makeup',
      rows: 24,
      start: 0,
      extraParams: {
        scope: 'mobile',
        instance: 'empathy',
        device: 'mobile',
        env: 'staging',
        lang: 'en'
      }
    };

    const fetchMock = jest.fn(getFetchMock(platformNextQueriesResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.nextQueries(nextQueriesRequest);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/nextqueries/empathy?query=makeup&scope=mobile&instance=empathy&device=mobile&env=staging&lang=en',
      { signal: expect.anything() }
    );
    expect(response).toStrictEqual({
      nextQueries: [
        {
          query: 'makeup remover',
          results: [],
          facets: [],
          modelName: 'NextQuery',
          totalResults: 0,
          isCurated: false
        }
      ]
    });
  });

  it('should call the related tags endpoint', async () => {
    const platformRelatedTagsResponse: PlatformRelatedTagsResponse = {
      data: {
        relatedtags: [
          {
            query: 'levis jeans',
            source: 'ORGANIC',
            tag: 'levis',
            position: 1000
          }
        ]
      },
      status: 200
    };

    const fetchMock = jest.fn(getFetchMock(platformRelatedTagsResponse));
    window.fetch = fetchMock as any;

    const relatedTagsRequest: RelatedTagsRequest = {
      query: 'jeans',
      extraParams: {
        device: 'mobile',
        env: 'staging',
        lang: 'en',
        scope: 'mobile',
        instance: 'empathy'
      }
    };

    const response = await platformAdapter.relatedTags(relatedTagsRequest);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/relatedtags/empathy?query=jeans&device=mobile&env=staging&lang=en&scope=mobile&instance=empathy',
      { signal: expect.anything() }
    );
    expect(response).toStrictEqual({
      relatedTags: [
        {
          query: 'levis jeans',
          modelName: 'RelatedTag',
          isCurated: false,
          tag: 'levis'
        }
      ]
    });
  });

  it('should call the identifier results endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock(platformIdentifierResultsResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.identifierResults({
      query: 'jeans',
      start: 0,
      rows: 24,
      origin: 'search_box:none',
      extraParams: {
        instance: 'empathy',
        env: 'staging',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/search/v1/query/empathy/skusearch?query=jeans&origin=search_box%3Anone&start=0&rows=24&instance=empathy&env=staging&lang=en&device=mobile&scope=mobile',
      { signal: expect.anything() }
    );

    expect(response).toStrictEqual({
      results: [
        {
          id: '12345-U',
          identifier: {
            value: '12345-U'
          },
          images: ['https://assets.empathy.co/images-demo/12345.jpg'],
          isWishlisted: false,
          modelName: 'Result',
          name: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          price: {
            hasDiscount: false
          },
          rating: {
            value: null
          },
          tagging: {
            add2cart: {
              params: {
                filtered: 'false',
                follow: false,
                lang: 'en',
                origin: 'search_box:none',
                page: '1',
                position: '1',
                productId: '12345-U',
                q: '12345',
                scope: 'desktop',
                spellcheck: 'false',
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart'
            },
            checkout: {
              params: {
                filtered: 'false',
                follow: false,
                lang: 'en',
                origin: 'search_box:none',
                page: '1',
                position: '1',
                productId: '12345-U',
                q: '12345',
                scope: 'desktop',
                spellcheck: 'false',
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout'
            },
            click: {
              params: {
                filtered: 'false',
                follow: false,
                lang: 'en',
                origin: 'search_box:none',
                page: '1',
                position: '1',
                productId: '12345-U',
                q: '12345',
                scope: 'desktop',
                spellcheck: 'false',
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click'
            }
          },
          type: 'Default'
        }
      ]
    });
  });

  it('should call the recommendations endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock(platformRecommendationsResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.recommendations({
      start: 0,
      rows: 24,
      origin: 'search_box:none',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'desktop',
        scope: 'desktop'
      }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/topclicked?start=0&rows=24&origin=search_box%3Anone&instance=empathy&env=test&lang=en&device=desktop&scope=desktop',
      { signal: expect.anything() }
    );

    expect(response).toStrictEqual({
      results: [
        {
          id: '31335-U',
          identifier: {
            value: '31335-U'
          },
          images: ['https://assets.empathy.co/images-demo/31335.jpg'],
          isWishlisted: false,
          modelName: 'Result',
          name: 'Locomotive Men Washed Blue Jeans',
          price: {
            hasDiscount: false,
            originalValue: 10,
            value: 10
          },
          rating: {
            value: null
          },
          type: 'Default',
          url: 'https://assets.empathy.co/images-demo/31335.jpg'
        }
      ]
    });
  });

  it('should call the tagging endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock({}));
    window.fetch = fetchMock as any;
    await platformAdapter.tagging({
      url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click',
      params: {
        filtered: 'false',
        follow: false,
        lang: 'en',
        origin: 'search_box:none',
        page: '1',
        position: '1',
        productId: '12345-U',
        q: '12345',
        scope: 'desktop',
        spellcheck: 'false',
        title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
      }
    });
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/tagging/v1/track/empathy/click?filtered=false&follow=false&lang=en&origin=search_box%3Anone&page=1&position=1&productId=12345-U&q=12345&scope=desktop&spellcheck=false&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree',
      { keepalive: true }
    );
  });
});
