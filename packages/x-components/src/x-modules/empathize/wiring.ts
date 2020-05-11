import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * The empathize wire factory.
 *
 * @public
 */
export const empathizeModule = withModule('empathize');

/**
 * Empty keyboard action to set the wiring.
 * TODO Define action.
 * TODO Decide if we want to filter events from external modules.
 *
 * @public
 */
const keyboardAction = empathizeModule.wireDispatch('keyboardAction');

/**
 * Wiring configuration for the {@link EmpathizeXModule | empathize module}.
 *
 * @internal
 */
export const empathizeWiring = createWiring({
  UserPressedArrowKey: {
    keyboardAction
  }
});
