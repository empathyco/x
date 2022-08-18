<template>
  <NoElement v-if="result && variants" data-test="variant-container">
    <slot :variants="variants" :selectedVariant="selectedVariant" :selectVariant="selectVariant">
      <ul>
        <li v-for="(variant, index) in variants" :key="index" data-test="variant-item">
          <slot
            name="variant"
            :variant="variant"
            :isSelected="variant === selectedVariant"
            :selectVariant="selectVariant.bind(this, variant)"
          >
            <button @click="setResultVariant(level, index)" data-test="variant-button">
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
    SELECTED_VARIANTS_INDEXES_KEY,
    SET_RESULT_VARIANT_KEY
  } from '../decorators/injection.consts';

  @Component({
    components: {
      NoElement
    }
  })
  export default class ResultSelector extends Vue {
    @XInject(SET_RESULT_VARIANT_KEY)
    public setResultVariant!: (level: number, variantIndex: number) => void;

    @XInject(RESULT_KEY)
    public result!: Result;

    @XInject(SELECTED_VARIANTS_INDEXES_KEY)
    public selectedIndexes!: number[];

    @Prop({
      required: true
    })
    public level!: number;

    public get variants(): ResultVariant[] | undefined {
      if (this.level === 0) {
        return this.result.variants;
      }
      return this.selectedIndexes.slice(1, this.level).reduce((selectedVariant, selectedIndex) => {
        return selectedVariant?.variants?.[selectedIndex];
      }, this.result.variants?.[this.selectedIndexes[0]])?.variants;
    }

    public get selectedVariant(): ResultVariant | undefined {
      return this.variants?.[this.selectedIndexes[this.level]];
    }

    selectVariant(variant: ResultVariant): void {
      if (this.variants) {
        this.setResultVariant(this.level, this.variants.indexOf(variant));
      }
    }
  }
</script>
