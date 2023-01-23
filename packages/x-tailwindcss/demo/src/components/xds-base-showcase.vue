<template>
  <div class="x-flex x-flex-col x-gap-32">
    <h1 class="x-text-lg">{{ title }}</h1>
    <div
      v-for="(classes, section) in sections"
      :key="section"
      class="x-flex x-flex-row x-gap-16 x-items-baseline"
    >
      <h2 class="x-text-md x-w-128 x-text-right x-flex-none">{{ section }}</h2>

      <div class="x-flex x-flex-row x-flex-wrap x-gap-16 x-items-baseline">
        <div v-for="cssClass in classes" :key="cssClass">
          <slot v-bind="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }" />
        </div>
      </div>
    </div>
    <div
      class="x-fixed x-left-1/2 x-top-1/2 -translate-x-1/2 -translate-y-1/2 x-bg-neutral-25 x-p-8 x-transition-opacity x-duration-300 x-pointer-events-none"
      :class="isMessageVisible ? 'x-opacity-100' : 'x-opacity-0'"
    >
      CSS classes copied to Clipboard!
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';

  @Component
  export default class XdsBaseShowcase extends Vue {
    /**
     * The sections to display with the list of classes for each element.
     *
     * @public
     */
    @Prop({ required: true })
    public sections!: ShowcaseSections;

    /**
     * The title to display at the beginning of the component.
     *
     * @public
     */
    @Prop({ required: true })
    public title!: string;

    protected isMessageVisible = false;

    /**
     * Copies the classList of an HTML Element to the clipboard.
     *
     * @param event - The MouseEvent to get the HTML Element from.
     *
     * @internal
     */
    protected copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      this.showMessage();
    }

    /**
     * Removes the prefix from a CSS class list. If the prefix is full class name, is removed too.
     *
     * @param cssClasses - The class list to remove the prefix from.
     * @param prefix - The prefix to be removed.
     * @returns The CSS classes with the prefix removed.
     *
     * @internal
     */
    protected removeClassPrefix(cssClasses: string, prefix: string): string {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
    }

    /**
     * Shows the message of copied classes to clipboard for 2 seconds.
     *
     * @internal
     */
    protected showMessage(): void {
      this.isMessageVisible = true;
      setTimeout(() => (this.isMessageVisible = false), 2000);
    }
  }
</script>
