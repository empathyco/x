import { Decrement, Double, GetRaw, Increment } from '../__mocks__/pipe-mappers.mocks';
import { pipeMappers } from '../mappers/pipe-mappers';

it('pipes a single mapper', () => {
  const pipedMappers = pipeMappers(new GetRaw());
  expect(pipedMappers(1, 0, {})).toBe(1);
});
it('pipes multiple mappers', () => {
  const initial = 10;
  const pipedMappers = pipeMappers(new GetRaw(), new Decrement(), new Double(), new Increment());
  expect(pipedMappers(initial, 0, {})).toBe((initial - 1) * 2 + 1);
});
