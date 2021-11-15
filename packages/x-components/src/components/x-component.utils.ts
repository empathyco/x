import Vue from 'vue';
import { XModuleName } from '../x-modules/x-modules.types';
import { XComponent } from './x-component.types';

/**
 * Symbol for storing the {@link XModule} that an X-Component belongs to.
 *
 * @internal
 */
export const XComponentModule = Symbol.for('XComponentModule');

/**
 * Sets the X-Component name.
 *
 * @param component - The x-component to set its name.
 * @param name - The name of the X-Component.
 * @internal
 */
export function setXComponentXModuleName(component: Vue, name: XModuleName): void {
  (component as XComponent)[XComponentModule] = name;
}

/**
 * Gets the X-Component name.
 *
 * @param component - The x-component to get its name.
 * @returns The x-module name if the component is an x-component, or `null` if it is not an
 * x-component.
 * @internal
 */
export function getXComponentXModuleName(component: Vue | undefined): XModuleName | null {
  return (component as XComponent)?.[XComponentModule] ?? null;
}

/**
 * Returns if the component is an X-Component. An X-Component is a component that has an
 * {@link XModule} associated to it.
 *
 * @param component - The component to check if it is an X-Component.
 * @returns A boolean which flags if a component is a X-Component.
 * @public
 */
export function isXComponent(component: Vue): component is XComponent {
  return !!(component as XComponent)[XComponentModule];
}
