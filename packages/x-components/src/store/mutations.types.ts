import { Dictionary } from '@empathyco/x-utils';
import { ExtractPayload } from './store.types';

/**
 * Util type for being used on generic constraints which will only accept an object containing
 * mutations.
 *
 * @example Example constraint
 *
 * ```typescript
 *  // This function allows receiving any object who only contains mutations;
 *  function sampleFunction\<Mutations extends MutationsDictionary\<Mutations\>\>
 *    (mutations: Mutations): void;
 * ```
 * @public
 */
export type MutationsDictionary<Mutations> = Record<keyof Mutations, (payload?: any) => void>;

/**
 * Type-safe mutations definition type. An object with this type is what it is needed to define
 * {@link https://vuex.vuejs.org/ | Vuex} mutations.
 *
 * @param State - The module state dictionary type definition.
 * @param Mutations - The module mutations dictionary type definition.
 * @public
 */
export type MutationsTree<
  State extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>
> = {
  [Key in keyof Mutations]: (state: State, payload: ExtractPayload<Mutations[Key]>) => void;
};

/**
 * Alias for any mutations tree. Use only when the concrete type does not matter.
 *
 * @public
 */
export type AnyMutationsTree = MutationsTree<Dictionary, MutationsDictionary<any>>;
