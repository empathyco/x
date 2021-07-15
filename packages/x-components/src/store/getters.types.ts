import { Dictionary } from '../utils';
import { AnyXStoreModule, RootXStoreState } from './store.types';

/**
 * Type safe getters definition type. An object with this type is what it is needed to define
 * {@link https://vuex.vuejs.org/ | Vuex} getters.
 *
 * @param State - The module state dictionary type definition.
 * @param Getters - The module getters dictionary type definition.
 * @public
 */
export type GettersTree<State extends Dictionary, Getters extends Dictionary> = {
  [Key in keyof Getters]: (
    state: State,
    getters: Getters,
    rootState: RootXStoreState,
    rootGetters: any
  ) => Getters[Key];
};
/**
 * Alias for any getters tree. Use only when you don't care about the type.
 *
 * @public
 */
export type AnyGettersTree = GettersTree<Dictionary, Dictionary>;

/**
 * Type for implementing getters for a module with a class.
 *
 * @param Module - The module this getters belong to.
 * @public
 */
export type GettersClass<Module extends AnyXStoreModule> = Partial<Module['getters']>;
