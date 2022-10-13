<template>
  <component
    :is="animation"
    v-if="isVisible"
    class="x-input-placeholder x-search-input-placeholder"
    mode="out-in"
  >
    <span v-if="isBeingAnimated" :key="animationMessage" data-test="search-input-placeholder">
      {{ animationMessage }}
    </span>
    <span v-else-if="$slots.default" data-test="search-input-placeholder">
      <!--
        @slot The default placeholder when the `messages` animation is not active.
      -->
      <slot />
    </span>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';

  import { animateTranslate, State, xComponentMixin, XOn } from '../../../components';
  import { searchBoxXModule } from '../x-module';

  /**.
   * This component renders an animated placeholder for the search input in the shape of a list of
   * iterating messages that can be configured to happen always or only when hovering the input
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInputPlaceholder extends Vue {
    /**
     * List of messages to animate.
     */
    @Prop({ required: true })
    protected messages!: Array<string>;

    /**
     * Animation component used for the messages.
     *
     * @public
     */
    @Prop({ default: () => animateTranslate('bottom-to-top') })
    protected animation!: Vue;

    /**
     * Time in milliseconds during which each message is visible.
     *
     * @public
     */
    @Prop({ default: 1500 })
    protected animationIntervalMs!: number;

    /**
     * Whether the messages animation is active only when hovering the search input or always.
     *
     * @public
     */
    @Prop({ default: false })
    protected animateOnlyOnHover!: boolean;

    @State('searchBox', 'query')
    public query!: string;

    protected isSearchBoxHovered = false;

    protected isSearchBoxFocused = false;

    protected animationMessageIndex = 0;

    protected animationInterval: number | undefined;

    protected get isVisible(): boolean {
      return !this.query && !this.isSearchBoxFocused;
    }

    protected get isBeingAnimated(): boolean {
      return this.isVisible && (!this.animateOnlyOnHover || this.isSearchBoxHovered);
    }

    protected get animationMessage(): string | undefined {
      return this.messages[this.animationMessageIndex];
    }

    @Watch('isBeingAnimated', { immediate: true })
    @Watch('messages', { deep: true })
    @Watch('animationIntervalMs')
    protected resetAnimation(): void {
      this.stopAnimationInterval();

      if (this.isBeingAnimated) {
        this.animationInterval = setInterval((): void => {
          this.incrementAnimationMessageIndex();
        }, this.animationIntervalMs);
      }
    }

    protected stopAnimationInterval(): void {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = undefined;
      }
    }

    protected incrementAnimationMessageIndex(): void {
      this.animationMessageIndex = (this.animationMessageIndex + 1) % this.messages.length;
    }

    @Watch('isBeingAnimated')
    protected incrementMessageIndexForNextAnimation(): void {
      if (!this.isBeingAnimated) {
        this.incrementAnimationMessageIndex();
      }
    }

    @Watch('messages', { deep: true })
    protected resetAnimationMessageIndex(): void {
      this.animationMessageIndex = 0;
    }

    @XOn('UserHoveredInSearchBox')
    onUserHoveredInSearchBox(): void {
      this.isSearchBoxHovered = true;
    }

    @XOn('UserHoveredOutSearchBox')
    onUserHoveredOutSearchBox(): void {
      this.isSearchBoxHovered = false;
    }

    @XOn('UserFocusedSearchBox')
    onUserFocusedSearchBox(): void {
      this.isSearchBoxFocused = true;
    }

    @XOn('UserBlurredSearchBox')
    onUserBlurredSearchBox(): void {
      this.isSearchBoxFocused = false;
    }

    beforeDestroy(): void {
      this.stopAnimationInterval();
    }
  }
</script>

<style lang="scss" scoped>
  .x-search-input-placeholder {
    display: flex;
    align-items: center;
  }
</style>

<docs lang="mdx">
## See it in action

Here a basic example of how the animated search input placeholder is rendered.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
    />
    <SearchInput />
  </div>
</template>

<script>
  import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputPlaceholderDemo',
    components: {
      SearchInput,
      SearchInputPlaceholder
    },
    data: function () {
      return {
        placeholderMessages: ['Find sunglasses', 'Find handbags', 'Find earrings']
      };
    }
  };
</script>
```

### Play with default slot

In this example, a custom placeholder can be set so it is the only one visible until the user hovers
in the search input.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
      :animate-only-on-hover="true"
    >
      Search
    </SearchInputPlaceholder>
    <SearchInput />
  </div>
</template>

<script>
  import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputPlaceholderDemo',
    components: {
      SearchInput,
      SearchInputPlaceholder
    },
    data: function () {
      return {
        placeholderMessages: ['Find sunglasses', 'Find handbags', 'Find earrings']
      };
    }
  };
</script>
```
</docs>
