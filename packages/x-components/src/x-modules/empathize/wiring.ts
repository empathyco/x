import { withModule } from '../../wiring/wires.namespace';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * The empathize wire factory.
 *
 * @public
 */
export const empathizeModule = withModule('empathize');

/**
 * Wiring configuration for the {@link EmpathizeXModule | empathize module}.
 *
 * @internal
 */
export const empathizeWiring = createWiring({});
