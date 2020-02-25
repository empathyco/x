import { Dictionary } from '../utils';
import { ExtractPayload } from './store.types';

/**
 * Util type for being used on generic constraints which will only accept an object containing mutations
 * @example ```typescript
 *  // This function allows receiving any object who only contains mutations;
 *  function sampleFunction<Mutations extends MutationsDictionary<Mutations>>(mutations: Mutations): void;
 * ```
 */
export type MutationsDictionary<Mutations> = Record<keyof Mutations, (payload?: any) => void>;

/**
 * Type-safe mutations definition type. An object with this type is what it is needed to define {@link Vuex} mutations
 * @param State the module state dictionary type definition
 * @param Mutations the module mutations dictionary type definition
 */
export type MutationsTree<
  State extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>
> = {
  [Key in keyof Mutations]: (state: State, payload: ExtractPayload<Mutations[Key]>) => void;
};

/**
 * Alias for any mutations tree. Use only when the concrete type does not matter
 */
export type AnyMutationsTree = MutationsTree<Dictionary, MutationsDictionary<any>>;
