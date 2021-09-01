import { Dictionary } from '../../utils/types';
import { ActionsDictionary, XActionContext } from '../actions.types';
import { MutationsDictionary } from '../mutations.types';

/**
 * Type safe single module store.
 *
 * @internal
 */
export type SafeStore<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>
> = Omit<XActionContext<State, Getters, Mutations, Actions>, 'rootGetters' | 'rootState'>;
