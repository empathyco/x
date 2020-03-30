<template>
  <EventButton
    :events="events"
    :aria-label="$x.config.messages.searchBox.searchButton.ariaLabel"
    class="x-search-button"
    :class="dynamicClasses"
  >
    <!-- @slot To add an icon or text for the search button-->
    <slot />
  </EventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators';
  import EventButton from '../../../components/pure/event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCssClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * Search button component which emits on its click {@link XEventsTypes.UserAcceptedAQuery} and
   * {@link XEventsTypes.UserPressedSearchButton} events with the query as payload while there is
   * query. If the query is empty, the component won't emit any event. The component has also a
   * dynamic class to flag the HTML button when the query is empty (to hide the button when the
   * query is empty for instance).
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)],
    components: { EventButton }
  })
  export default class SearchButton extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get events(): Partial<XEventsTypes> {
      return !this.isQueryEmpty
        ? {
            UserAcceptedAQuery: this.query,
            UserPressedSearchButton: this.query
          }
        : {};
    }

    protected get dynamicClasses(): VueCssClasses {
      return {
        'x-search-button--has-empty-query': this.isQueryEmpty
      };
    }
  }
</script>

<docs>
  #Example

  ## Basic example
  No props are required for its usage. The component has a slot to append content to the button,
  in most cases you are going to need to pass content to the default slot. It also uses the
  message `searchBox.searchButton.ariaLabel` for accessibility matters.

  ```vue
  <SearchButton>
    <svg height="10" width="10">
      <circle cx="5" cy="5" r="4" stroke="black" />
    </svg>
  </SearchButton>
  ```

  ```vue
  <SearchButton>Search!</SearchButton>
  ```
</docs>
