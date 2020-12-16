<template>
  <BaseEventButton
    :events="events"
    class="x-related-tag"
    data-test="related-tag"
    :class="dynamicClasses"
  >
    <!--
      @slot Related Tag content
          @binding {RelatedTag} relatedTag - Related Tag data
          @binding {boolean} isSelected - True if the related tag is selected. False otherwise.
      -->
    <slot v-bind="{ relatedTag, isSelected }">{{ relatedTag.tag }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { RelatedTag as RelatedTagModel } from '@empathy/search-types';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { RelatedTagsXEvents } from '../events.types';
  import { relatedTagsXModule } from '../x-module';

  /**
   * Renders a related tag item which receives the related tag that will be rendered as a prop.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(relatedTagsXModule)]
  })
  export default class RelatedTag extends Vue {
    /**
     * The related tag to render and use in the default slot.
     *
     * @public
     */
    @Prop({ required: true })
    protected relatedTag!: RelatedTagModel;
    /**
     * The selected related tags.
     *
     * @public
     */
    @State('relatedTags', 'selectedRelatedTags')
    public selectedRelatedTags!: RelatedTagModel[];
    /**
     * Events list which are going to be emitted when a related tag is selected.
     *
     * @returns The {@link XEvent | XEvents} to emit.
     *
     * @public
     */
    protected get events(): Partial<RelatedTagsXEvents> {
      return this.isSelected
        ? {
            UserPickedARelatedTag: this.relatedTag,
            UserDeselectedARelatedTag: this.relatedTag
          }
        : {
            UserPickedARelatedTag: this.relatedTag,
            UserSelectedARelatedTag: this.relatedTag
          };
    }
    /**
     * Check if the related tag is selected or not.
     *
     * @returns If the related tag is selected.
     *
     * @public
     */
    protected get isSelected(): boolean {
      return this.selectedRelatedTags.includes(this.relatedTag);
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     *
     * @public
     */
    protected get dynamicClasses(): VueCSSClasses {
      return {
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

<docs>
  #Example

  This components expects just a related tag as a prop to be rendered. It has a slot to override
  the content. By default, it renders the tag of the related tag.

  ## Basic Usage

  Using default slot:
  ```vue
  <RelatedTag :relatedTag="relatedTag"/>
  ```

  ## Overriding default slot .

  The default slot allows you to replace the content of the related tag.

  ```vue
  <RelatedTag :relatedTag="relatedTag">
    <template #default="{ relatedTag }">
      <img class="x-related-tag__icon" src="./related-tag.svg" />
      <span class="x-related-tag__tag" :aria-label="relatedTag.tag">{{ relatedTag.tag }}</span>
    </template>
  </RelatedTag>
  ```
</docs>
