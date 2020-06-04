<template>
  <input
    ref="input"
    @blur="emitUserBlurredSearchBox"
    @focus="emitUserFocusedSearchBox"
    @input="emitUserIsTypingAQueryEvents"
    @keydown.enter="emitUserPressedEnterKey"
    @keydown.right.left.stop="emitUserPressedArrowKey"
    @keydown.up.down.prevent="emitUserPressedArrowKey"
    :maxlength="config.maxLength"
    :value="query"
    autocomplete="off"
    class="x-input x-search-input"
    inputmode="search"
    type="search"
    data-test="search-input"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State, XOn } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { ArrowKey } from '../../../utils';
  import { debounce, DebouncedFunction } from '../../../utils/debounce';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { SearchBoxConfig } from '../config.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * Search input that reacts to user interaction emitting events.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInput extends Vue {
    public $refs!: { input: HTMLInputElement };

    @State('searchBox', 'query')
    public query!: string;

    @State('searchBox', 'config')
    public config!: SearchBoxConfig;

    protected debouncedUserAcceptedAQuery!: DebouncedFunction<[string]>;

    /**
     * When event {@link XEventsTypes.UserAcceptedAQuery} is emitted the pending debounced emit
     * {@link XEvent} `UserAcceptedAQuery` is canceled.
     *
     * @internal
     */
    @XOn('UserAcceptedAQuery')
    cancelDebouncedUserAcceptedAQuery(): void {
      this.debouncedUserAcceptedAQuery?.cancel();
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event with a debounce configured in
     * `config.instantDebounceInMs`.
     *
     * @internal
     * @param query - The query that will be emitted.
     */
    emitDebouncedUserAcceptedAQuery(query: string): void {
      if (this.config.instant) {
        if (!this.debouncedUserAcceptedAQuery) {
          this.debouncedUserAcceptedAQuery =
            // eslint-disable-next-line @typescript-eslint/unbound-method
            debounce(this.emitUserAcceptedAQuery, this.config.instantDebounceInMs);
        }
        this.debouncedUserAcceptedAQuery(query);
      }
    }

    /**
     * Generates the {@link WireMetadata | event metadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    protected eventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$refs.input
      };
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserBlurredSearchBox} when search box loses focus.
     *
     * @internal
     */
    protected emitUserBlurredSearchBox(): void {
      this.$x.emit('UserBlurredSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserFocusedSearchBox} when search box gains focus.
     *
     * @internal
     */
    protected emitUserFocusedSearchBox(): void {
      this.$x.emit('UserFocusedSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserIsTypingAQuery} when the user typed/pasted something
     * into the search-box. Also emits event {@link SearchBoxXEvents.UserClearedQuery} when the user
     * removes all characters in the search-box.
     *
     * @internal
     */
    protected emitUserIsTypingAQueryEvents(): void {
      const query = this.$refs.input.value;
      if (query.trim()) {
        this.$x.emit('UserIsTypingAQuery', query, this.eventMetadata());
        this.emitDebouncedUserAcceptedAQuery(query);
      } else if (!query) {
        this.$x.emit('UserClearedQuery', undefined, this.eventMetadata());
      }
    }

    /**
     * Emits event {@link XEventsTypes.UserPressedArrowKey} when the user pressed an arrow key.
     *
     * @param event - The keyboard event with the arrow key pressed.
     * @internal
     */
    protected emitUserPressedArrowKey(event: KeyboardEvent): void {
      this.$x.emit('UserPressedArrowKey', event.key as ArrowKey, this.eventMetadata());
    }

    /**
     * Emits multiple events when the user pressed the enter key.
     *
     * @remarks
     * Emitted events are:
     * * {@link SearchBoxXEvents.UserPressedEnterKey}
     * * {@link XEventsTypes.UserAcceptedAQuery}
     *
     * @internal
     */
    protected emitUserPressedEnterKey(): void {
      const query = this.$refs.input.value.trim();
      if (query.length > 0) {
        this.$x.emit('UserPressedEnterKey', query, this.eventMetadata());
        this.emitUserAcceptedAQuery(query);
      }
      this.$refs.input?.blur();
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event.
     *
     * @remarks It is necessary in a separated method to use it as the parameter of debounce in
     * emitDebouncedUserAcceptedAQuery method.
     * @internal
     * @param query - The query that will be emitted.
     */
    protected emitUserAcceptedAQuery(query: string): void {
      this.$x.emit('UserAcceptedAQuery', query, this.eventMetadata());
    }
  }
</script>

<style lang="scss" scoped>
  .x-search-input::-webkit-search-decoration,
  .x-search-input::-webkit-search-cancel-button,
  .x-search-input::-webkit-search-results-button,
  .x-search-input::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
</style>

<docs>
  #Examples

  ## Basic example

  Simple search input component without props or slots that emits events when a user interacts
  with it.

  ```vue
  <SearchInput/>
  ```
</docs>
