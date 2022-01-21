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

  /**
   * Stores in the local storage the information from the Result clicked by the user
   * in order to be able to track later on.
   *
   * @param result - The result to store.
   */
  storeResultClicked(result: Result): void {
    const { clickedResultStorageKey, clickedResultStorageTTLMs } =
      this.store.state.x.tagging.config;

    let key = result[clickedResultStorageKey as keyof Result] as string;

    if (clickedResultStorageKey === 'url') {
      key = key.replace(/\s|\+/g, '%20');
    }

    const storageKey = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${key}`;
    this.localStorageService.setItem(storageKey, result, clickedResultStorageTTLMs as number);
  }

  /**
   * Checks if the local storage contains a result information for the given id and moves
   * the result info from the local storage to the session storage.
   *
   * @param id - The id of the result to move to the session storage.
   */
  moveToSessionStorage(id: string): void {
    let clickedResultStorageKeyId: string;

    if (id === 'url') {
      const url = window.location.href.replace(/\s|\+/g, '%20');
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${url}`;
    } else {
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }

    const result = this.localStorageService.getItem(clickedResultStorageKeyId);
    if (result) {
      this.sessionStorageService.setItem(clickedResultStorageKeyId, result);
      this.localStorageService.removeItem(clickedResultStorageKeyId);
    }
  }

  /**
   * Checks if the session storage contains a result information for given id or the current url
   * and tracks the add to cart if exists.
   *
   * @param id - The id of the result to track.
   */
  trackAddToCart(id?: string | null): void {
    let clickedResultStorageKeyId: string;

    if (!id) {
      const url = window.location.href.replace(/\s|\+/g, '%20');
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${url}`;
    } else {
      clickedResultStorageKeyId = `${DefaultPDPAddToCartService.RESULT_CLICKED_ID_KEY}-${id}`;
    }

    const result = this.sessionStorageService.getItem(clickedResultStorageKeyId) as Result;
    if (result) {
      this.store.dispatch('x/tagging/track', result.tagging.add2cart);
    } else {
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn(`No result info found for ${clickedResultStorageKeyId}`);

      const { clickedResultStorageKey } = this.store.state.x.tagging.config;
      if (!id && clickedResultStorageKey !== 'url') {
        //TODO: add here logger
        //eslint-disable-next-line no-console
        console.warn(
          'No product id was provided but the storage was not configured to use the url'
        );
      }
    }
  }
}
