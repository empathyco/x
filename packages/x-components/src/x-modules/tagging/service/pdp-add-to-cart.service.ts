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
    if (storageId) {
      this.localStorageService.setItem(storageId, result, this.clickedResultStorageTTLMs);
    }
  }

  /**
   * Checks if the local storage contains a result information for the given id and moves
   * the result info from the local storage to the session storage.
   *
   * @param id - The id of the result to move to the session storage.
   *
   * @public
   */
  moveToSessionStorage(id?: string): void {
    const storageId = this.getStorageId(id);
    if (storageId) {
      const result = this.localStorageService.removeItem(storageId);
      if (result) {
        this.sessionStorageService.setItem(storageId, result);
      }
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
  trackAddToCart(id?: string): void {
    const storageId =
      this.clickedResultStorageKey === 'url' ? this.getStorageId() : this.getStorageId(id);
    if (storageId) {
      const result = this.sessionStorageService.getItem<Result>(storageId);
      if (result?.tagging?.add2cart) {
        result.tagging.add2cart.params.location = 'pdp';
        this.store.dispatch('x/tagging/track', result.tagging.add2cart);
      }
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
  protected getStorageId(id?: string): string | null {
    if (this.clickedResultStorageKey === 'url') {
      let url = id ?? window.location.href;
      url = url.replace(/\s|\+/g, '%20');
      const pathName = this.getPathName(url);
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${pathName}`;
    } else if (id) {
      return `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    } else {
      this.showWarningMessage();
      return null;
    }
  }

  /**
   * Logs a warning message in case the tracking cannot be done.
   *
   * @internal
   */
  protected showWarningMessage(): void {
    if (this.clickedResultStorageKey !== 'url') {
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
    let urlObject: URL;
    try {
      // Check if the url is relative or absolute path
      if (/^(\.\.\/|\.\/|\/)/.test(url)) {
        urlObject = new URL(url, location.origin);
      } else {
        urlObject = new URL(url);
      }
      return urlObject.pathname;
    } catch (e) {
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn(`There was a problem with url ${url}`);
      return url;
    }
  }
}
