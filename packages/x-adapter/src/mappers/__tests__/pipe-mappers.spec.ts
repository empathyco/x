import { pipeMappers } from '../pipe-mappers';
import {
  decrement,
  double,
  raw,
  increment,
  toNumber,
  toString
} from './__mocks__/pipe-mappers.mocks';

describe('pipeMappers tests', () => {
  it('pipes a single mapper', () => {
    const pipedMappers = pipeMappers<number, number>(raw);
    expect(pipedMappers(1, {})).toBe(1);
  });

  it('pipes multiple mappers', () => {
    const pipedMappers = pipeMappers<number, number>(
      raw,
      double,
      decrement,
      increment,
      toString,
      toNumber
    );
    expect(pipedMappers(1, {})).toBe(1 * 2 - 1 + 1);
  });
});
