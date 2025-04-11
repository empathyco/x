import type { IdentifierResultsXStoreModule } from '../types'

/**
 * Default implementation for the {@link IdentifierResultsGetters.identifierDetectionRegexp} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the identifier
 * results module.
 * @returns The RegExp to detect and identifier.
 *
 * @public
 */

export const identifierDetectionRegexp: IdentifierResultsXStoreModule['getters']['identifierDetectionRegexp'] =
  ({ config }) => {
    return new RegExp(config.identifierDetectionRegexp)
  }
