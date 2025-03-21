import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { UrlParams } from '../../../../types';
import { baseSnippetConfig } from '../../../../views/base-config';
import { WireMetadata } from '../../../../wiring';
import { initialUrlState } from '../../store/initial-state';
import UrlHandler from '../url-handler.vue';

// Mock the window.performance.getEntriesByType function used to get the location. The location is
// tested in an E2E test as navigation between different pages is needed.
window.performance.getEntriesByType = jest.fn().mockReturnValue([]);

function setUrlParams(urlParams: string) {
  const newUrl = new URL(window.location.href);
  newUrl.search = urlParams;
  window.history.replaceState(history.state, 'test', newUrl.href);
}

function popstateUrlWithParams(urlParams: string) {
  setUrlParams(urlParams);
  window.dispatchEvent(new Event('popstate'));
}

/**
 * Renders the {@link UrlHandler} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the {@link UrlHandler} component.
 */
function renderUrlHandler({ template = `<UrlHandler />`, urlParams = '' } = {}) {
  setUrlParams(urlParams);

  const wrapperTemplate = mount(
    {
      template,
      components: { UrlHandler }
    },
    {
      global: {
        plugins: [installNewXPlugin({})],
        provide: { snippetConfig: { ...baseSnippetConfig } }
      }
    }
  );

  return {
    wrapper: wrapperTemplate.findComponent(UrlHandler),
    popstateUrlWithParams,
    getCurrentUrlParams: () => new URL(window.location.href).searchParams
  };
}

describe('testing UrlHandler component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderUrlHandler();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('url');
  });

  it('emits the `ParamsLoadedFromUrl` when the component is created', () => {
    renderUrlHandler({
      urlParams: 'query=lego&page=2&tag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    });

    const listener = jest.fn();
    XPlugin.bus.on('ParamsLoadedFromUrl', true).subscribe(listener);

    expect(listener).toHaveBeenNthCalledWith(1, {
      eventPayload: {
        query: 'lego',
        page: 2,
        prompt: -1,
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
    const { popstateUrlWithParams } = renderUrlHandler();

    const listener = jest.fn();
    XPlugin.bus.on('ParamsLoadedFromUrl').subscribe(listener);

    popstateUrlWithParams(
      'query=lego&page=2&tag=marvel&sort=price desc&scroll=333&filter=brand:lego'
    );
    popstateUrlWithParams(
      'query=playmobil&page=3&tag=harry potter' +
        '&sort=price asc&scroll=444&filter=brand:playmobil'
    );

    expect(listener).toHaveBeenNthCalledWith(2, {
      query: 'lego',
      page: 2,
      prompt: -1,
      filter: ['brand:lego'],
      sort: 'price desc',
      scroll: '333',
      tag: ['marvel']
    } as UrlParams);

    expect(listener).toHaveBeenNthCalledWith(3, {
      query: 'playmobil',
      page: 3,
      prompt: -1,
      filter: ['brand:playmobil'],
      sort: 'price asc',
      scroll: '444',
      tag: ['harry potter']
    } as UrlParams);
  });

  it('emits the `ParamsLoadedFromUrl` initial state values for not present params', () => {
    const { popstateUrlWithParams } = renderUrlHandler();

    const listener = jest.fn();
    XPlugin.bus.on('ParamsLoadedFromUrl').subscribe(listener);

    popstateUrlWithParams('query=lego&page=2');
    popstateUrlWithParams('query=playmobil&page=3');

    expect(listener).toHaveBeenNthCalledWith(2, {
      ...initialUrlState,
      query: 'lego',
      page: 2
    } as UrlParams);

    expect(listener).toHaveBeenNthCalledWith(3, {
      ...initialUrlState,
      query: 'playmobil',
      page: 3
    } as UrlParams);
  });

  it('ignores `extra params` that are not configured in the component', () => {
    renderUrlHandler({
      template: '<UrlHandler store="store" />',
      urlParams: 'query=lego&page=2&warehouse=111&store=222'
    });

    const listener = jest.fn();
    XPlugin.bus.on('ParamsLoadedFromUrl').subscribe(listener);

    expect(listener).toHaveBeenNthCalledWith(1, {
      ...initialUrlState,
      query: 'lego',
      page: 2,
      store: '222'
    });
  });

  it('allows to configure the URL keys names', () => {
    renderUrlHandler({
      template: '<UrlHandler query="q" page="p" />',
      urlParams: 'q=lego&p=2'
    });

    const listener = jest.fn();
    XPlugin.bus.on('ParamsLoadedFromUrl').subscribe(listener);

    expect(listener).toHaveBeenNthCalledWith(1, {
      ...initialUrlState,
      query: 'lego',
      page: 2
    });
  });

  it('changes the URL params when `PushableUrlStateUpdated` is emitted', () => {
    const { getCurrentUrlParams } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });

    XPlugin.bus.emit('PushableUrlStateUpdated', {
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

  it('changes the URL params when `ReplaceableUrlStateUpdated` is emitted', () => {
    const { getCurrentUrlParams } = renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });

    XPlugin.bus.emit('ReplaceableUrlStateUpdated', {
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
    renderUrlHandler({
      template: '<UrlHandler store="store" />'
    });

    XPlugin.bus.emit('PushableUrlStateUpdated', {
      ...initialUrlState,
      query: 'lego city'
    });

    expect(window.location.href).toContain('query=lego%20city');

    XPlugin.bus.emit('ReplaceableUrlStateUpdated', {
      ...initialUrlState,
      query: 'lego farm'
    });

    expect(window.location.href).toContain('query=lego%20farm');
  });

  it('ignores all parameters if query is not provided', () => {
    renderUrlHandler();

    XPlugin.bus.emit('PushableUrlStateUpdated', {
      page: 2,
      prompt: -1,
      filter: ['dry-aged:2-months'],
      sort: 'price desc',
      tag: ['frisona'],
      scroll: 'frisona-steak-1.5kg',
      query: ''
    });

    expect(new URL(window.location.href).searchParams.toString()).toEqual('');
  });
});
