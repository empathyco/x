import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * Sets the empathize state `isOpen` to true.
 *
 * @public
 */
const setIsOpen = namespacedWireCommit('empathize')('setIsOpen', true);

/**
 * Sets the empathize state `isOpen` to false.
 *
 * @public
 */
const setIsNotOpen = namespacedWireCommit('empathize')('setIsOpen', false);

/**
 * Wiring configuration for the {@link EmpathizeXModule | empathize module}.
 *
 * @internal
 */
export const empathizeWiring = createWiring({
  EmpathizeOpened: {
    setIsOpen
  },
  EmpathizeClosed: {
    setIsNotOpen
  }
});
