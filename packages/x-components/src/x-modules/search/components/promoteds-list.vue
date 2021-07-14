<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
          @binding {promoteds} promoteds - Promoteds to render
          @binding {animation} animation - Animation to animate the elements
    -->
    <slot v-bind="{ promoteds, gridItems, animation }">
      <component
        :is="animation"
        v-if="promoteds.length"
        tag="ul"
        class="x-list x-promoteds-list"
        data-test="promoteds-list"
      >
        <li
          v-for="promoted in gridItems"
          :key="promoted.id"
          class="x-promoteds-list__item"
          data-test="promoteds-list-item"
        >
          <!--
            @slot Customized Promoteds List promoted.
                @binding {promoted} promoted - Promoted data
          -->
          <slot :promoted="promoted" name="promoted">{{ promoted.name }}</slot>
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Promoted } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { XInject, XProvide } from '../../../components/decorators/injection.decorators';
  import { GridItem } from '../../../utils/types';
  /**
   * It renders a list of promoteds from {@link SearchState.promoteds} by default.
   *
   * The component provides the slot layout which wraps the whole component with the promoteds
   * bound.
   *
   * It also provides the slot result to customize the item, which is within the layout slot, with
   * the promoted bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class PromotedsList extends Vue {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'promoteds')
    public promoteds!: Promoted[];

    /**
     * Animation component that will be used to animate the promoteds.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    @XInject('gridItems', <GridItem[]>[])
    public injectedGridItems!: GridItem[];

    @XProvide('gridItems')
    public get gridItems(): GridItem[] {
      return [...this.promoteds, ...this.injectedGridItems];
    }
  }
</script>

<docs lang="mdx"></docs>
