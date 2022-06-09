import { DeepPartial } from '@empathyco/x-utils';
import { Filter, NextQueriesRequest } from '@empathyco/x-types';
import { platformAdapter } from '../platform.adapter';
import { BaseRequest, TaggingRequest } from '../types/request.types';
import {
  PlatformEmpathizeResponse,
  PlatformNextQueriesResponse,
  PlatformRelatedTagsResponse,
  PlatformSearchResponse
} from '../types/response.types';
import { getFetchMock } from './__mocks__/fetch.mock';
import { platformSkuSearchResponse } from './__fixtures__/platform-sku-search.response';
import { platformTopClickedResponse } from './__fixtures__/platform-top-clicked.response';

describe('platformAdapter tests', () => {
  beforeEach(jest.clearAllMocks);

  it('Should call the search endpoint', async () => {
    const rawPlatformSearchResponse: DeepPartial<PlatformSearchResponse> = {
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

    const fetchMock = jest.fn(getFetchMock(rawPlatformSearchResponse));
    window.fetch = fetchMock as any;

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
      instance: 'empathy',
      lang: 'es',
      origin: 'popular_search:predictive_layer',
      query: 'chips',
      relatedTags: [],
      rows: 0,
      scope: 'mobile',
      sort: 'price asc',
      start: 0
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/search?device=mobile&query=chips&env=test&scope=mobile&origin=popular_search%3Apredictive_layer&start=0&rows=0&lang=es&sort=price+asc&filter=categoryIds%3Affc61e1e9__be257cb26&filter=gender%3Amen&filter=price%3A10.0-20.0',
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

  it('should call the empathize endpoint', async () => {
    const rawPlatformEmpathizeResponse: PlatformEmpathizeResponse = {
      topTrends: {
        content: [
          {
            title_raw: 'shoes'
          }
        ],
        spellcheck: 'sneakers'
      }
    };
    const fetchMock = jest.fn(getFetchMock(rawPlatformEmpathizeResponse));
    window.fetch = fetchMock as any;

    const empathizeRequest: BaseRequest = {
      env: 'test',
      device: 'tablet',
      rows: 24,
      scope: 'tablet',
      start: 0,
      lang: 'en',
      instance: 'empathy'
    };
    const response = await platformAdapter.empathize(empathizeRequest);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/empathize?device=tablet&env=test&lang=en&rows=24&scope=tablet&start=0',
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
      ],
      spellcheck: 'sneakers'
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

    const relatedTagsRequest: BaseRequest = {
      device: 'mobile',
      env: 'staging',
      lang: 'en',
      query: 'jeans',
      rows: 24,
      scope: 'mobile',
      start: 0,
      instance: 'empathy'
    };

    const response = await platformAdapter.relatedTags(relatedTagsRequest);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/relatedtags/empathy?device=mobile&env=staging&lang=en&rows=24&scope=mobile&start=0&query=jeans',
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

  it('should call the sku search endpoint', async () => {
    const skuSearchRequest: BaseRequest = {
      device: 'mobile',
      env: 'staging',
      lang: 'en',
      query: 'jeans',
      rows: 24,
      scope: 'mobile',
      start: 0,
      instance: 'empathy',
      origin: 'search_box:none'
    };

    const fetchMock = jest.fn(getFetchMock(platformSkuSearchResponse));
    window.fetch = fetchMock as any;
    const response = await platformAdapter.skuSearch(skuSearchRequest);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/search/v1/query/empathy/skusearch?device=mobile&env=staging&lang=en&rows=24&scope=mobile&start=0&query=jeans&origin=search_box%3Anone',
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

  it('should call the top clicked endpoint', async () => {
    const topClickedRequest: BaseRequest = {
      device: 'desktop',
      env: 'test',
      lang: 'en',
      query: 'jeans',
      rows: 24,
      scope: 'desktop',
      start: 0,
      instance: 'empathy'
    };

    const fetchMock = jest.fn(getFetchMock(platformTopClickedResponse));
    window.fetch = fetchMock as any;

    const response = await platformAdapter.topClicked(topClickedRequest);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.test.empathy.co/search/v1/query/empathy/topclicked?device=desktop&env=test&lang=en&rows=24&scope=desktop&start=0&query=jeans',
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
    const beaconMock = jest.fn();
    const fetchMock = jest.fn(getFetchMock({}));
    window.fetch = fetchMock as any;
    navigator.sendBeacon = beaconMock;
    const taggingRequest: TaggingRequest = {
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
    };
    await platformAdapter.tagging(taggingRequest);
    expect(beaconMock).toHaveBeenCalledWith(
      // eslint-disable-next-line max-len
      'https://api.staging.empathy.co/tagging/v1/track/empathy/click?filtered=false&follow=false&lang=en&origin=search_box%3Anone&page=1&position=1&productId=12345-U&q=12345&scope=desktop&spellcheck=false&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree'
    );
  });
});
