import Vue, { ComponentOptions } from 'vue';
import { XComponent } from '../components/x-component.types';
import { getXComponentXModuleName, isXComponent } from '../components/x-component.utils';
import { Location, QueryFeature, Origin, ResultOrigin } from '../types/origin';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { XBus } from './x-bus.types';
import { getAliasAPI } from './x-plugin.alias';
import { XComponentAPI, XComponentBusAPI } from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

interface PrivateExtendedVueComponent extends Vue {
  $location?: Location;
  xComponent: XComponent | undefined;
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
  created(): void {
    this.xComponent = getRootXComponent(this);
    const aliasAPI = getAliasAPI(this.$store);
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
      metadata: Parameters<XComponentBusAPI['emit']>[2] = {}
    ) => {
      const xComponent = component.xComponent;
      bus.emit(event, payload as any, {
        moduleName: xComponent ? getXComponentXModuleName(xComponent) : null,
        origin: createQueryOrigin(metadata.feature, component.$location),
        location: component.$location,
        ...metadata
      });
      xComponent?.$emit(event, payload);
    },
    on: bus.on.bind(bus)
  };
}

/**
 * Given a component, finds the root XComponent in the ancestors hierarchy.
 *
 * @param component - The component to find its root XComponent.
 * @returns The root XComponent or undefined if it has not.
 * @public
 */
export function getRootXComponent(component: Vue): XComponent | undefined {
  let xComponent: XComponent | undefined;
  while (component !== undefined && component !== null) {
    if (isXComponent(component)) {
      xComponent = component;
    }
    component = component.$parent;
  }
  return xComponent;
}

/**
 * Creates a {@link Origin} string given a {@link QueryFeature} and a {@link Location}.
 * If the {@link Origin} can't be created, it returns `undefined`.
 *
 * @param feature - The feature that originated the query, or `undefined` if the event is not
 * related with a query.
 * @param location - The location where the event has happened.
 * @returns The composed origin, or `undefined` if it is not able to create the origin.
 * @internal
 */
function createQueryOrigin(
  feature: QueryFeature | undefined,
  location: Location | undefined
): Origin | ResultOrigin | undefined {
  if (location && feature) {
    return `${feature}:${location}`;
  }
}
