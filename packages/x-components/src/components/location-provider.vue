<script lang="ts">
import type { PropType } from 'vue'
import type { FeatureLocation } from '../types'
import { defineComponent, provide, toRef } from 'vue'

/**
 * Location Provider component.
 * This component injects the location with value passed as prop.
 *
 * @public
 */
export default defineComponent({
  name: 'LocationProvider',
  props: {
    /**
     * The {@link FeatureLocation} to provide.
     *
     * @public
     */
    location: {
      type: String as PropType<FeatureLocation>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const featureLocation = toRef(props, 'location')
    provide('location', featureLocation)

    return () => slots.default?.()[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Events

This component doesn't emit events. However, events emitted by child components, will include the
`location` prop value in its metadata.

## See it in action

In this example, the `LocationProvider` component receives the `location` prop with the
`predictive_layer` value. This value will then be combined with the `NextQueries` feature name,
`next_query` to create a `QueryOrigin` string, which is used for tracking the performance of the
different tools that generate the query.

```vue
<template>
  <LocationProvider location="predictive_layer">
    <NextQueries />
  </LocationProvider>
</template>
<script>
import { LocationProvider } from '@empathyco/x-components'
import { NextQueries } from '@empathyco/x-components/next-queries'
export default {
  name: 'LocationProviderDemo',
  components: {
    LocationProvider,
    NextQueries,
  },
}
</script>
```
</docs>
