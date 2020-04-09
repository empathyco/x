import { XConfig } from './x-plugin.types';

/**
 * Default global {@link XConfig}.
 *
 * @public
 */
export const DEFAULT_X_CONFIG: XConfig = {
  consent: false,
  documentDirection: 'ltr',
  currencyOptions: {
    symbol: '€'
  },
  messages: {
    historyQueries: {
      clearButton: {
        content: 'Clear history queries',
        ariaLabel: 'Clear history queries'
      },
      deleteHistoryQuery: {
        ariaLabel: 'Delete query from history',
        content: '×'
      }
    },
    searchBox: {
      ariaLabel: 'Search input',
      placeholder: 'Search',
      clearButton: {
        ariaLabel: 'Clear search input'
      },
      searchButton: {
        ariaLabel: 'Search button'
      }
    }
  }
};
