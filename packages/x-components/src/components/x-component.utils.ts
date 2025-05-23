import type { ComponentPublicInstance } from 'vue'
import type { XModuleName } from '../x-modules/x-modules.types'

/**
 * Gets the X-Component name.
 *
 * @param component - The x-component to get its name.
 * @returns The x-module name if the component is an x-component, or `null` if it is not an
 * x-component.
 * @internal
 */
export function getXComponentXModuleName(
  component: ComponentPublicInstance | undefined,
): XModuleName | null {
  // eslint-disable-next-line ts/no-unsafe-return
  return component?.$options.xModule ?? null
}

/**
 * Returns if the component is an X-Component. An X-Component is a component that has an
 * {@link XModule} associated to it.
 *
 * @param component - The component to check if it is an X-Component.
 * @returns A boolean which flags if a component is a X-Component.
 * @public
 */
export function isXComponent(component: ComponentPublicInstance): boolean {
  return !!getXComponentXModuleName(component)
}

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy.
 *
 * @param component - The component to find its root XComponent.
 * @returns The root XComponent or undefined if it has not.
 * @public
 */
export function getRootXComponent(
  component: ComponentPublicInstance | null,
): ComponentPublicInstance | undefined {
  let xComponent: ComponentPublicInstance | undefined
  let currentComponent = component
  while (currentComponent != null) {
    if (isXComponent(currentComponent)) {
      xComponent = currentComponent
    }
    currentComponent = currentComponent.$parent
  }
  return xComponent
}
