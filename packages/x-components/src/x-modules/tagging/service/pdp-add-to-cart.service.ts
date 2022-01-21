import { Store } from 'vuex';
import { Result } from '@empathyco/x-types';
import { BrowserStorageService, StorageService } from '@empathyco/x-storage-service';
import { RootXStoreState } from '../../../store/index';
import { XPlugin } from '../../../plugins/index';
import { PDPAddToCartService } from './types';

/**
 * Default implementation for the {@link PDPAddToCartService}.
 *
 * @public
 */
export class DefaultPDPAddToCartService implements PDPAddToCartService {
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
  ) {}

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store;
  }

  protected get clickedResultStorageKey(): string {
    return this.store.state.x.tagging.config.clickedResultStorageKey as string;
  }

  protected get clickedResultStorageTTLMs(): number {
    return this.store.state.x.tagging.config.clickedResultStorageTTLMs as number;
  }

  /**
   * Stores in the local storage the information from the Result clicked by the user
   * in order to be able to track later on.
   *
   * @param result - The result to store.
   */
  storeResultClicked(result: Result): void {
    const key = result[this.clickedResultStorageKey as keyof Result] as string;
    const storageId = this.getStorageId(key);
    this.localStorageService.setItem(storageId, result, this.clickedResultStorageTTLMs);
  }

  /**
   * Checks if the local storage contains a result information for the given id and moves
   * the result info from the local storage to the session storage.
   *
   * @param id - The id of the result to move to the session storage.
   */
  moveToSessionStorage(id: string): void {
    const storageKey = this.getStorageId(id);
    const result = this.localStorageService.removeItem(storageKey);
    if (result) {
      this.sessionStorageService.setItem(storageKey, result);
    }
  }

  /**
   * Checks if the session storage contains a result information for given id or the current url
   * and tracks the add to cart if exists.
   *
   * @param id - The id of the result to track.
   */
  trackAddToCart(id?: string | null): void {
    const storageId = this.getStorageId(id ?? 'url');
    const result = this.sessionStorageService.getItem(storageId) as Result;
    if (result) {
      this.store.dispatch('x/tagging/track', result.tagging.add2cart);
    } else {
      this.showWarningMessage(storageId, id);
    }
  }

  private getStorageId(id: string): string {
    if (this.clickedResultStorageKey === 'url') {
      const url =
        id === 'url' ? window.location.href.replace(/\s|\+/g, '%20') : id.replace(/\s|\+/g, '%20');
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${url}`;
    } else {
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }
  }

  private showWarningMessage(storageId: string, id?: string | null): void {
    //TODO: add here logger
    //eslint-disable-next-line no-console
    console.warn(`No result info found for ${storageId}`);
    if (!id && this.clickedResultStorageKey !== 'url') {
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn('No product id was provided but the storage was not configured to use the url');
    }
  }
}
