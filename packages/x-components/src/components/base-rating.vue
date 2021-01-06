<template>
  <div class="x-rating" role="img" :aria-label="ariaLabel">
    <div class="x-rating--empty">
      <!--
        @slot The content to render as empty icon
      -->
      <slot v-for="i in max" name="emptyIcon">
        <DefaultIcon :key="i" class="x-rating__default-icon x-rating__default-icon--empty" />
      </slot>
    </div>
    <div class="x-rating--filled" :style="{ width: calculateFilledWrapperWidth }">
      <!--
        @slot The content to render as filled icon
      -->
      <slot v-for="i in max" name="filledIcon">
        <DefaultIcon :key="i" class="x-rating__default-icon x-rating__default-icon--filled" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import StarIcon from './icons/star.vue';

  /**
   * Rating component. This component renders a set of elements filled based on the value passed as
   * prop.
   *
   * @public
   */
  @Component({
    components: {
      DefaultIcon: StarIcon
    }
  })
  export default class BaseRating extends Vue {
    /**
     * Numeric value used to calculates the width of the filled elements.
     *
     * @public
     */
    @Prop({ required: true })
    protected value!: number;
    /**
     * Maximum number of elements to paint.
     *
     * @public
     */
    @Prop({ default: 5 })
    protected max!: number;

    /**
     * Calculates the width of the filled elements wrapper.
     *
     * @returns The % of the wrapper width.
     *
     * @internal
     */
    protected get calculateFilledWrapperWidth(): string {
      return `${(this.value * 100) / this.max}%`;
    }

    /**
     * Creates the aria label for accessibility purpose.
     *
     * @returns The aria label.
     *
     * @internal
     */
    protected get ariaLabel(): string {
      return `${this.value}/${this.max}`;
    }
  }
</script>

<style lang="scss" scoped>
  .x-rating {
    position: relative;
    display: inline-block;

    &--empty {
      overflow-x: hidden;
      display: flex;
    }

    &--filled {
      display: flex;
      position: absolute;
      overflow-x: hidden;
      top: 0;
      left: 0;
    }

    &__default-icon {
      fill: currentColor;
      stroke: currentColor;

      &--empty {
        fill: none;
      }
    }
  }
</style>

<docs>
#Examples

This component receives a `value` as prop and renders a set of elements, which will be filled based
on this value.

## Basic usage

```vue
<BaseRating :value="5.23"/>
```

## Customizing its contents

```vue
<BaseRating :value="7.15" :max="10">
  <template #filledIcon>
    <TestIcon/>
  </template>
  <template #emptyIcon>
    <TestIcon/>
  </template>
</BaseRating>
```

</docs>
