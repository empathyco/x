import { RelatedTag } from '@empathy/search-types';

/**
 * Function to create related tags stub.
 *
 * @returns Array of related tags stub.
 */
export function getRelatedTagsStub(): RelatedTag[] {
  return [
    {
      previous: 'lego city',
      query: 'lego city policia',
      selected: false,
      tag: 'policia',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city bombero',
      selected: false,
      tag: 'bombero',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city ambulancia',
      selected: false,
      tag: 'ambulancia',
      modelName: 'RelatedTags'
    }
  ];
}

/**
 * Function to create selected related tags stub.
 *
 * @returns Array of selected related tags stub.
 */
export function getSelectedRelatedTagsStub(): RelatedTag[] {
  return [
    {
      previous: 'lego',
      query: 'lego city',
      selected: true,
      tag: 'city',
      modelName: 'RelatedTags'
    }
  ];
}
