<script lang="ts">
  import Vue, { VNode, CreateElement } from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { XProvide } from '../decorators/injection.decorators';
  import {
    RESULT_WITH_VARIANTS_KEY,
    SELECTED_VARIANTS_KEY,
    SELECT_RESULT_VARIANT_KEY
  } from '../decorators/injection.consts';

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
  @Component
  export default class ResultVariantsProvider extends Vue {
    /**
     * The original result containing the variants.
     *
     * @public
     */
    @Prop({
      required: true
    })
    @XProvide(RESULT_WITH_VARIANTS_KEY)
    public result!: Result;

    /**
     * The provider by default will auto select the first variants of all levels.
     * This prop allows to limit the number of variants auto selected when the provider is created.
     * Take into account that the depth will be the variants level + 1, so, setting autoSelectDepth
     * to 0 will not select any variant, setting it to 1 will select only the first variant of the
     * first level, and so on.
     */
    @Prop({
      default: Number.POSITIVE_INFINITY
    })
    public autoSelectDepth!: number;

    /**
     * Array to keep track of the selected variants of the result.
     * Each position of the array is a nest level in the variants' hierarchy, so,
     * the second position will contain a variant that is present inside the variant of the first
     * position, and so on.
     *
     * @public
     */
    @XProvide(SELECTED_VARIANTS_KEY)
    public selectedVariants: ResultVariant[] = [];

    /**
     * Selects a variant of the result.
     * When called, it slices the array of selected variants to remove the selected child variants.
     * Emits the {@link XEventsTypes.UserSelectedAResultVariant} when called.
     *
     * @param variant - The variant to set.
     * @param level - The nest level where the variant is placed inside the result.
     * @public
     */
    @XProvide(SELECT_RESULT_VARIANT_KEY)
    selectResultVariant(variant: ResultVariant, level = 0): void {
      if (this.selectedVariants[level] === variant) {
        return;
      }
      this.selectedVariants.splice(level, Number.POSITIVE_INFINITY, variant);
      this.$x.emit('UserSelectedAResultVariant', {
        variant,
        level,
        result: this.result
      });
    }

    /**
     * Render function of the provider.
     * It exposes the result with the selected variant merged.
     *
     * @param createElement - Vue createElement method.
     * @returns - The VNode of the first element passed in the slot.
     * @public
     */
    render(createElement: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.resultToProvide
        })?.[0] ?? createElement()
      );
    }

    /**
     * Resets the selected variants when the result changes.
     * That includes doing the auto selection of the variants when the component is created
     * and when the result is changed.
     */
    @Watch('result', { immediate: true })
    resetSelectedVariants(): void {
      this.selectedVariants = [];
      this.selectFirstVariants(this.result?.variants?.[0]);
    }

    /**
     * Merges the original result with the selected variant.
     * The merge is done with all the selected variants of the array.
     *
     * @returns - The result with the selected variant merged.
     * @public
     */
    public get resultToProvide(): Result {
      if (!this.selectedVariants.length) {
        return this.result;
      }
      const mergedResult = this.selectedVariants.reduce<Result>((result, variant) => {
        return {
          ...result,
          ...variant
        };
      }, this.result);
      mergedResult.variants = this.result.variants;
      return mergedResult;
    }

    /**
     * Adds to the selectedVariants array the variants up to the autoSelectDepth level.
     *
     * @param variant - Variant to add to the array.
     */
    selectFirstVariants(variant?: ResultVariant): void {
      if (!!variant && this.selectedVariants.length <= this.autoSelectDepth - 1) {
        this.selectedVariants.push(variant);
        this.selectFirstVariants(variant.variants?.[0]);
      }
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

[`UserSelectedAResultVariant`](./../../api/x-components.userselectedaresultvariant.md).

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

<script>
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantsProviderDemo',
    components: {
      ResultVariantsProvider,
      ResultVariantSelector
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
                  name: 'red XL'
                },
                {
                  name: 'red L'
                }
              ]
            },
            {
              name: 'blue',
              variants: [
                {
                  name: 'blue S'
                },
                {
                  name: 'blue M'
                },
                {
                  name: 'blue L'
                }
              ]
            }
          ]
        }
      };
    }
  };
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

<script>
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantsProviderDemo',
    components: {
      ResultVariantsProvider,
      ResultVariantSelector
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
                  name: 'red XL'
                },
                {
                  name: 'red L'
                }
              ]
            },
            {
              name: 'blue',
              variants: [
                {
                  name: 'blue S'
                },
                {
                  name: 'blue M'
                },
                {
                  name: 'blue L'
                }
              ]
            }
          ]
        }
      };
    }
  };
</script>
```
</docs>
