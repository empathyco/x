<script lang="ts">
  import { defineComponent, PropType, provide } from 'vue';
  import { FeatureLocation } from '../types';

  /**
   * Location Provider component.
   * This component injects the location with value passed as prop.
   *
   * @public
   */
  export default defineComponent({
    props: {
      location: {
        type: Object as PropType<FeatureLocation>,
        required: true
      }
    },
    setup(props) {
      /**
       * The {@link FeatureLocation} to provide.
       *
       * @public
       */
      provide<FeatureLocation>('location', props.location);
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
