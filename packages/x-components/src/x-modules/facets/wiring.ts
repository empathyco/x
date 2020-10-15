import { namespacedWireCommit } from '../../wiring';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `facets` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'facets';

/**
 * WireCommit for {@link FacetsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * Sets the facets state `facets`.
 *
 * @public
 */
export const setFacets = wireCommit('setFacets');

/**
 * Wiring configuration for the {@link FacetsXModule | facets module}.
 *
 * @internal
 */
export const facetsWiring = createWiring({
  FacetsChanged: {
    setFacets
  }
});
