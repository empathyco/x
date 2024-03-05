import Vue, { getCurrentInstance, inject } from 'vue';
import { XBus } from '@empathyco/x-bus';
import { bus } from '../plugins/x-bus';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { getRootXComponent, getXComponentXModuleName } from '../components/x-component.utils';
import { FeatureLocation } from '../types/origin';
import { PropsWithType } from '../utils/types';

/**
 * Composable which injects the current location,
 * returns the `on` and `emit` functions from the `XBus`, applying location
 * and component metadata.
 *
 * @returns An object with the `on` and `emit` functions.
 */
export function useXBus(): UseXBusAPI {
  const location = inject<FeatureLocation>('location', undefined as any);

  const currentComponent: PrivateExtendedVueComponent | undefined | null =
    getCurrentInstance()?.proxy;
  const currentXComponent = getRootXComponent(currentComponent ?? null);
  if (currentComponent && currentXComponent) {
    currentComponent.xComponent = currentXComponent;
  }

  return {
    on: bus.on.bind(bus),
    emit: <Event extends XEvent>(
      event: Event,
      payload?: XEventPayload<Event>,
      metadata: Omit<WireMetadata, 'moduleName'> = {}
    ) => {
      bus.emit(event, payload, createWireMetadata(metadata, currentComponent, location));
      currentXComponent?.$emit(event, payload);
    }
  };
}

/**
 * Creates a wire metadata object based on the component and the provided metadata.
 *
 * @param metadata - Additional metadata emitted by the component.
 * @param component - The component this metadata belongs to.
 * @param location - The location of the component.
 *
 * @returns A {@link WireMetadata} object.
 */
function createWireMetadata(
  metadata: Partial<WireMetadata>,
  component?: PrivateExtendedVueComponent,
  location?: FeatureLocation
): WireMetadata {
  return Object.defineProperties(
    {
      replaceable: true,
      moduleName: component ? getXComponentXModuleName(component.xComponent) : null,
      location,
      ...metadata
    },
    {
      component: {
        value: component,
        /* TODO: defining component as a non-enumerable property to ease tests changes due to
         * cyclic dependencies in Vue component instances. */
        enumerable: false
      }
    }
  );
}

interface PrivateExtendedVueComponent extends Vue {
  xComponent?: Vue | undefined;
}

interface UseXBusAPI {
  /* eslint-disable jsdoc/require-description-complete-sentence */
  /** {@inheritDoc XBus.(on:1)} */
  on: XBus<XEventsTypes, WireMetadata>['on'];
  /** {@inheritDoc XBus.(emit:1)} */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /** {@inheritDoc XBus.(emit:2)} */
  emit<Event extends XEvent>(
    event: Event,
    payload: XEventPayload<Event>,
    metadata?: Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
  ): void;
  /* eslint-enable jsdoc/require-description-complete-sentence */
}
