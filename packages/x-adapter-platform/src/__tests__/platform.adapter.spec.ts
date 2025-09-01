import type { Filter, NextQueriesRequest, RelatedTagsRequest } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type {
  PlatformAiQuestionsResponse,
  PlatformAiSuggestionsSearchResponse,
  PlatformAiTasksResponse,
  PlatformExperienceControlsResponse,
} from '../types'
import type { PlatformNextQueriesResponse } from '../types/responses/next-queries-response.model'
import type { PlatformPopularSearchesResponse } from '../types/responses/popular-searches-response.model'
import type { PlatformQuerySuggestionsResponse } from '../types/responses/query-suggestions-response.model'
import type { PlatformRelatedTagsResponse } from '../types/responses/related-tags-response.model'
import type { PlatformSearchResponse } from '../types/responses/search-response.model'
import type { PlatformSemanticQueriesResponse } from '../types/responses/semantic-queries-response.model'
import { platformAdapter } from '../platform.adapter'
import { platformIdentifierResultsResponse } from './__fixtures__/identifier-results.response'
import { platformRecommendationsResponse } from './__fixtures__/recommendations.response'
import { platformResult, result } from './__fixtures__/result.response'
import { getFetchMock } from './__mocks__/fetch.mock'

const aiQuestionsResponseStub: PlatformAiQuestionsResponse = {
  context: {
    instance: 'mymotivemarketplace',
    lang: 'es',
    filters: {},
    query: 'camiseta arrugada',
  },
  items: [],
  resolved: false,
  numItems: 0,
  taskId:
    'f:questions:i:mymotivemarketplace:type:generate-conversational:lang:es:q:9f7d9f3e3549f1d801845f4c9e2114a3',
  totalItems: 0,
}
describe('platformAdapter tests', () => {
  beforeEach(jest.clearAllMocks)

  it('should call the search endpoint', async () => {
    const rawPlatformSearchResponse: DeepPartial<PlatformSearchResponse> = {
      banner: {
        content: [{ id: '5af08ea2d5d534000bcc27fb', title: 'test' }],
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
                filter: 'price:10.0-20.0',
              },
              {
                id: '20.0-30.0',
                value: '20.0-30.0',
                count: 80,
                filter: 'price:20.0-30.0',
              },
            ],
          },
        ],
        numFound: 0,
        tagging: {
          query: 'https://api.test.empathy.co/search/v1/query/empathy/search?query=chips',
        },
      },
    }

    const fetchMock = jest.fn(getFetchMock(rawPlatformSearchResponse))
    window.fetch = fetchMock as any

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
            totalResults: 1,
          } as Filter,
          {
            children: ['categoryIds:ffc61e1e9__be257cb26'],
            facetId: 'categoryPaths',
            id: 'categoryIds:ffc61e1e9',
            label: 'Personal Care',
            modelName: 'HierarchicalFilter',
            parentId: null,
            selected: true,
            totalResults: 1,
          } as Filter,
        ],
        gender: [
          {
            facetId: 'gender',
            id: 'gender:men',
            label: 'men',
            modelName: 'SimpleFilter',
            selected: true,
            totalResults: 1,
          } as Filter,
        ],
        price: [
          {
            facetId: 'price',
            id: 'price:10.0-20.0',
            label: '10.0-20.0',
            modelName: 'NumberRangeFilter',
            range: {
              max: 20,
              min: 10,
            },
            selected: true,
            totalResults: 1,
          } as Filter,
        ],
      },
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'es',
        device: 'mobile',
        scope: 'mobile',
      },
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://search.internal.test.empathy.co/query/empathy/search?internal=true&query=chips&origin=popular_search%3Apredictive_layer&start=0&rows=0&sort=price+asc&filter=categoryIds%3Affc61e1e9__be257cb26&filter=gender%3Amen&filter=price%3A10.0-20.0&instance=empathy&env=test&lang=es&device=mobile&scope=mobile',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )
    expect(response.totalResults).toBe(0)
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
              min: 10,
            },
            selected: false,
            totalResults: 97,
          },
          {
            facetId: 'price',
            id: 'price:20.0-30.0',
            label: '20.0-30.0',
            modelName: 'NumberRangeFilter',
            range: {
              max: 30,
              min: 20,
            },
            selected: false,
            totalResults: 80,
          },
        ],
      },
    ])
  })

  it('should call the popular searches endpoint', async () => {
    const rawPlatformPopularSearchesResponse: PlatformPopularSearchesResponse = {
      topTrends: {
        content: [
          {
            keywords: 'shoes',
          },
        ],
      },
    }
    const fetchMock = jest.fn(getFetchMock(rawPlatformPopularSearchesResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.popularSearches({
      start: 0,
      rows: 24,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'tablet',
        scope: 'tablet',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://search.internal.test.empathy.co/query/empathy/empathize?internal=true&start=0&rows=24&instance=empathy&env=test&lang=en&device=tablet&scope=tablet',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      suggestions: [
        {
          query: 'shoes',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'shoes',
        },
      ],
    })
  })

  it('should call the query suggestions endpoint', async () => {
    const rawPlatformQuerySuggestionsResponse: PlatformQuerySuggestionsResponse = {
      topTrends: {
        content: [
          {
            keywords: 'shoes',
          },
        ],
      },
    }

    const fetchMock = jest.fn(getFetchMock(rawPlatformQuerySuggestionsResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.querySuggestions({
      query: 'boots',
      start: 0,
      rows: 24,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'tablet',
        scope: 'tablet',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://search.internal.test.empathy.co/query/empathy/empathize?internal=true&query=boots&start=0&rows=24&instance=empathy&env=test&lang=en&device=tablet&scope=tablet',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      suggestions: [
        {
          query: 'shoes',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'shoes',
        },
      ],
    })
  })

  it('should call the query suggestions endpoint and prioritize for title_raw over keywords', async () => {
    const rawPlatformQuerySuggestionsResponse: PlatformQuerySuggestionsResponse = {
      topTrends: {
        content: [
          {
            title_raw: 'shoes',
            keywords: 'no_query',
          },
        ],
      },
    }

    const fetchMock = jest.fn(getFetchMock(rawPlatformQuerySuggestionsResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.querySuggestions({
      query: 'boots',
      start: 0,
      rows: 24,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'tablet',
        scope: 'tablet',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://search.internal.test.empathy.co/query/empathy/empathize?internal=true&query=boots&start=0&rows=24&instance=empathy&env=test&lang=en&device=tablet&scope=tablet',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      suggestions: [
        {
          query: 'shoes',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'shoes',
        },
      ],
    })
  })

  it('should call the next queries endpoint', async () => {
    const platformNextQueriesResponse: PlatformNextQueriesResponse = {
      data: {
        nextqueries: [
          {
            query: 'makeup remover',
            source: 'ORGANIC',
            position: 1000,
          },
        ],
      },
    }
    const nextQueriesRequest: NextQueriesRequest = {
      query: 'makeup',
      rows: 24,
      start: 0,
      extraParams: {
        scope: 'mobile',
        instance: 'empathy',
        device: 'mobile',
        env: 'staging',
        lang: 'en',
      },
    }

    const fetchMock = jest.fn(getFetchMock(platformNextQueriesResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.nextQueries(nextQueriesRequest)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/nextqueries/empathy?internal=true&query=makeup&scope=mobile&instance=empathy&device=mobile&env=staging&lang=en',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )
    expect(response).toStrictEqual({
      nextQueries: [
        {
          query: 'makeup remover',
          results: [],
          facets: [],
          modelName: 'NextQuery',
          totalResults: 0,
          isCurated: false,
        },
      ],
    })
  })

  it('should call the related tags endpoint', async () => {
    const platformRelatedTagsResponse: PlatformRelatedTagsResponse = {
      data: {
        relatedtags: [
          {
            query: 'levis jeans',
            source: 'ORGANIC',
            tag: 'levis',
            position: 1000,
          },
        ],
      },
      status: 200,
    }

    const fetchMock = jest.fn(getFetchMock(platformRelatedTagsResponse))
    window.fetch = fetchMock as any

    const relatedTagsRequest: RelatedTagsRequest = {
      query: 'jeans',
      extraParams: {
        device: 'mobile',
        env: 'staging',
        lang: 'en',
        scope: 'mobile',
        instance: 'empathy',
      },
    }

    const response = await platformAdapter.relatedTags(relatedTagsRequest)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/relatedtags/empathy?internal=true&query=jeans&device=mobile&env=staging&lang=en&scope=mobile&instance=empathy',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )
    expect(response).toStrictEqual({
      relatedTags: [
        {
          query: 'levis jeans',
          modelName: 'RelatedTag',
          isCurated: false,
          tag: 'levis',
        },
      ],
    })
  })

  it('should call the identifier results endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock(platformIdentifierResultsResponse))
    window.fetch = fetchMock as any

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
        scope: 'mobile',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/search/v1/query/empathy/skusearch?internal=true&query=jeans&origin=search_box%3Anone&start=0&rows=24&instance=empathy&env=staging&lang=en&device=mobile&scope=mobile',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      results: [
        {
          id: '12345-U',
          identifier: {
            value: '12345-U',
          },
          images: ['https://assets.empathy.co/images-demo/12345.jpg'],
          isWishlisted: false,
          modelName: 'Result',
          name: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          price: {
            value: 10,
            originalValue: 10,
            futureValue: 10,
            hasDiscount: false,
          },
          rating: {
            value: null,
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
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart',
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
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout',
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
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click',
            },
            displayClick: {
              params: {
                displayId: '12345',
                filtered: 'false',
                follow: false,
                lang: 'en',
                origin: 'search_box:none',
                page: '1',
                position: '1',
                productId: '12345-U',
                scope: 'desktop',
                spellcheck: 'false',
                title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
              },
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/displayClick',
            },
          },
          type: 'Default',
        },
      ],
    })
  })

  it('should call the recommendations endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock(platformRecommendationsResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.recommendations({
      start: 0,
      rows: 24,
      origin: 'search_box:none',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'desktop',
        scope: 'desktop',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://search.internal.test.empathy.co/query/empathy/topclicked?internal=true&start=0&rows=24&origin=search_box%3Anone&instance=empathy&env=test&lang=en&device=desktop&scope=desktop',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      results: [result],
    })
  })

  it('should call the tagging endpoint', async () => {
    const fetchMock = jest.fn(getFetchMock({}))
    window.fetch = fetchMock as any
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
        title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
      },
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/tagging/v1/track/empathy/click?filtered=false&follow=false&lang=en&origin=search_box%3Anone&page=1&position=1&productId=12345-U&q=12345&scope=desktop&spellcheck=false&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree',
      {
        keepalive: true,
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )
  })

  it('should call the semantic queries adapter', async () => {
    const platformResponse: PlatformSemanticQueriesResponse = {
      data: {
        candidates: [
          {
            query: 'test',
            distance: 123,
          },
          {
            query: 'test 2',
            distance: 456,
          },
        ],
      },
    }

    const fetchMock = jest.fn(getFetchMock(platformResponse))
    window.fetch = fetchMock as any
    const response = await platformAdapter.semanticQueries({
      query: 'test',
      extraParams: {
        lang: 'en',
        instance: 'empathy',
        env: 'staging',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/semantics-api/search_single/empathy?q=test&lang=en&instance=empathy&env=staging',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    expect(response).toStrictEqual({
      semanticQueries: [
        {
          modelName: 'SemanticQuery',
          query: 'test',
          distance: 123,
        },
        {
          modelName: 'SemanticQuery',
          query: 'test 2',
          distance: 456,
        },
      ],
    })
  })

  it('should call the experiences control adapter', async () => {
    const platformResponse: PlatformExperienceControlsResponse = {
      grid: {
        columns: 2,
      },
    }

    const fetchMock = jest.fn(getFetchMock(platformResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.experienceControls({
      extraParams: {
        instance: 'empathy',
        env: 'staging',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.staging.empathy.co/config/v1/public/configs?service=xcontrols&instance=empathy&env=staging',
      {
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )
    expect(response).toStrictEqual({
      controls: {
        grid: {
          columns: 2,
        },
      },
      events: {},
    })
  })

  it('should call the ai questions endpoint', async () => {
    const instanceStub = 'empathy'
    const queryStub = 'return policy'
    const langStub = 'en'
    const fetchMock = jest.fn(getFetchMock(aiQuestionsResponseStub))
    window.fetch = fetchMock as any

    const response = await platformAdapter.aiQuestions({
      query: queryStub,
      lang: langStub,
      extraParams: {
        instance: instanceStub,
        env: 'staging',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `https://questions.staging.empathy.co/v1/questions/${instanceStub}/conversational`,
      {
        headers: {
          'x-origin': expect.anything(),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          internal: true,
          context: {
            lang: langStub,
            query: queryStub,
            instance: instanceStub,
          },
        }),
      },
    )

    expect(response).toStrictEqual(aiQuestionsResponseStub)
  })

  it('should call the ai tasks endpoint', async () => {
    const aiTasksResponse: PlatformAiTasksResponse = {
      result: aiQuestionsResponseStub,
      steps: [],
    }
    const instanceStub = 'empathy'
    const taskIdStub = 'taskId'

    const fetchMock = jest.fn(getFetchMock(aiTasksResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.aiTasks({
      taskId: taskIdStub,
      extraParams: {
        instance: instanceStub,
        env: 'staging',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `https://questions.staging.empathy.co/v1/tasks/${taskIdStub}?internal=true&taskId=${taskIdStub}`,
      {
        headers: {
          'x-origin': expect.anything(),
        },
      },
    )

    // Ensure the response matches AiTaskResponse interface
    expect(response).toStrictEqual(aiTasksResponse)
  })

  it('should call the ai suggestions search endpoint', async () => {
    const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
      items: [{ query: 'test', results: [platformResult] }],
    }
    const instanceStub = 'empathy'
    const langStub = 'en'
    const queriesStub = [
      {
        query: 'test',
        categories: ['test'],
      },
    ]

    const fetchMock = jest.fn(getFetchMock(platformAiSuggestionsSearchResponse))
    window.fetch = fetchMock as any

    const response = await platformAdapter.aiSuggestionsSearch({
      queries: queriesStub,
      extraParams: {
        lang: langStub,
        instance: instanceStub,
        env: 'staging',
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `https://questions.staging.empathy.co/v1/overview/${instanceStub}/suggestions/search`,
      {
        method: 'POST',
        signal: expect.anything(),
        headers: {
          'x-origin': expect.anything(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          internal: true,
          context: {
            lang: langStub,
            instance: instanceStub,
          },
          queries: queriesStub,
        }),
      },
    )

    const aiSuggestionsSearchResponse = {
      suggestions: [{ query: 'test', results: [result] }],
    }
    // Ensure the response matches AiOverviewSuggestionsSearch interface
    expect(response).toStrictEqual(aiSuggestionsSearchResponse)
  })
})
