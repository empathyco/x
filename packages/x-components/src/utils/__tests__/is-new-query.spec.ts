import { isNewQuery } from '../is-new-query';

describe('testing hasQueryChanged util', () => {
  it('returns true when the new query changes by one word', () => {
    const newQuery = 'pantalon verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the new query changes by one word in a different position', () => {
    const newQuery = 'calcetin verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the query changes by one word in the middle of the query', () => {
    const newQuery = 'pantalones largos de pana azules';
    const previousQuery = 'pantalones cortos de pana azules';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the new query is empty but the previous is not', () => {
    const newQuery = '';
    const previousQuery = 'trousers';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the previous query is empty but the new is not', () => {
    const newQuery = 'trousers';
    const previousQuery = '';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns false when the new query has only one different word', () => {
    const newQuery = 'pantalon corto rojo';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has only one different word in a different position', () => {
    const newQuery = 'pantalon rojo corto';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has the same words but with less letters', () => {
    const newQuery = 'pantalon corto';
    const previousQuery = 'pantalones cortos';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
});
