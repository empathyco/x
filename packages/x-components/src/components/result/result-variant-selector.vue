<template>
  <ul v-if="result && variants" class="x-result-variant-selector__list" data-test="variants-list">
    <li
      v-for="(variant, index) in variants"
      :key="index"
      class="x-result-variant-selector__item"
      :class="{ 'x-result-variant-selector__item--is-selected': variantIsSelected(variant) }"
      data-test="variant-item"
    >
      <!--
        @slot Variant item
        @binding {ResultVariant} variant - The variant item
        @binding {boolean} isSelected - Indicates if the variant is selected
        @binding {() => void} selectVariant - Callback to select the variant
      -->
      <slot
        name="variant"
        :variant="variant"
        :is-selected="variantIsSelected(variant)"
        :select-variant="() => selectVariant(variant)"
      >
        <button data-test="variant-button" class="xds:button" @click="selectVariant(variant)">
          <!--
            @slot Variant content
            @binding {ResultVariant} variant - The variant item
            @binding {boolean} isSelected - Indicates if the variant is selected
          -->
          <slot name="variant-content" :variant="variant" :is-selected="variantIsSelected(variant)">
            {{ variant }}
          </slot>
        </button>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
import type { Result, ResultVariant } from '@empathyco/x-types'
import type { Ref } from 'vue'
import { computed, defineComponent, inject } from 'vue'
import {
  RESULT_WITH_VARIANTS_KEY,
  SELECT_RESULT_VARIANT_KEY,
  SELECTED_VARIANTS_KEY,
} from '../decorators/injection.consts'

/**
 * Component to show and select the available variants of a product for a given nest level.
 * TODO: Log warning on mount when result is not injected.
 *
 * @public
 */
