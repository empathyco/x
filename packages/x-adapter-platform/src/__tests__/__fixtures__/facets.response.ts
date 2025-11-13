import type { PlatformSearchResponse } from '../../types/responses/search-response.model'

export const platformFacetsResponse = {
  catalog: {
    content: [],
    facets: [
      {
        facet: 'facetEditorial',
        filter: 'editorial',
        label: 'Editorial',
        type: 'value',
        values: [
          {
            id: 'DEBOLSILLO',
            value: 'DEBOLSILLO',
            count: 1149,
            filter: 'editorial:DEBOLSILLO',
          },
          {
            id: 'ALFAGUARA',
            value: 'ALFAGUARA',
            count: 1005,
            filter: 'editorial:ALFAGUARA',
          },
          {
            id: 'PLANETA',
            value: 'PLANETA',
            count: 786,
            filter: 'editorial:PLANETA',
          },
        ],
      },
      {
        facet: 'facetColecciondilve',
        filter: 'facetColecciondilve',
        label: 'Colección',
        type: 'value',
        values: [
          {
            id: 'Best Seller',
            value: 'Best Seller',
            count: 265,
            filter: 'facetColecciondilve:Best Seller',
          },
          {
            id: 'Jovenes lectores',
            value: 'Jovenes lectores',
            count: 238,
            filter: 'facetColecciondilve:Jovenes lectores',
          },
          {
            id: 'Ficcion',
            value: 'Ficcion',
            count: 204,
            filter: 'facetColecciondilve:Ficcion',
          },
        ],
      },
      {
        facet: 'facetHierarchicalCategories',
        filter: 'filterHierarchicalCategories',
        label: 'Categorías',
        type: 'hierarchical',
        values: [
          {
            id: '121000000',
            value: 'Literatura',
            count: 28672,
            filter: 'filterHierarchicalCategories:121000000',
          },
          {
            id: '415000000',
            value: 'Libro antiguo y de ocasion',
            count: 14165,
            filter: 'filterHierarchicalCategories:415000000',
          },
          {
            id: '117000000',
            value: 'Infantil',
            count: 10903,
            filter: 'filterHierarchicalCategories:117000000',
          },
        ],
      },
    ],
  },
} as any as PlatformSearchResponse
