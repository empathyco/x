/**
 * Components messages
 *
 * @public
 */
export interface Messages {
  searchBox: {
    placeholder: string;
  };
  custom?: Message;
}

/**
 * A message or a container of messages
 *
 * @public
 */
export interface Message {
  [key: string]: Message | string;
}
