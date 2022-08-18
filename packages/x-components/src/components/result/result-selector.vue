<template>
  <NoElement v-if="result && variants" data-test="variant-container">
    <slot :variants="variants" :selectedVariant="selectedVariant" :selectVariant="selectVariant">
      <ul>
        <li v-for="(variant, index) in variants" :key="index" data-test="variant-item">
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

  @Component({
    components: {
      NoElement
    }
  })
  export default class ResultSelector extends Vue {
    @XInject(SET_RESULT_VARIANT_KEY)
    public setResultVariant!: (level: number, variant: ResultVariant) => void;

    @XInject(RESULT_KEY)
    public result!: Result;

    @XInject(SELECTED_VARIANTS_KEY)
    public selectedVariants!: ResultVariant[];

    @Prop({
      required: true
    })
    public level!: number;

    public get variants(): ResultVariant[] | undefined {
      if (this.level === 0) {
        return this.result.variants;
      }
      return this.selectedVariants[this.level - 1].variants;
    }

    public get selectedVariant(): ResultVariant | undefined {
      return this.variants?.find(variant => variant === this.selectedVariants[this.level]);
    }

    selectVariant(variant: ResultVariant): void {
      this.setResultVariant(this.level, variant);
    }
  }
</script>
