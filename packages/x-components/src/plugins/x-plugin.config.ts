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
    closeButton: {
      ariaLabel: 'Close search',
      content: '×'
    },
    openButton: {
      ariaLabel: 'Open search',
      content: 'Search'
    },
    historyQueries: {
      clearButton: {
        ariaLabel: 'Clear history queries',
        content: 'Clear history queries'
      },
      removeHistoryQuery: {
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
