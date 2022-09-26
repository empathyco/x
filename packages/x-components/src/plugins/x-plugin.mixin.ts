import Vue, { ComponentOptions } from 'vue';
import { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../components/x-component.utils';
import { RootXStoreState } from '../store/store.types';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { FeatureLocation } from '../types/origin';
import { XModuleName } from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';
import { getAliasAPI } from './x-plugin.alias';
import { XComponentAPI, XComponentBusAPI } from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ComponentOptions<V, Data, Methods, Computed, PropsDef, Props> {
    xModule?: XModuleName;
  }
}

interface PrivateExtendedVueComponent extends Vue {
  $location?: FeatureLocation;
  $store: Store<{ x: Partial<RootXStoreState['x']> }>;
  xComponent: Vue | undefined;
}

/**
 * Vue global mixin that adds a `$x` object to every component with the {@link XComponentAPI}.
 *
 * @remarks It adds an injection property `origin` which value is included in the metadata of each
 * event emitted with `$x.emit`.
 *
 * @param bus - The {@link XBus} to use inside the components for emitting events.
 * @returns Mixin options which registers the component as X-Component and the $x.
 * @internal
 */
export const createXComponentAPIMixin = (
  bus: XBus
): ComponentOptions<Vue> & ThisType<PrivateExtendedVueComponent> => ({
  inject: {
    $location: {
      from: 'location',
      default: undefined
    }
  },
  beforeCreate(this: PrivateExtendedVueComponent) {
    this.xComponent = getRootXComponent(this);
    const aliasAPI = getAliasAPI(this);
    const busAPI = getBusAPI(bus, this);
    this.$x = Object.assign(aliasAPI, busAPI);
  }
});

/**
 * Creates an object containing the API related to the {@link XBus}.
 *
 * @param bus - The global {@link XBus}.
 * @param component - The component instance.
 *
 * @returns An object containing the {@link XComponentBusAPI}.
 * @internal
 */
export function getBusAPI(bus: XBus, component: PrivateExtendedVueComponent): XComponentBusAPI {
  return {
    emit: <Event extends XEvent>(
      event: Event,
      payload?: XEventPayload<Event>,
      metadata: Omit<WireMetadata, 'moduleName'> = {}
    ) => {
      bus.emit(event, payload as any, createWireMetadata(component, metadata));
      component.xComponent?.$emit(event, payload);
    },
    on: bus.on.bind(bus)
  };
}

/**
 * Creates a wire metadata object based on the component and the provided metadata.
 *
 * @param component - The component this metadata belongs to.
 * @param metadata - Additional metadata emitted by the component.
 * @returns A {@link WireMetadata} object.
 * @internal
 */
function createWireMetadata(
  component: PrivateExtendedVueComponent,
  metadata: Partial<WireMetadata>
): WireMetadata {
  return Object.defineProperties(
    {
      moduleName: getXComponentXModuleName(component.xComponent),
      location: component.$location,
      ...metadata
    },
    {
      component: {
        value: component,
        /* FIX-ME: defining component as a non-enumerable property to ease tests changes due to
         * cyclic dependencies in Vue component instances. */
        enumerable: false
      }
    }
  );
}

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy.
 *
 * @param component - The component to find its root XComponent.
 * @returns The root XComponent or undefined if it has not.
 * @public
 */
export function getRootXComponent(component: Vue): Vue | undefined {
  let xComponent: Vue | undefined;
  while (component !== undefined && component !== null) {
    if (isXComponent(component)) {
      xComponent = component;
    }
    component = component.$parent;
  }
  return xComponent;
}
