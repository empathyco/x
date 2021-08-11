<script lang="ts">
  import Vue, { CreateElement, VNode, VNodeChildren } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { RangeValue } from '@empathyco/x-types';
  import BaseCurrency from '../../currency/base-currency.vue';

  /**
   * Renders a label for a price filter, allowing to select different messages depending on the
   * value of the filter.
   *
   * @public
   */
  @Component({
    components: { BaseCurrency }
  })
  export default class BasePriceFilterLabel extends Vue {
    /** The filter data for get min and max value. */
    @Prop({ required: true })
    public filter!: { range: RangeValue };

    /** Configuration for show the label. */
    @Prop()
    public format?: string;

    /**
     * Message shown when the filter hasn't got the min value defined.
     *
     * @public
     */
    @Prop({ required: true })
    public lessThan!: string;

    /**
     * Message shown when the filter has both the min and max values defined.
     *
     * @public
     */
    @Prop({ required: true })
    public fromTo!: string;

    /**
     * Message shown when the filter hasn't got max value defined.
     *
     * @public
     */
    @Prop({ required: true })
    public from!: string;

    /**
     * The active label, retrieved from the provided props.
     * It depends on the min and max values of the filter.
     *
     * @returns The active label to be formatted with the min and max values of the filter.
     */
    protected get label(): string {
      return this.filter.range.min === null
        ? this.lessThan
        : this.filter.range.max === null
        ? this.from
        : this.fromTo;
    }

    render(createElement: CreateElement): VNode {
      const labelParts = this.label.split(/({min}|{max})/);

      const children: VNodeChildren = labelParts.map(partMessage => {
        if (partMessage === '{min}') {
          return createElement('BaseCurrency', {
            props: {
              value: this.filter.range.min,
              format: this.format
            }
          });
        } else if (partMessage === '{max}') {
          return createElement('BaseCurrency', {
            props: {
              value: this.filter.range.max,
              format: this.format
            }
          });
        }
        return partMessage;
      });

      return createElement('span', { class: 'x-price-filter-label' }, children);
    }
  }
</script>

<docs lang="mdx">
# Example

Renders a label for a price filter, allowing to select different messages depending on the value of
the filter.

- When the `min` value property isn't defined in the filter, you can show a message like
  `Less than $10` by using the `lessThan` prop, combined with the `{max}` placeholder.
- When the `max` value property isn't defined in the filter, you can show a message like
  `More than $300` by using the `from` prop, combined with the `{min}` placeholder.
- If both the `min` and `max` values of the filter are defined, you can show a message like
  `$10 - $300` by using the `fromTo` prop.

This component uses internally the `BaseCurrency` one, so you can pass the same props to configure
how the price should look like.

## Basic usage

```vue
<template>
  <Facets>
    <template #price="{ facet }">
      <Filters v-slot="{ filter }" :filters="facet.filters">
        <NumberRangeFilter :filter="filter" v-slot="{ filter }">
          <BasePriceFilterLabel
            :filter="filter"
            format="$i"
            lessThan="Less than {max}"
            fromTo="From {min} to {max}"
            from="More than {min}"
          />
        </NumberRangeFilter>
      </Filters>
    </template>
  </Facets>
</template>

<script>
  import { BasePriceFilterLabel } from '@empathyco/x-components';
  import { Filters, Facets, NumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'MyFacets',
    components: {
      Facets,
      Filters,
      NumberRangeFilter,
      BasePriceFilterLabel
    }
  };
</script>
```
</docs>
