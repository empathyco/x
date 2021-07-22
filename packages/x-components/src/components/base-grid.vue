<template>
  <component
    :is="animation"
    :style="style"
    class="x-grid x-base-grid"
    :class="cssClasses"
    tag="ul"
    data-test="grid"
  >
    <li
      v-for="{ item, cssClass } in itemsWithCSSClass"
      :key="item.id"
      :class="cssClass"
      class="x-grid__item x-base-grid__item"
    >
      <!--
        @slot Customized item rendering. Specifying a slot with the item's modelName will result in
        the item using that slot composition to render.
            @binding {item} item - Item to render
      -->
      <slot v-if="$scopedSlots[item.modelName]" :name="item.modelName" :item="item" />
      <!--
        @slot (required) Default item rendering. This slot will be used by default for rendering
        the item without an specific slot implementation.
            @binding {item} item - Item to render
      -->
      <slot v-else :item="item">{{ item.name || item.modelName || item.id || item }}</slot>
    </li>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { toKebabCase } from '../utils/string';
  import { SearchItem, VueCSSClasses } from '../utils/types';
  import { XInject } from './decorators/injection.decorators';
  import { SEARCH_ITEMS_KEY } from './decorators/injection.consts';

  /**
   * Grid component that is able to render different items based on their modelName value. In order
   * to achieve this, it exposes a scopedSlot for each different modelName. In case the items used
   * do not have modelName property, the default slot is used instead. It has a required property:
   * the `items` to render; and an optional one: the number `columns` the grid is divided in. If the
   * number of columns is not specified, the grid automatically fills the rows with as many columns
   * as it can fit.
   *
   * @public
   */
  @Component({})
  export default class BaseGrid extends Vue {
    /**
     * Animation component that will be used to animate the base grid.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * Number of columns the grid is divided into. By default, its value is 0, setting the grid
     * columns mode to auto-fill.
     *
     * @public
     */
    @Prop({ default: 0 })
    protected columns!: number;

    /**
     * The list of items to be rendered.
     *
     * @remarks The items must have an id property.
     *
     * @public
     */
    @Prop()
    protected items!: SearchItem[];

    /**
     * It injects {@link SearchItem} provided by an ancestor.
     *
     * @internal
     */
    @XInject(SEARCH_ITEMS_KEY)
    public injectedSearchItems!: SearchItem[];

    /**
     * It returns the items passed as props or the injected ones.
     *
     * @returns List of grid items.
     *
     * @public
     */
    protected get computedItems(): SearchItem[] {
      return (
        this.items ??
        this.injectedSearchItems ??
        //TODO: add here logger
        //eslint-disable-next-line no-console
        console.warn('It is necessary to pass a prop or inject the list of filters')
      );
    }

    /**
     * CSS class based on the column property value so items inside the grid can fill different
     * amount of columns or rows based on how many columns the grid is divided into.
     *
     * @returns CSS class with the column property value.
     *
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return this.columns ? `x-base-grid--cols-${this.columns}` : 'x-base-grid--cols-auto';
    }

    /**
     * CSSStyleDeclaration object specifying the number of columns the grid is divided into based on
     * the column property value.
     *
     * @returns A CSSStyleDeclaration to use as the style attribute.
     *
     * @internal
     */
    protected get style(): Partial<CSSStyleDeclaration> {
      return {
        gridTemplateColumns: this.columns
          ? `repeat(${this.columns}, minmax(0, 1fr))`
          : 'repeat(auto-fill, minmax(var(--x-size-min-width-grid-item, 150px), auto))'
      };
    }

    /**
     * Maps the item to an object containing: the `item` and its `CSS class`.
     *
     * @returns An array of objects containing the item and its CSS class.
     *
     * @internal
     */
    protected get itemsWithCSSClass(): {
      item: SearchItem;
      cssClass: VueCSSClasses;
    }[] {
      return this.computedItems.map(item => ({
        item,
        cssClass: item.modelName
          ? `x-base-grid__${toKebabCase(item.modelName)}`
          : 'x-base-grid__default'
      }));
    }
  }
</script>

<style lang="scss" scoped>
  .x-base-grid {
    padding: var(--x-space-padding-grid, 0);
    margin: 0;
    display: grid;
    grid-auto-flow: dense;
    list-style: none;
  }
</style>

<docs lang="mdx">
#Examples

This component renders a list of elements in different slots depending on their modelName. In order
to achieve this, it exposes a scopedSlot for each different modelName. In case the items used do not
have modelName property, the default slot is used instead. It has a required property, the `items`
to render, and an optional one, the number of `columns` the grid is divided in. If the number of
columns is not specified, the grid automatically fills the rows with as many columns as it can fit.

## Basic example

It renders a list of items using the default slot:

```vue
<template>
  <BaseGrid :items="items">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>
```

## Configuring the number of columns

It renders a grid with 12 columns instead of 6, which is the default value:

```vue
<template>
  <BaseGrid :items="items" :columns="12">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>
```

## Rendering usage

Configuring the number of columns.

It renders a list of items using the different scopedSlots created by the item's modelName. For
example, if you want to use this component as the search grid, you pass the search results (results,
banners, promoted, next queries...etc) as items. Each of these results have a different modelName
and are rendered in different slots.

```vue
<template>
  <BaseGrid :animation="animation" :items="items">
    <template #Banner="{ item }">
      <span class="banner">
        {{ `${item.title} banner` }}
      </span>
    </template>
    <template #NextQueries="{ item }">
      <span>
        {{ `${item.totalResults} next queries` }}
      </span>
    </template>
    <template #Promoted="{ item }">
      <span class="promoted">
        {{ `${item.title} promoted` }}
      </span>
    </template>
    <template #Result="{ item }">
      <BaseResultLink :result="item">
        {{ item.name }}
      </BaseResultLink>
    </template>
  </BaseGrid>
</template>
```
</docs>
