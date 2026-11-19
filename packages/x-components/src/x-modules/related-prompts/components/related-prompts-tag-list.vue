<template>
  <SlidingPanel
    :key="x.query.search"
    ref="slidingPanel"
    :class="{ 'x-related-prompts-tag-list--placeholder': showPlaceholder }"
    :fade="selectedPromptIndex === -1"
    :reset-on-content-change="false"
    :button-class="buttonClass"
    :show-buttons="showButtons && selectedPromptIndex === -1"
    :scroll-container-class="[
      'x-related-prompts-tag-list-scroll-container',
      scrollContainerClass || '',
    ]"
  >
    <template #sliding-panel-left-button>
      <!--
      @slot sliding-panel-left-button - The button to be displayed on the left side of the sliding panel.
      -->
      <slot name="sliding-panel-left-button" />
    </template>
    <transition-group
      class="x-related-prompts-tag-list"
      :css="false"
      tag="ul"
      appear
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <li
        v-for="{ index, ...relatedPrompt } in visibleRelatedPrompts"
        ref="listItems"
        :key="relatedPrompt.suggestionText"
        class="x-related-prompts-tag-list-item"
        :class="[tagClass, tagColors && tagColors[index % tagColors.length]]"
        :data-index="index"
        :style="{
          ...(selectedPromptIndex === index && { width: '100%' }),
          ...(isAnimating && { pointerEvents: 'none' }),
        }"
        data-test="related-prompts-tag-list-item"
      >
        <!--
         @slot - The slot to render related prompt information.
         @prop {Object} relatedPrompt - The related prompt object.
         @prop {Function} onSelect - The function to select the related prompt.
         @prop {Boolean} isSelected - Indicates if the related prompt is currently selected.
         -->
        <slot
          :related-prompt="relatedPrompt"
          :on-select="() => onSelect(index)"
          :is-selected="selectedPromptIndex === index"
        >
          <DisplayEmitter
            :payload="relatedPrompt.tagging?.toolingDisplayTagging!"
            :event-metadata="{
              feature: 'related-prompts',
              displayOriginalQuery: x.query.searchBox,
              replaceable: false,
            }"
          >
            <RelatedPrompt
              :related-prompt="relatedPrompt"
              :selected="selectedPromptIndex === index"
              @click="onSelect(index)"
            >
              <template #related-prompt-extra-content>
                <!--
                 @slot related-prompt-extra-content - The slot to render related prompt extra information.
                 @prop {Object} relatedPrompt - The related prompt object.
                -->
                <slot name="related-prompt-extra-content" :related-prompt="relatedPrompt" />
              </template>
            </RelatedPrompt>
          </DisplayEmitter>
        </slot>
      </li>
    </transition-group>
    <template #sliding-panel-right-button>
      <!--
      @slot sliding-panel-right-button - The button to be displayed on the right side of the sliding panel.
      -->
      <slot name="sliding-panel-right-button" />
    </template>
  </SlidingPanel>
</template>

<script lang="ts">
import type { RelatedPromptsRequest } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { deepEqual } from '@empathyco/x-utils'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import DisplayEmitter from '../../../components/display-emitter.vue'
import SlidingPanel from '../../../components/sliding-panel.vue'
import { use$x, useGetter, useOnDisplay, useState, useXBus } from '../../../composables'
import { relatedPromptsXModule } from '../x-module'
import RelatedPrompt from './related-prompt.vue'

/**
 * This component shows the list of `RelatedPrompts` components.
 *
 * If the default slot is reimplemented in the consumer, `onSelect` function will be
 * necessary to handle the selection of the related prompt and to trigger the stagger-fade-slide animation.
 *
 * @public
 */
