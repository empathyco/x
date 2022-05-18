import { Dictionary } from '@empathyco/x-utils';
import {
  Filter,
  HierarchicalFilter,
  NumberRangeFilter,
  SearchRequest,
  SimpleFilter
} from '@empathyco/x-types';
import { PlatformSearchRequest } from '../../../types/requests/search-request.model';
import { searchRequestMapper } from '../../request/search-request.mapper';

const filters: Dictionary<Filter[]> = {
  offer: [
    {
      facetId: 'offer',
      modelName: 'SimpleFilter',
      id: 'price:[0 TO 10]',
      selected: true,
      label: 'In Offer'
    }
  ] as SimpleFilter[],
  brand_facet: [
    {
      facetId: 'brand_facet',
      id: '{!tag=brand_facet}brand_facet:"Lego"',
      label: 'Lego',
      selected: true,
      totalResults: 6,
      modelName: 'SimpleFilter'
    }
  ] as SimpleFilter[],
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
    }
  ] as NumberRangeFilter[],
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
      facetId: 'categoryPaths',
      id: 'categoryIds:ffc61e1e9__fa5ef54f2',
      label: 'Fragrance',
      modelName: 'HierarchicalFilter',
      parentId: 'categoryIds:ffc61e1e9',
      selected: true,
      totalResults: 1
    },
    {
      children: ['categoryIds:ffc61e1e9__be257cb26', 'categoryIds:ffc61e1e9__fa5ef54f2'],
      facetId: 'categoryPaths',
      id: 'categoryIds:ffc61e1e9',
      label: 'Personal Care',
      modelName: 'HierarchicalFilter',
      parentId: null,
      selected: true,
      totalResults: 1
    }
  ] as HierarchicalFilter[]
};

describe('searchRequestMapper tests', () => {
  const internalRequest: SearchRequest = {
    query: 'chips',
    origin: 'url:external',
    start: 14,
    rows: 2,
    sort: 'price asc',
    filters,
    extraParams: {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    }
  };

  it('should map the request', () => {
    const request: PlatformSearchRequest = {
      query: 'chips',
      origin: 'url:external',
      start: 14,
      rows: 2,
      sort: 'price asc',
      filter: [
        'price:[0 TO 10]',
        '{!tag=brand_facet}brand_facet:"Lego"',
        '{!tag=price}price:[0 TO 10]',
        'categoryIds:ffc61e1e9__be257cb26',
        'categoryIds:ffc61e1e9__fa5ef54f2'
      ],
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(searchRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
