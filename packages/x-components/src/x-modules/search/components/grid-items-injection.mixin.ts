import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { GridItem } from '../../../utils/types';
import { XInject, XInjectKey, XProvide } from '../../../components/decorators/injection.decorators';

const GridItemsKey: XInjectKey<GridItem[]> = 'gridItems';

@Component
export default class GridItemsInjectionMixin extends Vue {
  /**
   * List of {@link GridItem} to render from the state.
   *
   * @public
   */
  protected declare stateItems: GridItem[];

  /**
   * List of {@link GridItem} passed as props.
   *
   * @public
   */
  @Prop()
  protected propItems?: GridItem[];

  /**
   * List of {@link GridItem} formed by those that are passed through prop or injected.
   *
   * @returns List of {@link GridItem}.
   *
   * @internal
   */
  protected get items(): GridItem[] {
    return (
      this.propItems ??
      this.stateItems ??
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn('It is necessary to pass a prop or inject the list of filters')
    );
  }

  /**
   * It injects {@link GridItem} provided by an ancestor as injectedItems.
   *
   * @internal
   */
  @XInject(GridItemsKey, [] as GridItem[])
  public injectedItems!: GridItem[];

  /**
   * It provides `gridItems` which is the result of concatenating the `items` and the
   * `injectedItems`.
   *
   * @returns List of `items` and `injectedItems`.
   *
   * @internal
   */
  @XProvide(GridItemsKey)
  public get providedItems(): GridItem[] {
    return this.injectedItems.concat(this.items);
  }
}
