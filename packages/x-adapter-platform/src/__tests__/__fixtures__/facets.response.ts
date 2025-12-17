import type { PlatformSearchResponse } from '../../types/responses/search-response.model'

export const platformFacetsResponse = {
  catalog: {
    content: [],
    facets: [
      {
        facet: 'brand_facet',
        filter: 'brand_facet',
        label: 'Brand',
        type: 'value',
        values: [
          {
            id: 'Nike',
            value: 'Nike',
            count: 1249,
            filter: 'brand_facet:Nike',
          },
          {
            id: 'Adidas',
            value: 'Adidas',
            count: 1105,
            filter: 'brand_facet:Adidas',
          },
          {
            id: "Levi's",
            value: "Levi's",
            count: 886,
            filter: "brand_facet:Levi's",
          },
        ],
      },
      {
        facet: 'gender',
        filter: 'gender',
        label: 'Gender',
        type: 'value',
        values: [
          {
            id: 'men',
            value: 'men',
            count: 421,
            filter: 'gender:men',
          },
          {
            id: 'women',
            value: 'women',
            count: 247,
            filter: 'gender:women',
          },
          {
            id: 'boys',
            value: 'boys',
            count: 35,
            filter: 'gender:boys',
          },
          {
            id: 'girls',
            value: 'girls',
            count: 28,
            filter: 'gender:girls',
          },
          {
            id: 'unisex',
            value: 'unisex',
            count: 5,
            filter: 'gender:unisex',
          },
        ],
      },
      {
        facet: 'categoryPaths',
        filter: 'categoryIds',
        label: 'Categories',
        type: 'hierarchical',
        values: [
          {
            id: '78d9b7366',
            value: 'Apparel',
            count: 28672,
            filter: 'categoryIds:78d9b7366',
          },
          {
            id: 'b08648dbd',
            value: 'Accessories',
            count: 14165,
            filter: 'categoryIds:b08648dbd',
          },
          {
            id: 'e5eef62d8',
            value: 'Footwear',
            count: 10903,
            filter: 'categoryIds:e5eef62d8',
          },
        ],
      },
    ],
  },
} as any as PlatformSearchResponse
