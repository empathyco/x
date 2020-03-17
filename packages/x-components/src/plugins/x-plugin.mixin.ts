import Vue, { ComponentOptions } from 'vue';
import { getXComponentXModuleName, isXComponent } from '../components/x-component.utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { bus } from './x-bus';
import { XComponentAPI, XConfig } from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

/**
 * Vue global mixin that adds a `$x` object to every component with the {@link XComponentAPI}
 *
 * @param config - The global {@link XConfig}
 * @internal
 */
export const createXComponentAPIMixin = (
  config: XConfig
): ComponentOptions<Vue> & ThisType<Vue> => ({
  beforeCreate(): void {
    const xComponent = getRootXComponent(this);
    this.$x = {
      emit: <Event extends XEvent>(
        event: Event,
        payload?: XEventPayload<Event>,
        metadata: Omit<WireMetadata, 'moduleName'> = {}
      ) => {
        const moduleName = xComponent ? getXComponentXModuleName(xComponent) : null;
        bus.emit(event, payload as any, { ...metadata, moduleName });
        xComponent?.$emit(event, payload);
      },
      on: bus.on.bind(bus),
      config
    };
  }
});

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy
 *
 * @param component - The component to find its root XComponent
 * @returns The root XComponent or undefined if it has not
 * @public
 */
export function getRootXComponent(component: Vue): Vue | undefined {
  let xComponent: Vue | undefined;
  while (component !== undefined) {
    if (isXComponent(component)) {
      xComponent = component;
    }
    component = component.$parent;
  }
  return xComponent;
}
