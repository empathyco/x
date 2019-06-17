import { RelatedTag } from '@empathy/search-types';
import { Container } from 'inversify';
import { SearchRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequestMapper } from '../../mappers/request/empathy-search-request.mapper';
import { EmpathySearchRequest } from '../../models';
import clearAllMocks = jest.clearAllMocks;

const container = new Container();
const mockedQueryMapper = { map: jest.fn((_rawQuery: string, query: string) => query) };
const mockedFiltersMapper = { map: jest.fn(() => ['size=xxl']) };
container.bind(DEPENDENCIES.RequestMappers.Parameters.query).toConstantValue(mockedQueryMapper);
container.bind(DEPENDENCIES.RequestMappers.Parameters.filters).toConstantValue(mockedFiltersMapper);
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
    { tag: 'skinny', previous: 'jeans', query: 'skinny jeans', selected: true },
    { tag: 'short', previous: 'jeans', query: 'short jeans', selected: true }
  ];
  const rawRequest: SearchRequest = { query: 'jeans', origin: 'default', start: 0, rows: 24, relatedTags };
  const request = {} as EmpathySearchRequest;

  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toContain('skinny');
  expect(request.q).toContain('short');
  expect(request.q).toContain('jeans');
  expect(request).toBe(returnedRequest);
  expect(mockedQueryMapper.map).toHaveBeenCalledTimes(1);
  expect(mockedFiltersMapper.map).toHaveBeenCalledTimes(1);
});

it('Does not modify the query if no related tags are passed', () => {
  const query = 'jeans';
  const rawRequest: SearchRequest = { query, origin: 'default', start: 0, rows: 24, relatedTags: [] };
  const request = {} as EmpathySearchRequest;

  mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toEqual(query);
});
