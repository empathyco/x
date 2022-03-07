import { Container } from 'inversify';
import { SearchRequest } from '../../../types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathySearchRequestMapper } from '../../mappers/request/empathy-search-request.mapper';
import { EmpathySearchRequest } from '../../models';
import clearAllMocks = jest.clearAllMocks;

const container = new Container();
const mockedQueryMapper = { map: jest.fn((_rawQuery: string, query: string) => query) };
const mockedFiltersMapper = { map: jest.fn(() => []) };
const mockedSortMapper = { map: jest.fn((sort: string) => sort) };

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
