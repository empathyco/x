import { InMemoryStorageService } from '@empathyco/x-storage-service';
import { Store } from 'vuex';
import { DefaultPDPAddToCartService } from '../pdp-add-to-cart.service';
import { XPlugin } from '../../../../plugins/index';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { taggingXModule } from '../../x-module';
import { RootXStoreState } from '../../../../store/index';
import { createResultStub } from '../../../../__stubs__/index';

interface PDPdAddToCartServiceTestAPI {
  service: DefaultPDPAddToCartService;
  localStorageService: InMemoryStorageService;
  sessionStorageService: InMemoryStorageService;
  store: Store<RootXStoreState>;
}

function preparePDPAddToCartService(): PDPdAddToCartServiceTestAPI {
  XPlugin.resetInstance();
  installNewXPlugin();
  XPlugin.registerXModule(taggingXModule);

  const store = XPlugin.store;
  const localStorageService = new InMemoryStorageService();
  const sessionStorageService = new InMemoryStorageService();
  const service = new DefaultPDPAddToCartService(localStorageService, sessionStorageService);

  return {
    service,
    localStorageService,
    sessionStorageService,
    store
  };
}

function commitClickResultStorageConfig(
  store: Store<RootXStoreState>,
  storageKey: string,
  ttl: number
): void {
  store.commit('x/tagging/setClickedResultStorageKey', storageKey);
  store.commit('x/tagging/setClickedResultStorageTTL', ttl);
}

describe('testing pdp add to cart', () => {
  const { service, localStorageService, sessionStorageService, store } =
    preparePDPAddToCartService();

  const localGetItemSpy = jest.spyOn(localStorageService, 'getItem');
  const localSetItemSpy = jest.spyOn(localStorageService, 'setItem');
  const localRemoveItemSpy = jest.spyOn(localStorageService, 'removeItem');

  const sessionGetItemSpy = jest.spyOn(sessionStorageService, 'getItem');
  const sessionSetItemSpy = jest.spyOn(sessionStorageService, 'setItem');
  const storeDispatchSpy = jest.spyOn(store, 'dispatch');

  const url = 'http://localhost:8080/?param=test&param2=&param3=t+e+s+t';
  const encodedURL = 'http://localhost:8080/?param=test&param2=&param3=t%20e%20s%20t';
  const URLWithSpaces = 'http://localhost:8080/?param=test&param2=&param3=t e s t';

  const result = createResultStub('Product 001', { url: URLWithSpaces });

  Object.defineProperty(window, 'location', {
    writable: true,
    value: new URL(url)
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageService.clear();
    sessionStorageService.clear();
  });

  it('stores the result with the id as key and ttl', () => {
    const storageKey = 'id';
    const ttl = 30000;
    commitClickResultStorageConfig(store, storageKey, ttl);

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${result.id}`, result, ttl);
  });

  it('stores the result using the url as id and ttl', () => {
    const storageKey = 'url';
    const ttl = 30;
    commitClickResultStorageConfig(store, storageKey, ttl);

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${encodedURL}`, result, ttl);

    result.url = encodedURL;

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${encodedURL}`, result, ttl);
  });

  it('moves the result to the session service', () => {
    const storageKey = 'id';
    const ttl = 30000;
    commitClickResultStorageConfig(store, storageKey, ttl);

    service.storeResultClicked(result);
    service.moveToSessionStorage(result.id as string);
    let id = `add-to-cart-${result.id}`;

    expect(localGetItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);
    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);

    store.commit('x/tagging/setClickedResultStorageKey', 'url');
    service.storeResultClicked(result);
    service.moveToSessionStorage('url');
    id = `add-to-cart-${encodedURL}`;

    expect(localGetItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);
    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);
  });

  it('dispatches the add to track tagging', () => {
    const storageKey = 'url';
    const ttl = 30000;
    commitClickResultStorageConfig(store, storageKey, ttl);
    service.storeResultClicked(result);
    service.moveToSessionStorage('url');
    service.trackAddToCart();

    expect(sessionGetItemSpy).toHaveBeenCalledWith(`add-to-cart-${encodedURL}`);
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging.add2cart);

    commitClickResultStorageConfig(store, 'url', ttl);
    service.storeResultClicked(result);
    const id = result.id as string;
    service.moveToSessionStorage(id);
    service.trackAddToCart(id);

    expect(sessionGetItemSpy).toHaveBeenCalledWith(`add-to-cart-${id}`);
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging.add2cart);
  });
});
