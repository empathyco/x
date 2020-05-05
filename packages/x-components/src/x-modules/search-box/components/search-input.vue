<template>
  <input
    ref="input"
    @blur="emitUserBlurredSearchBox"
    @focus="emitUserFocusedSearchBox"
    @input="emitUserIsTypingAQuery"
    @keydown.enter="emitUserPressedEnterKey"
    @keydown.right.left.stop="emitUserPressedArrowKey"
    @keydown.up.down.prevent="emitUserPressedArrowKey"
    :aria-label="$x.config.messages.searchBox.ariaLabel"
    :maxlength="config.maxLength"
    :placeholder="$x.config.messages.searchBox.placeholder"
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

    /**
     * When event {@link XEventsTypes.UserAcceptedAQuery} is emitted the input will be blurred.
     *
     * @internal
     */
    @XOn('UserAcceptedAQuery')
    blurInput(): void {
      this.$refs.input?.blur();
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
     * Emits event {@link XEventsTypes.UserBlurredSearchBox} when search box loses focus.
     *
     * @internal
     */
    protected emitUserBlurredSearchBox(): void {
      this.$x.emit('UserBlurredSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link XEventsTypes.UserFocusedSearchBox} when search box gains focus.
     *
     * @internal
     */
    protected emitUserFocusedSearchBox(): void {
      this.$x.emit('UserFocusedSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link XEventsTypes.UserIsTypingAQuery} when the user typed/pasted something into
     * the search-box.
     *
     * @internal
     */
    protected emitUserIsTypingAQuery(): void {
      this.$x.emit('UserIsTypingAQuery', this.$refs.input.value, this.eventMetadata());
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
     * * {@link XEventsTypes.UserPressedEnterKey}
     * * {@link XEventsTypes.UserAcceptedAQuery}
     *
     * @internal
     */
    protected emitUserPressedEnterKey(): void {
      const query = this.$refs.input.value.trim();
      if (query.length > 0) {
        this.$x.emit('UserPressedEnterKey', query, this.eventMetadata());
        this.$x.emit('UserAcceptedAQuery', query, this.eventMetadata());
      }
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
