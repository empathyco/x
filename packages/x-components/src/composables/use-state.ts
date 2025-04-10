import { computed, ComputedRef } from 'vue';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import { useStore } from './use-store';

/**
 * Function which returns the requested state's properties as a dictionary.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @returns A dictionary of computed state properties of the module.
 */
export function useState<
  Module extends XModuleName,
  State extends ExtractState<Module>
>(module: Module): { [P in keyof State]: ComputedRef<State[P]> } {
  return new Proxy(useStore().state, {
    get(state, path) {
      return computed(() => state.x[module]?.[path])
    }
  });
}
