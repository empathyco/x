<template>
  <input
    ref="input"
    @input="emitUserTyped"
    @keyup.enter="emitUserPressedEnter"
    :value="query"
    autocomplete="off"
    inputmode="search"
    type="search"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../components/decorators';
  import { xComponentMixin } from '../../components/x-component.mixin';
  import { searchBoxXModule } from './x-module';

  /**
   * Simple search-box component that renders an input. This input allows the user to type a query, and emits the
   * needed events
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchBox extends Vue {
    public $refs!: { input: HTMLInputElement };

    @State('searchBox', 'query')
    public query!: string;

    /**
     * Emits a set of events related to the user typing in the search-box
     *
     * @internal
     */
    protected emitUserTyped(): void {
      const query = this.$refs.input.value;
      this.$x.emit('UserIsChangingQuery', query);
      this.$x.emit('UserTyped', query);
    }

    /**
     * Emits a set of events related to the user pressing the `Enter` key while the focus is
     * in the search-box
     *
     * @internal
     */
    protected emitUserPressedEnter(): void {
      const query = this.$refs.input.value;
      this.$x.emit('UserSelectedAQuery', query);
      this.$x.emit('UserPressedEnter', query);
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and it will render a ready to use `input`.
  This input will emit events to the rest of components when a user is using it.

  ```vue
  <SearchBox />
  ```
</docs>
