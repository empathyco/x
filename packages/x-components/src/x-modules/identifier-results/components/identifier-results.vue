<template>
  <component
    :is="animation"
    v-if="identifierResults.length"
    tag="ul"
    class="x-list x-identifier-results"
  >
    <li
      v-for="identifierResult in identifierResultsToRender"
      :key="identifierResult.id"
      class="x-identifier-results__item"
      data-test="identifier-results-item"
    >
      <!--
        @slot (Required) Identifier results item content
            @binding {Result} identifierResult - Identifier Result data
      -->
      <slot :identifierResult="identifierResult" />
    </li>
  </component>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import { Component, Prop, Provide } from 'vue-property-decorator';
  import Vue from 'vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { PropsWithType } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { identifierResultsXModule } from '../x-module';

  /**
   * Paints the list of identifier results stored in the state. Each identifier result should be
   * represented by a {@link IdentifierResult | identifier result component} besides any
   * other component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(identifierResultsXModule)]
  })
  export default class IdentifierResults extends Vue {
    /**
     * Animation component that will be used to animate the identifier results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue;

    /**
     * Number of identifier results to render.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * The module's list of identifier results.
     *
     * @public
     */
    @State('identifierResults', 'identifierResults')
    public identifierResults!: Result[];

    /**
     * The additional events to be emitted by the mandatory {@link BaseResultLink} component.
     *
     * @public
     */
    @Provide()
    protected resultClickExtraEvents: PropsWithType<XEventsTypes, Result>[] = [
      'UserClickedAIdentifierResult'
    ];

    /**
     * Slices the identifier results from the state.
     *
     * @returns - The list of identifier results sliced by the number of items to render.
     *
     * @internal
     */
    public get identifierResultsToRender(): Result[] {
      return this.identifierResults.slice(0, this.maxItemsToRender);
    }
  }
</script>

<docs lang="mdx">
## Examples

### Play with slot

A IdentifierResult **must** be used inside the IdentifierResults component. In the example below the
BaseResultLink is used as a wrapper and its default slot is filled with the IdentifierResult
component.

```vue
<IdentifierResults :animation="fadeAndSlide">
  <template #default="{ identifierResult }">
    <BaseResultLink :result="identifierResult">
      <template #default="{ result }">
        <IdentifierResult :result="result"/>
      </template>
    </BaseResultLink>
  </template>
</IdentifierResults>
```

### Play with props

In this example, the identifier results have been limited to render a maximum of 3 items.

```vue
<template>
  <IdentifierResults #default="{ identifierResult }" :maxItemsToRender="3">
    <IdentifierResult :result="identifierResult" />
  </IdentifierResults>
</template>

<script>
  import { IdentifierResults, IdentifierResult } from '@empathyco/x-components';

  export default {
    name: 'IdentifierResultsDemo',
    components: {
      IdentifierResults,
      IdentifierResult
    }
  };
</script>
```
</docs>
