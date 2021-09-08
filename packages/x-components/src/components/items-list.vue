<template>
  <component
    :is="animation"
    v-if="items.length"
    tag="ul"
    class="x-search-items-list"
    data-test="items-list"
  >
    <li
      v-for="item in computedItems"
      :key="item.id"
      class="x-items-list__item"
      :class="item.class"
      :data-test="item.dataTest"
    >
      <!--
        @slot Customized Search items list search item.
          @binding {ListItem} item - Item data.
      -->
      <slot :item="item" :name="item.slotName">{{ item.id }}</slot>
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { ListItem } from '../utils/types';
  import { toKebabCase } from '../utils/string';

  /**
   * It renders a list of {@link ListItem} providing a slot for each `slotName` which depends on
   * the `modelName`of the item.
   *
   * @public
   */
  @Component
  export default class ItemsList extends Vue {
    /**
     * Animation component that will be used to animate the list.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * List of search items.
     *
     * @public
     */
    @Prop({ required: true })
    protected items!: ListItem[];

    /**
     * The list of the items with additional properties.
     *
     * @returns A list of search items with `dataTest`, `class` and the `slotName` for each item.
     *
     * @internal
     */
    protected get computedItems(): {
      dataTest: string;
      class: string[];
    }[] {
      return this.items.map(item => {
        const modelName = toKebabCase(item.modelName);
        return {
          ...item,
          dataTest: `${modelName}s-list-item`,
          class: [`x-${modelName}s-list-item`],
          slotName: modelName
        };
      });
    }
  }
</script>
