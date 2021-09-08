import Vue from 'vue';
import Component from 'vue-class-component';
import { ListItem } from '../utils/types';
import { XInject, XProvide } from './decorators/injection.decorators';
import { LIST_ITEMS_KEY } from './decorators/injection.consts';

/**
 * Mixin to facilitate providing and injecting a list of search items. Injected list is
 * available at `injectedListItems`, and the provided list should be stored in `items`.
 *
 * @public
 */
@Component
export class ItemsListInjectionMixin extends Vue {
  /**
   * The search items of the entity that uses the mixin from the state.
   *
   * @remarks It should be defined in the component that uses the mixin and it's intended to be
   * filled with items from the state. Vue doesn't allow mixins as abstract classes.
   *
   * @internal
   */
  protected stateItems!: ListItem[];

  /**
   * The computed search items of the entity that uses the mixin.
   *
   * @remarks It should be overridden in the component that uses the mixin and it's intended to be
   * filled with items from the state. Vue doesn't allow mixins as abstract classes.
   * @returns An empty array as fallback in case it is not overridden.
   * @internal
   */
  @XProvide(LIST_ITEMS_KEY)
  public get items(): ListItem[] {
    return [];
  }

  /**
   * It injects {@link ListItem} provided by an ancestor as injectedListItems.
   *
   * @internal
   */
  @XInject(LIST_ITEMS_KEY)
  public injectedListItems: ListItem[] | undefined;
}
