import { PartialResult } from '@empathy/search-types';
import { createResultStub } from './results-stubs.factory';

/**
 * Function to create partial results stub.
 *
 * @returns Array of partial results stub.
 */
export function getPartialResultsStub(): PartialResult[] {
  return [
    {
      facets: [],
      query: 'lego camion',
      totalResults: 10,
      results: [createResultStub('lego camion')]
    },
    {
      facets: [],
      query: 'camion rojo',
      totalResults: 8,
      results: [createResultStub('camion rojo')]
    }
  ];
}
