import { EmpathyAdapterConfig } from '../../config/empathy-adapter-config.types';
import { EmpathyRequestQueryMapper } from '../../mappers/request/params/empathy-request-query.mapper';

it('Cuts the query if it has too many words', () => {
  const query = 'This is a very long long query with lots of words';
  const config = { mappings: { query: { maxWords: 5, maxLength: 1000 } } } as EmpathyAdapterConfig;
  const mapper = new EmpathyRequestQueryMapper(config);

  const mappedQuery = mapper.map('This is unused', query);

  expect(mappedQuery).toBe('This is a very long');
});

it('Cuts the query if it has too many characters', () => {
  const query = 'This is a very long long query with lots of words';
  const config = { mappings: { query: { maxWords: 1000, maxLength: 4 } } } as EmpathyAdapterConfig;
  const mapper = new EmpathyRequestQueryMapper(config);

  const mappedQuery = mapper.map('This is unused', query);

  expect(mappedQuery).toBe('This');
});
