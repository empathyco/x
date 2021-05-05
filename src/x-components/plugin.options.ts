import { InstallXOptions } from '@empathy/x-components';
import App from '../App.vue';
import { I18n } from '../i18n/i18n.plugin';
import * as messages from '../i18n/messages';
import store from '../store';
import { adapter } from './adapter';

export const installXOptions: InstallXOptions = {
  adapter,
  store,
  app: App,
  async installExtraPlugins({ vue, snippet }) {
    const i18n = await I18n.create({
      locale: snippet.lang,
      device: snippet.device ?? 'mobile',
      fallbackLocale: 'en',
      messages
    });
    vue.use(i18n);
    (window as any).setLocale = i18n.setLocale.bind(i18n); // Only for testing
    (window as any).setDevice = i18n.setDevice.bind(i18n); // Only for testing

    return {
      i18n: i18n.vueI18n
    };
  },
  xModules: {
    identifierResults: {
      config: {
        // This config overrides the default identifier search regex.
        // As the juguettos client has SKUs starting with a letter followed by numbers.

        // Please remove this config if your client has not this kind of issue.
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    }
  }
};
