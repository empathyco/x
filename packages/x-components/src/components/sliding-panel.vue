<template>
  <div v-if="slots.default" class="x-sliding-panel" :class="cssClasses" data-test="sliding-panel">
    <div
      ref="scrollContainerRef"
      :class="scrollContainerClass"
      class="x-sliding-panel__scroll"
      data-test="sliding-panel-scroll"
    >
      <!-- @slot (Required) Sliding panel content -->
      <slot />
    </div>
    <slot name="sliding-panel-addons" :arrived-state="arrivedState" :scroll="xScroll" />
    <template v-if="showButtons">
      <button
        class="x-sliding-panel__button x-button x-sliding-panel-button-left"
        :class="buttonClass"
        data-test="sliding-panel-left-button"
        @click="xScroll -= slotContainerWidth * scrollFactor"
      >
        <!-- @slot Left button content -->
        <slot name="sliding-panel-left-button">ᐸ</slot>
      </button>
      <button
        class="x-sliding-panel__button x-button x-sliding-panel-button-right"
        :class="buttonClass"
        data-test="sliding-panel-right-button"
        @click="xScroll += slotContainerWidth * scrollFactor"
      >
        <!-- @slot Right button content -->
        <slot name="sliding-panel-right-button">ᐳ</slot>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../utils/types'
import {
  useElementBounding,
  useElementVisibility,
  useMutationObserver,
  useScroll,
  whenever,
} from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'

/**
 * This component allows for any other component or element inside it to be horizontally
 * navigable. It also implements customizable buttons as well as other minor customizations to its
 * general behavior.
 *
 * Additionally, this component exposes the following props to modify the classes of the
 * elements: `buttonClass`.
 *
 * @public
 */
export default defineComponent({
  name: 'SlidingPanel',
  props: {
    /**
     * Scroll factor that will dictate how much the scroll moves when pressing a navigation button.
     */
    scrollFactor: {
      type: Number,
      default: 0.7,
    },
    /** Would make the navigation buttons visible when they're needed or always hide them. */
    showButtons: {
      type: Boolean,
      default: true,
    },
    /**
     * When true, whenever the DOM content in the sliding panel slot changes, it will reset
     * the scroll position to 0.
     */
    resetOnContentChange: {
      type: Boolean,
      default: true,
    },
    buttonClass: { type: [String, Object, Array] as PropType<VueCSSClasses> },
    scrollContainerClass: { type: [String, Object, Array] as PropType<VueCSSClasses> },
  },
  setup(props, { slots }) {
    const scrollContainerRef = ref<HTMLDivElement>()

    const { width: slotContainerWidth } = useElementBounding(scrollContainerRef)
    const isVisible = useElementVisibility(scrollContainerRef)

    const {
      x: xScroll,
      arrivedState,
      measure,
    } = useScroll(scrollContainerRef, {
      behavior: 'smooth',
    })

    /** CSS classes to apply based on the scroll position. */
    const cssClasses = computed(() => ({
      'x-sliding-panel-at-start': arrivedState.left,
      'x-sliding-panel-at-end': arrivedState.right,
    }))

    if (props.resetOnContentChange) {
      useMutationObserver(
        scrollContainerRef,
        mutations => {
          if (mutations.length > 0) {
            xScroll.value = 0
          }
        },
        {
          subtree: true,
          childList: true,
          attributes: false,
          characterData: false,
        },
      )
    }
    //ensure positions are right calculated as soon as the sliding panel is shown
    whenever(isVisible, measure)

    return {
      arrivedState,
      cssClasses,
      scrollContainerRef,
      slotContainerWidth,
      xScroll,
      slots,
    }
  },
})
</script>

<style lang="css" scoped>
.x-sliding-panel {
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
}

.x-sliding-panel__button {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: all ease-out 0.2s;
  z-index: 2; /* To overlay the design system gradient with z-index:1 */
}
.x-sliding-panel-button-left {
  left: 0;
}
.x-sliding-panel-button-right {
  right: 0;
}

.x-sliding-panel__scroll {
  display: flex;
  flex: 100%;
  flex-flow: row nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
}

/* Chrome, Edge & Safari */
.x-sliding-panel__scroll::-webkit-scrollbar {
  display: none;
}

.x-sliding-panel__scroll > * {
  flex: 0 0 auto;
}

/* prettier-ignore */
.x-sliding-panel:not(.x-sliding-panel-show-buttons-on-hover):not(.x-sliding-panel-at-start) .x-sliding-panel-button-left {
    opacity: 1;
    pointer-events: all;
  }

/* prettier-ignore */
.x-sliding-panel:not(.x-sliding-panel-show-buttons-on-hover):not(.x-sliding-panel-at-end) .x-sliding-panel-button-right {
    opacity: 1;
    pointer-events: all;
  }
</style>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

Simplest implementation of the component, just a list-based component inside its slot.

```vue
<template>
  <SlidingPanel>
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```

### Play with props

#### Modifying scroll buttons travel distance

Edit how much the scroll travels when navigating with the buttons by changing the `scrollFactor`
prop.

```vue
<template>
  <SlidingPanel :scrollFactor="1.5">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```

#### Hiding scroll buttons

Hide the navigational buttons completely by setting the `showButtons` prop to `false`. This is
intended to be used when other scrolling options are available, like in mobile, where you can scroll
just by swiping.

```vue
<template>
  <SlidingPanel :showButtons="false">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```

#### Customizing the content with classes

The `buttonClass` prop can be used to add classes to the buttons.

The `scrollContainerClass` prop can be used to add classes to the scroll content.

```vue
<template>
  <SlidingPanel buttonClass="x-button--round" scrollContainerClass="x-sliding-panel-fade">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
  </SlidingPanel>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```

#### Disabling reset the scroll when content changes

By default, whenever the content of the sliding panel changes, it auto resets its scroll position.
You can disable this behavior setting the `resetOnContentChange` prop to `false`.

```vue
<template>
  <div>
    <button @click="items++">Add item</button>
    <label>
      <input type="checkbox" v-model="resetOnContentChange" />
      Reset content onchange
    </label>
    <SlidingPanel :resetOnContentChange="resetOnContentChange">
      <div class="item" v-for="item in items" :key="item">Item {{ item }}</div>
    </SlidingPanel>
  </div>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
  data() {
    return {
      items: 4,
      resetOnContentChange: false,
    }
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```

## Extending the component

### Overriding Button content

By default the buttons show an arrow depicting the direction the scroll would go to when clicked,
but this content can be customized with anything, from characters to SVG and images.

```vue
<template>
  <SlidingPanel>
    <template #sliding-panel-left-button>Left</template>
    <template #default>
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">Item 3</div>
      <div class="item">Item 4</div>
    </template>
    <template #sliding-panel-right-button>Right</template>
  </SlidingPanel>
</template>

<script>
import { SlidingPanel } from '@empathyco/x-components'

export default {
  name: 'SlidingPanelDemo',
  components: {
    SlidingPanel,
  },
}
</script>

<style>
.x-sliding-panel {
  width: 200px;
}

.item {
  display: inline-block;
  width: 100px;
}
</style>
```
</docs>
