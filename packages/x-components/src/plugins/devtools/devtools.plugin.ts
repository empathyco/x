import { setupDevtoolsPlugin, App } from '@vue/devtools-api';
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
      app: app as App // FIXME: Infinite loop with types when inferred as a Vue2 app.
    },
    api => {
      if (api) {
        setupTimelinePlugin(api);
        setupWiringDevtools(api);
      }
    }
  );
}
