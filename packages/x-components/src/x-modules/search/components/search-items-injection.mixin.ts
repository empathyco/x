import Vue from 'vue';
import Component from 'vue-class-component';
import { SearchItem } from '../../../utils/types';
import { XInject } from '../../../components/decorators/injection.decorators';
import { SEARCH_ITEMS_KEY } from '../../../components/decorators/injection.consts';

@Component
export default class SearchItemsInjectionMixin extends Vue {
  /**
   * The search items of the entity that uses the mixin from the state.
   *
   * @remarks It should be defined in the component that uses the mixin and it's intended to be
   * filled with items from the state. Vue doesn't allow mixins as abstract classes.
   *
   * @internal
   */
  protected stateItems!: SearchItem[];

  /**
   * The computed search items of the entity that uses the mixin.
   *
   * @remarks It should be defined in the component that uses the mixin and it's intended to be
   * filled with items from the state. Vue doesn't allow mixins as abstract classes.
   *
   * @internal
   */
  protected items!: SearchItem[];

  /**
   * It injects {@link SearchItem} provided by an ancestor as injectedItems.
   *
   * @internal
   */
  @XInject(SEARCH_ITEMS_KEY)
  public injectedSearchItems: SearchItem[] | undefined;
}
