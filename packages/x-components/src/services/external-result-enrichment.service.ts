import type { Result } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../store/index'
import type { ExternalResultEnrichmentService } from './services.types'
import { XPlugin } from '../plugins/index'

/**
 * Default implementation for the {@link ExternalResultEnrichmentService}.
 *
 * @public
 */
export class DefaultExternalResultEnrichmentService implements ExternalResultEnrichmentService {
  /**
   * Global instance of the {@link ExternalResultEnrichmentService}.
   */
  public static instance: ExternalResultEnrichmentService =
    new DefaultExternalResultEnrichmentService()

  public constructor() {}

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store
  }

  async fetchExternalResults(_: Result[]): Promise<any[]> {
    // eslint-disable-next-line no-console
    console.log('defaultfetchExternalResults', _)
    return Promise.resolve([])
  }

  updateResultsFromEnrichment(_: Result[], __: any[]): void {
    // eslint-disable-next-line no-console
    console.log('defaultupdateResultsFromEnrichment', _, __)
  }
}
