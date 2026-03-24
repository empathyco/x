<template>
  <component
    :is="animation"
    v-if="relatedTags.length"
    tag="ul"
    class="x-related-tags"
    data-test="related-tags"
  >
    <li
      v-for="relatedTag in relatedTags"
      :key="relatedTag.query"
      class="x-related-tags__item"
      data-test="related-tag-item"
    >
      <!--
        @slot Custom content that replaces the RelatedTag component.
        @binding {RelatedTag} relatedTag - Related tag data.
        @binding {boolean} highlightCurated - True if the curated RTs should be displayed.
       -->
      <slot name="related-tag" v-bind="{ relatedTag, highlightCurated }">
        <RelatedTag
          :highlight-curated="highlightCurated"
          :related-tag="relatedTag"
          :class="itemClass"
        >
          <template
            #default="{ relatedTag: relatedTagBinding, isSelected, shouldHighlightCurated }"
          >
            <!-- eslint-disable max-len -->
            <!--
              @slot Custom content that replaces the RelatedTag default content.
              @binding {RelatedTag} relatedTag - Related tag data.
              @binding {boolean} isSelected - Related tag status.
              @binding {boolean} shouldHighlightCurated - True if the curated RTs should be displayed.
            -->
            <slot
              name="related-tag-content"
              v-bind="{ relatedTag: relatedTagBinding, isSelected, shouldHighlightCurated }"
            />
          </template>
        </RelatedTag>
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
import type { RelatedTag as RelatedTagModel } from '@empathyco/x-types'
import type { ComputedRef } from 'vue'
import { computed, defineComponent } from 'vue'
import { useGetter } from '../../../composables/use-getter'
import { AnimationProp } from '../../../types/index'
import { relatedTagsXModule } from '../x-module'
import RelatedTag from './related-tag.vue'

/**
 * This component renders a set of [`RelatedTag`](./x-components.related-tag) components by
 * default to select from after a query is performed to fine-tune search.
 * For example, if you are searching for *lego*, different related tags could be *city*,
 * friends*, or *harry potter*, refining the search with *lego city*, *lego friends*,
 * or *lego harry potter*.
 *
 * @public
 */
export default defineComponent({
  name: 'RelatedTags',
  xModule: relatedTagsXModule.name,
  components: {
    RelatedTag,
  },
  props: {
    /**
     * Animation component that will be used to animate the suggestion.
     *
     * @public
     */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },

    /**
     * Number of related tags to be rendered.
     *
     * @public
     */
    maxItemsToRender: Number,

    /**
     * Flag to indicate if the curated tags should be displayed different.
     *
     * @public
     */
    highlightCurated: {
      type: Boolean,
      default: false,
    },

    /** Class inherited by content element. */
    itemClass: String,
  },
  setup(props) {
    const storedRelatedTags: ComputedRef<RelatedTagModel[]> = useGetter('relatedTags').relatedTags

    const relatedTags = computed((): RelatedTagModel[] =>
      storedRelatedTags.value.slice(0, props.maxItemsToRender),
    )

    return {
      relatedTags,
    }
  },
})
</script>

<style lang="css" scoped>
.x-related-tags {
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
}
</style>

<docs lang="mdx">
## See it in action

<!-- prettier-ignore-start -->
:::warning Backend microservice required
To use this component, the QuerySignals microservice must be implemented.
:::
<!-- prettier-ignore-end -->

This example shows how related tags can be rendered without any additional effects.

_Search for a fashion term like "sandal" or "lipstick"._

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags } from '@empathyco/x-components/related-tags'
</script>
```

### Play with props

In this example, the number of related tags rendered has been limited to 3. A fade and slide effect
has been added so that the related tags appear with a delay, then slide upwards and fade.

_Search for a fashion term and see the related tags with the animation effect._

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags :animation="animation" :maxItemsToRender="3" />
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags } from '@empathyco/x-components/related-tags'
import { StaggeredFadeAndSlide } from '@empathyco/x-components'

const animation = StaggeredFadeAndSlide
</script>
```

### Play with related-tag slot

In this example, the [`RelatedTag`](./x-components.related-tag.md) component is passed in the
`related-tag` slot (although any other component could potentially be passed).

_Search for a fashion term and see how the related tags can be rendered._

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags #related-tag="{ relatedTag }">
      <RelatedTag :relatedTag="relatedTag" />
    </RelatedTags>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags, RelatedTag } from '@empathyco/x-components/related-tags'
</script>
```

### Play with related-tag-content slot

To continue the previous example, the [`RelatedTag`](./x-components.related-tag.md) component is
passed in the `related-tag-content` slot, but in addition, an HTML span tag for the text are also
passed.

_Search for a fashion term and see how the related tags are rendered._

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags #related-tag-content="{ relatedTag }">
      <span>{{ relatedTag.tag }}</span>
    </RelatedTags>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags } from '@empathyco/x-components/related-tags'
</script>
```

## Extending the component

Components can be combined and communicate with each other. The `RelatedTags` component can
communicate with the [`SearchInput`](../search-box/x-components.search-input.md) as follows:

_Search for a fashion term and see how the related tags can be rendered._

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags />
    <ResultsList #result="{ item }">
      <span class="result">
        {{ item.name }}
      </span>
    </ResultsList>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags } from '@empathyco/x-components/related-tags'
import { ResultsList } from '@empathyco/x-components/search'
</script>
```

## Customizing the related tags with classes

The `itemClass` prop can be used to add classes to the related tags.

```vue live
<template>
  <div>
    <SearchInput />
    <RelatedTags #related-tag-content="{ relatedTag }" itemClass="x-tag-outlined x-tag-auxiliary">
      <span>{{ relatedTag.tag }}</span>
    </RelatedTags>
  </div>
</template>

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { RelatedTags } from '@empathyco/x-components/related-tags'
</script>
```
</docs>
