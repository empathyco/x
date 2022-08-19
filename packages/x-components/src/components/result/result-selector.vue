<template>
  <NoElement v-if="result && variants" data-test="variant-container">
    <!--
      @slot Variants list
        @binding {ResultVariant[]} variants - Array containing the available variants
        @binding {ResultVariant | undefined} selectedVariant - The selected variant
        @binding {(variant: ResultVariant) => void} selectVariant - Callback to select a variant
    -->
    <slot :variants="variants" :selectedVariant="selectedVariant" :selectVariant="selectVariant">
      <ul>
        <li v-for="(variant, index) in variants" :key="index" data-test="variant-item">
          <!--
            @slot Variant item
              @binding {ResultVariant} variant - The variant item
              @binding {boolean} isSelected - Indicates if the variant is selected
              @binding {() => void} selectVariant - Callback to select the variant
          -->
          <slot
            name="variant"
            :variant="variant"
            :isSelected="variant === selectedVariant"
            :selectVariant="
              () => {
                selectVariant(variant);
              }
            "
          >
            <button @click="selectVariant(variant)" data-test="variant-button">
              {{ variant }}
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
    RESULT_KEY,
    SELECTED_VARIANTS_KEY,
    SET_RESULT_VARIANT_KEY
  } from '../decorators/injection.consts';

  /**
   * Component to show and select the available variants of a product for a given nest level.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    }
  })
  export default class ResultSelector extends Vue {
    /**
     * Callback to be called when a variant is selected.
     *
     * @public
     */
    @XInject(SET_RESULT_VARIANT_KEY)
    public setResultVariant!: (level: number, variant: ResultVariant) => void;

    /**
     * The original result, used to retrieve the available variants for the level.
     *
     * @public
     */
    @XInject(RESULT_KEY)
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
      required: true
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
      this.setResultVariant(this.level, variant);
    }
  }
</script>
