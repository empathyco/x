<template>
  <NoElement>
    <slot :variants="variants">
      <ul>
        <li
          v-for="variant in variants"
          :key="result.id + '_' + level + variant.name"
          data-test="variant-name"
        >
          {{ variant.name }}
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import { Result, ResultVariant } from '@empathyco/x-types';
  import { NoElement } from '../../../components/no-element';

  @Component({
    components: {
      NoElement
    }
  })
  export default class ResultSelector extends Vue {
    @Inject('setResultVariant')
    public setResultVariant!: (level: number, variantIndex: number) => void;

    @Inject('result')
    public result!: Result;

    @Inject('selectedIndexes')
    public selectedIndexes!: number[];

    @Prop({
      required: true
    })
    public level!: number;

    public get variants(): ResultVariant[] | undefined {
      if (!this.selectedIndexes.length) {
        return [];
      }
      return this.selectedIndexes.slice(1, this.level).reduce((selectedVariant, selectedIndex) => {
        return selectedVariant?.variants?.[selectedIndex];
      }, this.result.variants?.[this.selectedIndexes[0]])?.variants;
    }
  }
</script>
