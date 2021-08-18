import { RelatedTag } from '@empathyco/x-types';

/**
 * Function to create related tags stub.
 *
 * @returns Array of related tags stub.
 */
export function getRelatedTagsStub(): RelatedTag[] {
  return [
    {
      previous: 'lego city',
      query: 'lego city marvel',
      selected: false,
      tag: 'marvel',
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
    },
    {
      previous: 'lego city',
      query: 'lego city marvel',
      selected: false,
      tag: 'barbie',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city bombero',
      selected: false,
      tag: 'coche',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city ambulancia',
      selected: false,
      tag: 'thor',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city marvel',
      selected: false,
      tag: 'bob',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city bombero',
      selected: false,
      tag: 'esponja',
      modelName: 'RelatedTags'
    },
    {
      previous: 'lego city',
      query: 'lego city ambulancia',
      selected: false,
      tag: 'ben',
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

/**
 * Creates a related tag stub with the provided options. If the name is the only property provided,
 * it will be used to generate the facets, query, totalResults, results and modelName.
 *
 * @param query - The query of the related tag.
 * @param tag - The related tag.
 * @param selected - An boolean if the RT is selected.
 * @param previous - An string with the previous RT.
 * @param relatedTag - An optional object with fields to override the related tag.
 *
 * @returns A related tag.
 */
export function createRelatedTagStub(
  query: string,
  tag: string,
  selected: boolean,
  previous: string,
  relatedTag?: RelatedTag
): RelatedTag {
  return {
    previous,
    query,
    selected,
    tag,
    modelName: 'RelatedTags',
    ...relatedTag
  };
}
