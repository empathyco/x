<template>
  <BaseRating class="x-rating-filter-label" data-test="rating-label" :value="value" :max="max">
    <template #filled-icon>
      <!--
       @slot Filled icon content
     -->
      <slot name="rating-icon-filled" />
    </template>
    <template #empty-icon>
      <!--
       @slot Empty icon content
     -->
      <slot name="rating-icon-empty" />
    </template>
  </BaseRating>
</template>

<script lang="ts">
  import { BooleanFilter } from '@empathyco/x-types';
  import { computed, defineComponent, PropType } from 'vue';
  import BaseRating from '../../base-rating.vue';

  /**
   * Renders a label for a rating filter, allowing to override the elements used to paint
   * the rating.
   *
   * @public
   */

  export default defineComponent({
    /**
     * Renders a label for a rating filter, allowing to override the elements used to paint
     * the rating.
     *
     * @public
     */
    components: {
      BaseRating
    },
    props: {
      /**
       * The filter data to render.
       *
       * @public
       * */
      filter: {
        type: Object as PropType<BooleanFilter>,
        required: true
      },
      /**
       * Maximum number of elements to paint.
       *
       * @public
       */
      max: {
        type: Number,
        default: 5
      }
    },
    setup(props) {
      /**
       * Converts the label string into a number.
       *
       * @returns The label as number or 0 if it is not a valid number.
       *
       * @internal
       * */
      const value = computed<number>(() => {
        const x = parseFloat(props.filter.label) ?? 0;
        return Number.isNaN(x) ? 0 : x;
      });

      return {
        value
      };
    }
  });
</script>

<docs lang="mdx">
## Example

Renders a label for a rating filter, allowing to override the elements used to paint the rating. The
filter label must be a valid number string. For example: '3', '2.5', '0.25'

### Basic usage

```vue
<BaseRatingFilterLabel :filter="filter" />
```

### Customizing color

Its possible to change the default color directly with color CSS attribute. For more elaborated
styles it's possible to style the inner svg icons.

```vue
<BaseRatingFilterLabel :filter="filter" style="color: gold" />
```

### Customizing its contents

The `max` prop can be used to set the max rating number. It will render as many icons as the this
`max` value.

```vue
<BaseRatingFilterLabel :filter="filter" :max="max" />
```

The default icons can be changed using the `rating-icon-filled` and `rating-icon-empty` icons, to
represent the filled empty and empty icon in the rating component.

```vue
<BaseRatingFilterLabel :filter="filter" :max="max">
  <template #rating-icon-filled>♥</template>
  <template #rating-icon-empty>♡</template>
</BaseRatingFilterLabel>
```
</docs>
