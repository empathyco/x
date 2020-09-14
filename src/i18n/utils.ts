import { reduce } from '@empathy/x-components';
import { LocaleMessageObject } from 'vue-i18n';
import { LazyMessage, SplitMessages } from './i18n.types';
import { Messages } from './messages.types';

/**
 * TS helper function to create type safe messages.
 *
 * @param messages - The messages object to create.
 * @returns The same messages object passed.
 */
export function createMessages(messages: Messages): LocaleMessageObject {
  return (messages as unknown) as LocaleMessageObject;
}

/**
 * Splits messages into two groups, one for the ones lazy loaded, and other one that should be
 * loaded immediately. Ideally you should only load the messages needed.
 *
 * @param messages - The messages to split depending on when they should be loaded.
 * @returns The two groups of the messages.
 */
export function splitMessages(
  messages: Record<string, LazyMessage | LocaleMessageObject>
): SplitMessages {
  const initial: SplitMessages = {
    immediateMessages: {},
    lazyMessages: {}
  };
  return reduce(
    messages,
    (splitMessages, locale, localeMessages) => {
      if (typeof localeMessages === 'function') {
        splitMessages.lazyMessages[locale] = localeMessages;
      } else {
        splitMessages.immediateMessages[locale] = localeMessages;
      }
      return splitMessages;
    },
    initial
  );
}
