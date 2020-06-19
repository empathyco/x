import { IdentifierResultsXStoreModule } from '../types';

/**
 * Default implementation for the {@link IdentifierResultsGetters.regexp} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the identifier
 * results module.
 * @returns The {@link RegExp}.
 *
 * @public
 */
export const regex: IdentifierResultsXStoreModule['getters']['regex'] = ({ config }) => {
  return new RegExp(config.regex);
};
