import { createRelatedTagStub } from '../../__stubs__';
import { areRelatedTagsDifferent } from '../related-tags';

describe(`testing ${areRelatedTagsDifferent.name}`, () => {
  const expectedRelatedTag = createRelatedTagStub('cheese', 'someTag');

  it('returns true with different related tags', () => {
    expect(areRelatedTagsDifferent([expectedRelatedTag], ['anotherTag'])).toBe(true);
  });

  it('returns false with the same related tags', () => {
    expect(areRelatedTagsDifferent([expectedRelatedTag], ['someTag'])).toBe(false);
  });
});
