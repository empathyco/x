import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import { Store } from 'vuex';
import { XPluginOptions } from '../plugins/x-plugin.types';
import { RootXStoreState } from '../store/store.types';
import { installX as installXType } from '../x';
import { SearchAdapterDummy } from './adapter.dummy';

import SpyInstance = jest.SpyInstance;

describe('testing `installX` utility', () => {
  const xPluginOptions: XPluginOptions = { adapter: SearchAdapterDummy };
  let installSpy: SpyInstance;
  let localVue: typeof Vue;
  let installX: typeof installXType;

  beforeEach(() => {
    jest.isolateModules(() => {
      /* eslint-disable @typescript-eslint/no-var-requires */
      const { xPlugin } = require('../plugins/x-plugin');
      installX = require('../x').installX;
      /* eslint-enable @typescript-eslint/no-var-requires */
      installSpy = jest.spyOn(xPlugin, 'install');
    });
    delete window.X;
    localVue = createLocalVue();
  });

  it('installs the XPlugin without Vue dependency', () => {
    installX(xPluginOptions);

    expect(window.X).toBeDefined();
    expect(installSpy).toHaveBeenCalledWith(Vue, xPluginOptions);
  });

  it('installs the XPlugin in Vue constructor passed through', () => {
    installX(xPluginOptions, localVue);

    expect(window.X).toBeDefined();
    expect(installSpy).toHaveBeenCalledWith(localVue, xPluginOptions);
  });

  it('installs the XPlugin with the store passed through', () => {
    const store = new Store<RootXStoreState>({});
    const XPluginOptionsWithStore = { store, ...xPluginOptions };

    installX(XPluginOptionsWithStore, localVue);

    expect(window.X).toBeDefined();
    expect(installSpy).toHaveBeenCalledWith(localVue, XPluginOptionsWithStore);
  });
});
