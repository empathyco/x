import Vue, { ComponentOptions } from 'vue';
import { AnyXModule } from '../x-modules/x-modules.types';
import { useXPlugin } from '../plugins/index';

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
  useXPlugin().registerXModule(module);
  return {
    xModule: module.name
  };
}
