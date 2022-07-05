<template>
  <div v-show="isQueryEmpty" class="x-search-input-placeholder">
    <component :is="animation" @after-enter="showNextPlaceholder">
      <span
        v-if="animatedPlaceholder && isAnimationVisible"
        :key="animatedPlaceholder"
        class="x-search-input-placeholder__placeholder"
        data-test="animated-placeholder"
      >
        {{ animatedPlaceholder }}
      </span>
      <span
        v-else-if="$slots.default"
        class="x-search-input-placeholder__default-placeholder"
        data-test="default-placeholder"
      >
        <!-- @slot Default static placeholder. -->
        <slot />
      </span>
    </component>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchBoxXModule } from '../x-module';

  /**
   * Renders a placeholder that is displayed on top of the search input and
   * can be animated when given an array of animated placeholders.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInputPlaceholder extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    /**
     * List of placeholders that will be animated.
     *
     * @public
     */
    @Prop({ default: () => [] })
    protected animatedPlaceholders!: string[];

    /**
     * Animation component that will be used to animate the placeholders.
     *
     * @remarks This component must emit an `after-enter` event when the
     * enter animation has finished and that's when the next placeholder will
     * be shown.
     *
     * @public
     */
    @Prop({ default: 'div' })
    protected animation!: Vue | string;

    protected currentPlaceholder = -1;
    protected isAnimationVisible = false;

    /**
     * A computed property that returns the current animated placeholder.
     *
     * @returns String with the placeholder text.
     *
     * @internal
     */
    protected get animatedPlaceholder(): string | undefined {
      if (this.$props.animatedPlaceholders.length === 0) {
        return undefined;
      }
      return this.$props.animatedPlaceholders[this.currentPlaceholder];
    }

    /**
     * Loops through the animated placeholders;.
     */
    protected showNextPlaceholder(): void {
      if (this.animatedPlaceholders.length > 0) {
        this.currentPlaceholder = (this.currentPlaceholder + 1) % this.animatedPlaceholders.length;
      }
    }

    /**
     * When event {@link SearchBoxXEvents.UserFocusedSearchBox} is
     * emitted, the next animated placeholder is displayed.
     *
     * @internal
     */
    @XOn(['UserFocusedSearchBox'])
    showAnimation(): void {
      this.isAnimationVisible = true;
      this.showNextPlaceholder();
    }

    /**
     * When event {@link SearchBoxXEvents.UserBlurredSearchBox} is
     * emitted, the animated placeholders are hidden.
     *
     * @internal
     */
    @XOn(['UserBlurredSearchBox'])
    hideAnimation(): void {
      this.isAnimationVisible = false;
    }
  }
</script>

<style lang="scss" scoped>
  .x-search-input-placeholder {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--x-size-padding-left-input-group-default);
    display: flex;
    align-items: center;
    pointer-events: none; // let events through to the search input

    .x-search-input-placeholder__placeholder,
    .x-search-input-placeholder__default-placeholder {
      position: absolute;
      color: var(--x-color-base-neutral-35);
      white-space: nowrap;
    }
  }
</style>

<docs lang="mdx">
## See it in action

Here's a basic example of how to add an animated placholder to the search input:

```vue live
<template>
  <SearchInput />
  <SearchInputPlaceholder :animatedPlaceholders="placeholders" :animation="placeholderAnimation">
    Search for anything
  </SearchInputPlaceholder>
</template>

<script>
  import { SearchInput, SearchInputPlaceholder, Slide } from "@empathyco/x-components/search-box";

  export default {
    name: "SearchInputPlaceholderDemo",
    components: {
      SearchInput,
      SearchInputPlaceholder,
      Slide,
    },
    data: function () {
      return {
        animatedPlaceholders: [
          'milk',
          'cheese',
          'cookies
        ],
        placeholderAnimation: Slide
      }
    },
  };
</script>
```

As long as the search input is focused and empty, this component will show and loop through the
specified animated placeholders. If the search input is not focused, it will use the content of the
default slot as a static placeholder.
</docs>
