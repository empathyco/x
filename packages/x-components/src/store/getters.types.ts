import { Dictionary } from '../utils';
import { RootXStoreState } from './store.types';

/**
 * Type safe getters definition type. An object with this type is what it is needed to define {@link Vuex} getters
 * @param State the module state dictionary type definition
 * @param Getters the module getters dictionary type definition
 */
export type GettersTree<
  State extends Dictionary,
  Getters extends Dictionary
> = {
  [Key in keyof Getters]: (
    state: State,
    getters: Getters,
    rootState: RootXStoreState,
    rootGetters: any
  ) => Getters[Key];
};
/**
 * Alias for any getters tree. Use only when you don't care about the type
 */
export type AnyGettersTree = GettersTree<Dictionary, Dictionary>;
