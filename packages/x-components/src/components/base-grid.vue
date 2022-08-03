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
      v-for="{ slotName, item, cssClass } in gridItems"
      :key="item.id"
      :class="cssClass"
      class="x-grid__item x-base-grid__item"
    >
      <!--
        @slot Customized item rendering. Specifying a slot with the item's modelName will result in
        the item using that slot composition to render.
            @binding {item} item - Item to render
      -->
      <slot v-if="$scopedSlots[slotName]" :name="slotName" :item="item" />
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
  import { ListItem, VueCSSClasses } from '../utils/types';
  import { XInject } from './decorators/injection.decorators';
  import { LIST_ITEMS_KEY } from './decorators/injection.consts';

  /**
   * The type returned by the gridItems function. Basically it's a list of items with its CSS
   * classes and a slotName.
   *
   * @internal
   */
  interface GridItem {
    slotName: string;
    item: ListItem;
    cssClass: VueCSSClasses;
  }

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
    protected items!: ListItem[];

    /**
     * It injects {@link ListItem} provided by an ancestor.
     *
     * @internal
     */
    @XInject(LIST_ITEMS_KEY)
    public injectedListItems!: ListItem[];

    /**
     * It returns the items passed as props or the injected ones.
     *
     * @returns List of grid items.
     *
     * @public
     */
    protected get computedItems(): ListItem[] {
      return (
        this.items ??
        this.injectedListItems ??
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
      return this.columns ? `x-grid--cols-${this.columns}` : 'x-grid--cols-auto';
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
          : 'repeat(auto-fill, minmax(var(--x-size-min-width-grid-item, 150px), 1fr))'
      };
    }

    /**
     * Maps the item to an object containing: the `item`, its `CSS class` and its slot name.
     *
     * @returns An array of objects containing the item and its CSS class.
     *
     * @internal
     */
    protected get gridItems(): GridItem[] {
      return this.computedItems.map(item => {
        const slotName = toKebabCase(item.modelName);
        return {
          slotName,
          item,
          cssClass: `x-base-grid__${slotName}`
        };
      });
    }
  }
</script>

<style lang="scss" scoped>
  .x-base-grid {
    padding: var(--x-size-padding-grid, 0);
    margin: 0;
    display: grid;
    grid-auto-flow: dense;
    list-style: none;

    &__banner,
    &__next-queries-group {
      grid-column-start: 1;
      grid-column-end: -1;
    }
  }
</style>

<docs lang="mdx">
## Examples

This component renders a list of elements in different slots depending on their modelName. In order
to achieve this, it exposes a scopedSlot for each different modelName. In case the items used do not
have modelName property, the default slot is used instead. It has a required property, the `items`
to render, and an optional one, the number of `columns` the grid is divided in. If the number of
columns is not specified, the grid automatically fills the rows with as many columns as it can fit.

### Basic example

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

### Configuring the number of columns

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

### Rendering usage

Configuring the number of columns.

It renders a list of items using the different scopedSlots created by the item's modelName. For
example, if you want to use this component as the search grid, you pass the search results (results,
banners, promoted, next queries...etc) as items. Each of these results have a different modelName
and are rendered in different slots.

```vue
<template>
  <BaseGrid :animation="animation" :items="items">
    <template #banner="{ item }">
      <span class="banner">
        {{ `${item.title} banner` }}
      </span>
    </template>
    <template #next-queries="{ item }">
      <span>
        {{ `${item.totalResults} next queries` }}
      </span>
    </template>
    <template #promoted="{ item }">
      <span class="promoted">
        {{ `${item.title} promoted` }}
      </span>
    </template>
    <template #result="{ item }">
      <BaseResultLink :result="item">
        {{ item.name }}
      </BaseResultLink>
    </template>
  </BaseGrid>
</template>
```
</docs>
