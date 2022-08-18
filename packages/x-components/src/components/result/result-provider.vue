<script lang="ts">
  import Vue, { VNode, CreateElement } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import { XProvide } from '../decorators/injection.decorators';
  import {
    RESULT_KEY,
    SELECTED_VARIANTS_INDEXES_KEY,
    SET_RESULT_VARIANT_KEY
  } from '../decorators/injection.consts';

  @Component
  export default class ResultProvider extends Vue {
    @Prop({
      required: true
    })
    @XProvide(RESULT_KEY)
    public result!: Result;

    @XProvide(SELECTED_VARIANTS_INDEXES_KEY)
    public selectedIndexes: number[] = [];

    @XProvide(SET_RESULT_VARIANT_KEY)
    setResultVariant(level: number, variantIndex: number): void {
      if (this.selectedIndexes[level] === variantIndex) {
        return;
      }
      this.selectedIndexes = this.selectedIndexes.slice(0, level);
      this.$set(this.selectedIndexes, level, variantIndex);
    }

    render(createElement: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.resultToProvide
        })?.[0] ?? createElement()
      );
    }

    public get resultToProvide(): Result {
      if (!this.selectedIndexes) {
        return this.result;
      }
      const mergedResult = this.selectedIndexes.reduce((result, index) => {
        return {
          ...result,
          ...result.variants?.[index]
        };
      }, this.result);
      mergedResult.variants = this.result.variants;
      return mergedResult;
    }
  }
</script>
