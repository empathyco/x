import { identityMapper } from '../identity.mapper';

describe('identityMapper tests', () => {
  it('maps an entity to itself', () => {
    const arrayEntity = [1, 2];
    const booleanEntity = true;
    const nullEntity = null;
    const numberEntity = 1;
    const objectEntity = { a: 1, b: 'patata' };
    const stringEntity = 'patata';
    const undefinedEntity = undefined;

    expect(identityMapper(arrayEntity)).toBe(arrayEntity);
    expect(identityMapper(booleanEntity)).toEqual(booleanEntity);
    expect(identityMapper(nullEntity)).toEqual(nullEntity);
    expect(identityMapper(numberEntity)).toEqual(numberEntity);
    expect(identityMapper(objectEntity)).toBe(objectEntity);
    expect(identityMapper(stringEntity)).toEqual(stringEntity);
    expect(identityMapper(undefinedEntity)).toEqual(undefinedEntity);
  });
});
