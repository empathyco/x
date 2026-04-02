import type { Result } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../store/index'
import type { ResultsEnrichmentService } from './services.types'
import { XPlugin } from '../plugins/index'

/**
 * Default implementation for the {@link ResultsEnrichmentService}.
 *
 * @public
 */
export class DefaultResultsEnrichmentService implements ResultsEnrichmentService {
  /**
   * Global instance of the {@link ResultsEnrichmentService}.
   */
  public static instance: ResultsEnrichmentService = new DefaultResultsEnrichmentService()

  public constructor() {}

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store
  }

  /**
   * Fetches the enrichment results.
   *
   * @param results - The results to fetch the enrichment results for.
   */
  async fetchResults(_: Result[]): Promise<any[]> {
    return []
  }

  /**
   * Updates the results with the enrichment results. Updates via mutation.
   *
   * @param results - The results to update.
   * @param enrichmentResults - The enrichment results to update the results with.
   */
  updateResults(_: Result[], __: any[]): void {}
}
