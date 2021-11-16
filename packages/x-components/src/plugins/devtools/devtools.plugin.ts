import { DevtoolsPluginApi, setupDevtoolsPlugin } from '@vue/devtools-api';
import Vue from 'vue';
import { setupTimelinePlugin } from './timeline.devtools';
import { setupWiringDevtools } from './wiring.devtools';

/**
 * Setups a plugin for the Vue's devtools adding:
 * - {@link XEvent}s timeline. Every event is recorded in time, and its payload and metadata can be
 * inspected.
 * - Wiring inspector. Events and its wires can be viewed and disabled.
 *
 * @param app - The Vue application the devtools should track.
 * @beta
 */
export function setupDevtools(app: Vue): void {
  setupDevtoolsPlugin(
    {
      id: 'x-components-devtools-plugin',
      label: 'X Components',
      packageName: '@empathyco/x-components',
      homepage: 'https://empathy.co',
      enableEarlyProxy: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      app
    },
    (api?: DevtoolsPluginApi<void>) => {
      if (api) {
        setupTimelinePlugin(api);
        setupWiringDevtools(api);
      }
    }
  );
}
