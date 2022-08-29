import {
  namespacedWireCommit,
  namespacedWireDispatch
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
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
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);

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
export const clearQueryPreview = wireCommit('clearQueryPreview');
/**
 * Sets the queries preview state `params`.
 *
 * @public
 */
export const setQueriesPreviewExtraParams = wireCommit('setParams');

/**
 * Wiring configuration for the {@link QueriesPreviewXModule | queriesPreview module}.
 *
 * @internal
 */
export const queriesPreviewWiring = createWiring({
  QueryPreviewRequestChange: {
    fetchAndSaveQueryPreviewWire
  },
  QueryPreviewRemoved: {
    clearQueryPreview
  },
  ExtraParamsChanged: {
    setQueriesPreviewExtraParams
  }
});
