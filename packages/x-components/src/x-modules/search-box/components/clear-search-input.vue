<template>
  <BaseEventButton
    class="x-clear-search-input"
    :class="dynamicClasses"
    :aria-label="$x.config.messages.searchBox.clearButton.ariaLabel"
    :events="clearSearchInputEvents"
    data-test="clear-search-input"
  >
    <!-- @slot Slot to add the button content like a message or an icon -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * A button that when pressed emits the {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
   * and {@link SearchBoxXEvents.UserClearedQuery} events, expressing the user intention to clear
   * the current query.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class ClearSearchInput extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-clear-search-input--has-empty-query': this.isQueryEmpty
      };
    }

    /**
     * The events dictionary that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    protected clearSearchInputEvents: Partial<XEventsTypes> = {
      UserClearedQuery: undefined,
      UserPressedClearSearchBoxButton: undefined
    };
  }
</script>

<docs>
  #Examples

  ## Example

  You need to add the content that this button will render. To do so, you only need to pass a new
  component in the default slot:

  ```vue
  <ClearSearchInput>
    <img src="./my-awesome-clear-icon.svg" />
  </ClearSearchInput>
  ```
</docs>
