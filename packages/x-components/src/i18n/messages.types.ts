/**
 * Components messages.
 *
 * @public
 */
export interface Messages {
  custom?: Message;
  historyQueries: {
    deleteHistoryQuery: {
      ariaLabel: string;
      content: string;
    };
  };
  searchBox: {
    ariaLabel: string;
    placeholder: string;
    clearButton: {
      ariaLabel: string;
    };
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
