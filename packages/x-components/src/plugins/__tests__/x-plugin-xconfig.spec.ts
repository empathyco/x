import { shallowMount, Wrapper } from '@vue/test-utils';
import { ComponentOptions, default as Vue } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { XPlugin } from '../x-plugin';
import { DEFAULT_X_CONFIG } from '../x-plugin.config';
import { DocumentDirection } from '../x-plugin.types';

describe('testing global xConfig', () => {
  let xPlugin: XPlugin;
  let localVue: typeof Vue;

  beforeEach(() => {
    jest.clearAllMocks();
    [xPlugin, localVue] = installNewXPlugin();
  });

  it('registers reactive global xConfig via plugin options', () => {
    expect(XPlugin.xConfig).toMatchObject(DEFAULT_X_CONFIG);
  });

  it('overrides global xConfig through XPlugin.setConfig', () => {
    xPlugin.setXConfig({ consent: true });
    expect(XPlugin.xConfig).toHaveProperty('consent', true);
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

    it('overrides consent and emits ConfigConsentChanged event', async () => {
      const listener = jest.fn();
      componentInstance.vm.$x.on('ConfigConsentChanged').subscribe(listener);
      const newConsent = true;
      componentInstance.vm.$x.xConfig.consent = newConsent;

      await localVue.nextTick();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(XPlugin.xConfig).toHaveProperty('consent', newConsent);
    });

    it('overrides documentDirection and emits ConfigDocumentDirectionChanged event', async () => {
      const listener = jest.fn();
      componentInstance.vm.$x.on('ConfigDocumentDirectionChanged').subscribe(listener);
      const newDocumentDirection: DocumentDirection = 'rtl';
      componentInstance.vm.$x.xConfig.documentDirection = newDocumentDirection;

      await localVue.nextTick();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(XPlugin.xConfig).toHaveProperty('documentDirection', newDocumentDirection);
    });
  });
});
