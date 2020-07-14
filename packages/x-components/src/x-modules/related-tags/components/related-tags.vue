<template>
  <component :is="animation || 'ul'" v-if="relatedTags.length" tag="ul" class="x-related-tags">
    <li
      v-for="relatedTag in relatedTags"
      :key="relatedTag.tag"
      class="x-related-tags__item"
      data-test="related-tag-item"
    >
      <!--
        @slot Related Tag item
            @binding {RelatedTag} relatedTag - Related Tag data
       -->
      <slot name="related-tag" :relatedTag="relatedTag">
        <RelatedTag :relatedTag="relatedTag">
          <template #default="{ relatedTag }">
            <!--
              @slot Related Tag content
                  @binding {RelatedTag} relatedTag - Related Tag data
            -->
            <slot name="related-tag-content" :relatedTag="relatedTag" />
          </template>
        </RelatedTag>
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
  import { RelatedTag as RelatedTagModel } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { relatedTagsXModule } from '../x-module';
  import RelatedTag from './related-tag.vue';

  /**
   * Simple related-tags component that renders a list of related tags.
   *
   * @remarks
   * A related tag is just a tag related with the previous query refining it.
   * I.e. If you are searching for `lego`, a related tag could be `city` and this refine the search
   * with this new tag, 'lego city'.
   *
   * @public
   */
  @Component({
    components: { RelatedTag },
    mixins: [xComponentMixin(relatedTagsXModule)]
  })
  export default class RelatedTags extends Vue {
    @Getter('relatedTags', 'relatedTags')
    public relatedTags!: RelatedTagModel[];
    /**
     * Animation component that will be used to animate the suggestion.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any related
  tags it will show them

  ```vue
  <RelatedTags />
  ```

  ## Overriding Related Tag's Content

  You can use your custom implementation of the Related Tag's content.
  In the example below, instead of using the default Related Tag's content, an icon
  is added, as well as a span with the query of the Related Tag.

  ```vue
  <RelatedTags>
    <template #related-tag-content="{relatedTag}">
      <img src="./related-tag-icon.svg" class="x-related-tag__icon"/>
      <span class="x-related-tag__tag">{{ relatedTag.tag }}</span>
    </template>
  </RelatedTags>
  ```

  ## Adding a custom related tag component

  You can use your custom implementation of a Related Tag component.
  In the example below, instead of using the default `button` tag for a Related Tag, an icon is
  added, and the text of the related tag is wrapped in a `span`
  ```vue
  <RelatedTags>
    <template #related-tag="{relatedTag}">
      <RelatedTag :relatedTag="relatedTag">
        <template #default>
          <img src="./related-tag-icon.svg" class="x-related-tag__icon"/>
          <span class="x-related-tag__tag">{{ relatedTag.tag }}</span>
        </template>
      </RelatedTag>
      <button>Custom Behaviour</button>
    </template>
  </RelatedTags>
  ```
</docs>
