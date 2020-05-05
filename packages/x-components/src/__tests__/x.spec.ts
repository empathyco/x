import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import { Store } from 'vuex';
import { XPlugin } from '../plugins/x-plugin';
import { XPluginOptions } from '../plugins/x-plugin.types';
import { RootXStoreState } from '../store/store.types';
import { installX } from '../x';
import { SearchAdapterDummy } from './adapter.dummy';

describe('testing `installX` utility', () => {
  const installSpyOn = jest.spyOn(XPlugin, 'install');

  const xPluginOptions: XPluginOptions = { adapter: SearchAdapterDummy };
  let localVue: typeof Vue;

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.X;
    localVue = createLocalVue();
  });

  it('installs the XPlugin without Vue dependency', () => {
    installX(xPluginOptions);

    expect(window.X).toBeDefined();
    expect(installSpyOn).toHaveBeenCalledWith(Vue, xPluginOptions);
  });

  it('installs the XPlugin in Vue constructor passed through', () => {
    installX(xPluginOptions, localVue);

    expect(window.X).toBeDefined();
    expect(installSpyOn).toHaveBeenCalledWith(localVue, xPluginOptions);
  });

  it('installs the XPlugin with the store passed through', () => {
    const store = new Store<RootXStoreState>({});
    const XPluginOptionsWithStore = { store, ...xPluginOptions };

    installX(XPluginOptionsWithStore, localVue);

    expect(window.X).toBeDefined();
    expect(installSpyOn).toHaveBeenCalledWith(localVue, XPluginOptionsWithStore);
  });
});
