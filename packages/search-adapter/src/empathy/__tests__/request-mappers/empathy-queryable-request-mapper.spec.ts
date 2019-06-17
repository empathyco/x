import { Container } from 'inversify';
import { Dictionary } from '../../../utils/utils.types';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathyQueryableRequestMapper } from '../../mappers/request/empathy-queryable-request.mapper';

const container = new Container();
const mockedQueryMapper = { map: jest.fn((str: string) => str) };
const emptyContext: RequestMapperContext = { feature: '', url: '', requestOptions: {} };
container.bind(DEPENDENCIES.RequestMappers.Parameters.query)
  .toConstantValue(mockedQueryMapper);
let mapper: EmpathyQueryableRequestMapper;

beforeEach(() => {
  container.snapshot();
  mapper = container.resolve(EmpathyQueryableRequestMapper);
  mockedQueryMapper.map.mockClear();
});

afterEach(() => {
  container.restore();
});

it('Adds the query when passed', () => {
  const rawRequest: Dictionary<string> = { a: '1', b: '2', query: 'shirt' };
  const request: Dictionary<string> = {};
  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(request).toEqual({ a: '1', b: '2', q: 'shirt' });
  expect(rawRequest).not.toBe(request);
  expect(request).toBe(returnedRequest);
  expect(mockedQueryMapper.map).toHaveBeenCalledTimes(1);
});

it('Does not add the query when not passed', () => {
  const rawRequest: Dictionary<string> = { a: '1', b: '2' };
  const request: Dictionary<string> = {};
  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(rawRequest).toEqual(request);
  expect(rawRequest).not.toBe(request);
  expect(request).toBe(returnedRequest);
  expect(mockedQueryMapper.map).not.toHaveBeenCalled();

});
