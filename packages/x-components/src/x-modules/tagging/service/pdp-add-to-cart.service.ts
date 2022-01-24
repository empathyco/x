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
   *
   * @public
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
   *
   * @public
   */
  moveToSessionStorage(id: string): void {
    const productId = id === 'url' ? window.location.href : id;
    const storageKey = this.getStorageId(productId);
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
   *
   * @public
   */
  trackAddToCart(id?: string | null): void {
    const productId = id ? id : window.location.href;
    const storageId = this.getStorageId(productId);
    const result = this.sessionStorageService.getItem(storageId) as Result;
    if (result) {
      this.store.dispatch('x/tagging/track', result.tagging.add2cart);
    } else {
      this.showWarningMessage(storageId, id);
    }
  }

  /**
   * Calculates the browser storage key for the given id.
   *
   * @param id - The id to be used for the storage key.
   *
   * @returns The complete key to be used for storage.
   *
   * @internal
   */
  protected getStorageId(id: string): string {
    if (this.clickedResultStorageKey === 'url') {
      const url = id.replace(/\s|\+/g, '%20');
      const pathName = this.getPathName(url);
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${pathName}`;
    } else {
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }
  }

  /**
   * Logs a warning message in case the tracking cannot be done.
   *
   * @param storageId - The browser storage key used.
   * @param id - The product id to track.
   *
   * @internal
   */
  protected showWarningMessage(storageId: string, id?: string | null): void {
    //TODO: add here logger
    //eslint-disable-next-line no-console
    console.warn(`No result info found for ${storageId}`);
    if (!id && this.clickedResultStorageKey !== 'url') {
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn('No product id was provided but the storage was not configured to use the url');
    }
  }

  /**
   * Returns the pathname for a given url.
   *
   * @param url - The url to get the pathname from.
   *
   * @returns The pathname of the url.
   *
   * @internal
   */
  protected getPathName(url: string): string {
    let _url: URL;
    try {
      if (/^(\.\.\/|\.\/|\/)/.test(url)) {
        _url = new URL(url, location.origin);
      } else {
        _url = new URL(url);
      }
      return _url.pathname;
    } catch (e) {
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn(`There was a problem with url ${url}`);
      return url;
    }
  }
}
