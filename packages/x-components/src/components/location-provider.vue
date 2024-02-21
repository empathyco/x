<script lang="ts">
  import { defineComponent, PropType, provide, toRef } from 'vue';
  import { FeatureLocation } from '../types';
  import { useNoElementRender } from '../composables/index';

  /**
   * Location Provider component.
   * This component injects the location with value passed as prop.
   *
   * @public
   */
  export default defineComponent({
    name: 'LocationProvider',
    props: {
      location: {
        type: String as PropType<FeatureLocation>
      }
    },
    setup(props, { slots }) {
      const locationFeature = toRef(props, 'location');
      /**
       * The {@link FeatureLocation} to provide.
       *
       * @public
       */
      provide('location', locationFeature);

      return () => useNoElementRender(slots);
    }
  });
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
  import { LocationProvider } from '@empathyco/x-components';
  import { NextQueries } from '@empathyco/x-components/next-queries';
  export default {
    name: 'LocationProviderDemo',
    components: {
      LocationProvider,
      NextQueries
    }
  };
</script>
```
</docs>
