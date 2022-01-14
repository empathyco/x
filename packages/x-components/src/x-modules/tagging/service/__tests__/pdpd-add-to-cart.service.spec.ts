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

describe('testing pdp add to cart', () => {
  const { service, localStorageService, sessionStorageService, store } =
    preparePDPAddToCartService();

  const result = createResultStub('Product 001');

  const localGetItemSpy = jest.spyOn(localStorageService, 'getItem').mockReturnValue(result);
  const localSetItemSpy = jest.spyOn(localStorageService, 'setItem');
  const localRemoveItemSpy = jest.spyOn(localStorageService, 'removeItem');

  const sessionGetItemSpy = jest.spyOn(sessionStorageService, 'getItem').mockReturnValue(result);
  const sessionSetItemSpy = jest.spyOn(sessionStorageService, 'setItem');
  const storeDispatchSpy = jest.spyOn(store, 'dispatch');

  const url = 'http://localhost:8080/?param=test&param2=&param3=t+e+s+t';
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
    store.commit('x/tagging/setClickedResultStorageKey', 'id');
    store.commit('x/tagging/setClickedResultStorageTTL', 30000);

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${result.id}`, result, 30000);
  });

  it('stores the result using the url as id and ttl', () => {
    store.commit('x/tagging/setClickedResultStorageKey', 'url');
    store.commit('x/tagging/setClickedResultStorageTTL', 30);

    const encodedURL = `http://localhost:8080/?param=test&param2=&param3=t%20e%20s%20t`;
    result.url = url;

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${encodedURL}`, result, 30);

    result.url = 'http://localhost:8080/?param=test&param2=&param3=t e s t';

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(`add-to-cart-${encodedURL}`, result, 30);
  });

  it('moves the result to the session service', () => {
    service.moveToSessionStorage(result.id as string);
    let id = `add-to-cart-${result.id}`;
    expect(localGetItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);
    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);

    service.moveToSessionStorage('url');
    id = `add-to-cart-http://localhost:8080/?param=test&param2=&param3=t%20e%20s%20t`;
    expect(localGetItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);
    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);
  });

  it('dispatches the add to track tagging', () => {
    service.trackAddToCart();
    expect(sessionGetItemSpy).toHaveBeenCalledWith(
      `add-to-cart-http://localhost:8080/?param=test&param2=&param3=t%20e%20s%20t`
    );
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging.add2cart);

    const id = result.id as string;
    service.trackAddToCart(id);
    expect(sessionGetItemSpy).toHaveBeenCalledWith(`add-to-cart-${id}`);
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging.add2cart);
  });
});
