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
## Play with props

In this example, the location provider receives a prop with the location to provide to its child
components.

```vue
<template>
  <LocationProvider location="external">
    <BaseEventButton :events="events" />
  </LocationProvider>
</template>

<script>
  import { BaseEventButton, LocationProvider } from '@empathyco/x-components';

  export default {
    name: 'LocationProviderDemo',
    components: {
      BaseEventButton,
      LocationProvider
    },
    data() {
      return {
        events: ['UserAcceptedAQuery']
      };
    }
  };
</script>
```

## Events

This component doesn't emit events.
</docs>
