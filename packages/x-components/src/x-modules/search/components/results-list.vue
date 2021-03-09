<template>
  <NoElement v-if="results.length">
    <!--
      @slot Customized Results List layout.
          @binding {results} results - Results to render
          @binding {animation} animation - Animation to animate the elements
    -->
    <slot name="layout" v-bind="{ results, animation }">
      <component :is="animation" tag="ul" class="x-results-list" data-test="results-list">
        <li
          v-for="result in results"
          :key="result.id"
          class="x-results-list__item"
          data-test="results-list-item"
        >
          <!--
            @slot Customized Results List result.
                @binding {result} result - Result data
          -->
          <slot :result="result" name="result">{{ result.name }}</slot>
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { noElementComponent } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';

  /**
   * It renders a list of results from {@link SearchState.results} by default.
   * The component provides the slot layout which wraps the whole component with the results binded.
   * It also provides the slot result to customize the item, which is within the layout slot, with
   * the result binded.
   *
   * @public
   */
  @Component({
    components: {
      NoElement: noElementComponent
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ResultsList extends Vue {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'results')
    public results!: Result[];

    /**
     * Animation component that will be used to animate the results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;
  }
</script>

<docs lang="mdx">
#Examples

It renders a list of results from {@link SearchState.results} by default. The component provides the
slot layout which wraps the whole component with the results binded. It also provides the slot
result to customize the item, which is within the layout slot, with the result binded.

## Basic example

You don't need to pass any props or slots. Simply add the component and when it has any results it
will show them.

```vue
<ResultsList />
```

## Configuring the animation

The component has an optional prop, `animation`, to render the component using an animation.

```vue
<ResultsList :animation="FadeAndSlide" />
```

## Overriding result content

It renders a list of results using the result slot.

```vue
<ResultsList :animation="FadeAndSlide">
    <template #result="{ result }">
      <span class="result">
        {{ result.name }}
      </span>
    </template>
  </ResultsList>
```

## Overriding layout content

It renders a list of results customizing the layout slot. In the example below, instead of using the
default ResultsList content, a BaseGrid component is used to render the results.

```vue
<ResultsList :animation="FadeAndSlide">
    <template #layout="{ results, animation }">
      <BaseGrid :items="results" :animation="animation">
        <template #Result="{ item }">
          <span>Result: {{ item.name }}</span>
        </template>
        <template #default="{ item }">
          <span>Default: {{ item }}</span>
        </template>
      </BaseGrid>
    </template>
  </ResultsList>
```
</docs>
