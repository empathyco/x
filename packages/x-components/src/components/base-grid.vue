<template>
  <component
    :is="animation"
    ref="gridEl"
    :style="style"
    class="x-base-grid"
    :class="cssClasses"
    tag="ul"
    data-test="grid"
  >
    <li
      v-for="{ item, cssClass, slotName } in gridItems"
      :key="item.id"
      :class="cssClass"
      class="x-base-grid__item"
    >
      <!--
        @slot Customized item rendering. Specifying a slot with the item's modelName will result in
        the item using that slot composition to render.
            @binding {item} item - Item to render
      -->
      <slot v-if="slots[slotName]" :name="slotName" :item="item" />
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
import type { MaybeComputedElementRef, UseResizeObserverReturn } from '@vueuse/core'
import type { PropType, Ref } from 'vue'
import type { ListItem, VueCSSClasses } from '../utils/types'
import { useResizeObserver } from '@vueuse/core'
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useXBus } from '../composables/use-x-bus'
import { AnimationProp } from '../types/animation-prop'
import { toKebabCase } from '../utils/string'
import { LIST_ITEMS_KEY } from './decorators/injection.consts'

/**
 * The type returned by the gridItems function. Basically it's a list of items with its CSS
 * classes and a slotName.
 */
interface GridItem {
  slotName: string
  item: ListItem
  cssClass: VueCSSClasses
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
export default defineComponent({
  name: 'BaseGrid',
  props: {
    /** Animation component that will be used to animate the base grid. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
    /**
     * Number of columns the grid is divided into. By default, its value is 0, setting the grid
     * columns mode to auto-fill.
     */
    columns: {
      type: Number,
      default: 0,
    },
    /**
     * The list of items to be rendered.
     *
     * @remarks The items must have an ID property.
     */
    items: {
      type: Array as PropType<ListItem[]>,
    },
  },
  setup(props, { slots }) {
    // eslint-disable-next-line ts/consistent-type-definitions
    type ElementRef = {
      $el: HTMLElement
    }

    const xBus = useXBus()

    /** It injects {@link ListItem} provided by an ancestor. */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)
    const gridEl = ref<ElementRef | HTMLElement>()
    const renderedColumnsNumber = ref(0)

    /**
     * Emits the {@link XEventsTypes.RenderedColumnsNumberChanged}
     * event whenever the number of columns rendered inside the grid changes.
     */
    watch(
      renderedColumnsNumber,
      () => xBus.emit('RenderedColumnsNumberChanged', renderedColumnsNumber.value),
      { immediate: false },
    )

    /**
     * It returns the items passed as props or the injected ones.
     *
     * @returns List of grid items.
     */
    const computedItems = computed<ListItem[] | void>(() => {
      return (
        props.items ??
        injectedListItems?.value ??
        console.warn('It is necessary to pass a prop or inject the list of filters')
      )
    })

    /**
     * CSS class based on the column property value so items inside the grid can fill different
     * amount of columns or rows based on how many columns the grid is divided into.
     *
     * @returns CSS class with the column property value.
     */
    const cssClasses = computed(() => `x-base-grid--cols-${props.columns || 'auto'}`)

    /**
     * CSSStyleDeclaration object specifying the number of columns the grid is divided into based on
     * the column property value.
     *
     * @returns A CSSStyleDeclaration to use as the style attribute.
     */
    const style = computed<Partial<CSSStyleDeclaration>>(() => ({
      gridTemplateColumns: props.columns
        ? `repeat(${props.columns}, minmax(0, 1fr))`
        : 'repeat(auto-fill, minmax(var(--x-size-min-width-grid-item, 150px), 1fr))',
    }))

    /**
     * Maps the item to an object containing: the `item`, its `CSS class` and its slot name.
     *
     * @returns An array of objects containing the item and its CSS class.
     */
    const gridItems = computed<GridItem[]>(() =>
      (computedItems.value as ListItem[]).map(item => {
        const slotName = toKebabCase(item.modelName)
        return {
          slotName,
          item,
          cssClass: `x-base-grid__${slotName}`,
        }
      }),
    )

    /**
     * Checks if a given value is an `ElementRef` object.
     *
     * @param value - The value to check.
     * @returns `true` if the value is an `ElementRef` object, `false` otherwise.
     */
    const isElementRef = (value: any): value is ElementRef => {
      return value && value.$el instanceof HTMLElement
    }

    /** Updates the number of columns rendered inside the grid. */
    function updateRenderedColumnsNumber() {
      const { gridTemplateColumns } = getComputedStyle(
        isElementRef(gridEl.value) ? gridEl.value.$el : (gridEl.value as Element),
      )
      renderedColumnsNumber.value = gridTemplateColumns.split(' ').length
    }

    /** Initialises the rendered columns number and sets a ResizeObserver to keep it updated. */
    let resizeObserver: UseResizeObserverReturn
    onMounted(() => {
      resizeObserver = useResizeObserver(
        gridEl as MaybeComputedElementRef,
        updateRenderedColumnsNumber,
      )
    })
    onBeforeUnmount(() => resizeObserver?.stop())

    return {
      gridItems,
      cssClasses,
      style,
      gridEl,
      slots,
    }
  },
})
</script>

<style lang="css" scoped>
.x-base-grid {
  display: grid;
  grid-auto-flow: dense;
  list-style: none;
  align-items: stretch;
}

.x-base-grid__banner,
.x-base-grid__next-queries-group,
.x-base-grid__related-prompts-group {
  grid-column-start: 1;
  grid-column-end: -1;
}

.x-base-grid__item {
  display: flex;
  flex-flow: column nowrap;
}

.x-base-grid__item > * {
  flex-grow: 1;
}

.x-base-grid--cols-auto .x-base-grid__item {
  min-width: var(--x-size-min-width-grid-item);
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

### Customizing the items width

The `--x-size-min-width-grid-item` variable can be used to customize the min width of the grid
items.

```vue
<template>
  <BaseGrid :items="items" style="--x-size-min-width-grid-item: 150px">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>
```
</docs>
