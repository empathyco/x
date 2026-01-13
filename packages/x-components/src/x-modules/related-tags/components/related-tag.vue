<template>
  <button
    ref="buttonEl"
    class="x-tag x-related-tag"
    data-test="related-tag"
    :class="dynamicClasses"
    @click="clickRelatedTag"
  >
    <!--
      @slot Custom content that replaces the RelatedTag default content.
      @binding {RelatedTag} relatedTag - Related tag data.
      @binding {boolean} isSelected - Related tag status.
      @binding {boolean} shouldHighlightCurated - True if the curated RTs should be displayed.
      -->
    <slot v-bind="{ relatedTag, isSelected, shouldHighlightCurated }">{{ relatedTag.tag }}</slot>
  </button>
</template>

<script lang="ts">
import type { RelatedTag as RelatedTagModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { VueCSSClasses } from '../../../utils/types'
import type { WireMetadata } from '../../../wiring/wiring.types'
import { computed, defineComponent, ref } from 'vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { relatedTagsXModule } from '../x-module'

/**
 * This component renders a related tag for a query. A related tag is a descriptive keyword
 * related to the current query to fine-tune the search. For example, if you are searching
 * for *lego*, a related tag could be *city*, refining the search with *lego city*.
 *
 * @public
 */
export default defineComponent({
  name: 'RelatedTag',
  xModule: relatedTagsXModule.name,
  props: {
    /**
     * Indicates if the curated related tag should be highlighted.
     *
     * @public
     */
    highlightCurated: {
      type: Boolean,
      default: false,
    },
    /**
     * The related tag model data.
     *
     * @public
     */
    relatedTag: {
      type: Object as PropType<RelatedTagModel>,
      required: true,
    },
  },
  setup(props) {
    const $x = use$x()

    const buttonEl = ref<HTMLElement | undefined>()

    /**
     * The selected related tags.
     *
     * @internal
     */
    const { selectedRelatedTags } = useState('relatedTags')

    /**
     * Check if the related tag is selected or not.
     *
     * @returns If the related tag is selected.
     *
     * @internal
     */
    const isSelected = computed(() => selectedRelatedTags.value.includes(props.relatedTag))

    /**
     * Blurs the related tag if it is selected.
     *
     * @public
     */
    const blurRelatedTag = () => {
      if (isSelected.value) {
        buttonEl.value?.blur()
      }
    }

    /**
     * Generates the {@link WireMetadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    const createEventMetadata = (): Omit<WireMetadata, 'moduleName'> => ({
      target: buttonEl.value as HTMLElement,
      feature: 'related_tag',
    })

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    const emitEvents = () => {
      // We have to emit this events first to avoid the UserPickedARelatedTag wires to change the
      // isSelected value before emitting this selection events.
      $x.emit(
        isSelected.value ? 'UserDeselectedARelatedTag' : 'UserSelectedARelatedTag',
        props.relatedTag,
        createEventMetadata(),
      )
      $x.emit('UserPickedARelatedTag', props.relatedTag, createEventMetadata())
    }

    /**
     * Handles the click on the button.
     *
     * @public
     */
    const clickRelatedTag = () => {
      emitEvents()
      blurRelatedTag()
    }

    /**
     * Check if the related tag is curated and should be highlighted.
     *
     * @returns True if the related tag is curated and should be highlighted.
     *
     * @internal
     */
    const shouldHighlightCurated = computed(
      () => props.highlightCurated && (props.relatedTag.isCurated ?? false),
    )

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     *
     * @internal
     */
    const dynamicClasses = computed(
      (): VueCSSClasses => ({
        'xds:selected x-related-tag--is-selected': isSelected.value,
        'x-related-tag--is-curated': shouldHighlightCurated.value,
      }),
    )

    return {
      buttonEl,
      dynamicClasses,
      isSelected,
      clickRelatedTag,
      shouldHighlightCurated,
    }
  },
})
</script>

<docs lang="mdx">
## Dynamic classes

`RelatedTag` uses the following dynamic CSS classes so you can style it when is:

- Selected: `x-related-tag--is-selected`.
- Curated: `x-related-tag--is-curated`.

## Events

This component emits the following events:

- [`UserDeselectedARelatedTag`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserPickedARelatedTag`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserSelectedARelatedTag`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
The QuerySignals microservice must be implemented.
:::
<!-- prettier-ignore-end -->

In this example related tag data is passed as a prop.

_Here you can see how the RelatedTag component is rendered._

```vue live
<template>
  <RelatedTag :relatedTag="tag" />
</template>

<script>
import { RelatedTag } from '@empathyco/x-components/related-tags'

export default {
  name: 'RelatedTagDemo',
  components: {
    RelatedTag,
  },
  data() {
    return {
      tag: {
        modelName: 'RelatedTag',
        query: 'high heel',
        isCurated: false,
        tag: 'heel',
      },
    }
  },
}
</script>
```

### Play with default slot

In this example, an HTML span element is passed in the `default` slot.

_See how the related tag can be rendered._

```vue live
<template>
  <RelatedTag :relatedTag="tag" #default="{ relatedTag }">
    <span :aria-label="relatedTag.tag">{{ relatedTag.tag }}</span>
  </RelatedTag>
</template>

<script>
import { RelatedTag } from '@empathyco/x-components/related-tags'

export default {
  name: 'RelatedTagDemo',
  components: {
    RelatedTag,
  },
  data() {
    return {
      tag: {
        modelName: 'RelatedTag',
        query: 'high heel',
        isCurated: false,
        tag: 'heel',
      },
    }
  },
}
</script>
```

### Play with events

In this example, the [`UserSelectedARelatedTag`](./../../api/x-components.relatedtagsxevents.md)
event is implemented, as illustrated by the “Tag” message returned.

_See how the event is triggered when the related tag is clicked._

```vue live
<template>
  <RelatedTag :relatedTag="tag" @UserSelectedARelatedTag="alertRelatedTag" />
</template>

<script>
import { RelatedTag } from '@empathyco/x-components/related-tags'

export default {
  name: 'RelatedTagDemo',
  components: {
    RelatedTag,
  },
  data() {
    return {
      tag: {
        modelName: 'RelatedTag',
        query: 'high heel',
        isCurated: false,
        tag: 'heel',
      },
    }
  },
  methods: {
    alertRelatedTag(relatedTag) {
      alert(`You have clicked the related tag: ${relatedTag.query}`)
    },
  },
}
</script>
```
</docs>
