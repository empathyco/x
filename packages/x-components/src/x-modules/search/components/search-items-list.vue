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
      <slot :searchItem="searchItem" :name="searchItem.slotName">{{ searchItem.id }}</slot>
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { SearchItem } from '../../../utils/types';
  import { toKebabCase } from '../../../utils/string';

  /**
   * It renders a list of {@link SearchItem} providing a slot for each `slotName` which depends on
   * the `modelName`of the searchItem.
   *
   * @public
   */
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
          dataTest: `${modelName}s-list-item`,
          class: [`x-${modelName}s-list-item`],
          slotName: modelName
        };
      });
    }
  }
</script>
