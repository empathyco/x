<template>
  <NoElement v-if="recommendations.length">
    <!--
      @slot Customized Recommendations layout.
          @binding {Result[]} recommendations - Recommendations to render.
          @binding {Vue} animation - Animation to animate the elements.
    -->
    <slot name="layout" v-bind="{ animation, recommendations }">
      <component
        :is="animation"
        tag="ul"
        data-test="recommendations"
        class="x-list x-recommendations"
      >
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
  import { Result } from '@empathyco/x-types';
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
    public storedRecommendations!: Result[];

    /**
     * Animation component that will be used to animate the recommendations.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue;

    /**
     * Number of recommendations to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * The additional events to be emitted by the mandatory {@link BaseResultLink} component.
     *
     * @public
     */
    @Provide()
    protected resultClickExtraEvents: PropsWithType<XEventsTypes, Result>[] = [
      'UserClickedARecommendation'
    ];

    /**
     * Slices the recommendations from the state.
     *
     * @returns - The list of recommendations slice by the number of items to render.
     *
     * @internal
     */
    protected get recommendations(): Result[] {
      return this.storedRecommendations.slice(0, this.maxItemsToRender);
    }
  }
</script>

<style lang="scss" scoped>
  .x-recommendations {
    list-style-type: none;
  }
</style>

<docs lang="mdx">
## Events

This component emits no events, but it makes components such as `BaseResultLink` emit additional
events:

- `UserClickedARecommendation`: the event is emitted after the user clicks the link of a
  recommendation.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Topclicked service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example on how the recommendations are rendered. You can customize how each
result is rendered by using the `default` slot. It is highly recommended to use base components such
as the `BaseResultLink` or the `BaseResultAddToCart`, as they provides integration with other
modules such like the `tagging` one.

```vue live
<template>
  <Recommendations #default="{ recommendation }">
    <BaseResultLink :result="recommendation" class="x-recommendations__link">
      <img :src="recommendation.images[0]" class="x-recommendations__image" />
      <span class="x-recommendations__title">{{ recommendation.name }}</span>
    </BaseResultLink>
    <BaseResultAddToCart>Add to cart</BaseResultAddToCart>
  </Recommendations>
</template>
<script>
  import { Recommendations } from '@empathyco/x-components/recommendations';
  import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components';

  export default {
    name: 'RecommendationsDemo',
    components: {
      Recommendations,
      BaseResultLink,
      BaseResultAddToCart
    }
  };
</script>
```

### Play with props

In this example, the component will render a maximum of 4 result recommendations, and will use the
`StaggeredFadeAndSlide` animation for the results, smoothing the entrance.

```vue live
<template>
  <Recommendations
    #default="{ recommendation }"
    :maxItemsToRender="4"
    animation="StaggeredFadeAndSlide"
  >
    <BaseResultLink :result="recommendation" class="x-recommendations__link">
      <img :src="recommendation.images[0]" class="x-recommendations__image" />
      <span class="x-recommendations__title">{{ recommendation.name }}</span>
    </BaseResultLink>
    <BaseResultAddToCart>Add to cart</BaseResultAddToCart>
  </Recommendations>
</template>
<script>
  import Vue from 'vue';
  import { Recommendations } from '@empathyco/x-components/recommendations';
  import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components';

  Vue.component('StaggeredFadeAndSlide', StaggeredFadeAndSlide);
  export default {
    name: 'RecommendationsDemo',
    components: {
      Recommendations,
      BaseResultLink,
      BaseResultAddToCart
    }
  };
</script>
```

### Play with the layout

In this example you can build your own layout, and the `Recommendations` component will just act as
a provider of the result recommendations data. Using the component this way, and due to Vue 2
limitations you will only be allowed to render a single element inside the `layout` slot.

```vue live
<template>
  <Recommendations #layout="{ recommendations }">
    <div class="x-recommendations">
      <article
        class="x-recommendations-list"
        v-for="recommendation in recommendations"
        :key="recommendation.id"
      >
        <BaseResultLink :result="recommendation" class="x-recommendations__link">
          <img :src="recommendation.images[0]" class="x-recommendations__image" />
          <span class="x-recommendations__title">{{ recommendation.name }}</span>
        </BaseResultLink>
        <BaseResultAddToCart>Add to cart</BaseResultAddToCart>
      </article>
    </div>
  </Recommendations>
</template>
<script>
  import { Recommendations } from '@empathyco/x-components/recommendations';
  import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components';

  export default {
    name: 'RecommendationsDemo',
    components: {
      Recommendations,
      BaseResultLink,
      BaseResultAddToCart
    }
  };
</script>
```
</docs>
