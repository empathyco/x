import type { Dictionary } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { ActionsDictionary, XActionContext } from '../actions.types'
import type { MutationsDictionary } from '../mutations.types'

/**
 * Type safe single module store.
 *
 * @internal
 */
export type SafeStore<
  State extends Dictionary,
  Getters extends Dictionary,
  Mutations extends MutationsDictionary<Mutations>,
  Actions extends ActionsDictionary<Actions>,
> = Omit<Store<State>, 'dispatch' | 'commit' | 'state' | 'getters'> &
  Omit<XActionContext<State, Getters, Mutations, Actions>, 'rootGetters' | 'rootState'>
