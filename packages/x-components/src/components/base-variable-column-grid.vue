<template>
  <BaseGrid :animation="animation" :columns="columns" :items="items">
    <template v-for="(_, name) in $scopedSlots" v-slot:[name]="{ item }">
      <!--
        @slot Customized item rendering. The slot name can either be default or the item's model
         name.
            @binding {GridItem} item - Item to render.
      -->
      <slot :name="name" v-bind="{ item }" />
    </template>
  </BaseGrid>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { GridItem } from '../utils/types';
  import BaseGrid from './base-grid.vue';
  import { XOn } from './decorators/bus.decorators';

  /**
   * The `BaseVariableColumnGrid` component is a wrapper of the `BaseGrid` component that listens to
   * the `UserClickedColumnPicker` and the `ColumnPickerSetColumnsNumber` events and passes the
   * selected number of columns to the grid. It also allows to customize the grid items using the
   * available `scopedSlots`.
   *
   * @public
   */
  @Component({
    components: {
      BaseGrid
    }
  })
  export default class BaseVariableColumnGrid extends Vue {
    /**
     * Animation component that will be used to animate the grid.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;
    /**
     * The list of items to be rendered.
     *
     * @remarks The items must have an id property.
     *
     * @public
     */
    @Prop({ required: true })
    protected items!: GridItem[];

    /**
     * The columns to render in the grid.
     *
     * @internal
     */
    protected columns = 0;

    /**
     * Handler to update the number of columns when the user selects a new value.
     *
     * @param newColumns - The new columns value.
     *
     * @internal
     */
    @XOn(['UserClickedColumnPicker', 'ColumnPickerSetColumnsNumber'])
    setColumns(newColumns: number): void {
      this.columns = newColumns;
    }
  }
</script>

<docs lang="mdx">
# Example

The `BaseVariableColumnGrid` component is a wrapper of the `BaseGrid` component that listens to the
`UserClickedColumnPicker` and the `ColumnPickerSetColumnsNumber` events and passes the selected
amount of columns to the grid. It also allows you to customize the grid items using the available
`scopedSlots`.

```vue
<template>
  <section class="results">
    <button @click="setColumns(4)" class="column-picker-selector">
      <span class="column-picker-selector__text">4 columns</span>
    </button>
    <BaseVariableColumnGrid :animation="animation" :items="items">
      <template #default="{ item }">
        <span data-test="default-slot">{{ item.id }}</span>
      </template>
      <template #Result="{ item }">
        <span data-test="result-slot">{{ 'Result ' + item.id }}</span>
      </template>
    </BaseVariableColumnGrid>
  </section>
</template>

<script>
  import { BaseVariableColumnGrid, StaggeredFadeAndSlide } from '@empathyco/x-components';

  export default {
    name: 'ResultsSection',
    components: {
      BaseVariableColumnGrid
    },
    data() {
      return {
        animation: StaggeredFadeAndSlide,
        items: [
          {
            id: 'res-1',
            modelName: 'Result',
            name: 'Product 1'
          },
          {
            id: 'res-2',
            modelName: 'Result',
            name: 'Product 2'
          }
        ]
      };
    },
    methods: {
      setColumns(columns) {
        this.$x.emit('UserClickedColumnPicker', columns);
      }
    }
  };
</script>
```
</docs>
