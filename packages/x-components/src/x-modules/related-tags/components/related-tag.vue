<template>
  <button
    @click="emitEvents"
    class="x-tag x-related-tag"
    data-test="related-tag"
    :class="dynamicClasses"
  >
    <!--
      @slot Custom content that replaces the RelatedTag default content.
      @binding {RelatedTag} relatedTag - Related tag data.
      @binding {boolean} isSelected - Related tag status.
      -->
    <slot v-bind="{ relatedTag, isSelected }">{{ relatedTag.tag }}</slot>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { RelatedTag as RelatedTagModel } from '@empathyco/x-types';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { relatedTagsXModule } from '../x-module';

  /**
   * This component renders a related tag for a query. A related tag is a descriptive keyword
   * related to the current query to fine-tune the search. For example, if you are searching
   * for *lego*, a related tag could be *city*, refining the search with *lego city*.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(relatedTagsXModule)]
  })
  export default class RelatedTag extends Vue {
    /**
     * The related tag model data.
     *
     * @public
     */
    @Prop({ required: true })
    protected relatedTag!: RelatedTagModel;
    /**
     * The selected related tags.
     *
     * @internal
     */
    @State('relatedTags', 'selectedRelatedTags')
    public selectedRelatedTags!: RelatedTagModel[];

    /**
     * Generates the {@link WireMetadata | event metadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    protected createEventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$el as HTMLElement,
        feature: 'related_tag'
      };
    }

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    protected emitEvents(): void {
      // We have to emit this events first to avoid the UserPickedARelatedTag wires to change the
      // isSelected value before emitting this selection events.
      this.$x.emit(
        this.isSelected ? 'UserDeselectedARelatedTag' : 'UserSelectedARelatedTag',
        this.relatedTag,
        this.createEventMetadata()
      );
      this.$x.emit('UserPickedARelatedTag', this.relatedTag, this.createEventMetadata());
    }

    /**
     * Check if the related tag is selected or not.
     *
     * @returns If the related tag is selected.
     *
     * @internal
     */
    protected get isSelected(): boolean {
      return this.selectedRelatedTags.includes(this.relatedTag);
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     *
     * @internal
     */
    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-tag--is-selected': this.isSelected,
        'x-related-tag--is-selected': this.isSelected
      };
    }
  }
</script>

<style lang="scss" scoped>
  .x-related-tag {
    white-space: nowrap;

    &--is-selected {
      background: lightgrey;
    }
  }
</style>

<docs lang="mdx">
## Dynamic classes

`RelatedTag` uses the `x-related-tag--is-selected` dynamic CSS class so you can style it when is
selected.

## Events

This component emits the following events:

- [`UserDeselectedARelatedTag`](./../../api/x-components.relatedtagsxevents.md)
- [`UserPickedARelatedTag`](./../../api/x-components.relatedtagsxevents.md)
- [`UserSelectedARelatedTag`](./../../api/x-components.relatedtagsxevents.md)

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
The QuerySignals microservice must be implemented.
:::
<!-- prettier-ignore-end -->

In this example related tag data is passed as a prop.

_Here you can see how the RelatedTag component is rendered._

```vue
<template>
  <RelatedTag :relatedTag="tag"></RelatedTag>
</template>

<script>
  import { RelatedTag } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagDemo',
    components: {
      RelatedTag
    },
    data() {
      return {
        tag: {
          modelName: 'RelatedTag',
          previous: 'toy',
          query: 'toy story',
          selected: false,
          tag: 'story'
        }
      };
    }
  };
</script>
```

### Play with default slot

In this example, an HTML span element is passed in the `default` slot.

_See how the related tag can be rendered._

```vue
<template>
  <RelatedTag :relatedTag="tag" #default="{ relatedTag }">
    <span :aria-label="relatedTag.tag">{{ relatedTag.tag }}</span>
  </RelatedTag>
</template>

<script>
  import { RelatedTag } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagDemo',
    components: {
      RelatedTag
    },
    data() {
      return {
        tag: {
          modelName: 'RelatedTag',
          previous: 'toy',
          query: 'toy story',
          selected: false,
          tag: 'story'
        }
      };
    }
  };
</script>
```

### Play with events

In this example, the [`UserSelectedARelatedTag`](./../../api/x-components.relatedtagsxevents.md)
event is implemented, as illustrated by the “Tag” message returned.

_See how the event is triggered when the related tag is clicked._

```vue
<template>
  <RelatedTag :relatedTag="tag" @UserSelectedARelatedTag="alertRelatedTag"></RelatedTag>
</template>

<script>
  import { RelatedTag } from '@empathyco/x-components/related-tags';

  export default {
    name: 'RelatedTagDemo',
    components: {
      RelatedTag
    },
    data() {
      return {
        tag: {
          modelName: 'RelatedTag',
          previous: 'toy',
          query: 'toy story',
          selected: false,
          tag: 'story'
        }
      };
    },
    methods: {
      alertRelatedTag(relatedTag) {
        alert(`You have clicked the related tag: ${relatedTag.query}`);
      }
    }
  };
</script>
```
</docs>
