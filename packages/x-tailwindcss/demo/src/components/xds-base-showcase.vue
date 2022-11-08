<template>
  <div class="x-flex x-flex-col x-gap-32">
    <h1 class="x-text-lg">{{ title }}</h1>
    <div v-for="(classes, section) in sections" :key="section" class="x-flex x-flex-row x-gap-16">
      <h2 class="x-text-md x-w-128 x-text-right x-flex-none">{{ section }}</h2>

      <div class="x-flex x-flex-row x-flex-wrap x-gap-16">
        <div v-for="cssClass in classes" :key="cssClass">
          <slot v-bind="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }" />
        </div>
      </div>
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

    /**
     * Copies the classList of an HTML Element to the clipboard.
     *
     * @param event - The MouseEvent to get the HTML Element from.
     */
    protected copyCssClassesToClipboard(event: MouseEvent): void {
      navigator.clipboard.writeText((event.target as HTMLElement).classList.value);
    }

    /**
     * Removes the prefix from a CSS class list. If the prefix is full class name, is removed too.
     *
     * @param cssClasses - The class list to remove the prefix from.
     * @param prefix - The prefix to be removed.
     * @returns The CSS classes with the prefix removed.
     */
    protected removeClassPrefix(cssClasses: string, prefix: string): string {
      return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
    }
  }
</script>
