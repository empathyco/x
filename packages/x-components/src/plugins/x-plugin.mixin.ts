import Vue, { ComponentOptions } from 'vue';
import { Store } from 'vuex';
import { XComponent } from '../components/x-component.types';
import { getXComponentXModuleName, isXComponent } from '../components/x-component.utils';
import { RootXStoreState } from '../store/store.types';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { ExtractGetters, XModuleName } from '../x-modules/x-modules.types';
import { XBus } from './x-bus.types';
import {
  XComponentAliasAPI,
  XComponentAPI,
  XComponentBusAPI,
  XComponentXConfigAPI,
  XConfig
} from './x-plugin.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

/**
 * Vue global mixin that adds a `$x` object to every component with the {@link XComponentAPI}.
 *
 * @param bus - The {@link XBus} to use inside the components for emitting events.
 * @param xConfig - The global {@link XConfig}.
 * @returns Mixin options which registers the component as X-Component and the $x.
 * @internal
 */
export const createXComponentAPIMixin = (
  bus: XBus,
  xConfig: XConfig
): ComponentOptions<Vue> & ThisType<Vue & { xComponent: XComponent | undefined }> => ({
  created(): void {
    this.xComponent = getRootXComponent(this);

    const aliasAPI = getAliasAPI(this.$store);
    const busAPI = getBusAPI(bus, this.xComponent);
    const xConfigAPI = getXConfigAPI(xConfig);

    this.$x = Object.assign(aliasAPI, busAPI, xConfigAPI);
  }
});

/**
 * Creates an object containing the API related to the {@link XBus}.
 *
 * @param bus - The global {@link XBus}.
 * @param xComponent - The root {@link XComponent} that the component that owns this API has.
 * @returns An object containing the {@link XComponentBusAPI}.
 * @internal
 */
export function getBusAPI(bus: XBus, xComponent: XComponent | undefined): XComponentBusAPI {
  return {
    emit: <Event extends XEvent>(
      event: Event,
      payload?: XEventPayload<Event>,
      metadata: Omit<WireMetadata, 'moduleName'> = {}
    ) => {
      const moduleName = xComponent ? getXComponentXModuleName(xComponent) : null;
      bus.emit(event, payload as any, { ...metadata, moduleName });
      xComponent?.$emit(event, payload);
    },
    on: bus.on.bind(bus)
  };
}

/**
 * Creates an object containing the API related to the {@link XConfig}.
 *
 * @param xConfig - The initial global {@link XConfig}.
 * @returns A object containing the API related to {@link XConfig}.
 * @internal
 */
export function getXConfigAPI(xConfig: XConfig): XComponentXConfigAPI {
  return { xConfig };
}

/**
 * Creates an object containing the alias part of {@link XComponentAPI}.
 *
 * @param store - The store from which retrieve the data.
 * @returns An object containing the alias part of the {@link XComponentAPI}.
 * @internal
 */
export function getAliasAPI(
  store: Store<{ x: Partial<RootXStoreState['x']> }>
): XComponentAliasAPI {
  return {
    query: {
      get searchBox() {
        return store.state.x.searchBox?.query ?? '';
      },
      get nextQueries() {
        return store.state.x.nextQueries?.query ?? '';
      },
      get querySuggestions() {
        return store.state.x.querySuggestions?.query ?? '';
      },
      get relatedTags() {
        return store.state.x.relatedTags?.query ?? '';
      },
      get search() {
        return store.state.x.search?.query ?? '';
      }
    },
    get nextQueries() {
      return store.getters[getGetterPath('nextQueries', 'nextQueries')] ?? [];
    },
    get popularSearches() {
      return store.state.x.popularSearches?.popularSearches ?? [];
    },
    get historyQueries() {
      return store.getters[getGetterPath('historyQueries', 'historyQueries')] ?? [];
    },
    get querySuggestions() {
      return store.state.x.querySuggestions?.suggestions ?? [];
    },
    get relatedTags() {
      return store.getters[getGetterPath('relatedTags', 'relatedTags')] ?? [];
    },
    get selectedRelatedTags() {
      return store.state.x.relatedTags?.selectedRelatedTags ?? [];
    },
    get identifierResults() {
      return store.state.x.identifierResults?.identifierResults ?? [];
    },
    get recommendations() {
      return store.state.x.recommendations?.recommendations ?? [];
    },
    get facets() {
      return store.state.x.facets?.facets ?? {};
    },
    get selectedFilters() {
      return store.getters[getGetterPath('facets', 'selectedFilters')] ?? [];
    }
  };
}

/**
 * Generates a getter path string with the module and getter name.
 *
 * @param moduleName - The module name the getter belongs to.
 * @param getterName - The getter name.
 * @returns A string representing the getter path.
 * @public
 */
export function getGetterPath<ModuleName extends XModuleName>(
  moduleName: ModuleName,
  getterName: keyof ExtractGetters<ModuleName>
): string {
  return `x/${moduleName}/${getterName as string}`;
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
