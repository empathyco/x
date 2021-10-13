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
export function getRelatedTagsStub(amount = 9): RelatedTag[] {
  return Array.from({ length: amount }, (_, index) =>
    createRelatedTagStub('Related Tag', `Related Tag ${index + 1}`)
  );
}

/**
 * Function to create selected related tags stub.
 *
 * @returns Array of selected related tags stub.
 */
export function getSelectedRelatedTagsStub(): RelatedTag[] {
  return [createRelatedTagStub('Related Tag Query', `Related Tag`, { selected: true })];
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
    previous: 'previous',
    query,
    tag,
    selected: false,
    modelName: 'RelatedTag',
    ...relatedTag
  };
}
