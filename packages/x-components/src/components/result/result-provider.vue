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

  @Component
  export default class ResultProvider extends Vue {
    @Prop({
      required: true
    })
    @XProvide(RESULT_KEY)
    public result!: Result;

    @XProvide(SELECTED_VARIANTS_KEY)
    public selectedVariants: ResultVariant[] = [];

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

    render(createElement: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.resultToProvide
        })?.[0] ?? createElement()
      );
    }

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
