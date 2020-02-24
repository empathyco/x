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

  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchBox extends Vue {
    $refs!: {
      input: HTMLInputElement;
    };
    @State('searchBox', 'query')
    query!: string;

    protected emitUserTyped(): void {
      const query = this.$refs.input.value;
      this.$x.emit('UserIsChangingQuery', query);
      this.$x.emit('UserTyped', query);
    }

    protected emitUserPressedEnter(): void {
      const query = this.$refs.input.value;
      this.$x.emit('UserSelectedAQuery', query);
      this.$x.emit('UserPressedEnter', query);
    }
  }
</script>
