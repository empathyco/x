import { AnyXModule } from '../x-modules/x-modules.types';
import { XPlugin } from '../plugins/x-plugin';
/**
 * Initializes a component as an X-Component:
 * * Registers the module passed as parameter.
 * * Flags the component as X-Component, so then it can be detected with the {@link isXComponent}
 * function.
 *
 * @param module - The module associated to the X-Component that is being registered.
 * @public
 * @deprecated Use `XPlugin.registerXModule(xModule)` instead.
 */
export function useRegisterXModule(module: AnyXModule): void {
  XPlugin.registerXModule(module);
}
