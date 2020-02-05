import { Dictionary } from '../utils';

/**
 * Intermediate type that must be extended to implement a store module mutations definitions. This type will then be used by {@link ActionsTree}
 * to offer a type-safe `commit` method.
 */
export type MutationsDictionary = Dictionary<(payload?: any) => void>;

/**
 * Type-safe mutations definition type. An object with this type is what it is needed to define {@link Vuex} mutations
 * @param State the module state dictionary type definition
 * @param Mutations the module mutations dictionary type definition
 */
export type MutationsTree<
  State extends Dictionary,
  Mutations extends MutationsDictionary
> = {
  [Key in keyof Mutations]: (
    state: State,
    payload: Parameters<Mutations[Key]>[0]
  ) => void;
};

/**
 * Alias for any mutations tree. Use only when the concrete type does not matter
 */
export type AnyMutationsTree = MutationsTree<Dictionary, MutationsDictionary>;
