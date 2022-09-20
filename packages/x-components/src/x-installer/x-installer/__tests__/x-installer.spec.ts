import { createLocalVue } from '@vue/test-utils';
import { ComponentOptions, default as Vue, VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import { Store } from 'vuex';
import { XPlugin } from '../../../plugins/x-plugin';
import { PrivateXModulesOptions, XModulesOptions } from '../../../plugins/x-plugin.types';
import { XComponentsAdapterDummy } from '../../../__tests__/adapter.dummy';
import { AnyXModule } from '../../../x-modules/x-modules.types';
import { InitWrapper, InstallXOptions } from '../types';
import { XInstaller } from '../x-installer';
import { SnippetConfig } from '../../api/index';

describe('testing `XInstaller` utility', () => {
  const adapter = XComponentsAdapterDummy;
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

  const getMinimumSnippetConfig = (): SnippetConfig => ({
    instance: 'test',
    lang: 'test',
    scope: 'test'
  });

  /**
   * Creates a Vue component injecting the snippet config.
   *
   * @param snippetProperty
   * @returns A Vue component with the injected snippet config.
   *
   * @internal
   */
  function createSnippetConfigComponent(
    snippetProperty: keyof SnippetConfig = 'instance'
  ): VueConstructor {
    return Vue.extend({
      inject: ['snippetConfig'],
      render(h) {
        return h('h1', [(this as any).snippetConfig[snippetProperty]]);
      }
    });
  }

  beforeEach(() => {
    delete window.initX;
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
    }).init(getMinimumSnippetConfig());
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
    delete window.InterfaceX;
    new XInstaller({ adapter, plugin, vue: createLocalVue() }).init(getMinimumSnippetConfig());

    expect(window.InterfaceX).toBeDefined();
    delete window.InterfaceX;
  });

  it('does not create the public API passing the api parameter to false', () => {
    new XInstaller({ adapter, plugin, api: false, vue: createLocalVue() }).init(
      getMinimumSnippetConfig()
    );

    expect(window.InterfaceX).not.toBeDefined();
  });

  it('installs the XPlugin using the passed vue', () => {
    const localVue = createLocalVue();
    new XInstaller({ adapter, plugin, vue: localVue }).init(getMinimumSnippetConfig());
    const vueParam = xPluginMock.install.mock.calls[0][0];

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);
    expect(vueParam).toBe(localVue);
  });

  it('creates a Vue application using the component passed in the app option', async () => {
    await new XInstaller({ adapter, plugin, app: component, vue: createLocalVue() }).init(
      getMinimumSnippetConfig()
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
    const { app } = await new XInstaller({
      adapter,
      vue,
      vueOptions,
      app: component
    }).init(getMinimumSnippetConfig());

    expect(app).toHaveProperty('testMethod');
    expect(app).toHaveProperty('$router');
  });

  it('allows to install more plugins', async () => {
    const vue = createLocalVue();
    const { app } = await new XInstaller({
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
    }).init(getMinimumSnippetConfig());

    expect(app).toHaveProperty('$router');
    expect(app).toHaveProperty('bus');
    expect(app).toHaveProperty('snippet', { ...getMinimumSnippetConfig(), uiLang: 'test' });
  });

  it('initializes the app with the provided snippet config', async () => {
    const vue = createLocalVue();
    const { app, api } = await new XInstaller({
      adapter,
      vue,
      app: createSnippetConfigComponent()
    }).init(getMinimumSnippetConfig());

    expect(app?.$el).toHaveTextContent(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('test-2');
  });

  it('initializes the app when window.initX has the snippet config object', async () => {
    const vue = createLocalVue();
    window.initX = getMinimumSnippetConfig();
    const { app, api } = (await new XInstaller({
      adapter,
      vue,
      app: createSnippetConfigComponent()
    }).init()) as InitWrapper;

    expect(app?.$el).toHaveTextContent(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('test-2');
  });

  // eslint-disable-next-line max-len
  it('initializes the app when window.initX is a function retrieving the snippet config', async () => {
    const vue = createLocalVue();
    window.initX = () => getMinimumSnippetConfig();
    const { app, api } = (await new XInstaller({
      adapter,
      vue,
      app: createSnippetConfigComponent()
    }).init()) as InitWrapper;

    expect(app?.$el).toHaveTextContent(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await vue.nextTick();
    expect(app?.$el).toHaveTextContent('test-2');
  });

  // eslint-disable-next-line max-len
  it('does not initialize XComponents when no snippet config is passed and no window.initX is not defined', async () => {
    expect(await new XInstaller({ adapter, plugin, vue: createLocalVue() }).init()).toBeUndefined();
  });

  describe('`lang` & `uiLang`', () => {
    it('provides a `uiLang` by default', async () => {
      const { app } = await new XInstaller({
        adapter,
        plugin,
        vue: createLocalVue(),
        app: createSnippetConfigComponent('uiLang')
      }).init({ ...getMinimumSnippetConfig(), lang: 'en' });

      expect(app?.$el).toHaveTextContent('en');
    });

    it('respects user `uiLang` value', async () => {
      const { app } = await new XInstaller({
        adapter,
        plugin,
        vue: createLocalVue(),
        app: createSnippetConfigComponent('uiLang')
      }).init({ ...getMinimumSnippetConfig(), lang: 'en', uiLang: 'it' });
      expect(app?.$el).toHaveTextContent('it');
    });

    it('updates `uiLang` when `lang` is changed', async () => {
      const vue = createLocalVue();
      const { app, api } = await new XInstaller({
        adapter,
        plugin,
        vue,
        app: createSnippetConfigComponent('uiLang')
      }).init({ ...getMinimumSnippetConfig(), lang: 'en', uiLang: 'it' });
      expect(app?.$el).toHaveTextContent('it');

      api!.setSnippetConfig({ lang: 'es' });
      await vue.nextTick();
      expect(app?.$el).toHaveTextContent('es');

      api!.setSnippetConfig({ uiLang: 'en' });
      await vue.nextTick();
      expect(app?.$el).toHaveTextContent('en');

      api!.setSnippetConfig({ lang: 'fr', uiLang: 'it' });
      await vue.nextTick();
      expect(app?.$el).toHaveTextContent('it');
    });
  });
});
