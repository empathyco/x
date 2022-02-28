import { createLocalVue } from '@vue/test-utils';
import { SearchAdapterDummy } from '../../../__tests__/adapter.dummy';
import { BaseXBus } from '../../../plugins/x-bus';
import { XInstaller } from '../../x-installer/x-installer';
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
    const snippetConfig = {
      instance: 'test',
      scope: 'test',
      lang: 'es'
    };
    const installerApp = vue.extend({
      inject: ['snippetConfig'],
      render(h) {
        // Vue does not provide type safety for inject
        const lang = (this as any).snippetConfig.lang;
        return h('h1', [lang]);
      }
    });

    const { api, app } = await new XInstaller({
      adapter: SearchAdapterDummy,
      api: defaultXAPI,
      app: installerApp
    }).init(snippetConfig);

    expect(app?.$el).toHaveTextContent(snippetConfig.lang);
    api?.setSnippetConfig({ lang: 'en' });
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('en');
  });
});
