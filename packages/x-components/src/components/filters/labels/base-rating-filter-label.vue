<template>
  <BaseRating class="x-rating-filter-label" data-test="rating-label" :value="value" :max="max">
    <template #filledIcon>
      <!--
       @slot Filled icon content
     -->
      <slot name="rating-icon-filled" />
    </template>
    <template #emptyIcon>
      <!--
       @slot Empty icon content
     -->
      <slot name="rating-icon-empty" />
    </template>
  </BaseRating>
</template>

<script lang="ts">
  import { Filter } from '@empathyco/x-types-old';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseRating from '../../base-rating.vue';

  /**
   * Renders a label for a rating filter, allowing to override the elements used to paint
   * the rating.
   *
   * @public
   */
  @Component({
    components: {
      BaseRating
    }
  })
  export default class BaseRatingFilterLabel extends Vue {
    /**
     * The filter data to render.
     *
     * @public
     * */
    @Prop({ required: true })
    public filter!: Filter;

    /**
     * Maximum number of elements to paint.
     *
     * @public
     */
    @Prop({ default: 5 })
    protected max!: number;

    /**
     * Converts the label string into a number.
     *
     * @returns The label as number or 0 if it is not a valid number.
     *
     * @internal
     * */
    protected get value(): number {
      const value = parseFloat(this.filter.label);
      return Number.isNaN(value) ? 0 : value;
    }
  }
</script>

<docs lang="mdx">
# Example

Renders a label for a rating filter, allowing to override the elements used to paint the rating. The
filter label must be a valid number string. For example: '3', '2.5', '0.25'

## Basic usage

```vue
<BaseRatingFilterLabel :filter="filter" />
```

## Customizing color

Its possible to change the default color directly with color CSS attribute. For more elaborated
styles it's possible to style the inner svg icons.

```vue
<BaseRatingFilterLabel :filter="filter" style="color: gold" />
```

## Customizing its contents

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
