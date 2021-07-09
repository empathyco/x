<template>
  <component
    :is="animation"
    v-if="relatedTags.length"
    tag="ul"
    class="x-list x-related-tags"
    data-test="related-tags"
  >
    <li
      v-for="relatedTag in relatedTags"
      :key="relatedTag.tag"
      class="x-related-tags__item"
      data-test="related-tag-item"
    >
      <!--
        @slot Custom content that replaces the RelatedTag component.
        @binding {RelatedTag} relatedTag - Related tag data.
       -->
      <slot name="related-tag" :relatedTag="relatedTag">
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag, isSelected }">
            <!--
              @slot Custom content that replaces the RelatedTag default content.
              @binding {RelatedTag} relatedTag - Related tag data.
              @binding {boolean} isSelected - Related tag status.
            -->
            <slot name="related-tag-content" v-bind="{ relatedTag, isSelected }" />
          </template>
        </RelatedTag>
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
  import { RelatedTag as RelatedTagModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { relatedTagsXModule } from '../x-module';
  import RelatedTag from './related-tag.vue';

  /**
   * Simple `RelatedTags` component that renders a list of related tags.
   * For example, if you are searching for *lego*, different related tags could be *city*,
   * *friends*, or *harry potter*, refining the search with *lego city*, *lego friends*,
   * or *lego harry potter*.
   *
   * @public
   */
  @Component({
    components: { RelatedTag },
    mixins: [xComponentMixin(relatedTagsXModule)]
  })
  export default class RelatedTags extends Vue {
    /**
     * Animation component that will be used to animate the suggestion.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue;

    /**
     * Number of related tags to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    @Getter('relatedTags', 'relatedTags')
    public storedRelatedTags!: RelatedTagModel[];

    protected get relatedTags(): RelatedTagModel[] {
      return this.storedRelatedTags.slice(0, this.maxItemsToRender);
    }
  }
</script>

<style lang="scss" scoped>
  .x-related-tags {
    display: flex;
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

_Search for a toy and press enter._

```vue
<template>
  <div>
    <SearchInput></SearchInput>
    <RelatedTags></RelatedTags>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { RelatedTags } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagsDemo',
    components: {
      SearchInput,
      RelatedTags
    }
  };
</script>
```

### Play with props

In this example, the number of related tags rendered has been limited to 3. A fade and slide effect
has been added so that the related tags appear with a delay, then slide upwards and fade.

_Search for a toy and press Enter to see the related tags with the animation effect._

```vue
<template>
  <div>
    <SearchInput></SearchInput>
    <RelatedTags animation="StaggeredFadeAndSlide" :maxItemsToRender="3"></RelatedTags>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { RelatedTags } from '@empathyco/x-components/related-tags';
  import { StaggeredFadeAndSlide } from '@empathyco/x-components';

  Vue.component('StaggeredFadeAndSlide', StaggeredFadeAndSlide);
  export default {
    name: 'RelatedTagsDemo',
    components: {
      SearchInput,
      RelatedTags
    }
  };
</script>
```

### Play with related-tag slot

In this example, the [`RelatedTag`](../related-tags/related-tag.md) component is passed in the
`related-tag` slot (although any other component could potentially be passed).

_Search for a toy and see how the related tags can be rendered._

```vue
<template>
  <div>
    <SearchInput></SearchInput>
    <RelatedTags #related-tag="{ relatedTag }">
      <RelatedTag :relatedTag="relatedTag"></RelatedTag>
    </RelatedTags>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { RelatedTags, RelatedTag } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagsDemo',
    components: {
      SearchInput,
      RelatedTags,
      RelatedTag
    }
  };
</script>
```

### Play with related-tag-content slot

To continue the previous example, the [`RelatedTag`](./x-components.related-tag.md) component is
passed in the `related-tag-content` slot, but in addition, an HTML span tag for the text are also
passed.

_Search for a toy and see how the related tags are rendered._

```vue
<template>
  <div>
    <SearchInput></SearchInput>
    <RelatedTags #related-tag-content="{ relatedTag }">
      <span>{{ relatedTag.tag }}</span>
    </RelatedTags>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { RelatedTags } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagsDemo',
    components: {
      SearchInput,
      RelatedTags
    }
  };
</script>
```

## Extending the component

Components can be combined and communicate with each other. The `RelatedTags` component can
communicate with the [`SearchInput`](../search-box/search-input.md) as follows:

_Search for a toy and see how the related tags can be rendered._

```vue
<template>
  <div>
    <SearchInput></SearchInput>
    <RelatedTags></RelatedTags>
    <ResultsList></ResultsList>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { RelatedTags } from '@empathyco/x-components/related-tags';
  import { ResultsList } from '@empathyco/x-components/search';

  export default {
    name: 'RelatedTagsDemo',
    components: {
      SearchInput,
      RelatedTags,
      ResultsList
    }
  };
</script>
```
</docs>
