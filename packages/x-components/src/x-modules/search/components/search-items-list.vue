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

  @Component
  export default class SearchItemList extends Vue {
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    @Prop({ required: true })
    protected searchItems!: SearchItem[];

    protected get computedSearchItems(): {
      dataTest: string;
      class: string[];
    }[] {
      return this.searchItems.map(searchItem => {
        const modelName = searchItem.modelName.toLowerCase();
        return {
          ...searchItem,
          dataTest: `${modelName}-list-item`,
          class: [`${modelName}-list-item`],
          slotName: modelName.toLowerCase() // todo: PascalCase to kebab-case
        };
      });
    }
  }
</script>
