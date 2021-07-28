import { RelatedTag } from '@empathyco/x-types-old';
import { Container } from 'inversify';
import { Dictionary, QueryableRequest } from '../../../types';
import { DEFAULT_EMPATHY_ADAPTER_CONFIG } from '../../config/empathy-adapter.config';
import { DEPENDENCIES } from '../../container/container.const';
import { RequestMapperContext } from '../../empathy-adapter.types';
import { EmpathyQueryableRequestMapper } from '../../mappers/request/empathy-queryable-request.mapper';
import { EmpathyRequestQueryMapper } from '../../mappers/request/params/empathy-request-query.mapper';
import { EmpathyRequestRelatedTagsQueryMapper } from '../../mappers/request/params/empathy-request-related-tags-query.mapper';

const container = new Container();

const relatedTagsMapper = new EmpathyRequestRelatedTagsQueryMapper();
const spiedRelatedTagsMapper = jest.spyOn(relatedTagsMapper, 'map');
container.bind(DEPENDENCIES.RequestMappers.Parameters.query).toConstantValue(relatedTagsMapper);

const queryMapper = new EmpathyRequestQueryMapper(DEFAULT_EMPATHY_ADAPTER_CONFIG);
const spiedQueryMapper = jest.spyOn(queryMapper, 'map');
container.bind(DEPENDENCIES.RequestMappers.Parameters.query).toConstantValue(queryMapper);

let mapper: EmpathyQueryableRequestMapper;
const emptyContext: RequestMapperContext = { feature: '', url: '', requestOptions: {} };

beforeEach(() => {
  container.snapshot();
  mapper = container.resolve(EmpathyQueryableRequestMapper);
  jest.clearAllMocks();
});

afterEach(() => container.restore());

it('Adds the query when passed', () => {
  const rawRequest: QueryableRequest & Dictionary<string> = { a: '1', b: '2', query: 'shirt' };
  const request: Dictionary<string> = {};
  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(request).toEqual({ a: '1', b: '2', q: 'shirt' });
  expect(rawRequest).not.toBe(request);
  expect(request).toBe(returnedRequest);
  expect(spiedQueryMapper).toHaveBeenCalledTimes(1);
});

it('Query mapper is not called when query is empty', () => {
  const rawRequest: QueryableRequest & Dictionary<string> = { a: '1', b: '2', query: '' };
  const request: Dictionary<string> = {};
  const returnedRequest = mapper.map(rawRequest, request, emptyContext);

  expect(rawRequest).not.toBe(request);
  expect(request).toBe(returnedRequest);
  expect(spiedQueryMapper).not.toHaveBeenCalled();
});

it('Maps related tags to query', () => {
  const relatedTags: RelatedTag[] = [
    { modelName: 'RelatedTag', tag: 'city', previous: 'lego', query: 'lego city', selected: true },
    { modelName: 'RelatedTag', tag: 'friends', previous: 'lego', query: 'lego friends', selected: true }
  ];
  // This const has an any type because TS don't understand the type QueryableRequest & Dictionary<string> :(
  const rawRequest: any = {
    query: 'lego',
    relatedTags: relatedTags,
    rows: '24'
  };
  const request: Dictionary<string> = {};
  mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toBe('lego city friends');
  expect(request.rows).toBeDefined();
  expect(spiedQueryMapper).toHaveBeenCalledTimes(1);
  expect(spiedRelatedTagsMapper).toHaveBeenCalledTimes(1);
});

it('Does not modify the query if no related tags are passed', () => {
  const query = 'lego';
  const rawRequest: QueryableRequest & Dictionary<string> = { query, origin: 'default' };
  const request: Dictionary<string> = {};
  mapper.map(rawRequest, request, emptyContext);

  expect(request.q).toBe(query);
  expect(request.origin).toBeDefined();
  expect(spiedQueryMapper).toHaveBeenCalledTimes(1);
  expect(spiedRelatedTagsMapper).toHaveBeenCalledTimes(1);
});

it('Does not call mappers if there is no query and neither related tags', () => {
  const rawRequest: QueryableRequest & Dictionary<string> = { query: '' };
  mapper.map(rawRequest, {}, emptyContext);

  expect(spiedQueryMapper).toHaveBeenCalledTimes(0);
  expect(spiedRelatedTagsMapper).toHaveBeenCalledTimes(0);
});
