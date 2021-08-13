import { Dictionary } from '../../../types';
import { EmpathySimpleRequestMapper } from '../../mappers/request/empathy-simple-request.mapper';

it('Copies the parameters to a new object', () => {
  const mapper = new EmpathySimpleRequestMapper();
  const rawRequest: Dictionary<string> = { a: '1', b: '2' };
  const request: Dictionary<string> = {};
  const returnedRequest = mapper.map(rawRequest, request);
  expect(rawRequest).toEqual(request);
  expect(rawRequest).not.toBe(request);
  expect(request).toBe(returnedRequest);
});
