import Vue, { ComponentOptions } from 'vue';
import { XPlugin } from '../plugins/x-plugin';
import { AnyXModule } from '../x-modules/x-modules.types';
import { setXComponentXModuleName } from './x-component.utils';

/**
 * Initializes a component as an X-Component:
 * * Registers the module passed as parameter.
 * * Flags the component as X-Component, so then it can be detected with the {@link isXComponent}
 * function.
 *
 * @param module - The module associated to the X-Component using this mixin.
 * @returns Mixin for the module.
 * @public
 */
export function xComponentMixin(module: AnyXModule): ComponentOptions<Vue> {
  XPlugin.registerXModule(module);
  return {
    beforeCreate(): void {
      setXComponentXModuleName(this, module.name);
    }
  };
}
