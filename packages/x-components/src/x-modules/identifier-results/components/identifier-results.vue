<template>
  <component :is="animation" v-if="identifierResults.length" tag="ul" class="x-identifier-results">
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
      <slot :identifier-result="identifierResult" />
    </li>
  </component>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropsWithType } from '../../../utils/types'
import type { XEventsTypes } from '../../../wiring/events.types'
import { computed, defineComponent, provide } from 'vue'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { identifierResultsXModule } from '../x-module'

/**
 * Paints the list of identifier results stored in the state. Each identifier result should be
 * represented by a {@link IdentifierResult} component besides any
 * other component.
 *
 * @public
 */
export default defineComponent({
  name: 'IdentifierResults',
  xModule: identifierResultsXModule.name,
  props: {
    /**
     * Animation component that will be used to animate the identifier results.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * Number of identifier results to render.
     *
     * @public
     */
    maxItemsToRender: Number,
  },
  setup(props) {
    /**
     * The module's list of identifier results.
     *
     * @public
     */
    const { identifierResults } = useState('identifierResults', ['identifierResults'])

    /**
     * The additional events to be emitted by the mandatory {@link BaseResultLink} component.
     *
     * @public
     */
    provide<PropsWithType<XEventsTypes, Result>[]>('resultClickExtraEvents', [
      'UserClickedAIdentifierResult',
    ])

    /**
     * Slices the identifier results from the state.
     *
     * @returns - The list of identifier results sliced by the number of items to render.
     *
     * @internal
     */
    const identifierResultsToRender = computed(() =>
      (identifierResults.value as Result[]).slice(0, props.maxItemsToRender),
    )

    return {
      identifierResults,
      identifierResultsToRender,
    }
  },
})
</script>

<style lang="css" scoped>
.x-identifier-results {
  display: flex;
  flex-flow: column nowrap;
}
</style>

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
import { IdentifierResults, IdentifierResult } from '@empathyco/x-components'

export default {
  name: 'IdentifierResultsDemo',
  components: {
    IdentifierResults,
    IdentifierResult,
  },
}
</script>
```
</docs>
