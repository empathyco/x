import { Dictionary } from '@empathyco/x-utils';
import { Filter, NumberRangeFilter, SimpleFilter } from '@empathyco/x-types';
import { searchRequestMapper } from '../request/search-request.mapper';
import { PlatformSearchRequest, SearchRequest } from '../../types';

const filters: Dictionary<Filter[]> = {
  offer: [
    {
      facetId: 'offer',
      modelName: 'SimpleFilter',
      id: 'price:[0 TO 10]',
      selected: true,
      label: 'In Offer'
    } as SimpleFilter
  ],
  brand_facet: [
    {
      facetId: 'brand_facet',
      id: '{!tag=brand_facet}brand_facet:"Lego"',
      label: 'Lego',
      selected: true,
      totalResults: 6,
      modelName: 'SimpleFilter'
    } as SimpleFilter
  ],
  price: [
    {
      facetId: 'price',
      id: '{!tag=price}price:[0 TO 10]',
      label: '0:10',
      selected: true,
      totalResults: 6,
      modelName: 'NumberRangeFilter',
      range: {
        min: null,
        max: 10
      }
    } as NumberRangeFilter
  ],
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
      facetId: 'categoryPaths',
      id: 'categoryIds:ffc61e1e9__fa5ef54f2',
      label: 'Fragrance',
      modelName: 'HierarchicalFilter',
      parentId: 'categoryIds:ffc61e1e9',
      selected: true,
      totalResults: 1
    } as Filter,
    {
      children: ['categoryIds:ffc61e1e9__be257cb26', 'categoryIds:ffc61e1e9__fa5ef54f2'],
      facetId: 'categoryPaths',
      id: 'categoryIds:ffc61e1e9',
      label: 'Personal Care',
      modelName: 'HierarchicalFilter',
      parentId: null,
      selected: true,
      totalResults: 1
    } as Filter
  ]
};

describe('search platform request test', () => {
  const internalRequest: SearchRequest = {
    env: 'test',
    lang: 'en',
    origin: 'url:external',
    rows: 2,
    scope: 'mobile',
    sort: 'price asc',
    start: 14,
    device: 'mobile',
    query: 'chips',
    filters
  };

  it('should map the request', () => {
    const request: PlatformSearchRequest = {
      device: 'mobile',
      env: 'test',
      lang: 'en',
      origin: 'url:external',
      query: 'chips',
      rows: 2,
      scope: 'mobile',
      sort: 'price asc',
      filter: [
        'price:[0 TO 10]',
        '{!tag=brand_facet}brand_facet:"Lego"',
        '{!tag=price}price:[0 TO 10]',
        'categoryIds:ffc61e1e9__be257cb26',
        'categoryIds:ffc61e1e9__fa5ef54f2'
      ],
      start: 14
    };
    expect(searchRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
