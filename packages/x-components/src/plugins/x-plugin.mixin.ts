import Vue, { ComponentOptions } from 'vue';
import { XComponent } from '../components/x-component.types';
import { getXComponentXModuleName, isXComponent } from '../components/x-component.utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { XBus } from './x-bus.types';
import { XComponentAPI, XConfig } from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

/**
 * Vue global mixin that adds a `$x` object to every component with the {@link XComponentAPI}.
 *
 * @param bus - The {@link XBus} to use inside the components for emitting events.
 * @param config - The global {@link XConfig}.
 * @returns Mixin options which registers the component as X-Component and the $x.
 * @internal
 */
export const createXComponentAPIMixin = (
  bus: XBus,
  config: XConfig
): ComponentOptions<Vue> & ThisType<Vue & { xComponent: XComponent | undefined }> => ({
  created(): void {
    this.xComponent = getRootXComponent(this);
    this.$x = {
      emit: <Event extends XEvent>(
        event: Event,
        payload?: XEventPayload<Event>,
        metadata: Omit<WireMetadata, 'moduleName'> = {}
      ) => {
        const moduleName = this.xComponent ? getXComponentXModuleName(this.xComponent) : null;
        bus.emit(event, payload as any, { ...metadata, moduleName });
        this.xComponent?.$emit(event, payload);
      },
      on: bus.on.bind(bus),
      config
    };
  }
});

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy.
 *
 * @param component - The component to find its root XComponent.
 * @returns The root XComponent or undefined if it has not.
 * @public
 */
export function getRootXComponent(component: Vue): XComponent | undefined {
  let xComponent: XComponent | undefined;
  while (component !== undefined) {
    if (isXComponent(component)) {
      xComponent = component;
    }
    component = component.$parent;
  }
  return xComponent;
}
