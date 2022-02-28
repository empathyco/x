import { createLocalVue } from '@vue/test-utils';
import { ComponentOptions, default as Vue, VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/x-plugin';
import { PrivateXModulesOptions, XModulesOptions } from '../../../plugins/x-plugin.types';
import { SearchAdapterDummy } from '../../../__tests__/adapter.dummy';
import { AnyXModule } from '../../../x-modules/x-modules.types';
import { InitWrapper, InstallXOptions } from '../types';
import { XInstaller } from '../x-installer';

describe('testing `XInstaller` utility', () => {
  const adapter = SearchAdapterDummy;
  const xPluginMock = { install: jest.fn() };
  const plugin = xPluginMock as unknown as XPlugin;
  const store = {} as unknown as Store<any>;
  const xModules = {} as unknown as XModulesOptions;
  const __PRIVATE__xModules = {} as unknown as PrivateXModulesOptions;
  const initialXModule = {} as unknown as AnyXModule;

  const component: ComponentOptions<Vue> = {
    render(h) {
      return h('div');
    },
    mounted: jest.fn()
  };

  const snippetConfig = {
    instance: 'test',
    lang: 'test',
    scope: 'test'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('installs the XPlugin with all the passed plugin parameters', () => {
    new XInstaller({
      adapter,
      plugin,
      store,
      xModules,
      __PRIVATE__xModules,
      initialXModules: [initialXModule],
      vue: createLocalVue()
    }).init(snippetConfig);
    const params = xPluginMock.install.mock.calls[0][1];

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);
    expect(params.adapter).toEqual(adapter);
    expect(params.store).toEqual(store);
    expect(params.xModules).toEqual(xModules);
    expect(params.initialXModules).toHaveLength(1);
    expect(params.initialXModules[0]).toEqual(initialXModule);
    expect(params.__PRIVATE__xModules).toEqual(__PRIVATE__xModules);
  });

  it('creates the public API in global scope by default', () => {
    delete window.X;
    new XInstaller({ adapter, plugin, vue: createLocalVue() }).init(snippetConfig);

    expect(window.X).toBeDefined();
    delete window.X;
  });

  it('does not create the public API passing the api parameter to false', () => {
    new XInstaller({ adapter, plugin, api: false, vue: createLocalVue() }).init(snippetConfig);

    expect(window.X).not.toBeDefined();
  });

  it('installs the XPlugin using the passed vue', () => {
    const localVue = createLocalVue();
    new XInstaller({ adapter, plugin, vue: localVue }).init(snippetConfig);
    const vueParam = xPluginMock.install.mock.calls[0][0];

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);
    expect(vueParam).toBe(localVue);
  });

  it('creates a Vue application using the component passed in the app option', async () => {
    await new XInstaller({ adapter, plugin, app: component, vue: createLocalVue() }).init(
      snippetConfig
    );

    // eslint-disable-next-line  @typescript-eslint/unbound-method
    expect(component?.mounted).toHaveBeenCalledTimes(1);
  });

  it('creates a Vue application using the `vueOptions` passed', async () => {
    const testMethod = jest.fn();
    const vue = createLocalVue();
    vue.use(VueRouter);
    const vueOptions: InstallXOptions['vueOptions'] = {
      router: new VueRouter({}),
      methods: { testMethod }
    };
    const { app } = (await new XInstaller({
      adapter,
      vue,
      vueOptions,
      app: component
    }).init(snippetConfig)) as InitWrapper;

    expect(app).toHaveProperty('testMethod');
    expect(app).toHaveProperty('$router');
  });

  it('allows to install more plugins', async () => {
    const vue = createLocalVue();
    const { app } = (await new XInstaller({
      adapter,
      vue,
      installExtraPlugins({ bus, vue, snippet }) {
        vue.use(VueRouter);
        return {
          // Installing the Vue Router plugin
          router: new VueRouter({}),
          data() {
            // Adding some data variables to check that we correctly receive them
            return {
              bus,
              snippet
            };
          }
        };
      },
      app: component
    }).init(snippetConfig)) as InitWrapper;

    expect(app).toHaveProperty('$router');
    expect(app).toHaveProperty('bus');
    expect(app).toHaveProperty('snippet', snippetConfig);
  });

  it('initializes the app with the provided snippet config', async () => {
    const vue = createLocalVue();
    const { app } = (await new XInstaller({
      adapter,
      vue,
      app: injectSnippetConfigComponent()
    }).init(snippetConfig)) as InitWrapper;

    expect(app?.$el).toHaveTextContent(snippetConfig.instance);

    snippetConfig.instance = 'test-2';
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('test-2');
  });

  it('initializes the app with the configured window.initX snippet config', async () => {
    const vue = createLocalVue();
    window.initX = snippetConfig;
    const { app } = (await new XInstaller({
      adapter,
      vue,
      app: injectSnippetConfigComponent()
    }).init()) as InitWrapper;

    expect(app?.$el).toHaveTextContent(snippetConfig.instance);

    snippetConfig.instance = 'test-2';
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('test-2');
  });

  // eslint-disable-next-line max-len
  it('does not initialize XComponents when no snippet config is passed and no window.initX is not defined', async () => {
    expect(await new XInstaller({ adapter, plugin, vue: createLocalVue() }).init()).toBeUndefined();
  });
});

/**
 * Creates a Vue component injecting the snippet config.
 *
 * @returns A Vue component with the injected snippet config.
 *
 * @internal
 */
function injectSnippetConfigComponent(): VueConstructor {
  return Vue.extend({
    inject: ['snippetConfig'],
    render(h) {
      // Vue does not provide type safety for inject
      const instance = (this as any).snippetConfig.instance;
      return h('h1', [instance]);
    }
  });
}
