import { RelatedTag } from '@empathy/search-types';
import { Container } from 'inversify';
import { QueryableRequest, SearchRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequestMapper } from '../../mappers/request/empathy-search-request.mapper';
import { EmpathySearchRequest } from '../../models';
import clearAllMocks = jest.clearAllMocks;

const container = new Container();
const mockedRelatedTagsQueryMapper = {
  map: jest.fn(({ relatedTags = [] }: QueryableRequest, query: string) =>
    relatedTags.length > 0 ? relatedTags.reduce((chain, rt) => `${ chain } ${ rt.tag }`, query).trim() : query)
};
const mockedQueryMapper = { map: jest.fn((_rawQuery: string, query: string) => query) };
const mockedFiltersMapper = { map: jest.fn(() => []) };
const mockedSortMapper = { map: jest.fn((sort: string) => sort) };

container.bind(DEPENDENCIES.RequestMappers.Parameters.query).toConstantValue(mockedRelatedTagsQueryMapper);
container.bind(DEPENDENCIES.RequestMappers.Parameters.query).toConstantValue(mockedQueryMapper);
container.bind(DEPENDENCIES.RequestMappers.Parameters.filters).toConstantValue(mockedFiltersMapper);
container.bind(DEPENDENCIES.RequestMappers.Parameters.sort).toConstantValue(mockedSortMapper);
let mapper: EmpathySearchRequestMapper;
const emptyContext: RequestMapperContext = { feature: '', url: '', requestOptions: {} };

beforeEach(() => {
  container.snapshot();
  mapper = container.resolve(EmpathySearchRequestMapper);
  clearAllMocks();
});

afterEach(() => {
  container.restore();
});

it('Maps related tags to query', () => {
  const relatedTags: RelatedTag[] = [
    { modelName: 'RelatedTag', tag: 'skinny', previous: 'jeans', query: 'skinny jeans', selected: true },
    { modelName: 'RelatedTag', tag: 'short', previous: 'jeans', query: 'short jeans', selected: true }
  ];
  const rawRequest: SearchRequest = { query: 'jeans', origin: 'default', start: 0, rows: 24, relatedTags };
  const request = {} as EmpathySearchRequest;

  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toContain('skinny');
  expect(request.q).toContain('short');
  expect(request.q).toContain('jeans');
  expect(request).toBe(returnedRequest);
  expect(mockedQueryMapper.map).toHaveBeenCalledTimes(1);
  expect(mockedRelatedTagsQueryMapper.map).toHaveBeenCalledTimes(1);
  expect(mockedFiltersMapper.map).toHaveBeenCalledTimes(1);
});

it('Does not modify the query if no related tags are passed', () => {
  const query = 'jeans';
  const rawRequest: SearchRequest = { query, origin: 'default', start: 0, rows: 24, relatedTags: [] };
  const request = {} as EmpathySearchRequest;

  mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toEqual(query);
});

it('Uses the provided sort mappers', () => {
  const rawRequest: SearchRequest = {
    sort: 'price asc',
    query: 'milk',
    origin: 'default'
  };
  const request = {} as EmpathySearchRequest;

  expect(mapper.map(rawRequest, request, emptyContext)).toEqual({
    filter: [],
    sort: 'price asc',
    q: 'milk',
    origin: 'default'
  });

  expect(mockedSortMapper.map).toHaveBeenCalledWith('price asc', '', emptyContext);
});
