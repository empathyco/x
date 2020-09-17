/*
  Export the messages in this file to be auto-loaded.

  A normal re-export like `export { default as en } from './en.messages'`,
  will make the `en` to be loaded immediately and included in the main chunk.

  If you instead prefer the messages to be loaded only when they are needed, export instead
  a function that imports the messages. This way, messages for a specific locale would be loaded
  when the active locale matches them.
 */

// Example of how to make the english language be loaded immediately
export { default as en } from './en.messages';
export { default as es } from './es.messages';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Example of how to make the spanish messages be lazy loaded, only when the locale is set to `es`
// export const es = () => import('./es.messages');
/* eslint-enable @typescript-eslint/explicit-function-return-type */
