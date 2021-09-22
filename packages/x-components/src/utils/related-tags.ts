import { RelatedTag } from '@empathyco/x-types';

/**
 * Compares if two lists contains the same related tags.
 *
 * @param someRelatedTags RelatedTag[] - A list of related tags to compare.
 * @param anotherRelatedTags - Another list of related tags to compare.
 *
 * @returns True if the two lists of filters are equal, which means that they have the same
 * related tags. The position of the related tag does not matter for this check.
 *
 * @public
 */
export function areRelatedTagsDifferent(someRelatedTags: RelatedTag[], anotherRelatedTags: string[]): boolean {
  return (
    someRelatedTags.length !== anotherRelatedTags.length ||
    someRelatedTags.some(relatedTag => !anotherRelatedTags.find(otherRelatedTag => otherRelatedTag === relatedTag.tag))
  );
}
