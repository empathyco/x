import { RelatedTag } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#RelatedTag | related tags} stub.
 *
 * @param amount - Number of stubbed related tags to create.
 *
 * @returns Array of related tags stub.
 *
 * @internal
 */
export function getRelatedTagsStub(amount = 12): RelatedTag[] {
  return Array.from({ length: amount }, (_, index) =>
    createRelatedTagStub('Related Tag', `Related Tag ${index + 1}`)
  );
}

/**
 * Creates a related tag stub with the provided options.
 *
 * @param query - The query of the related tag.
 * @param tag - The related tag.
 * @param relatedTag - An optional object with fields to override the related tag.
 *
 * @returns A related tag.
 */
export function createRelatedTagStub(
  query: string,
  tag: string,
  relatedTag?: Partial<RelatedTag>
): RelatedTag {
  return {
    query,
    tag,
    modelName: 'RelatedTag',
    ...relatedTag
  };
}
