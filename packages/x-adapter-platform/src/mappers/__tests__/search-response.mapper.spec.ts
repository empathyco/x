import { searchResponseMapper } from '../response/search-response.mapper';
import { PlatformSearchResponse, SearchResponse } from '../../types';
import { platformSearchResponse } from '../../__tests__/__fixtures__/platform-search.response';

describe('search response mapper tests', () => {
  it('should map the response', () => {
    const response: SearchResponse = {
      banners: [],
      facets: [
        {
          filters: [
            {
              children: {
                filters: [
                  {
                    facetId: 'categoryIds:78d9b7366__8a4e61a33',
                    id: 'categoryIds:78d9b7366__8a4e61a33',
                    label: 'Bottomwear',
                    modelName: 'HierarchicalFilter',
                    parentId: 'categoryPaths_78d9b7366',
                    selected: false,
                    totalResults: 637
                  },
                  {
                    facetId: 'categoryIds:78d9b7366__e2f94a4ea',
                    id: 'categoryIds:78d9b7366__e2f94a4ea',
                    label: 'Topwear',
                    modelName: 'HierarchicalFilter',
                    parentId: 'categoryPaths_78d9b7366',
                    selected: false,
                    totalResults: 99
                  }
                ],
                id: 'categoryPaths_78d9b7366',
                label: 'categoryPaths_78d9b7366',
                modelName: 'HierarchicalFacet'
              },
              facetId: 'categoryIds:78d9b7366',
              id: 'categoryIds:78d9b7366',
              label: 'Apparel',
              modelName: 'HierarchicalFilter',
              parentId: 'categoryPaths',
              selected: false,
              totalResults: 736
            },
            {
              facetId: 'categoryIds:b08648dbd',
              id: 'categoryIds:b08648dbd',
              label: 'Accessories',
              modelName: 'HierarchicalFilter',
              parentId: 'categoryPaths_78d9b7366',
              selected: false,
              totalResults: 43
            },
            {
              facetId: 'categoryIds:ffc61e1e9',
              id: 'categoryIds:ffc61e1e9',
              label: 'Personal Care',
              modelName: 'HierarchicalFilter',
              parentId: 'categoryPaths_78d9b7366',
              selected: false,
              totalResults: 9
            },
            {
              facetId: 'categoryIds:e5eef62d8',
              id: 'categoryIds:e5eef62d8',
              label: 'Footwear',
              modelName: 'HierarchicalFilter',
              parentId: 'categoryPaths_78d9b7366',
              selected: false,
              totalResults: 6
            }
          ],
          id: 'categoryPaths',
          label: 'categoryPaths',
          modelName: 'HierarchicalFacet'
        },
        {
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
            },
            {
              facetId: '30.0-40.0',
              id: 'price:30.0-40.0',
              label: '30.0-40.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 40,
                min: 30
              },
              selected: false,
              totalResults: 85
            },
            {
              facetId: '40.0-50.0',
              id: 'price:40.0-50.0',
              label: '40.0-50.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 50,
                min: 40
              },
              selected: false,
              totalResults: 75
            },
            {
              facetId: '50.0-60.0',
              id: 'price:50.0-60.0',
              label: '50.0-60.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 60,
                min: 50
              },
              selected: false,
              totalResults: 88
            },
            {
              facetId: '60.0-70.0',
              id: 'price:60.0-70.0',
              label: '60.0-70.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 70,
                min: 60
              },
              selected: false,
              totalResults: 62
            },
            {
              facetId: '70.0-80.0',
              id: 'price:70.0-80.0',
              label: '70.0-80.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 80,
                min: 70
              },
              selected: false,
              totalResults: 84
            },
            {
              facetId: '80.0-90.0',
              id: 'price:80.0-90.0',
              label: '80.0-90.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 90,
                min: 80
              },
              selected: false,
              totalResults: 86
            },
            {
              facetId: '90.0-100.0',
              id: 'price:90.0-100.0',
              label: '90.0-100.0',
              modelName: 'NumberRangeFilter',
              range: {
                max: 100,
                min: 90
              },
              selected: false,
              totalResults: 79
            }
          ],
          id: 'price',
          label: 'price',
          modelName: 'NumberRangeFacet'
        },
        {
          filters: [
            {
              facetId: 'gender:men',
              id: 'gender:men',
              label: 'men',
              modelName: 'SimpleFilter',
              selected: false,
              totalResults: 421
            },
            {
              facetId: 'gender:women',
              id: 'gender:women',
              label: 'women',
              modelName: 'SimpleFilter',
              selected: false,
              totalResults: 247
            },
            {
              facetId: 'gender:boys',
              id: 'gender:boys',
              label: 'boys',
              modelName: 'SimpleFilter',
              selected: false,
              totalResults: 35
            },
            {
              facetId: 'gender:girls',
              id: 'gender:girls',
              label: 'girls',
              modelName: 'SimpleFilter',
              selected: false,
              totalResults: 28
            },
            {
              facetId: 'gender:unisex',
              id: 'gender:unisex',
              label: 'unisex',
              modelName: 'SimpleFilter',
              selected: false,
              totalResults: 5
            }
          ],
          id: 'gender',
          label: 'gender',
          modelName: 'SimpleFacet'
        }
      ],
      promoted: [],
      queryTagging: {
        params: {
          filtered: 'true',
          follow: false,
          lang: 'en',
          origin: 'url:external',
          page: '1',
          q: 'jeans',
          scope: 'desktop',
          spellcheck: 'false',
          totalHits: '686'
        },
        url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/query'
      },
      redirections: [],
      results: [],
      spellcheck: '',
      totalResults: 686
    };
    expect(
      searchResponseMapper(platformSearchResponse as PlatformSearchResponse, {})
    ).toStrictEqual(response);
  });
});
