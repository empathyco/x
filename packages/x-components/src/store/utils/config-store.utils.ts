import Vue from 'vue';

/**
 * Config mutations, containing a method to change the current config and other to merge
 * a new one.
 *
 * @public
 */
export interface ConfigMutations<T extends { config: T['config'] }> {
  /**
   * Sets the module config.
   *
   * @param config - The new config.
   */
  setConfig(config: T['config']): void;
  /**
   * Merges a new config with the current one.
   *
   * @param config - The config to be merged.
   */
  mergeConfig(config: T['config']): void;
}

/**
 * Sets the request config. Can be used as a mutation.
 *
 * @param state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param config - The new config.
 *
 * @public
 */
export function setConfig<T extends { config: T['config'] }>(state: T, config: T['config']): void {
  Vue.set(state, 'config', config);
}

/**
 * Merges a new config with the current one. Can be used as a mutation.
 *
 * @param state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param config - The config to be merged.
 *
 * @public
 */
export function mergeConfig<T extends { config: T['config'] }>(
  state: T,
  config: Partial<T['config']>
): void {
  Object.assign(<object>state.config, config);
}
