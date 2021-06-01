<template>
  <NoElement v-if="recommendations.length">
    <!--
      @slot Customized Recommendations layout.
          @binding {Result[]} recommendations - Recommendations to render.
          @binding {Vue} animation - Animation to animate the elements.
    -->
    <slot name="layout" v-bind="{ animation, recommendations }">
      <component :is="animation" tag="ul" data-test="recommendations" class="x-recommendations">
        <li
          v-for="recommendation in recommendations"
          :key="recommendation.id"
          class="x-recommendations__item"
          data-test="recommendation-item"
        >
          <!--
            @slot (Required) Recommendation content.
            @binding {recommendation} recommendation - Recommendation data.
          -->
          <slot :recommendation="recommendation" />
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Component, Prop, Provide } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import Vue from 'vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { PropsWithType } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { recommendationsXModule } from '../x-module';

  /**
   * It renders a list of recommendations from the
   * {@link RecommendationsState.recommendations | Recommendations} state by default.
   * The component provides the slot layout which wraps the whole component with the
   * recommendations bounded. It also provides the default slot to customize the item, which is
   * within the layout slot, with the recommendation bounded. Each recommendation should be
   * represented by a {@link BaseResultLink | result link component} besides any other component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(recommendationsXModule)],
    components: {
      NoElement
    }
  })
  export default class Recommendations extends Vue {
    /**
     * The module's list of recommendations.
     *
     * @public
     */
    @State('recommendations', 'recommendations')
    public recommendations!: Result[];

    /**
     * Animation component that will be used to animate the recommendations.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue;

    /**
     * The additional events to be emitted by the mandatory {@link BaseResultLink} component.
     *
     * @public
     */
    @Provide()
    protected resultClickExtraEvents: PropsWithType<XEventsTypes, Result>[] = [
      'UserClickedARecommendation'
    ];
  }
</script>

<style lang="scss" scoped>
  .x-recommendations {
    list-style-type: none;
    padding-inline-start: 0;
  }
</style>

<docs>
  #Examples

  It renders a list of recommendations from recommendations state by default. The component
  provides the slot layout which wraps the whole component with the recommendations bound. It also
  provides the default slot to customize the item, which is within the layout slot, with the
  recommendation bound. Each recommendation should be represented by a BaseResultLink component
  besides any other component.

  ## Basic example

  ## Adding a custom BaseResultLink component

  A BaseResultLink **must** be used inside the Recommendations component. In the example below
  the BaseResultLink default slot is filled with an image of the result and a span for the title.
  Besides that, an additional button has been added.

  ```vue
  <Recommendations>
    <template #default="{ recommendation }">
      <BaseResultLink :result="recommendation" class="x-recommendations__link">
        <template #default="{ result }">
          <img :src="result.images[0]" class="x-recommendations__image"/>
          <span class="x-recommendations__title">{{ result.name }}</span>
        </template>
      </BaseResultLink>
      <button>Custom Behaviour</button>
    </template>
  </Recommendations>
  ```

  ## Overriding layout content

  It renders a list of recommendations customizing the layout slot. In the example below,
  instead of using the default Recommendations content, a BaseGrid component is used to render
  the recommendations.

  ```vue
  <Recommendations :animation="staggeredFadeAndSlide">
    <template #layout="{ recommendations, animation }">
      <BaseGrid :items="recommendations" :animation="animation">
        <template #Result="{ item }">
          <BaseResultLink :result="item">
            <BaseResultImage :result="item" />
            <span class="x-result__title">{{ item.name }}</span>
          </BaseResultLink>
        </template>
      </BaseGrid>
    </template>
  </Recommendations>
  ```

  ## Events

  A list of events that the component will emit:

  - `UserClickedARecommendation`: the event is emitted after the user clicks the button.
  - A list of events emitted by the `BaseResultLink`.
</docs>
