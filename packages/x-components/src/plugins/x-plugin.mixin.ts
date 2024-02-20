import Vue, { ComponentOptions } from 'vue';
import { Store } from 'vuex';
import { XBus } from '@empathyco/x-bus';
import { getRootXComponent, getXComponentXModuleName } from '../components/x-component.utils';
import { RootXStoreState } from '../store/store.types';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { FeatureLocation } from '../types/origin';
import { XModuleName } from '../x-modules/x-modules.types';
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
 * @param bus - The {@link @empathyco/x-bus#XBus} to use inside the components for emitting events.
 * @returns Mixin options which registers the component as X-Component and the $x.
 * @internal
 */
export const createXComponentAPIMixin = (
  bus: XBus<XEventsTypes, WireMetadata>
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
 * Creates an object containing the API related to the {@link @empathyco/x-bus#XBus}.
 *
 * @param bus - The global {@link @empathyco/x-bus#XBus}.
 * @param component - The component instance.
 *
 * @returns An object containing the {@link XComponentBusAPI}.
 * @internal
 */
export function getBusAPI(
  bus: XBus<XEventsTypes, WireMetadata>,
  component: PrivateExtendedVueComponent
): XComponentBusAPI {
  return {
    emit: <Event extends XEvent>(
      event: Event,
      payload?: XEventPayload<Event>,
      metadata: Omit<WireMetadata, 'moduleName'> = {}
    ) => {
      bus.emit(event, payload as XEventPayload<Event>, createWireMetadata(component, metadata));
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
      replaceable: true,
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
