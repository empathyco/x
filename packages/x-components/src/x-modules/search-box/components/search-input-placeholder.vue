<template>
  <label ref="placeholder" class="placeholder"></label>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchBoxXModule } from '../x-module';
  import SearchInput from './search-input.vue';
  @Component({
    components: { SearchInput },
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInputPlaceholder extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    @Prop({ default: () => [''] })
    protected placeholdersArray!: string[];

    @Prop({ default: 1 })
    protected numberOfStrings!: number;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    @XOn(['UserHoveringOverSearchBox'])
    animatePlaceholder(): void {
      if (this.isQueryEmpty) {
        var array = this.placeholdersArray;
        var element = this.$refs.placeholder as HTMLElement;
        element.classList.add('visible');
        for (let i = 0; i < array.length; i++) {
          setTimeout(function () {
            element.innerText = array[i];
            if (i === array.length - 1) {
              element.classList.remove('visible');
            }
          }, i * 2000);
        }
      }
    }

    @XOn(['UserFocusedSearchBox'])
    stopAnimatingPlaceholder(): void {
      var element = this.$refs.placeholder as HTMLElement;
      element.classList.remove('visible');
    }
  }
</script>
