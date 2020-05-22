<template>
  <a
    @click="emitUserClickedAResult"
    @click.middle="emitUserClickedAResult"
    @click.right="emitUserRightClickedAResult"
    :href="result.url"
    class="x-result-link"
    data-test="result-link"
  >
    <!--
     @slot (Required) to add content to the link like for example: a text, an icon, both, or other
     components as {@link ResultImage}
       @binding {Result} The result data
     -->
    <slot :result="result" />
  </a>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  /**
   * Component to be reused that renders an `<a>` with the logic of emitting
   * {@link XEventsTypes.UserClickedAResult} and {@link XEventsTypes.UserRightClickedAResult} to
   * the bus on click mouse events.
   *
   * @public
   */
  @Component
  export default class BaseResultLink extends Vue {
    /**
     * (Required) The {@link @empathy/search-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * Emits the {@link XEventsTypes.UserClickedAResult} when user clicks on the result.
     *
     * @public
     */
    emitUserClickedAResult(): void {
      this.$x.emit('UserClickedAResult', this.result, { target: this.$el as HTMLElement })
    }

    /**
     * Emits the {@link XEventsTypes.UserRightClickedAResult} when user right clicks on the result.
     *
     * @public
     */
    emitUserRightClickedAResult(): void {
      this.$x.emit('UserRightClickedAResult', this.result, { target: this.$el as HTMLElement })
    }
  };
</script>

<docs>
  #Examples

  ## Basic example

  This component is a wrapper for the result contents (images, name, price...) It may be part of
  the search result page, recommendations or other section which needs to include results.

  This component will emit `UserClickedAResult` when clicked or middle clicked and
  `UserRightClickedAResult` when right  clicked.

  The result prop is required. It will render a `<a></a>` with the href to the result URL:

  ```vue
  <BaseResultLink :result="result">
    <template #default="{ result }">
      <img src="${result.images[0]}"/>
      <span>{{ result.name }}</span>
    </template>
  </BaseResultLink>
  ```

</docs>
