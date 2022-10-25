import { InMemoryStorageService } from '@empathyco/x-storage-service';
import { Store } from 'vuex';
import { DefaultPDPAddToCartService } from '../pdp-add-to-cart.service';
import { XPlugin } from '../../../../plugins/index';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { taggingXModule } from '../../x-module';
import { RootXStoreState } from '../../../../store/index';
import { createResultStub } from '../../../../__stubs__/index';
import { TaggingConfig } from '../../config.types';

interface PDPAddToCartServiceTestAPI {
  service: DefaultPDPAddToCartService;
  localStorageService: InMemoryStorageService;
  sessionStorageService: InMemoryStorageService;
  store: Store<RootXStoreState>;
}

function preparePDPAddToCartService(): PDPAddToCartServiceTestAPI {
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

function commitTaggingConfig(
  store: Store<RootXStoreState>,
  taggingConfig: Partial<TaggingConfig>
): void {
  store.commit('x/tagging/setTaggingConfig', taggingConfig);
}

describe('testing pdp add to cart', () => {
  const { service, localStorageService, sessionStorageService, store } =
    preparePDPAddToCartService();

  const localSetItemSpy = jest.spyOn(localStorageService, 'setItem');
  const localRemoveItemSpy = jest.spyOn(localStorageService, 'removeItem');

  const sessionGetItemSpy = jest.spyOn(sessionStorageService, 'getItem');
  const sessionSetItemSpy = jest.spyOn(sessionStorageService, 'setItem');
  const storeDispatchSpy = jest.spyOn(store, 'dispatch');

  const productPathName = '/products/1234';
  const url = `http://localhost:8080${productPathName}?param=test`;
  const encodedURL = `http://localhost:8080${productPathName}?param=test&param3=t%20e%20s%20t`;
  const URLWithSpaces = `http://localhost:8080${productPathName}?param=t e st`;

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
    const clickedResultStorageKey = 'id';
    const clickedResultStorageTTLMs = 30000;
    commitTaggingConfig(store, {
      clickedResultStorageKey,
      clickedResultStorageTTLMs
    });

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(
      `add-to-cart-${result.id}`,
      result,
      clickedResultStorageTTLMs
    );
  });

  it('stores the result using the url as id and ttl', () => {
    const clickedResultStorageKey = 'url';
    const clickedResultStorageTTLMs = 30;
    commitTaggingConfig(store, { clickedResultStorageKey, clickedResultStorageTTLMs });

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(
      `add-to-cart-${productPathName}`,
      result,
      clickedResultStorageTTLMs
    );

    result.url = encodedURL;

    service.storeResultClicked(result);
    expect(localSetItemSpy).toHaveBeenCalledWith(
      `add-to-cart-${productPathName}`,
      result,
      clickedResultStorageTTLMs
    );
  });

  it('moves the result to the session service', () => {
    const clickedResultStorageKey = 'id';
    const clickedResultStorageTTLMs = 30000;
    commitTaggingConfig(store, { clickedResultStorageKey, clickedResultStorageTTLMs });

    service.storeResultClicked(result);
    service.moveToSessionStorage(result.id as string);
    let id = `add-to-cart-${result.id}`;

    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);

    commitTaggingConfig(store, { clickedResultStorageKey: 'url' });
    service.storeResultClicked(result);
    service.moveToSessionStorage();
    id = `add-to-cart-${productPathName}`;

    expect(localRemoveItemSpy).toHaveBeenCalledWith(id);
    expect(sessionSetItemSpy).toHaveBeenCalledWith(id, result);
  });

  it('dispatches the add to track tagging', () => {
    const clickedResultStorageKey = 'url';
    const clickedResultStorageTTLMs = 30000;
    commitTaggingConfig(store, { clickedResultStorageKey, clickedResultStorageTTLMs });
    service.storeResultClicked(result);
    service.moveToSessionStorage();
    service.trackAddToCart();

    expect(sessionGetItemSpy).toHaveBeenCalledWith(`add-to-cart-${productPathName}`);
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging?.add2cart);

    commitTaggingConfig(store, { clickedResultStorageKey: 'id', clickedResultStorageTTLMs });
    service.storeResultClicked(result);
    const id = result.id as string;
    service.moveToSessionStorage(id);
    service.trackAddToCart(id);

    expect(sessionGetItemSpy).toHaveBeenCalledWith(`add-to-cart-${id}`);
    expect(storeDispatchSpy).toHaveBeenCalledWith('x/tagging/track', result.tagging?.add2cart);
  });

  it('does not dispatch the add to track if result has no tagging', () => {
    commitTaggingConfig(store, {});
    service.storeResultClicked({ ...result, tagging: undefined });
    service.trackAddToCart();

    expect(storeDispatchSpy).not.toHaveBeenCalledWith('x/tagging/track', expect.anything());
  });
});
