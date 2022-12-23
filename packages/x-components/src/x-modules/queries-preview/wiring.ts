import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `queriesPreview` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'queriesPreview';

/**
 * WireCommit for {@link QueriesPreviewXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatch for {@link QueriesPreviewXModule}.
 *
 * @internal
 */
const wireDispatch = namespacedWireDispatch(moduleName);

/**
 * Requests and stores the query preview results.
 *
 * @public
 */
export const fetchAndSaveQueryPreviewWire = wireDispatch('fetchAndSaveQueryPreview');

/**
 * Clears a query preview from queries preview module.
 *
 * @public
 */

export const clearQueryPreviewWire = wireCommit('clearQueryPreview');

/**
 * Sets the queries preview state `params`.
 *
 * @public
 */
export const setQueriesPreviewExtraParamsWire = wireCommit('setParams');

/**
 * Wiring configuration for the {@link QueriesPreviewXModule | queriesPreview module}.
 *
 * @internal
 */
export const queriesPreviewWiring = createWiring({
  QueryPreviewRequestChanged: {
    fetchAndSaveQueryPreviewWire
  },
  QueryPreviewRemoved: {
    clearQueryPreviewWire
  },
  ExtraParamsChanged: {
    setQueriesPreviewExtraParamsWire
  }
});
