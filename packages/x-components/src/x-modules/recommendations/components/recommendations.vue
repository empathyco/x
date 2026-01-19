<template>
  <component
    :is="animation"
    v-if="recommendations.length"
    tag="ul"
    data-test="recommendations"
    class="x-recommendations"
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
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropsWithType } from '../../../utils'
import type { XEventsTypes } from '../../../wiring'
import { computed, defineComponent, provide } from 'vue'
import { useState } from '../../../composables'
import { AnimationProp } from '../../../types'
import { recommendationsXModule } from '../x-module'

/**
 * It renders a list of recommendations from the
 * {@link RecommendationsState.recommendations} state by default.
 * The component provides the slot layout which wraps the whole component with the
 * recommendations bounded. It also provides the default slot to customize the item, which is
 * within the layout slot, with the recommendation bounded. Each recommendation should be
 * represented by a {@link BaseResultLink} component besides any other component.
 *
 * @public
 */
export default defineComponent({
  name: 'Recommendations',
  xModule: recommendationsXModule.name,
  props: {
    /** Animation component that will be used to animate the recommendations. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /** Number of recommendations to be rendered. */
    maxItemsToRender: Number,
  },
  setup(props, { slots }) {
    /** The module's list of recommendations. */
    const storedRecommendations = useState('recommendations').recommendations

    /** The additional events to be emitted by the mandatory {@link BaseResultLink} component. */
    provide<PropsWithType<XEventsTypes, Result>[]>('resultClickExtraEvents', [
      'UserClickedARecommendation',
    ])

    /**
     * Slices the recommendations from the state.
     *
     * @returns - The list of recommendations slice by the number of items to render.
     */
    const recommendations = computed<Result[]>(() =>
      storedRecommendations.value.slice(0, props.maxItemsToRender),
    )

    /**
     * Render function to execute the `layout` slot, binding `slotsProps` and getting only the
     * first `vNode` to avoid Fragments and Text root nodes.
     * If there are no recommendations, nothing is rendered.
     *
     * @remarks `slotProps` must be values without Vue reactivity and located inside the
     * render-function to update the binding data properly.
     *
     * @returns The root `vNode` of the `layout` slot or empty string if there are
     * no recommendations.
     */
    function renderLayoutSlot() {
      const slotProps = {
        animation: props.animation,
        recommendations: recommendations.value,
      }
      return recommendations.value.length ? slots.layout?.(slotProps)[0] : ''
    }

    /* Hack to render through a render-function, the `layout` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const componentProps = { recommendations }
    return (slots.layout ? renderLayoutSlot : componentProps) as typeof componentProps
  },
})
</script>

<style lang="css" scoped>
.x-recommendations {
  display: flex;
  list-style-type: none;
}
</style>

<docs lang="mdx">
## Events

This component emits no events, but it makes components such as `BaseResultLink` emit additional
events:

- [`UserClickedARecommendation`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the link of a recommendation.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Topclicked service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example on how the recommendations are rendered. You can customize how each
result is rendered by using the `default` slot. It is highly recommended to use base components such
as the `BaseResultLink` or the `BaseResultAddToCart`, as they provide integration with other
modules such as the `tagging` one.

```vue live
<template>
  <Recommendations v-slot="{ recommendation }">
    <BaseResultLink :result="recommendation" class="x-recommendations__link">
      <img
        :src="recommendation.images[0]"
        :alt="recommendation.name"
        class="x-recommendations__image"
      />
      <span class="x-recommendations__title">{{ recommendation.name }}</span>
    </BaseResultLink>
    <BaseResultAddToCart :result="recommendation">Add to cart</BaseResultAddToCart>
  </Recommendations>
</template>

<script setup>
import { Recommendations } from '@empathyco/x-components/recommendations'
import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components'
</script>
```

### Play with props

In this example, the component will render a maximum of 4 result recommendations, and will use the
`StaggeredFadeAndSlide` animation for the results, smoothing the entrance.

```vue live
<template>
  <Recommendations
    v-slot="{ recommendation }"
    :max-items-to-render="4"
    :animation="StaggeredFadeAndSlide"
  >
    <BaseResultLink :result="recommendation" class="x-recommendations__link">
      <img
        :src="recommendation.images[0]"
        :alt="recommendation.name"
        class="x-recommendations__image"
      />
      <span class="x-recommendations__title">{{ recommendation.name }}</span>
    </BaseResultLink>
    <BaseResultAddToCart :result="recommendation">Add to cart</BaseResultAddToCart>
  </Recommendations>
</template>

<script setup>
import { Recommendations } from '@empathyco/x-components/recommendations'
import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components'
import StaggeredFadeAndSlide from '@empathyco/x-components/animations/staggered-fade-and-slide.vue'
</script>
```

### Play with the layout

In this example you can build your own layout, and the `Recommendations` component will just act as
a provider of the result recommendations data. Using the component this way, you can render any
layout you want using the `layout` slot.

```vue live
<template>
  <Recommendations v-slot:layout="{ recommendations }">
    <div class="x-recommendations">
      <article
        class="x-recommendations-list"
        v-for="recommendation in recommendations"
        :key="recommendation.id"
      >
        <BaseResultLink :result="recommendation" class="x-recommendations__link">
          <img
            :src="recommendation.images[0]"
            :alt="recommendation.name"
            class="x-recommendations__image"
          />
          <span class="x-recommendations__title">{{ recommendation.name }}</span>
        </BaseResultLink>
        <BaseResultAddToCart :result="recommendation">Add to cart</BaseResultAddToCart>
      </article>
    </div>
  </Recommendations>
</template>

<script setup>
import { Recommendations } from '@empathyco/x-components/recommendations'
import { BaseResultLink, BaseResultAddToCart } from '@empathyco/x-components'
</script>
```
</docs>
