import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XComponentBusAPI } from '../../../../plugins/x-plugin.types';
import { initialUrlState } from '../../store/module';
import { UrlParams } from '../../store/types';
import { urlXModule } from '../../x-module';
import { UrlHandler } from '../index';

/**
 * Renders the {@link UrlHandler} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link UrlHandler} component.
 */
function renderUrlHandler({ template = `<UrlHandler />` }: UrlHandlerOptions = {}): UrlHandlerAPI {
  const [, localVue] = installNewXPlugin({ initialXModules: [urlXModule] });

  const wrapperTemplate = mount({ template, components: { UrlHandler } }, { localVue });
  const wrapper = wrapperTemplate.findComponent(UrlHandler);

  function getUrlFunction(event: string) {
    return function (urlParams: string): void {
      const newUrl = new URL(window.location.href);
      newUrl.search = urlParams;
      window.history.replaceState(history.state, 'test', newUrl.href);
      window.dispatchEvent(new Event(event));
    };
  }

  return {
    wrapper,
    on: wrapperTemplate.vm.$x.on.bind(wrapperTemplate.vm.$x),
    emit: wrapperTemplate.vm.$x.emit.bind(wrapperTemplate.vm.$x),
    loadUrlWithParams: getUrlFunction('load'),
    popstateUrlWithParams: getUrlFunction('popstate'),
    getCurrentUrlParams(): URLSearchParams {
      return new URL(window.location.href).searchParams;
    }
  };
}

describe('testing UrlHandler component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderUrlHandler();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('url');
  });

  it('emits the `ParamsLoadedFromUrl` when the window is loaded', () => {
    const { on, loadUrlWithParams } = renderUrlHandler();
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    loadUrlWithParams(
      'query=lego&page=2&relatedTag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    );
    loadUrlWithParams(
      'query=playmobil&page=3&relatedTag=harry potter' +
        '&sort=price asc&scroll=444&filter=brand:playmobil'
    );

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      query: 'lego',
      page: 2,
      filter: ['brand:lego'],
      sort: 'price desc',
      scroll: 333,
      relatedTag: ['marvel']
    } as UrlParams);

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      query: 'playmobil',
      page: 3,
      filter: ['brand:playmobil'],
      sort: 'price asc',
      scroll: 444,
      relatedTag: ['harry potter']
    } as UrlParams);
  });

  it('emits the `ParamsLoadedFromUrl` when the browser history is navigated', () => {
    const { on, popstateUrlWithParams } = renderUrlHandler();
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    popstateUrlWithParams(
      'query=lego&page=2&relatedTag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    );
    popstateUrlWithParams(
      'query=playmobil&page=3&relatedTag=harry potter' +
        '&sort=price asc&scroll=444&filter=brand:playmobil'
    );

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      query: 'lego',
      page: 2,
      filter: ['brand:lego'],
      sort: 'price desc',
      scroll: 333,
      relatedTag: ['marvel']
    } as UrlParams);

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      query: 'playmobil',
      page: 3,
      filter: ['brand:playmobil'],
      sort: 'price asc',
      scroll: 444,
      relatedTag: ['harry potter']
    } as UrlParams);
  });
  it('emits the `ParamsLoadedFromUrl` initial state values for not present params', () => {
    const { on, popstateUrlWithParams } = renderUrlHandler();
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    popstateUrlWithParams('query=lego&page=2');
    popstateUrlWithParams('query=playmobil&page=3');

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...initialUrlState.params,
      query: 'lego',
      page: 2
    } as UrlParams);

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      ...initialUrlState.params,
      query: 'playmobil',
      page: 3
    } as UrlParams);
  });

  it('ignores `extra params` that are not configured in the component', () => {
    const { on, loadUrlWithParams } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    loadUrlWithParams('query=lego&page=2&warehouse=111&store=222');
    loadUrlWithParams('query=playmobil&page=3&warehouse=111');

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...initialUrlState.params,
      query: 'lego',
      page: 2,
      store: '222'
    });
    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      ...initialUrlState.params,
      query: 'playmobil',
      page: 3
    });
  });

  it('allows to configure the URL keys names', () => {
    const { on, loadUrlWithParams } = renderUrlHandler({
      template: '<UrlHandler query="q" page="p" />'
    });
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    loadUrlWithParams('q=lego&p=2');
    loadUrlWithParams('q=playmobil&p=3');

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...initialUrlState.params,
      query: 'lego',
      page: 2
    });
    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      ...initialUrlState.params,
      query: 'playmobil',
      page: 3
    });
  });

  it('changes the URL params when `PushableUrlStateChanged` is emitted', () => {
    const { emit, getCurrentUrlParams } = renderUrlHandler();
    emit('PushableUrlStateChanged', {
      ...initialUrlState.params,
      query: 'lego',
      page: 2,
      store: '111'
    });
    const urlSearchParams = getCurrentUrlParams();

    expect(urlSearchParams.get('query')).toEqual('lego');
    expect(urlSearchParams.get('page')).toEqual('2');
    expect(urlSearchParams.get('store')).toEqual('111');
  });

  it('changes the URL params when `ReplaceableUrlStateChanged` is emitted', () => {
    const { emit, getCurrentUrlParams } = renderUrlHandler();
    emit('ReplaceableUrlStateChanged', {
      ...initialUrlState.params,
      query: 'lego',
      page: 2,
      store: '111'
    });
    const urlSearchParams = getCurrentUrlParams();

    expect(urlSearchParams.get('query')).toEqual('lego');
    expect(urlSearchParams.get('page')).toEqual('2');
    expect(urlSearchParams.get('store')).toEqual('111');
  });
});

interface UrlHandlerAPI {
  /** Test wrapper of the {@link UrlHandler} instance. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
  /** The {@link XComponentBusAPI.emit} method to emit events. */
  emit: XComponentBusAPI['emit'];
  /**
   * Changes the current URL params with the passed as parameter.
   *
   * @param urlParams - The URL params in format string: `query=lego&page=1&scroll=100`.
   */
  loadUrlWithParams: (urlParams: string) => void;
  /**
   * Changes the current URL params with the passed as parameter.
   *
   * @param urlParams - The URL params in format string: `query=lego&page=1&scroll=100`.
   */
  popstateUrlWithParams: (urlParams: string) => void;

  /**
   * Returns the current {@link URLSearchParams}.
   */
  getCurrentUrlParams: () => URLSearchParams;
}

interface UrlHandlerOptions {
  /** The template to render. Receives the `params` via prop. */
  template?: string;
}
