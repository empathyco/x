import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XComponentBusAPI } from '../../../../plugins/x-plugin.types';
import { UrlParams } from '../../../../types/url-params';
import { baseSnippetConfig } from '../../../../views/base-config';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { initialUrlState } from '../../store/initial-state';
import { urlXModule } from '../../x-module';
import UrlHandler from '../url-handler.vue';

// Mock the window.performance.getEntriesByType function used to get the location. The location is
// tested in an E2E test as navigation between different pages is needed.
Object.defineProperty(window, 'performance', {
  value: {
    getEntriesByType: jest.fn().mockReturnValue([])
  }
});

/**
 * Renders the {@link UrlHandler} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link UrlHandler} component.
 */
function renderUrlHandler({
  template = `<UrlHandler />`,
  urlParams = ''
}: UrlHandlerOptions = {}): UrlHandlerAPI {
  const [, localVue] = installNewXPlugin({ initialXModules: [urlXModule] });
  setUrlParams(urlParams);
  const wrapperTemplate = mount(
    {
      template,
      components: { UrlHandler },
      provide: {
        snippetConfig: {
          ...baseSnippetConfig
        }
      }
    },
    { localVue }
  );
  const wrapper = wrapperTemplate.findComponent(UrlHandler);

  function setUrlParams(urlParams: string): void {
    const newUrl = new URL(window.location.href);
    newUrl.search = urlParams;
    window.history.replaceState(history.state, 'test', newUrl.href);
  }

  function popstateUrlWithParams(urlParams: string): void {
    setUrlParams(urlParams);
    window.dispatchEvent(new Event('popstate'));
  }

  return {
    wrapper,
    on: wrapperTemplate.vm.$x.on.bind(wrapperTemplate.vm.$x),
    emit: wrapperTemplate.vm.$x.emit.bind(wrapperTemplate.vm.$x),
    popstateUrlWithParams,
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

  it('emits the `ParamsLoadedFromUrl` when the component is created', () => {
    const { on } = renderUrlHandler({
      urlParams: 'query=lego&page=2&tag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    });
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl', true).subscribe(eventSpy);

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      eventPayload: {
        query: 'lego',
        page: 2,
        filter: ['brand:lego'],
        sort: 'price desc',
        scroll: '333',
        tag: ['marvel']
      } as UrlParams,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        feature: 'url'
      })
    });
  });

  it('emits the `ParamsLoadedFromUrl` when the browser history is navigated', () => {
    const { on, popstateUrlWithParams } = renderUrlHandler();
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    popstateUrlWithParams(
      'query=lego&page=2&tag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    );
    popstateUrlWithParams(
      'query=playmobil&page=3&tag=harry potter' +
        '&sort=price asc&scroll=444&filter=brand:playmobil'
    );

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      query: 'lego',
      page: 2,
      filter: ['brand:lego'],
      sort: 'price desc',
      scroll: '333',
      tag: ['marvel']
    } as UrlParams);

    expect(eventSpy).toHaveBeenNthCalledWith(3, {
      query: 'playmobil',
      page: 3,
      filter: ['brand:playmobil'],
      sort: 'price asc',
      scroll: '444',
      tag: ['harry potter']
    } as UrlParams);
  });
  it('emits the `ParamsLoadedFromUrl` initial state values for not present params', () => {
    const { on, popstateUrlWithParams } = renderUrlHandler();
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    popstateUrlWithParams('query=lego&page=2');
    popstateUrlWithParams('query=playmobil&page=3');

    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      ...initialUrlState,
      query: 'lego',
      page: 2
    } as UrlParams);

    expect(eventSpy).toHaveBeenNthCalledWith(3, {
      ...initialUrlState,
      query: 'playmobil',
      page: 3
    } as UrlParams);
  });

  it('ignores `extra params` that are not configured in the component', () => {
    const { on } = renderUrlHandler({
      template: '<UrlHandler store="store" />',
      urlParams: 'query=lego&page=2&warehouse=111&store=222'
    });
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...initialUrlState,
      query: 'lego',
      page: 2,
      store: '222'
    });
  });

  it('allows to configure the URL keys names', () => {
    const { on } = renderUrlHandler({
      template: '<UrlHandler query="q" page="p" />',
      urlParams: 'q=lego&p=2'
    });
    const eventSpy = jest.fn();
    on('ParamsLoadedFromUrl').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...initialUrlState,
      query: 'lego',
      page: 2
    });
  });

  it('changes the URL params when `PushableUrlStateChanged` is emitted', () => {
    const { emit, getCurrentUrlParams } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });
    emit('PushableUrlStateChanged', {
      ...initialUrlState,
      query: 'lego',
      page: 2,
      store: '111',
      warehouse: '222'
    });
    const urlSearchParams = getCurrentUrlParams();

    expect(urlSearchParams.get('query')).toEqual('lego');
    expect(urlSearchParams.get('page')).toEqual('2');
    expect(urlSearchParams.get('store')).toEqual('111');
    expect(urlSearchParams.get('warehouse')).toBeNull();
  });

  it('changes the URL params when `ReplaceableUrlStateChanged` is emitted', () => {
    const { emit, getCurrentUrlParams } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });
    emit('ReplaceableUrlStateChanged', {
      ...initialUrlState,
      query: 'lego',
      page: 2,
      store: '111',
      warehouse: '222'
    });
    const urlSearchParams = getCurrentUrlParams();

    expect(urlSearchParams.get('query')).toEqual('lego');
    expect(urlSearchParams.get('page')).toEqual('2');
    expect(urlSearchParams.get('store')).toEqual('111');
    expect(urlSearchParams.get('warehouse')).toBeNull();
  });

  it('normalizes + characters into %20 for spaces when updating the url', () => {
    const { emit } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });
    emit('PushableUrlStateChanged', {
      ...initialUrlState,
      query: 'lego city'
    });
    expect(window.location.href).toContain('query=lego%20city');

    emit('ReplaceableUrlStateChanged', {
      ...initialUrlState,
      query: 'lego farm'
    });
    expect(window.location.href).toContain('query=lego%20farm');
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
  popstateUrlWithParams: (urlParams: string) => void;
  /**
   * Returns the current {@link URLSearchParams}.
   */
  getCurrentUrlParams: () => URLSearchParams;
}

interface UrlHandlerOptions {
  /** The template to render. Receives the `params` via prop. */
  template?: string;
  /** The URL params to set in URL. */
  urlParams?: string;
}
