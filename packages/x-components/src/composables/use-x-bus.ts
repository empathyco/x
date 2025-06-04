import type { ComponentPublicInstance, Ref } from 'vue'
import type { FeatureLocation } from '../types/origin'
import type { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/wiring.types'
import type { EventPayload, SubjectPayload, XBus } from '../x-bus'
import { Subscription } from 'rxjs'
import { getCurrentInstance, inject, isRef, onBeforeUnmount } from 'vue'
import { getRootXComponent, getXComponentXModuleName } from '../components/x-component.utils'
import { bus as xBus } from '../plugins/x-bus'
import { XPlugin } from '../plugins/x-plugin'

interface PrivateExtendedVueComponent extends ComponentPublicInstance {
  xComponent?: ComponentPublicInstance
}

/**
 * Composable which injects the current location, returns the `on` and `emit` functions
 * using the bus and applying component metadata. Also unsubscribe from events when components is
 * unmounted.
 *
 * @remarks This composable tries to use the `XPlugin` bus and catches the exception thrown
 * by the `XPlugin` if it was not instantiated and uses the default `xBus` as fallback.
 *
 * @returns An object with the `on` and `emit` functions.
 * @public
 */
export function useXBus() {
  const injectedLocation = inject<Ref<FeatureLocation> | FeatureLocation>('location', 'none')

  const component = getCurrentInstance()?.proxy as PrivateExtendedVueComponent
  const xComponent = getRootXComponent(component ?? null)
  if (component && xComponent) {
    component.xComponent = xComponent
  }

  let bus: XBus<XEventsTypes, WireMetadata>
  try {
    bus = XPlugin.bus
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (_error) {
    bus = xBus
  }

  const subscription = new Subscription()
  onBeforeUnmount(() => {
    subscription.unsubscribe()
  })

  return {
    on: <Event extends XEvent, Metadata extends boolean>(event: Event, withMetadata: Metadata) => {
      type Payload = EventPayload<XEventsTypes, Event>
      const observable = bus.on(event, withMetadata)

      return {
        subscribe: (
          callback: (
            payload: Metadata extends true ? SubjectPayload<Payload, WireMetadata> : Payload,
          ) => void,
          // Cast to any because bus.on doesn't infer conditional type referencing `withMetadata`
          // eslint-disable-next-line ts/no-unsafe-argument
        ) => subscription.add(observable.subscribe(callback as any)),
      }
    },
    emit: async <Event extends XEvent>(
      event: Event,
      payload?: XEventPayload<Event>,
      metadata: Omit<WireMetadata, 'moduleName'> = {},
    ) => {
      const location = isRef(injectedLocation) ? injectedLocation.value : injectedLocation

      xComponent?.$emit(event, payload) // TODO - Pending to deprecate
      return bus.emit(event, payload!, createWireMetadata(metadata, component, location))
    },
  }
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
  location?: FeatureLocation,
): WireMetadata {
  return Object.defineProperties(
    {
      replaceable: true,
      moduleName: component ? getXComponentXModuleName(component.xComponent) : null,
      location,
      ...metadata,
    },
    {
      component: {
        value: component,
        /* TODO: defining component as a non-enumerable property to ease tests changes due to
         * cyclic dependencies in Vue component instances. */
        enumerable: false,
      },
    },
  )
}
