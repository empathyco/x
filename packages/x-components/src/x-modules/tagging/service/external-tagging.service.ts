import type { StorageService } from '@empathyco/x-storage-service'
import type { Result } from '@empathyco/x-types'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../store/index'
import type { ExternalTaggingService } from './types'
import { BrowserStorageService } from '@empathyco/x-storage-service'
import { XPlugin } from '../../../plugins/index'

/**
 * Default implementation for the {@link ExternalTaggingService}.
 *
 * @public
 */
export class DefaultExternalTaggingService implements ExternalTaggingService {
  /**
   * Session id key to use as key in the storage for result clicks.
   *
   * @public
   */
  public static readonly RESULT_CLICKED_ID_KEY = 'add-to-cart'

  /**
   * Session id key to use as key in the storage for add to carts.
   *
   * @public
   */
  public static readonly ADD_TO_CART_ID_KEY = 'checkout'

  /**
   * Global instance of the {@link ExternalTaggingService}.
   */
  public static instance: ExternalTaggingService = new DefaultExternalTaggingService()

  public constructor(
    protected localStorageService: StorageService = new BrowserStorageService(localStorage, 'x'),
    protected sessionStorageService: StorageService = new BrowserStorageService(
      sessionStorage,
      'x',
    ),
  ) {}

  protected get store(): Store<RootXStoreState> {
    return XPlugin.store
  }

  protected get storageKey(): string {
    return this.store.state.x.tagging.config.storageKey as string
  }

  protected get storageTTLMs(): number {
    return this.store.state.x.tagging.config.storageTTLMs as number
  }

  /**
   * Stores in the local storage the information from the Result clicked by the user
   * in order to be able to track the add to cart later on the result's PDP.
   *
   * @param result - The result to store.
   *
   * @public
   */
  storeResultClicked(result: Result): void {
    const key = result[this.storageKey as keyof Result] as string
    const storageId = this.getStorageId(DefaultExternalTaggingService.RESULT_CLICKED_ID_KEY, key)
    if (storageId) {
      this.localStorageService.setItem(storageId, result, this.storageTTLMs)
    }
  }

  /**
   * Stores in the local storage the information from the Result added to the cart
   * by the user in order to be able to track the checkout later on when the checkout
   * process has been completed by shopper.
   *
   * @param result - The result to store.
   *
   * @public
   */
  storeAddToCart(result: Result): void {
    const key = result[this.storageKey as keyof Result] as string
    const storageId = this.getStorageId(DefaultExternalTaggingService.ADD_TO_CART_ID_KEY, key)
    if (storageId) {
      this.localStorageService.setItem(storageId, result, this.storageTTLMs)
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
    const storageId = this.getStorageId(DefaultExternalTaggingService.RESULT_CLICKED_ID_KEY, id)
    if (storageId) {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const result = this.localStorageService.removeItem(storageId)
      if (result) {
        this.sessionStorageService.setItem(storageId, result)
      }
    }
  }

  /**
   * Checks if the session storage contains a result information for a given id or the current url.
   * If exists, it tracks the add to cart and saves the add to cart information into session
   * storage.
   *
   * @param id - The id of the result to track.
   *
   * @public
   */
  trackAddToCart(id?: string): void {
    const storageId =
      this.storageKey === 'url'
        ? this.getStorageId(DefaultExternalTaggingService.RESULT_CLICKED_ID_KEY)
        : this.getStorageId(DefaultExternalTaggingService.RESULT_CLICKED_ID_KEY, id)
    if (storageId) {
      const result = this.sessionStorageService.getItem<Result>(storageId)
      if (result?.tagging?.add2cart) {
        result.tagging.add2cart.params.location = 'pdp'
        void this.store.dispatch('x/tagging/track', result.tagging.add2cart)
        /**
         * Done after tracking the add to cart to avoid tracking the checkout without
         * an add to cart, in case the tracking fails.
         */
        this.storeAddToCart(result)
      }
    }
  }

  /**
   * Calculates the browser storage key for the given id.
   *
   * @param keyPrefix - The key prefix to use in the storage.
   * @param id - The id to be used for the storage key.
   *
   * @returns The complete key to be used for storage.
   *
   * @internal
   */
  protected getStorageId(keyPrefix: string, id?: string): string | null {
    if (this.storageKey === 'url') {
      let url = id ?? window.location.href
      url = url.replace(/\s|\+/g, '%20')
      const pathName = this.getPathName(url)
      return `${keyPrefix}-${pathName}`
    } else if (id) {
      return `${keyPrefix}-${id}`
    } else {
      this.showWarningMessage()
      return null
    }
  }

  /**
   * Logs a warning message in case the tracking cannot be done.
   *
   * @internal
   */
  protected showWarningMessage(): void {
    if (this.storageKey !== 'url') {
      console.warn('No product id was provided but the storage was not configured to use the url')
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
    let urlObject: URL
    try {
      // Check if the url is relative or absolute path
      // eslint-disable-next-line regexp/no-unused-capturing-group
      if (/^(\.\.\/|\.\/|\/)/.test(url)) {
        urlObject = new URL(url, location.origin)
      } else {
        urlObject = new URL(url)
      }
      return urlObject.pathname
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_error) {
      console.warn(`There was a problem with url ${url}`)
      return url
    }
  }
}
