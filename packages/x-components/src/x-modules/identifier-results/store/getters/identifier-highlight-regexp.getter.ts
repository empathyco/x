import { IdentifierResultsXStoreModule } from '../types';

/**
 * Default implementation for the {@link IdentifierResultsGetters.identifierHighlightRegexp} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the identifier
 * results module.
 * @returns The RegExp to match optional characters.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const identifierHighlightRegexp: IdentifierResultsXStoreModule['getters']['identifierHighlightRegexp'] =
  ({ query, config }) => {
    /* Escape each character to avoid creating a regex like [/- ] where the hyphen acts as delimiter
     * and the regex fails when created*/
    const separatorChars = config.separatorChars
      .split('')
      .map(char => `\\${char}`)
      .join('');
    const queryWithoutSeparators = query.replace(new RegExp(`[${separatorChars}]`, 'g'), '');
    const highlightQueryRegexValue = queryWithoutSeparators.split('').join(`[${separatorChars}]*`);
    return new RegExp(`(${highlightQueryRegexValue})`, 'i');
  };
