<template>
  <ul class="x-related-tags"></ul>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { relatedTagsXModule } from '../x-module';

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
    mixins: [xComponentMixin(relatedTagsXModule)]
  })
  export default class RelatedTags extends Vue {}
</script>

<docs>
  #Examples
</docs>
