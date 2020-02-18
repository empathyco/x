import Vue, { ComponentOptions } from 'vue';
import { isXComponent } from '../components/x-component.mixin';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { bus } from './x-bus';
import { XComponentAPI } from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

export const createXComponentAPIMixin: ComponentOptions<Vue> & ThisType<Vue> = {
  beforeCreate(): void {
    const xComponent = getRootXComponent(this);
    this.$x = {
      emit: <Event extends XEvent>(event: Event, payload?: XEventPayload<Event>) => {
        bus.emit(event, payload);
        xComponent?.$emit(event, payload);
      },
      on: bus.on.bind(bus)
    };
  }
};

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy
 * @public
 * @param component - The component to find its root XComponent
 * @returns The root XComponent or undefined if it has not
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
