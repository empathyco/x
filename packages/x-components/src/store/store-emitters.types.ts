import { Dictionary, Returns } from '../utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { AnyXStoreModule } from './store.types';

/**
 * Selects a part of the store state or getters (AKA "getter" inside {@link Vuex} watchers).
 * @param ReturnType the type of the state or getters property selected
 * @param State the type of the state of the {@link XModule} where this selector is used
 * @param Getters the type of the getters of the {@link XModule} where this selector is used
 */
export type StateSelector<
  ReturnType,
  State extends Dictionary,
  Getters extends Dictionary
> = (state: State, getters: Getters) => ReturnType;
/**
 * Dictionary where the key is a {@link XEvent}, and the value is {@link StateSelector}. This {@link StateSelector} can only access
 * the state and getters from the {@link XStoreModule} passed as param type
 * This dictionary is used to emits a {@link XEvent} when the part of the store selected by {@link StateSelector} changes
 * @param StoreModule The store module that these store emitters will be able to access.
 */
export type StoreEmitters<StoreModule extends AnyXStoreModule> = {
  [Event in XEvent]?: StateSelector<
    XEventPayload<Event>,
    ReturnType<StoreModule['state']>,
    Returns<StoreModule['getters']>
  >;
};
/**
 * Alias for any store emitters
 */
export type AnyStoreEmitters = StoreEmitters<AnyXStoreModule>;
