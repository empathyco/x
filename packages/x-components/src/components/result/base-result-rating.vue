<template>
  <a
    v-if="result.rating && result.rating.value"
    @click="emitClickedEvent"
    class="x-result-rating"
    data-test="result-rating"
    :href="link"
  >
    <!--
      @slot To override the whole content
    -->
    <slot :rating="result.rating.value" :result="result">
      <BaseRating :value="result.rating.value" v-bind="$attrs">
        <template #empty-icon>
          <!--
            @slot The content to render as empty icon
          -->
          <slot name="empty-icon" />
        </template>

        <template #filled-icon>
          <!--
            @slot The content to render as filled icon
          -->
          <slot name="filled-icon" />
        </template>
      </BaseRating>
    </slot>
  </a>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import BaseRating from '../base-rating.vue';

  /**
   * This component renders a {@link BaseRating} for a result passed as prop.
   *
   * @public
   */
  @Component({
    components: {
      BaseRating
    }
  })
  export default class BaseResultRating extends Vue {
    /**
     * The {@link @empathyco/x-types#Result | Result} to render its rating.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * A link to redirect when rating is clicked.
     *
     * @public
     */
    @Prop()
    protected link!: string;

    /**
     * Emits the `UserClickedAResultRating` event when user clicks this component, with the
     * {@link @empathyco/x-types#Result | Result} as payload.
     *
     * @internal
     */
    protected emitClickedEvent(): void {
      this.$x.emit('UserClickedAResultRating', this.result, { target: this.$el as HTMLElement });
    }
  }
</script>

<style scoped lang="scss">
  .x-result-rating {
    display: inline-block;
    color: inherit;
    text-decoration: none;
  }
</style>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedAResultRating`](./../../api/x-components.searchboxxevents.md)

## See it in action

Here you have a basic example of how the result rating is rendered.

```vue
<template>
  <BaseResultRating :result="result" />
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```

### Play with props

In this example, the result rating has been configured to 6 as maximum value using the prop `max`.

```vue
<template>
  <BaseResultRating :result="result" :max="6" />
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```

In this example, the result rating has been configured with a link to redirect when is clicked.

```vue
<template>
  <BaseResultRating :result="result" link="https://empathy.co/" />
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```

### Play with events

In this example, a message has been added to be shown when the result rating is clicked.

```vue
<template>
  <BaseResultRating :result="result" @UserClickedAResultRating="logUserClickedRating" />
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    },
    methods: {
      logUserClickedRating(result) {
        console.log('User clickedRating of this result:', result);
      }
    }
  };
</script>
```

## Extending the component

The rendered icons for rating can be configured through slots. Keep in mind that the icons for both
states (filled and empty), must have the same size make component work properly.

```vue
<template>
  <BaseResultRating :result="result">
    <template #filled-icon>❤️</template>
    <template #empty-icon>🤍</template>
  </BaseResultRating>
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```

It is possible to override all the content of the component to show your own rating but keeping the
link and event behaviour:

```vue
<template>
  <BaseResultRating :result="result" #default="{ rating, result }">
    <span v-for="star in rating">⭐️</span>
    <span>{{ result.name }}</span>
  </BaseResultRating>
</template>

<script>
  import { BaseResultRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```

Even it is possible to reuse our rating component:

```vue
<template>
  <BaseResultRating :result="result" #default="{ rating, result }">
    <BaseRating :value="rating" />
    <span>{{ result.name }}</span>
  </BaseResultRating>
</template>

<script>
  import { BaseResultRating, BaseRating } from '@empathyco/x-components';

  export default {
    name: 'ResultRatingDemo',
    components: {
      BaseResultRating,
      BaseRating
    },
    data() {
      return {
        result: {
          id: 1,
          name: 'Result with rating',
          rating: { value: 3 }
        }
      };
    }
  };
</script>
```
</docs>
