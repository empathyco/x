import { createLocalVue } from '@vue/test-utils';
import { XComponentsAdapterDummy } from '../../../__tests__/adapter.dummy';
import { BaseXBus } from '../../../plugins/x-bus';
import { XInstaller } from '../../x-installer/x-installer';
import { SnippetConfig } from '../api.types';
import { BaseXAPI } from '../base-api';

describe('testing default X API', () => {
  const defaultXAPI = new BaseXAPI();
  const bus = new BaseXBus();
  defaultXAPI.setBus(bus);
  const query = 'maserati';

  it('should emit `UserAcceptedAQuery` through the `search` function', () => {
    const listener = jest.fn();
    bus.on('UserAcceptedAQuery').subscribe(listener);

    defaultXAPI.search(query);

    expect(listener).toHaveBeenCalledWith(query);
  });

  it('should emit `UserClickedPDPAddToCart` through the `addProductToCart` function', () => {
    const listener = jest.fn();
    bus.on('UserClickedPDPAddToCart').subscribe(listener);

    defaultXAPI.addProductToCart();

    expect(listener).toHaveBeenCalledTimes(1);

    const productId = '123abc';
    defaultXAPI.addProductToCart(productId);
    expect(listener).toHaveBeenCalledWith(productId);
  });

  it('changes the `SnippetConfig` when calling the `setSnippetConfig` function', async () => {
    const vue = createLocalVue();
    const snippetConfig: SnippetConfig = {
      instance: 'test',
      scope: 'test',
      lang: 'es'
    };
    const installerApp = vue.extend({
      inject: ['snippetConfig'],
      render(h) {
        // Vue does not provide type safety for inject
        const lang = (this as any).snippetConfig.lang;
        const store = (this as any).snippetConfig.store;
        return h('div', [
          h('h1', { class: 'lang-test' }, [lang]),
          h('h1', { class: 'store-test' }, [store])
        ]);
      }
    });

    const { api, app } = await new XInstaller({
      adapter: XComponentsAdapterDummy,
      api: defaultXAPI,
      app: installerApp
    }).init(snippetConfig);

    const langElement = app?.$el.getElementsByClassName('lang-test')[0];
    const storeElement = app?.$el.getElementsByClassName('store-test')[0];

    expect(langElement).toHaveTextContent(snippetConfig.lang);
    api?.setSnippetConfig({ lang: 'en' });
    await vue.nextTick();
    expect(langElement).toHaveTextContent('en');

    expect(storeElement).toHaveTextContent('');
    api?.setSnippetConfig({ store: 'Portugal' });
    await vue.nextTick();
    expect(storeElement).toHaveTextContent('Portugal');
  });
});
