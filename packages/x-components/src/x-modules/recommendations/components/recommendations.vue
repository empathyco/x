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
## Examples

It renders a list of recommendations from recommendations state by default. The component provides
the slot layout which wraps the whole component with the recommendations bound. It also provides the
default slot to customize the item, which is within the layout slot, with the recommendation bound.
Each recommendation should be represented by a BaseResultLink component besides any other component.

### Basic example

### Adding a custom BaseResultLink component

A BaseResultLink **must** be used inside the Recommendations component. In the example below the
BaseResultLink default slot is filled with an image of the result and a span for the title. Besides
that, an additional button has been added.

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

### Overriding layout content

It renders a list of recommendations customizing the layout slot. In the example below, instead of
using the default Recommendations content, a BaseGrid component is used to render the
recommendations.

```vue
<Recommendations :animation="staggeredFadeAndSlide">
  <template #layout="{ recommendations, animation }">
    <BaseGrid :items="recommendations" :animation="animation">
      <template #result="{ item }">
        <BaseResultLink :result="item">
          <BaseResultImage :result="item" />
          <span class="x-result__title">{{ item.name }}</span>
        </BaseResultLink>
      </template>
    </BaseGrid>
  </template>
</Recommendations>
```

### Play with props

In this example, the suggestions has been limited to render a maximum of 3 items.

_Type “puzzle” or another toy in the input field to try it out!_

```vue
<template>
  <BaseSuggestions :suggestions="suggestions" :maxItemToRender="3" />
</template>

<script>
  import { BaseSuggestions } from '@empathyco/x-components';

  export default {
    name: 'BaseSuggestionsDemo',
    components: {
      BaseSuggestions
    },
    data() {
      return {
        suggestions: [
          {
            facets: [],
            key: 'chips',
            query: 'Chips',
            totalResults: 10,
            results: [],
            modelName: 'PopularSearch'
          }
        ]
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedARecommendation`: the event is emitted after the user clicks the button.
- A list of events emitted by the `BaseResultLink`.
</docs>
