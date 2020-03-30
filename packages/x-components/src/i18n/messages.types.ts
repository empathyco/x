/**
 * Components messages.
 *
 * @public
 */
export interface Messages {
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
  custom?: Message;
}

/**
 * A message or a container of messages.
 *
 * @public
 */
export interface Message {
  [key: string]: Message | string;
}