export default defineComponent({
  name: 'ResultVariantSelector',
  props: {
    /** The nest level of the variants to be rendered. */
    level: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots }) {
    /**
     * Callback to be called when a variant is selected.
     *
     * @public
     * @returns The 'selectResultVariant' injection key.
     */
    const selectResultVariant = inject<(variant: ResultVariant, level?: number) => void>(
      SELECT_RESULT_VARIANT_KEY as string,
    )

    /** The original result, used to retrieve the available variants for the level. */
    const result = inject<Ref<Result>>(RESULT_WITH_VARIANTS_KEY as string)

    /** Array containing the selected variants. */
    const selectedVariants = inject<Ref<ResultVariant[]>>(SELECTED_VARIANTS_KEY as string)

    /**
     * It retrieves the available variants from the result.
     *
     * @returns - The variants of the result for the current level.
     */
    const variants = computed<ResultVariant[] | undefined>(() => {
      if (props.level === 0) {
        return result!.value?.variants
      }
      return selectedVariants!.value[props.level - 1]?.variants
    })

    /**
     * Gets the selected variant of the current level.
     *
     * @returns - The selected variant.
     */
    const selectedVariant = computed<ResultVariant | undefined>(() =>
      variants.value?.find(variant => variant === selectedVariants!.value[props.level]),
    )

    /**
     * Calls the provided method to select a variant.
     *
     * @param variant - Variant to select.
     */
    const selectVariant = (variant: ResultVariant) => {
      selectResultVariant!(variant, props.level)
    }

    /**
     * Checks if a variant is selected.
     *
     * @param variant - Variant to check.
     * @returns True if the variant is selected, false if not.
     */
    const variantIsSelected = (variant: ResultVariant) => {
      return selectedVariant.value === variant
    }

    /**
     * Render function to execute the `default` slot, binding `slotsProps` and getting only the
     * first `vNode` to avoid Fragments and Text root nodes.
     * If there are no result or variants, nothing is rendered.
     *
     * @remarks `slotProps` must be values without Vue reactivity and located inside the
     * render-function to update the binding data properly.
     *
     * @returns The root `vNode` of the `default` slot or empty string if there are
     * no result or variants.
     */
    function renderDefaultSlot() {
      const slotProps = {
        variants: variants.value,
        selectedVariant: selectedVariant.value,
        selectVariant,
      }
      return result && variants.value ? slots.default?.(slotProps)[0] : ''
    }

    /* Hack to render through a render-function, the `default` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const componentProps = { result, variants, variantIsSelected, selectVariant }
    return (slots.default ? renderDefaultSlot : componentProps) as typeof componentProps
  },
})
</script>

<style lang="css" scoped>
.x-result-variant-selector__list {
  display: flex;
}
</style>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

Here you have a basic example of how the `ResultVariantSelector` component is rendered.

Take into account that this component **must** be a child of a `ResultVariantsProvider` component.

Also, the component is intended to be used overwriting the content with the slots.

By default it will render a list of buttons containing the available variants.

This component only has a required `level` prop, that indicates the level of the variants to be
rendered.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <h1>Select color</h1>
    <ResultVariantSelector :level="0" #variant="{ variant, selectVariant }" />

    <h1>Select size</h1>
    <ResultVariantSelector :level="1" #variant="{ variant, selectVariant }" />
  </ResultVariantsProvider>
</template>

<script>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'

export default {
  name: 'ResultVariantSelectorDemo',
  components: {
    ResultVariantsProvider,
    ResultVariantSelector,
  },
  data() {
    return {
      result: {
        id: 'jacket',
        modelName: 'Result',
        type: 'Product',
        isWishlisted: false,
        identifier: { value: 'jacket' },
        images: [],
        name: 'jacket',
        price: { hasDiscount: false, originalValue: 10, value: 10 },
        url: '/products/jacket',
        variants: [
          {
            name: 'red',
            variants: [
              {
                name: 'red XL',
              },
              {
                name: 'red L',
              },
            ],
          },
          {
            name: 'blue',
            variants: [
              {
                name: 'blue S',
              },
              {
                name: 'blue M',
              },
              {
                name: 'blue L',
              },
            ],
          },
        ],
      },
    }
  },
}
</script>
```

### Play with the default slot

In this example the default slot is used to customize the list.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <ResultVariantSelector :level="0" #default="{ variants, selectedVariant, selectVariant }">
      <div>
        <p v-if="selectedVariant">Selected variant: {{ selectedVariant.name }}</p>
        <ul class="x-flex">
          <li v-for="(variant, index) in variants" :key="index">
            <button @click="selectVariant(variant)">{{ variant.name }}</button>
          </li>
        </ul>
      </div>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'

export default {
  name: 'ResultVariantSelectorDemo',
  components: {
    ResultVariantsProvider,
    ResultVariantSelector,
  },
  data() {
    return {
      result: {
        id: 'jacket',
        modelName: 'Result',
        type: 'Product',
        isWishlisted: false,
        identifier: { value: 'jacket' },
        images: [],
        name: 'jacket',
        price: { hasDiscount: false, originalValue: 10, value: 10 },
        url: '/products/jacket',
        variants: [
          {
            name: 'red',
          },
          {
            name: 'blue',
          },
        ],
      },
    }
  },
}
</script>
```

### Play with variant-slot

In this example the variant-slot is used to customize the variant item.

The variant will be rendered inside a list.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <ResultVariantSelector :level="0" #variant="{ variant, isSelected, selectVariant }">
      <div>
        <button @click="selectVariant">
          {{ variant.name }}
          <span v-if="isSelected">SELECTED!</span>
        </button>
      </div>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'

export default {
  name: 'ResultVariantSelectorDemo',
  components: {
    ResultVariantsProvider,
    ResultVariantSelector,
  },
  data() {
    return {
      result: {
        id: 'jacket',
        modelName: 'Result',
        type: 'Product',
        isWishlisted: false,
        identifier: { value: 'jacket' },
        images: [],
        name: 'jacket',
        price: { hasDiscount: false, originalValue: 10, value: 10 },
        url: '/products/jacket',
        variants: [
          {
            name: 'red',
          },
          {
            name: 'blue',
          },
        ],
      },
    }
  },
}
</script>
```

### Play with variant-content slot

In this example the variant-content slot is used to customize the content of the default variant
button.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <ResultVariantSelector #variant-content="{ variant, isSelected }">
      <div>
        {{ variant.name }}
        <span v-if="isSelected">SELECTED!</span>
      </div>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'

export default {
  name: 'ResultVariantSelectorDemo',
  components: {
    ResultVariantsProvider,
    ResultVariantSelector,
  },
  data() {
    return {
      result: {
        id: 'jacket',
        modelName: 'Result',
        type: 'Product',
        isWishlisted: false,
        identifier: { value: 'jacket' },
        images: [],
        name: 'jacket',
        price: { hasDiscount: false, originalValue: 10, value: 10 },
        url: '/products/jacket',
        variants: [
          {
            name: 'red',
          },
          {
            name: 'blue',
          },
        ],
      },
    }
  },
}
</script>
```
</docs>
