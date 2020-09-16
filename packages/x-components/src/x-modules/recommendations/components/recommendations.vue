<template>
  <component :is="animation" v-if="recommendations.length" tag="ul" class="x-recommendations">
    <li
      v-for="recommendation in recommendations"
      :key="recommendation.id"
      class="x-recommendations__item"
      data-test="recommendation-item"
    >
      <!--
        @slot Recommendation content
            @binding {Result} recommendation - Result data
      -->
      <slot :recommendation="recommendation" />
    </li>
  </component>
</template>

<script lang="ts">
  import { Component, Prop, Provide } from 'vue-property-decorator';
  import { Result } from '@empathy/search-types';
  import Vue from 'vue';
  import { State } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { PropsWithType } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { recommendationsXModule } from '../x-module';

  /**
   * Paints the list of recommendations stored in the state. Each recommendation should be
   * represented by a {@link BaseResultLink | result link component} besides any other component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(recommendationsXModule)]
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

<docs>
  #Examples

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
  ---
  id: x-components.recommendations
  title: Recommendations
  sidebar_label: Recommendations
  ---
</docs>
