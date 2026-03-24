<script lang="ts">
import type { Result, ResultVariant } from '@empathyco/x-types'
import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, inject, provide, ref, watch } from 'vue'
import { useXBus } from '../../composables/use-x-bus'
import {
  RESULT_WITH_VARIANTS_KEY,
  SELECT_RESULT_VARIANT_KEY,
  SELECTED_VARIANTS_KEY,
} from '../decorators/injection.consts'

/**
 * Component that exposes the result merged with its selected variant in the default slot.
 *
 * It receives the original result and keeps track of the selected variant.
 *
 * It provides the original result, the array containing the selected variants and a callback to
 * set the selected variant to be used from a child.
 *
 * @public
 */
export default defineComponent({
  name: 'ResultVariantsProvider',
  props: {
    /** The original result containing the variants. */
    result: {
      type: Object as PropType<Result>,
      required: true,
    },
    /**
     * The provider by default will auto select the first variants of all levels.
     * This prop allows to limit the number of variants auto selected when the provider is created.
     * Take into account that the depth will be the variants level + 1, so, setting autoSelectDepth
     * to 0 will not select any variant, setting it to 1 will select only the first variant of the
     * first level, and so on.
     */
    autoSelectDepth: {
      type: Number,
      default: Number.POSITIVE_INFINITY,
    },
  },
  setup(props, { slots }) {
    const xBus = useXBus()

    /**
     * The original result containing the variants as a computed ref object to enable watching
     * prop changes.
     */
    const result = computed(() => props.result)

    /**
     * Array to keep track of the selected variants of the result.
     * Each position of the array is a nest level in the variants' hierarchy, so,
     * the second position will contain a variant that is present inside the variant of the first
     * position, and so on.
     */
    const selectedVariants = ref<ResultVariant[]>([])

    /**
     * It injects the queryPreviewHash provided by a query-preview.
     *
     * @internal
     */
    const queryPreviewHash = inject<ComputedRef<string> | null>('queryPreviewHash', null)

    /**
     * Selects a variant of the result.
     * When called, it slices the array of selected variants to remove the selected child variants.
     * Emits the {@link XEventsTypes.UserSelectedAResultVariant} when called.
     *
     * @param variant - The variant to set.
     * @param level - The nest level where the variant is placed inside the result.
     */
    function selectResultVariant(variant: ResultVariant, level = 0) {
      if (selectedVariants.value[level] === variant) {
        return
      }
      selectedVariants.value.splice(level, Number.POSITIVE_INFINITY, variant)
      xBus.emit('UserSelectedAResultVariant', {
        variant,
        level,
        result: result.value,
        queryPreviewHash,
      })
    }

    /**
     * Merges the original result with the selected variant.
     * The merge is done with all the selected variants of the array.
     *
     * @returns - The result with the selected variant merged.
     */
    const resultToProvide = computed(() => {
      if (!selectedVariants.value.length) {
        return result.value
      }

      const mergedResult = selectedVariants.value.reduce<Result>((result, variant) => {
        return {
          ...result,
          ...variant,
        }
      }, result.value)

      mergedResult.variants = result.value.variants
      return mergedResult
    })

    /**
     * Adds to the selectedVariants array the variants up to the autoSelectDepth level.
     *
     * @param variant - Variant to add to the array.
     */
    function selectFirstVariants(variant?: ResultVariant) {
      if (!!variant && selectedVariants.value.length <= props.autoSelectDepth - 1) {
        selectedVariants.value.push(variant)
        selectFirstVariants(variant.variants?.[0])
      }
    }

    /** Provides the original result passed as a prop. */
    provide<Ref<Result>>(RESULT_WITH_VARIANTS_KEY as string, result)

    /** The selected variants of the result. */
    provide<Ref<ResultVariant[]>>(SELECTED_VARIANTS_KEY as string, selectedVariants)

    /** The result variant key that will be selected. */
    provide(SELECT_RESULT_VARIANT_KEY as string, selectResultVariant)

    /**
     * Resets the selected variants when the result changes.
     * That includes doing the auto selection of the variants when the component is created
     * and when the result is changed.
     */
    watch(
      result,
      () => {
        selectedVariants.value = []
        selectFirstVariants(result.value?.variants?.[0])
      },
      { immediate: true },
    )

    return () => slots.default?.({ result: resultToProvide.value })[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserSelectedAResultVariant`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

This component is intended to be used in conjunction with the `ResultVariantSelector` component.

The result exposed in the default slot will contain the data of the selected variant.

By default, the first variants of all the levels will be selected when the component is rendered.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <h1>Select color</h1>
    <ResultVariantSelector :level="0" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultVariantSelector>

    <h1>Select size</h1>
    <ResultVariantSelector :level="1" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script setup>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'
const result = {
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
      variants: [{ name: 'red XL' }, { name: 'red L' }],
    },
    {
      name: 'blue',
      variants: [{ name: 'blue S' }, { name: 'blue M' }, { name: 'blue L' }],
    },
  ],
}
</script>
```

### Play with props

In this example, the provider has been configured to not auto select any variant. Changing the
`autoSelectDepth` prop sets the number of variant levels to auto select, being 0 no variants, 1 the
first variant of the first level, and so on.

```vue
<template>
  <ResultVariantsProvider :result="result" :autoSelectDepth="0" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <h1>Select color</h1>
    <ResultVariantSelector :level="0" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultVariantSelector>

    <h1>Select size</h1>
    <ResultVariantSelector :level="1" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script setup>
import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components'
const result = {
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
      variants: [{ name: 'red XL' }, { name: 'red L' }],
    },
    {
      name: 'blue',
      variants: [{ name: 'blue S' }, { name: 'blue M' }, { name: 'blue L' }],
    },
  ],
}
</script>
```
</docs>
