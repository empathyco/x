<script lang="ts">
  import { Prop, Provide, Component } from 'vue-property-decorator';
  import { NoElement } from '../components/no-element';
  import { FeatureLocation } from '../types';

  /**
   * Location Provider component.
   * This component injects the location with value passed as prop.
   *
   * @public
   */
  @Component
  export default class LocationProvider extends NoElement {
    /**
     * The {@link FeatureLocation} to provide.
     *
     * @public
     */
    @Prop({ required: true })
    @Provide()
    protected location!: FeatureLocation;
  }
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
