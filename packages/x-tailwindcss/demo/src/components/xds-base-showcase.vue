<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-lg">{{ title }}</h1>
    <div
      v-for="(classes, section) in sections"
      :key="section"
      class="flex flex-row items-baseline gap-4"
    >
      <h2 class="text-md w-[128px] flex-none text-right">{{ section }}</h2>

      <div
        class="flex flex-row flex-wrap items-baseline gap-4"
        :class="sectionsClasses[section] || ''"
      >
        <div v-for="cssClass in classes" :key="cssClass">
          <slot v-bind="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }" />
        </div>
      </div>
    </div>
    <div
      class="bg-neutral-25 pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 transition-opacity duration-300"
      :class="isMessageVisible ? 'opacity-100' : 'opacity-0'"
    >
      CSS classes copied to Clipboard!
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { ShowcaseSectionsClasses, ShowcaseSections } from '../types/types';

  export default defineComponent({
    props: {
      sections: {
        type: Object as PropType<ShowcaseSections>,
        required: true
      },
      sectionsClasses: {
        type: Object as PropType<ShowcaseSectionsClasses>,
        default: () => ({})
      },
      title: {
        type: String,
        required: true
      }
    },
    setup() {
      const isMessageVisible = ref(false);

      /**
       * Copies the classList of an HTML Element to the clipboard.
       *
       * @param event - The MouseEvent to get the HTML Element from.
       *
       * @internal
       */
      function copyCssClassesToClipboard(event: MouseEvent): void {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
        showMessage();
      }

      /**
       * Shows the message of copied classes to clipboard for 2 seconds.
       *
       * @internal
       */
      function showMessage(): void {
        isMessageVisible.value = true;
        setTimeout(() => (isMessageVisible.value = false), 2000);
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
      function removeClassPrefix(cssClasses: string, prefix: string): string {
        return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
      }
      return {
        copyCssClassesToClipboard,
        removeClassPrefix,
        isMessageVisible
      };
    }
  });
</script>
