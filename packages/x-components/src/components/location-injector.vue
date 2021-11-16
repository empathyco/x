<script lang="ts">
  import { Prop, Provide, Component } from 'vue-property-decorator';
  import { NoElement } from '../components/no-element';
  import { FeatureLocation } from '../types';
  import BaseEventButton from './base-event-button.vue';

  /**
   * Location Injector component.
   * This component injects the location with value passed as prop.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class LocationInjector extends NoElement {
    /**
     * The {@link FeatureLocation} to inject.
     *
     * @public
     */
    @Prop({ required: true })
    @Provide('location')
    protected location!: FeatureLocation;
  }
</script>

<docs lang="mdx">
## Play with props

In this example, the location injector receives a prop with the location to provide to its child
components.

```vue
<template>
  <LocationInjector location="external">
    <BaseEventButton :events="events" />
  </LocationInjector>
</template>

<script>
  import { BaseEventButton, LocationInjector } from '@empathyco/x-components';

  export default {
    name: 'LocationInjectorDemo',
    components: {
      BaseEventButton,
      LocationInjector
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
