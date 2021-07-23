<template>
  <component
    :is="animation"
    v-if="searchItems.length"
    tag="ul"
    class="x-search-items-list"
    data-test="search-items-list"
  >
    <li
      v-for="searchItem in computedSearchItems"
      :key="searchItem.id"
      class="x-search-items-list__item"
      :class="searchItem.class"
      :data-test="searchItem.dataTest"
    >
      <!--
        @slot Customized Search items list search item.
          @binding {SearchItem} searchItem - Search item data.
      -->
      <slot :searchItem="searchItem" :name="searchItem.slotName">{{ searchItem.slotName }}</slot>
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { SearchItem } from '../../../utils/types';
  import { toKebabCase } from '../../../utils/string';

  @Component
  export default class SearchItemList extends Vue {
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
    protected searchItems!: SearchItem[];

    /**
     * The list of the search items with additional properties.
     *
     * @returns A list of search items with `dataTest`, `class` and the `slotName` for each item.
     *
     * @internal
     */
    protected get computedSearchItems(): {
      dataTest: string;
      class: string[];
    }[] {
      return this.searchItems.map(searchItem => {
        const modelName = toKebabCase(searchItem.modelName);
        return {
          ...searchItem,
          dataTest: `${modelName}-list-item`,
          class: [`${modelName}-list-item`],
          slotName: modelName
        };
      });
    }
  }
</script>
