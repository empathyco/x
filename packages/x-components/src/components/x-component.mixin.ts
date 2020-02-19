import Vue, { ComponentOptions } from 'vue';
import { XPlugin } from '../plugins/x-plugin';
import { AnyXModule } from '../x-modules/x-modules.types';
import { XComponent } from './x-component.types';
import { setXComponentXModuleName } from './x-component.utils';

/**
 * Initializes a component as an X-Component:
 * * Registers the module passed as parameter
 * * Flags the component as X-Component, so then it can be detected with the {@link isXComponent}
 * function
 *
 * @param module - The module associated to the X-Component using this mixin
 */
export function xComponentMixin(
  module: AnyXModule
): ComponentOptions<Vue> & ThisType<Vue & XComponent> {
  XPlugin.registerXModule(module);
  return {
    created(): void {
      setXComponentXModuleName(this, module.name);
    }
  };
}
