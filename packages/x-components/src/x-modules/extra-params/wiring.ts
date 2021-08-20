import { namespacedWireCommit } from '../../wiring';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * WireCommit for {@link ExtraParamsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('extraParams');

/**
 * Sets the extra params of the {@link ExtraParamsXModule}.
 *
 * @public
 */
export const setExtraParams = wireCommit('setParams');

/**
 * Wiring configuration for the {@link ExtraParamsXModule | extraParams module}.
 *
 * @internal
 */
export const extraParamsWiring = createWiring({
  UserChangedExtraParams: {
    setExtraParams
  },
  ExtraParamsProvided: {
    setExtraParams
  }
});
