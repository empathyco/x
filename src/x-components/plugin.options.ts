import { InstallXOptions } from '@empathy/x-components';
import App from '../App.vue';
import store from '../store';
import { adapter } from './adapter';
import { createI18NInstance } from '@/i18n';

const { i18n, setLocale } = createI18NInstance({ locale: 'en' });

(window as any)['setLocale'] = setLocale; // Only for testing

export const installXOptions: InstallXOptions = {
  adapter,
  store,
  app: App,
  xModules: {
    identifierResults: {
      config: {
        // This config overrides the default identifier search regex.
        // As the juguettos client has SKUs starting with a letter followed by numbers.

        // Please remove this config if your client has not this kind of issue.
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    }
  },
  vueOptions: {
    i18n
  }
};
