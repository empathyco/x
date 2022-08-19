<script lang="ts">
  import Vue, { VNode, CreateElement } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { XProvide } from '../decorators/injection.decorators';
  import {
    RESULT_KEY,
    SELECTED_VARIANTS_KEY,
    SET_RESULT_VARIANT_KEY
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
  export default class ResultProvider extends Vue {
    /**
     * The original result containing the variants.
     *
     * @public
     */
    @Prop({
      required: true
    })
    @XProvide(RESULT_KEY)
    public result!: Result;

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
     * Emits the {@link UserSelectedAResultVariant} when called.
     *
     * @param level - The nest level where the variant is placed inside the result.
     * @param variant - The variant to set.
     *
     * @public
     */
    @XProvide(SET_RESULT_VARIANT_KEY)
    setResultVariant(level: number, variant: ResultVariant): void {
      if (this.selectedVariants[level] === variant) {
        return;
      }
      this.selectedVariants = this.selectedVariants.slice(0, level);
      this.$set(this.selectedVariants, level, variant);
      this.$x.emit('UserSelectedAResultVariant', {
        variant,
        level,
        result: this.result
      });
    }

    /**
     * Render function of the provider.
     * It exposes the {@link Result} with the selected variant merged.
     *
     * @param createElement - Vue createElement method.
     * @returns - The VNode of the first element passed in the slot.
     *
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
     * Merges the original result with the selected variant.
     * The merge is done with all the selected variants of the array.
     *
     * @returns - The {@link Result} with the selected variant merged.
     *
     * @public
     */
    public get resultToProvide(): Result {
      if (!this.selectedVariants) {
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
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

[`UserSelectedAResultVariant`](./../../api/x-components.userselectedaresultvariant.md).

## See it in action

This component is intended to be used in conjunction with the `ResultSelector` component.

The result exposed in the default slot will contain the data of the selected variant.

```vue
<template>
  <ResultProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <h1>Select color</h1>
    <ResultSelector :level="0" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultSelector>

    <h1>Select size</h1>
    <ResultSelector :level="1" #variant="{ variant, selectVariant }">
      <button @click="selectVariant">{{ variant.name }}</button>
    </ResultSelector>
  </ResultProvider>
</template>

<script>
  import { ResultProvider, ResultSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultProviderDemo',
    components: {
      ResultProvider,
      ResultSelector
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
