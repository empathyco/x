import { XConfig } from '../plugins/x-plugin.types';

/**
 * Default global {@link XConfig}
 *
 * @public
 */
export const DEFAULT_X_CONFIG: XConfig = {
  adapter: null as any,
  consent: false,
  documentDirection: 'ltr',
  currencyOptions: {
    symbol: '€'
  },
  messages: {
    searchBox: {
      placeholder: 'Search'
    }
  }
};
