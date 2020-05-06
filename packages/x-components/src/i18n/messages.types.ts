/**
 * Components messages.
 *
 * @public
 */
export interface Messages {
  custom?: Message;
  closeButton: {
    ariaLabel: string;
    content: string;
  };
  historyQueries: {
    clearButton: {
      ariaLabel: string;
      content: string;
    };
    removeHistoryQuery: {
      ariaLabel: string;
      content: string;
    };
  };
  noSuggestions: {
    content: string;
  };
  openButton: {
    ariaLabel: string;
    content: string;
  };
  searchBox: {
    ariaLabel: string;
    clearButton: {
      ariaLabel: string;
    };
    placeholder: string;
    searchButton: {
      ariaLabel: string;
    };
  };
}

/**
 * A message or a container of messages.
 *
 * @public
 */
export interface Message {
  [key: string]: Message | string;
}
