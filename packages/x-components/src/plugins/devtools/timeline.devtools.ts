import { DevtoolsPluginApi } from '@vue/devtools-api';
import { Dictionary } from '@empathyco/x-utils';
import { XEvent, XEventPayload } from '../../wiring/events.types';
import { WirePayload } from '../../wiring/wiring.types';
import { hslToHex } from './colors.utils';

/**
 * Contains the devtools API.
 */
let devtoolsAPI: DevtoolsPluginApi<Dictionary> | undefined;

/**
 * List of all the configured timeline layers for {@link XEvent}s.
 */
const timelineLayers = [
  {
    id: 'x-components-module-registered-events',
    regex: /^ModuleRegistered$/,
    label: 'X registered modules'
  },
  {
    id: 'x-components-user-events',
    regex: /^User/,
    label: 'X user events'
  },

  {
    id: 'x-components-request-events',
    regex: /RequestChanged$/,
    label: 'X request events'
  },
  {
    id: 'x-components-status-change-events',
    regex: /Changed$/,
    label: 'X status change events'
  },
  {
    id: 'x-components-miscellanea-events',
    regex: /.*/,
    label: 'X miscellanea events'
  }
];

/** Set containing the different layer ids. */
const layerIds = new Set(timelineLayers.map(layer => layer.id));

/**
 * Retrieves the timeline layer that an {@link XEvent} belongs to.
 *
 * @param event - The {@link XEvent} to retrieve its layer id.
 * @returns The layer id for the {@link XEvent}.
 */
function getTimelineLayer(event: XEvent): string {
  return timelineLayers.find(layer => layer.regex.test(event))!.id;
}

/**
 * Configures Vue's devtools timeline with new rows for {@link XEvent}s.
 *
 * @param api - Vue's devtools API.
 * @internal
 */
export function setupTimelinePlugin(api: DevtoolsPluginApi<Dictionary>): void {
  devtoolsAPI = api;
  timelineLayers.forEach(layer =>
    api.addTimelineLayer({
      id: layer.id,
      label: layer.label,
      color: hslToHex(329, 100, 50)
    })
  );
  api.on.inspectTimelineEvent(payload => {
    if (layerIds.has(payload.layerId)) {
      const component = (<WirePayload<unknown>>payload.event.data).metadata.component;
      if (component) {
        api.highlightElement(component);
      }
    }
  });
}

/**
 * Sends the emission of an {@link XEvent} to the devtools.
 *
 * @param event - The emitted {@link XEvent}.
 * @param value - An object containing both the event payload and its metadata.
 * @internal
 */
export function logDevtoolsXEvent<Event extends XEvent>(
  event: Event,
  value: WirePayload<XEventPayload<Event>>
): void {
  if (process.env.NODE_ENV !== 'production') {
    devtoolsAPI?.addTimelineEvent({
      event: {
        title: event,
        data: {
          ...value,
          metadata: {
            ...value.metadata,
            // FIX-ME: copying metadata.component as it is defined as a non-enumerable property.
            component: value.metadata.component
          }
        },
        time: devtoolsAPI?.now()
      },
      layerId: getTimelineLayer(event)
    });
  }
}