export default defineComponent({
  name: 'RelatedPromptsTagList',
  xModule: relatedPromptsXModule.name,
  components: { DisplayEmitter, RelatedPrompt, SlidingPanel },
  props: {
    /**
     * The CSS class for the left and right button of the sliding panel.
     *
     * @public
     */
    buttonClass: String,
    /**
     * The boolean prop to handle the visiblity of sliding pannel buttons.
     *
     * @public
     */
    showButtons: { type: Boolean, default: true },
    /**
     * The CSS class for the wrapper of all the related prompt wrapper elements.
     *
     * @public
     */
    scrollContainerClass: String,
    /**
     * The CSS class for all the related prompt wrapper elements.
     *
     * @public
     */
    tagClass: String,
    /**
     * Array of colors to apply to the related prompts. It will be applied to tag
     * elements cyclically according to their index in the nex way: `tagColors[index % tagColors.length]`.
     *
     * @public
     */
    tagColors: Array as PropType<string[]>,
    /**
     * The duration of the total animation in milliseconds.
     *
     * @public
     */
    animationDurationInMs: {
      type: Number,
      default: 700,
    },
    /**
     * Controls whether the related prompts request should be triggered when the component is
     * visible in the viewport.
     *
     * @public
     */
    loadWhenVisible: {
      type: Boolean,
      default: false,
    },
    /**
     * The id of the scroll container to compute the visibility against.
     *
     * @public
     */
    scrollTarget: {
      type: String,
      default: 'main-scroll',
    },
  },
  setup(props) {
    const x = use$x()
    const xBus = useXBus()
    const {
      relatedPrompts,
      selectedPrompt: selectedPromptIndex,
      status,
    } = useState('relatedPrompts')

    const clickedListItemIndex = ref<number | null>(null)
    const initialOffsetLefts: Record<number, number> = {}
    const isAnimating = ref(false)
    const listItems = ref<HTMLElement[]>([])

    const sortedListItems = computed<HTMLElement[]>(() =>
      [...listItems.value].sort(
        (a: HTMLElement, b: HTMLElement) =>
          Number.parseInt(b.getAttribute('data-index')!) -
          Number.parseInt(a.getAttribute('data-index')!),
      ),
    )

    // The duration of a single animation (enter or leave) in milliseconds
    // if a related prompt is clicked (clickedListItemIndex.value !== null), the duration is divided by the number of related
    // prompts -1 (the clicked one is synchronized with the last one to leave or the first one to enter)
    const singleAnimationDurationInMs = computed(
      () =>
        props.animationDurationInMs /
        (clickedListItemIndex.value !== null
          ? relatedPrompts.value.length - 1
          : relatedPrompts.value.length),
    )

    const indexRelatedPrompts = computed(() =>
      relatedPrompts.value.map((relatedPrompt, index) => ({ ...relatedPrompt, index })),
    )

    const visibleRelatedPrompts = computed(() =>
      selectedPromptIndex.value !== -1
        ? [indexRelatedPrompts.value[selectedPromptIndex.value]]
        : indexRelatedPrompts.value,
    )

    /**
     * Template ref for the root element (the SlidingPanel) to track the component's visibility.
     */
    // eslint-disable-next-line ts/consistent-type-definitions
    type ElementRef = {
      $el: HTMLElement
    }
    const slidingPanel = ref<ElementRef | null>(null)

    /**
     * The root element of the related prompts tag list to track the visibility against.
     *
     * @returns The SlidingPanel root element, or null if it has not been mounted yet.
     */
    const tagListElement = computed<HTMLElement | null>(() => slidingPanel.value?.$el ?? null)

    /**
     * The related prompts request to fetch data from the API, or null if there is not enough
     * data in the state to conform a valid request.
     *
     * @returns The related prompts request.
     */
    const relatedPromptsRequest = useGetter('relatedPrompts').request

    /**
     * The last request that has been emitted to the bus.
     *
     * It is initialized with the current request when the related prompts have been already
     * loaded successfully, so a re-mount of the component does not trigger a new request.
     */
    const lastEmittedRequest = ref<RelatedPromptsRequest | null>(
      status.value === 'success' ? relatedPromptsRequest.value : null,
    )

    /**
     * Checks if the request is not null and it has changed since the last emitted request.
     *
     * @param request - The request to check.
     * @returns True if the request should be emitted.
     *
     * @internal
     */
    const shouldEmitRequest = (request: RelatedPromptsRequest | null): boolean =>
      !!request && !deepEqual(request, lastEmittedRequest.value ?? undefined)

    /**
     * Emits the related prompts request to the bus, if it is not null.
     *
     * @param request - The related prompts request to emit.
     *
     * @internal
     */
    const emitRelatedPromptsRequest = (request: RelatedPromptsRequest | null): void => {
      if (request) {
        lastEmittedRequest.value = request
        xBus.emit('RelatedPromptsRequestUpdated', request, { priority: 0, replaceable: false })
      }
    }

    /**
     * Watches the element visibility and emits the request when it becomes visible for the
     * first time.
     *
     * It is only set up when `loadWhenVisible` is enabled.
     *
     * The visibility is computed against the `MainScroll` container (`#main-scroll`) when it
     * exists, so the `rootMargin` preload zone works. When the container is not present
     * (e.g. host applications that scroll with the window via `MainScroll`'s `useWindow=true`),
     * it falls back to the viewport.
     */
    const { isElementVisible, unwatchDisplay } = props.loadWhenVisible
      ? useOnDisplay({
          element: tagListElement,
          threshold: 0,
          rootMargin: '0px 0px 200px 0px',
          scrollTargetId: props.scrollTarget,
          callback: () => {
            const request = relatedPromptsRequest.value
            if (shouldEmitRequest(request)) {
              emitRelatedPromptsRequest(request)
            }
          },
        })
      : { isElementVisible: ref(false), unwatchDisplay: undefined }

    /**
     * Emits the related prompts request when it changes, if the component is not controlled by
     * visibility or it is already visible in the viewport.
     *
     * @internal
     */
    watch(relatedPromptsRequest, (newRequest, oldRequest) => {
      if (
        !deepEqual(newRequest ?? undefined, oldRequest ?? undefined) &&
        shouldEmitRequest(newRequest) &&
        (!props.loadWhenVisible || isElementVisible.value)
      ) {
        emitRelatedPromptsRequest(newRequest)
      }
    })

    /**
     * Emits the related prompts request on setup, when the component is not controlled by
     * visibility and the related prompts have not been loaded for the current request.
     *
     * @internal
     */
    if (!props.loadWhenVisible) {
      const request = relatedPromptsRequest.value
      if (shouldEmitRequest(request)) {
        emitRelatedPromptsRequest(request)
      }
    }

    /**
     * Whether the wrapper should reserve placeholder space while the related prompts have not
     * been loaded yet.
     *
     * It is only applied when `loadWhenVisible` is enabled, so the component keeps a visible
     * space and the viewport visibility trigger has a realistic area to work with.
     *
     * @internal
     */
    const showPlaceholder = computed(() => {
      const statusValue = status.value
      return props.loadWhenVisible && statusValue !== 'success' && statusValue !== 'error'
    })

    /**
     * Emits the `RelatedPromptsUnmounted` event and stops the visibility watcher when the
     * component is destroyed.
     */
    onBeforeUnmount(() => {
      unwatchDisplay?.()
      x.emit('RelatedPromptsUnmounted')
    })

    let timeOutId: number
    const resetTransitionStyle = (excludedProperties: Array<string> = ['width']) => {
      if (timeOutId) {
        clearTimeout(timeOutId)
      }

      isAnimating.value = true
      timeOutId = +setTimeout(() => {
        isAnimating.value = false
        clickedListItemIndex.value = null

        sortedListItems.value.forEach(element => {
          element.style.cssText
            .split(';')
            .map(rule => rule.split(':')[0]?.trim())
            .forEach(property => {
              if (!excludedProperties.includes(property)) {
                element.style.removeProperty(property)
              }
            })
        })
      }, props.animationDurationInMs)
    }

    const onSelect = (selectedIndex: number): void => {
      resetTransitionStyle()

      clickedListItemIndex.value = selectedIndex
      const selected: HTMLElement = sortedListItems.value.find(
        element => Number.parseInt(element.getAttribute('data-index')!) === selectedIndex,
      )!

      // selectedPromptIndex.value === -1 ? 'SELECTING' : 'DESELECTING'
      if (selectedPromptIndex.value === -1) {
        // Prepare all the elements for the leave animation (~ 'beforeLeave' hook). Remember the elements are
        // sorted in descending order by index.
        sortedListItems.value.forEach(element => {
          const index = Number.parseInt(element.getAttribute('data-index')!)

          initialOffsetLefts[index] = element.offsetLeft
          element.style.left = `${element.offsetLeft}px`
          element.style.position = 'absolute'
          element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`

          if (index !== selectedIndex) {
            element.style.opacity = '1'
            element.style.transitionDelay = `${
              (index < selectedIndex ? index : index - 1) * singleAnimationDurationInMs.value
            }ms`
          }
        })

        // Synchronize the transition delay of the selected element with the last
        // element to leave
        selected.style.transitionDelay = `${
          (relatedPrompts.value.length > 1 ? relatedPrompts.value.length - 2 : 0) *
          singleAnimationDurationInMs.value
        }ms`

        // Trigger the animation (selecting) for the selected element
        requestAnimationFrame(() => {
          const maxWidth = getComputedStyle(selected).maxWidth

          selected.style.left = '0px'
          selected.style.setProperty(
            'width',
            `${maxWidth !== 'none' ? maxWidth : '100%'}`,
            'important',
          )
        })
      } else {
        // Prepare the selected element for the deselecting animation
        selected.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`
        selected.style.left = '0px'
        selected.style.position = 'absolute'

        // Trigger the animation (deselecting) for the selected element
        selected.style.removeProperty('width')
        requestAnimationFrame(() => {
          selected.style.left = `${initialOffsetLefts[selectedIndex]}px`
        })
      }

      x.emit('UserSelectedARelatedPrompt', selectedIndex, {
        relatedPrompt: relatedPrompts.value[selectedIndex],
        selectedPrompt: selectedPromptIndex.value,
      })
    }

    const onBeforeEnter = (el: Element) => {
      const element = el as HTMLElement
      const index = Number.parseInt(element.getAttribute('data-index')!)

      // Prepare the element for the enter animation
      element.style.opacity = '0'
      element.style.transform = 'translateY(5px)'
      element.style.transitionDelay = `${
        (clickedListItemIndex.value !== null && index > clickedListItemIndex.value
          ? index - 1
          : index) * singleAnimationDurationInMs.value
      }ms`
      element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`
    }

    const onEnter = (el: Element, done: () => void) => {
      const element = el as HTMLElement
      const index = Number.parseInt(element.getAttribute('data-index')!)

      // Also part of the preparation for the enter animation, but it needs to be done
      // once the element is inserted in DOM (if not the offsetLeft will be always 0)
      element.style.left = `${initialOffsetLefts[index] ?? element.offsetLeft}px`

      // trigger enter animation
      requestAnimationFrame(() => {
        element.style.opacity = '1'
        element.style.position = 'absolute'
        element.style.transform = 'translateY(0)'
      })

      done()
    }

    const onLeave = (el: Element, done: () => void) => {
      const element = el as HTMLElement

      // trigger leave animation
      requestAnimationFrame(() => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(5px)'
      })

      // Wait for the animation to finish (done() exectution extracts the element from the DOM)
      setTimeout(done, props.animationDurationInMs)
    }

    // Changing the request will trigger the appear animation, so we need to reset the
    // style after it finishes
    x.on('SearchRequestChanged', false).subscribe(() => {
      resetTransitionStyle([])
    })

    return {
      onSelect,
      onBeforeEnter,
      onEnter,
      onLeave,
      selectedPromptIndex,
      visibleRelatedPrompts,
      listItems,
      isAnimating,
      x,
      slidingPanel,
      showPlaceholder,
    }
  },
})
</script>

<style lang="css">
.x-related-prompts-tag-list--placeholder {
  min-block-size: 72px;
}
.x-related-prompts-tag-list-scroll-container {
  height: 100%;
  position: relative;
}
.x-related-prompts-tag-list {
  display: flex;
  gap: 16px;
  min-width: 100%;
  width: 100%;
}
.x-related-prompts-tag-list-item {
  height: 100%;
  flex-shrink: 0;
}
</style>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- `RelatedPromptsRequestUpdated`: the event is emitted when the component is mounted (if the
  related prompts have not been loaded yet) and when the properties of the request change. When
  the `loadWhenVisible` prop is enabled, the event is only emitted once the component becomes
  visible in the viewport.

## Props

- `loadWhenVisible`: controls whether the related prompts request is triggered when the component
  is visible in the viewport, instead of when it is mounted.
- `scrollTarget`: the id of the scroll container to compute the visibility against
  (defaults to `main-scroll`).

## See it in action

### Basic usage

```vue live
<template>
  <RelatedPromptsTagList />
</template>

<script setup>
import { RelatedPromptsTagList } from '@empathyco/x-components/related-prompts'
</script>
```

### Customizing tag colors and classes

```vue live
<template>
  <RelatedPromptsTagList :tagColors="['x-bg-neutral-50', 'x-bg-lead-50']" tagClass="rounded" />
</template>

<script setup>
import { RelatedPromptsTagList } from '@empathyco/x-components/related-prompts'
</script>
```

### Using the default slot to customize prompt rendering

```vue live
<template>
  <RelatedPromptsTagList>
    <template #default="{ relatedPrompt, onSelect, isSelected }">
      <button :class="{ selected: isSelected }" @click="onSelect()">
        {{ relatedPrompt.suggestionText }}
      </button>
    </template>
  </RelatedPromptsTagList>
</template>

<script setup>
import { RelatedPromptsTagList } from '@empathyco/x-components/related-prompts'
</script>
```

### Customizing extra content in RelatedPrompt

```vue live
<template>
  <RelatedPromptsTagList>
    <template #related-prompt-extra-content="{ relatedPrompt }">
      <span>Extra: {{ relatedPrompt.suggestionText }}</span>
    </template>
  </RelatedPromptsTagList>
</template>

<script setup>
import { RelatedPromptsTagList } from '@empathyco/x-components/related-prompts'
</script>
```
</docs>
