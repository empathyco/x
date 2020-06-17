import { WatchOptions } from 'vue';
import { Dictionary, Returns } from '../utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { AnyXStoreModule } from './store.types';

/**
 * Selects a part of the store state or getters (AKA "getter" inside
 * {@link https://vuex.vuejs.org/ | Vuex} watchers).
 *
 * @param ReturnType - The type of the state or getters property selected.
 * @param State - The type of the state of the {@link XModule} where this selector is used.
 * @param Getters - The type of the getters of the {@link XModule} where this selector is used.
 * @public
 */
export type SimpleStateSelector<
  ReturnType,
  State extends Dictionary,
  Getters extends Dictionary
> = (state: State, getters: Getters) => ReturnType;

/**
 * Composition type of {@link SimpleStateSelector} which allows to indicate if the state selector
 * should be executed in first instance (first assignment of values). Selector is the
 * {@link SimpleStateSelector} and immediate flags if the selector should be executed when it is
 * initialized for first time.
 *
 * @param ReturnType - The type of the state or getters property selected.
 * @param State - The type of the state of the {@link XModule} where this selector is used.
 * @param Getters - The type of the getters of the {@link XModule} where this selector is used.
 * @public
 */
export interface StateSelector<ReturnType, State extends Dictionary, Getters extends Dictionary>
  extends WatchOptions {
  selector: SimpleStateSelector<ReturnType, State, Getters>;
  /**
   * Checks if the value of the selector has changed.
   *
   * @remarks
   * This function exist because Vue will not stop reactivity propagation if the observed variable
   * is an `object`, an `Array`, or the `deep` mode has been enabled.
   *
   * @param newValue - The new value.
   * @param oldValue - The old value.
   * @returns True if the value has really changed.
   */
  isDifferent?(newValue: ReturnType, oldValue: ReturnType): boolean;
}

/**
 * Dictionary where the key is a {@link XEvent}, and the value is {@link SimpleStateSelector} or
 * {@link StateSelector}. This {@link SimpleStateSelector} or {@link StateSelector} can only
 * access the state and getters from the {@link XStoreModule} passed as param type. This
 * dictionary is used to emits a {@link XEvent} when the part of the store selected by
 * {@link SimpleStateSelector} changes.
 *
 * @param StoreModule - The store module that these store emitters will be able to access.
 * @public
 */
export type StoreEmitters<StoreModule extends AnyXStoreModule> = {
  [Event in XEvent]?:
    | SimpleStateSelector<
        XEventPayload<Event>,
        ReturnType<StoreModule['state']>,
        Returns<StoreModule['getters']>
      >
    | StateSelector<
        XEventPayload<Event>,
        ReturnType<StoreModule['state']>,
        Returns<StoreModule['getters']>
      >;
};

/**
 * Alias for any simple state selector.
 *
 * @public
 */
export type AnySimpleStateSelector = SimpleStateSelector<any, any, any>;

/**
 * Alias for any state selector.
 *
 * @public
 */
export type AnyStateSelector = StateSelector<any, any, any>;

/**
 * Alias for any store emitters.
 *
 * @public
 */
export type AnyStoreEmitters = StoreEmitters<AnyXStoreModule>;
