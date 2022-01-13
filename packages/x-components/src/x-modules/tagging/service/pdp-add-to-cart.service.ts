import { Store } from 'vuex';
import { Result } from '@empathyco/x-types';
import { BrowserStorageService, StorageService } from '@empathyco/x-storage-service';
import { Logger, logger } from '@empathyco/x-logger';
import { RootXStoreState } from '../../../store/index';
import { XPlugin } from '../../../plugins/index';
import { PDPAddToCartService } from './types';

export class DefaultPDPAddToCartService implements PDPAddToCartService {
  protected logger: Logger;
  /**
   * Session id key to use as key in the storage.
   *
   * @public
   */
  public static readonly RESULT_CLICKED_ID_KEY = 'add-to-cart';

  /**
   * Global instance of the {@link PDPAddToCartService}.
   */
  public static instance: PDPAddToCartService = new DefaultPDPAddToCartService();

  public constructor(
    protected localStorageService: StorageService = new BrowserStorageService(localStorage, 'x'),
    protected sessionStorageService: StorageService = new BrowserStorageService(sessionStorage, 'x')
  ) {
    this.logger = logger.child(`[PDPAddToCartService]`);
  }

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store;
  }

  storeResultClicked(result: Result): void {
    const { clickedResultStorageKey, clickedResultStorageTTLMs } =
      this.store.state.x.tagging.config;

    let key = result[clickedResultStorageKey as keyof Result] as string;

    if (clickedResultStorageKey === 'url') {
      key = key.replace(/\+/g, '%20');
    }

    const storageKey = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${key}`;
    this.localStorageService.setItem(storageKey, result, clickedResultStorageTTLMs as number);
  }

  moveToSessionStorage(id: string): void {
    let clickedResultStorageKeyId: string;

    if (id === 'url') {
      // eslint-disable-next-line max-len
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${window.location.href}`;
    } else {
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }

    const result = this.localStorageService.getItem(clickedResultStorageKeyId);
    if (result) {
      this.sessionStorageService.setItem(clickedResultStorageKeyId, result);
      this.localStorageService.removeItem(clickedResultStorageKeyId);
    }
  }

  trackResult(id?: string | null): void {
    let clickedResultStorageKeyId: string;

    if (!id) {
      // eslint-disable-next-line max-len
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${window.location.href}`;
    } else {
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }

    const result = this.sessionStorageService.getItem(clickedResultStorageKeyId) as Result;
    if (result) {
      this.store.dispatch('x/tagging/trackPDPAddToCart', result);
    } else {
      this.logger.warn(`No result info found for ${clickedResultStorageKeyId}`);
    }
  }
}
