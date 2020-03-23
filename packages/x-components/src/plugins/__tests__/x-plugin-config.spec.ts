import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { CurrencyOptions } from '../../i18n/currency.types';
import { XPlugin } from '../x-plugin';
import { DEFAULT_X_CONFIG } from '../x-plugin.config';
import { DocumentDirection } from '../x-plugin.types';
import { SearchAdapterDummy } from './adapter.dummy';

describe('testing global config', () => {
  const plugin: typeof XPlugin = require('../x-plugin').XPlugin;
  const localVue = createLocalVue();
  localVue.use(plugin, { adapter: SearchAdapterDummy });

  beforeEach(() => {
    plugin.setConfig(DEFAULT_X_CONFIG);
  });

  it('registers reactive global config via plugin options', () => {
    expect(plugin.getConfig()).toEqual(DEFAULT_X_CONFIG);
  });

  it('overrides global config through XPlugin.setConfig', () => {
    plugin.setConfig({ consent: true });
    expect(plugin.getConfig()).toHaveProperty('consent', true);
  });

  describe("testing integration with plugin's mixin", () => {
    const component: ComponentOptions<Vue> & ThisType<Vue> = {
      render(createElement) {
        return createElement();
      }
    };
    let componentInstance: Wrapper<Vue>;

    beforeEach(() => {
      componentInstance = shallowMount(component, { localVue });
    });

    afterEach(() => {
      componentInstance.destroy();
    });

    it('overrides consent and emits ConfigConsentChanged event', () => {
      const listener = jest.fn();
      componentInstance.vm.$x.on('ConfigConsentChanged').subscribe(listener);
      const newConsent = true;
      componentInstance.vm.$x.config.consent = newConsent;
      expect(listener).toHaveBeenCalledTimes(1);
      expect(plugin.getConfig()).toHaveProperty('consent', newConsent);
    });

    it('overrides currencyOptions and emits ConfigCurrencyChanged event', () => {
      const listener = jest.fn();
      componentInstance.vm.$x.on('ConfigCurrencyChanged').subscribe(listener);
      const newCurrencyOptions: CurrencyOptions = { symbol: '$' };
      componentInstance.vm.$x.config.currencyOptions = newCurrencyOptions;
      expect(listener).toHaveBeenCalledTimes(1);
      expect(plugin.getConfig()).toHaveProperty('currencyOptions', newCurrencyOptions);
    });

    it('overrides documentDirection and emits ConfigDocumentDirectionChanged event', () => {
      const listener = jest.fn();
      componentInstance.vm.$x.on('ConfigDocumentDirectionChanged').subscribe(listener);
      const newDocumentDirection: DocumentDirection = 'rtl';
      componentInstance.vm.$x.config.documentDirection = newDocumentDirection;
      expect(listener).toHaveBeenCalledTimes(1);
      expect(plugin.getConfig()).toHaveProperty('documentDirection', newDocumentDirection);
    });
  });
});
