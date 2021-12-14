import Vue from 'vue';
import { XModuleName } from '../x-modules/x-modules.types';

/**
 * Gets the X-Component name.
 *
 * @param component - The x-component to get its name.
 * @returns The x-module name if the component is an x-component, or `null` if it is not an
 * x-component.
 * @internal
 */
export function getXComponentXModuleName(component: Vue | undefined): XModuleName | null {
  return component?.$options.xModule ?? null;
}

/**
 * Returns if the component is an X-Component. An X-Component is a component that has an
 * {@link XModule} associated to it.
 *
 * @param component - The component to check if it is an X-Component.
 * @returns A boolean which flags if a component is a X-Component.
 * @public
 */
export function isXComponent(component: Vue): boolean {
  return !!getXComponentXModuleName(component);
}
