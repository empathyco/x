<template>
  <span class="x-rating" role="img" :aria-label="ariaLabel" data-test="rating">
    <div class="x-rating--empty" data-test="rating-empty">
      <!--
        @slot The content to render as empty icon
      -->
      <slot v-for="i in max" name="empty-icon">
        <DefaultIcon :key="i" class="x-rating__default-icon x-rating__default-icon--empty" />
      </slot>
    </div>
    <div
      class="x-rating--filled"
      :style="{ width: calculateFilledWrapperWidth }"
      data-test="rating-filled"
    >
      <!--
        @slot The content to render as filled icon
      -->
      <slot v-for="i in max" name="filled-icon">
        <DefaultIcon :key="i" class="x-rating__default-icon x-rating__default-icon--filled" />
      </slot>
    </div>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import StarIcon from './icons/star.vue'

/**
 * Rating component. This component renders a set of elements filled based on the value passed as
 * prop.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseRating',
  components: {
    DefaultIcon: StarIcon,
  },
  props: {
    /**
     * Numeric value used to calculates the width of the filled elements.
     *
     * @public
     */
    value: {
      type: Number,
      required: true,
    },
    /**
     * Maximum number of elements to paint.
     *
     * @public
     */
    max: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    /**
     * Calculates the width of the filled elements wrapper.
     *
     * @returns The % of the wrapper width.
     *
     * @internal
     */
    const calculateFilledWrapperWidth = computed(() => {
      return props.value < 0 ? '0%' : `${(props.value * 100) / props.max}%`
    })

    /**
     * Creates the aria label for accessibility purpose.
     *
     * @returns The aria label.
     *
     * @internal
     */
    const ariaLabel = computed(() => {
      return `${props.value}/${props.max}`
    })

    return {
      calculateFilledWrapperWidth,
      ariaLabel,
    }
  },
})
</script>

<style lang="css" scoped>
.x-rating {
  position: relative;
  display: inline-block;
  max-width: fit-content;
}

.x-rating--empty {
  overflow: hidden;
  display: flex;
  flex-flow: row nowrap;
  white-space: nowrap;
}

.x-rating--filled {
  display: flex;
  flex-flow: row nowrap;
  white-space: nowrap;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  height: 100%;
}

.x-rating__default-icon {
  fill: currentColor;
  stroke: currentColor;
}

.x-rating__default-icon--empty {
  fill: none;
}
</style>

<docs lang="mdx">
## Examples

This component receives a `value` as prop and renders a set of elements, which will be filled based
on this value.

### Basic usage

```vue
<template>
  <BaseRating :value="5.23" />
</template>
```

### Customizing its contents

```vue
<template>
  <BaseRating :value="7.15" :max="10">
    <template #filled-icon>
      <TestIcon />
    </template>
    <template #empty-icon>
      <TestIcon />
    </template>
  </BaseRating>
</template>
```
</docs>
