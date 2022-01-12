import { Store } from 'vuex';
import { Result } from '@empathyco/x-types';
import { BrowserStorageService, StorageService } from '@empathyco/x-storage-service';
import { RootXStoreState } from '../../../store/index';
import { XBus, XPlugin } from '../../../plugins/index';
import { PDPAddToCartService } from './types';

export class DefaultPDPAddToCartService implements PDPAddToCartService {
  /**
   * Session id key to use as key in the storage.
   *
   * @public
   */
  public static readonly RESULT_CLICKED_ID_KEY = 'clicked-result';

  /**
   * Global instance of the {@link PDPAddToCartService}.
   */
  public static instance: PDPAddToCartService = new DefaultPDPAddToCartService();

  public constructor(
    protected localStorageService: StorageService = new BrowserStorageService(localStorage, 'x'),
    protected sessionStorageService: StorageService = new BrowserStorageService(sessionStorage, 'x')
  ) {}

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store;
  }

  protected get bus(): XBus {
    return XPlugin.bus;
  }

  storeResultClicked(result: Result): void {
    const { clickedResultStorageKey, clickedResultStorageTTLMs } =
      this.store.state.x.tagging.config;

    const key = result[clickedResultStorageKey as keyof Result];
    const storageKey = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${key as string}`;
    this.localStorageService.setItem(storageKey, result, clickedResultStorageTTLMs as number);
  }

  moveToSessionStorage(id: string | null): void {
    if (!id) {
      // TODO use url as fallback
      return;
    }
    const clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    const result = this.localStorageService.getItem(clickedResultStorageKeyId);

    if (result) {
      this.sessionStorageService.setItem(clickedResultStorageKeyId, result);
      this.localStorageService.removeItem(clickedResultStorageKeyId);
    }
  }

  trackResult(id?: string | null): void {
    if (!id) {
      // TODO use url has fallback
      return;
    }
    const clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    const result = this.sessionStorageService.getItem(clickedResultStorageKeyId) as Result;
    if (result) {
      this.bus.emit('UserClickedResultAddToCart', result);
    }
  }
}
