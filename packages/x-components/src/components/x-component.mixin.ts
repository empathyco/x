import Vue, { ComponentOptions } from 'vue';
import { XPlugin } from '../plugins/x-plugin';
import { AnyXModule } from '../x-modules/x-modules.types';
import { XComponent } from './x-component.types';

export const XComponentModule = Symbol.for('XComponentModule');

/**
 * Returns if the component is an X-Component. An X-Component is a component that has an {@link XModule} associated to it
 *
 * @param component - The component to check if it is an X-Component
 */
export function isXComponent(component: Vue): boolean {
  // @ts-ignore Access hidden property
  return !!component[XComponentModule];
}

/**
 * Initializes a component as an X-Component:
 * * Registers the module passed as parameter
 * * Flags the component as X-Component, so then it can be detected with the {@link isXComponent} function
 *
 * @param module - The module associated to the X-Component using this mixin
 */
export function xComponentMixin(
  module: AnyXModule
): ComponentOptions<Vue> & ThisType<Vue & XComponent> {
  XPlugin.registerXModule(module);
  return {
    created(): void {
      // Flag component as X Component
      this[XComponentModule] = module.name;
    }
  };
}
