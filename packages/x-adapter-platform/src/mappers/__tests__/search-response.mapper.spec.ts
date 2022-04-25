import { searchResponseMapper } from '../response/search-response.mapper';
import { PlatformSearchResponse, SearchResponse } from '../../types';

describe('search response mapper tests', () => {
  const platformResponse: PlatformSearchResponse = {
    banner: {
      content: []
    },
    catalog: {
      content: [
        {
          id: '51587-U',
          image: 'https://assets.empathy.co/images-demo/51587.jpg',
          images: ['https://assets.empathy.co/images-demo/51587.jpg'],
          name: 'John Players Men Blue Jeans',
          url: 'https://assets.empathy.co/images-demo/42262.jpg',
          sku: '',
          averageRating: 0,
          price: 63.95,
          tagging: {
            add2cart:
              // eslint-disable-next-line max-len
              'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart?q=jeans&lang=en&scope=desktop',
            checkout:
              // eslint-disable-next-line max-len
              'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart?q=jeans&lang=en&scope=desktop',
            click:
              // eslint-disable-next-line max-len
              'https://api.staging.empathy.co/tagging/v1/track/empathy/click?q=jeans&lang=en&scope=desktop'
          }
        }
      ],
      facets: [
        {
          facet: 'categoryPaths',
          values: [
            {
              id: '78d9b7366',
              value: 'Apparel',
              count: 736,
              filter: 'categoryIds:78d9b7366',
              children: [
                {
                  facet: 'categoryPaths_78d9b7366',
                  values: [
                    {
                      count: 514,
                      filter: 'categoryIds:78d9b7366__8a4e61a33',
                      id: '78d9b7366__8a4e61a33',
                      value: 'Bottomwear',
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              id: 'b08648dbd',
              value: 'Accessories',
              count: 43,
              filter: 'categoryIds:b08648dbd',
              children: []
            }
          ]
        },
        {
          facet: 'price',
          values: [
            {
              id: '10.0-20.0',
              value: '10.0-20.0',
              count: 102,
              filter: 'price:10.0-20.0',
              children: []
            }
          ]
        }
      ],
      numFound: 1,
      spellchecked: '',
      tagging: {
        query: 'https://tagging.empathy.co/track/empathy/query?q=chips&lang=en&scope=desktop'
      }
    },
    direct: {
      content: []
    },
    promoted: {
      content: []
    }
  };

  it('should map the response', () => {
    const response: SearchResponse = {
      banners: [],
      facets: [
        {
          id: platformResponse.catalog.facets[0].facet,
          label: platformResponse.catalog.facets[0].facet,
          modelName: 'HierarchicalFacet',
          selected: false,
          filters: [
            {
              id: platformResponse.catalog.facets[0].values[0].filter,
              label: platformResponse.catalog.facets[0].values[0].value,
              modelName: 'HierarchicalFilter',
              selected: false,
              children: [
                {
                  id: platformResponse.catalog.facets[0].values[0].children[0].facet,
                  label: platformResponse.catalog.facets[0].values[0].children[0].facet,
                  modelName: 'HierarchicalFacet',
                  selected: false,
                  filters: [
                    {
                      children: [],
                      id: platformResponse.catalog.facets[0].values[0].children[0].values[0].filter,
                      label:
                        platformResponse.catalog.facets[0].values[0].children[0].values[0].value,
                      modelName: 'HierarchicalFilter',
                      selected: false
                    }
                  ]
                }
              ]
            },
            {
              id: platformResponse.catalog.facets[0].values[1].filter,
              label: platformResponse.catalog.facets[0].values[1].value,
              modelName: 'HierarchicalFilter',
              selected: false,
              children: []
            }
          ]
        },
        {
          id: platformResponse.catalog.facets[1].facet,
          label: platformResponse.catalog.facets[1].facet,
          modelName: 'NumberRangeFacet',
          selected: false,
          filters: [
            {
              id: platformResponse.catalog.facets[1].values[0].filter,
              label: platformResponse.catalog.facets[1].values[0].value,
              modelName: 'NumberRangeFilter',
              selected: false,
              children: []
            }
          ]
        }
      ],
      promoted: [],
      queryTagging: {
        url: 'https://tagging.empathy.co/track/empathy/query',
        params: {
          q: 'chips',
          lang: 'en',
          scope: 'desktop',
          follow: false
        }
      },
      redirections: [],
      results: [
        {
          id: platformResponse.catalog.content[0].id,
          images: platformResponse.catalog.content[0].images,
          name: platformResponse.catalog.content[0].name,
          url: platformResponse.catalog.content[0].url,
          type: 'Default',
          modelName: 'Result',
          identifier: {
            value: platformResponse.catalog.content[0].sku
          },
          rating: {
            value: Number(platformResponse.catalog.content[0].averageRating)
          },
          price: {
            value: platformResponse.catalog.content[0].price,
            originalValue: platformResponse.catalog.content[0].price,
            hasDiscount: false
          },
          isWishlisted: false,
          tagging: {
            add2cart: {
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart',
              params: {
                q: 'jeans',
                lang: 'en',
                scope: 'desktop',
                follow: false
              }
            },
            checkout: {
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart',
              params: {
                q: 'jeans',
                lang: 'en',
                scope: 'desktop',
                follow: false
              }
            },
            click: {
              url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click',
              params: {
                q: 'jeans',
                lang: 'en',
                scope: 'desktop',
                follow: false
              }
            }
          }
        }
      ],
      spellcheck: '',
      totalResults: 1
    };
    expect(searchResponseMapper(platformResponse, {})).toStrictEqual(response);
  });
});
