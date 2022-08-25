<template>
  <NoElement v-if="result && variants">
    <!--
      @slot Variants list
        @binding {ResultVariant[]} variants - Array containing the available variants
        @binding {ResultVariant | undefined} selectedVariant - The selected variant
        @binding {(variant: ResultVariant) => void} selectVariant - Callback to select a variant
    -->
    <slot :variants="variants" :selectedVariant="selectedVariant" :selectVariant="selectVariant">
      <ul class="x-list x-result-variant-selector__list" data-test="variants-list">
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
            :isSelected="variantIsSelected(variant)"
            :selectVariant="() => selectVariant(variant)"
          >
            <button @click="selectVariant(variant)" data-test="variant-button" class="x-button">
              <!--
                @slot Variant content
                  @binding {ResultVariant} variant - The variant item
                  @binding {boolean} isSelected - Indicates if the variant is selected
              -->
              <slot
                name="variant-content"
                :variant="variant"
                :isSelected="variantIsSelected(variant)"
              >
                {{ variant }}
              </slot>
            </button>
          </slot>
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { NoElement } from '../no-element';
  import { XInject } from '../decorators/injection.decorators';
  import {
    RESULT_WITH_VARIANTS_KEY,
    SELECTED_VARIANTS_KEY,
    SELECT_RESULT_VARIANT_KEY
  } from '../decorators/injection.consts';

  /**
   * Component to show and select the available variants of a product for a given nest level.
   * TODO: Add logger warning on mount when result is not injected.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    }
  })
  export default class ResultVariantSelector extends Vue {
    /**
     * Callback to be called when a variant is selected.
     *
     * @public
     */
    @XInject(SELECT_RESULT_VARIANT_KEY)
    public selectResultVariant!: (variant: ResultVariant, level?: number) => void;

    /**
     * The original result, used to retrieve the available variants for the level.
     *
     * @public
     */
    @XInject(RESULT_WITH_VARIANTS_KEY)
    public result!: Result;

    /**
     * Array containing the selected variants.
     *
     * @public
     */
    @XInject(SELECTED_VARIANTS_KEY)
    public selectedVariants!: ResultVariant[];

    /**
     * The nest level of the variants to be rendered.
     *
     * @public
     */
    @Prop({
      default: 0
    })
    public level!: number;

    /**
     * It retrieves the available variants from the result.
     *
     * @returns - The variants of the result for the current level.
     * @internal
     */
    protected get variants(): ResultVariant[] | undefined {
      if (this.level === 0) {
        return this.result.variants;
      }
      return this.selectedVariants[this.level - 1]?.variants;
    }

    /**
     * Gets the selected variant of the current level.
     *
     * @returns - The selected variant.
     * @internal
     */
    protected get selectedVariant(): ResultVariant | undefined {
      return this.variants?.find(variant => variant === this.selectedVariants[this.level]);
    }

    /**
     * Calls the provided method to select a variant.
     *
     * @param variant - Variant to select.
     * @internal
     */
    protected selectVariant(variant: ResultVariant): void {
      this.selectResultVariant(variant, this.level);
    }

    /**
     * Checks if a variant is selected.
     *
     * @param variant - Variant to check.
     * @returns True if the variant is selected, false if not.
     * @internal
     */
    protected variantIsSelected(variant: ResultVariant): boolean {
      return this.selectedVariant === variant;
    }
  }
</script>

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
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantSelectorDemo',
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

### Play with the default slot

In this example the default slot is used to customize the list.

```vue
<template>
  <ResultVariantsProvider :result="result" #default="{ result }">
    <p>Result name: {{ result.name }}</p>

    <ResultVariantSelector :level="0" #default="{ variants, selectedVariant, selectVariant }">
      <div>
        <p v-if="selectedVariant">Selected variant: {{ selectedVariant.name }}</p>
        <ul class="x-list x-list--horizontal">
          <li v-for="(variant, index) in variants" :key="index">
            <button @click="selectVariant(variant)">{{ variant.name }}</button>
          </li>
        </ul>
      </div>
    </ResultVariantSelector>
  </ResultVariantsProvider>
</template>

<script>
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantSelectorDemo',
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
              name: 'red'
            },
            {
              name: 'blue'
            }
          ]
        }
      };
    }
  };
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
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantSelectorDemo',
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
              name: 'red'
            },
            {
              name: 'blue'
            }
          ]
        }
      };
    }
  };
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
  import { ResultVariantsProvider, ResultVariantSelector } from '@empathyco/x-components';

  export default {
    name: 'ResultVariantSelectorDemo',
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
              name: 'red'
            },
            {
              name: 'blue'
            }
          ]
        }
      };
    }
  };
</script>
```
</docs>
