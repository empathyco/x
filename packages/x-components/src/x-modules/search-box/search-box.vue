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
  import { mapState } from 'vuex';
  import { XPlugin } from '../../plugins';
  import { searchBoxXModule } from './x-module';

  XPlugin.registerXModule(searchBoxXModule);
  @Component({
    computed: {
      ...mapState('x/searchBox', ['query'])
    }
  })
  export default class SearchBox extends Vue {
    $refs!: {
      input: HTMLInputElement;
    };
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
