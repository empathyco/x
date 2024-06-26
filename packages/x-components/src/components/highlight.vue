<template>
  <NoElement>
    <slot v-bind="{ text, hasMatch, ...matchParts }">
      <span class="x-highlight" :class="dynamicCSSClasses">
        <span
          v-if="matchParts.start"
          v-text="matchParts.start"
          class="x-highlight__text"
          data-test="highlight-start"
        />
        <span
          v-if="hasMatch"
          v-text="matchParts.match"
          class="x-highlight__text x-highlight-text-match"
          :class="matchingPartClass"
          data-test="matching-part"
        />
        <span
          v-if="matchParts.end"
          v-text="matchParts.end"
          class="x-highlight__text"
          data-test="highlight-end"
        />
      </span>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { normalizeString } from '../utils/normalize';
  import { VueCSSClasses } from '../utils/types';
  import { NoElement } from './no-element';

  /**
   * Highlights the given part of the text. The component is smart enough to do matches
   * between special characters like tilde, cedilla, eñe, capital letters...
   *
   * @public
   */
  export default defineComponent({
    name: 'Highlight',
    components: { NoElement },
    props: {
      /**
       * The text to highlight some part of it.
       *
       * @public
       */
      text: {
        type: String,
        default: ''
      },
      /**
       * The part of the text to be highlighted.
       *
       * @public
       */
      highlight: {
        type: String,
        default: ''
      },
      /**
       * CSS Class to add when the `text` string contains the `highlight` string.
       */
      matchClass: {
        type: String,
        default: ''
      },
      /**
       * CSS Class to add when the given `text` doesn't contain the `highlight` string.
       */
      noMatchClass: {
        type: String,
        default: ''
      },
      /**
       * CSS Class to add to the matching text.
       */
      matchingPartClass: {
        type: String,
        default: ''
      }
    },
    setup: function (props) {
      /**
       * Splits the text to highlight into 3 parts: a starting part, the matching part
       * and the ending part. If there is no match between the text and the highlight, the `start`
       * property will contain the whole text.
       *
       * @returns An object containing the different parts of the text.
       * @internal
       */
      const matchParts = computed((): HighlightMatch => {
        const matcherIndex = normalizeString(props.text).indexOf(normalizeString(props.highlight));
        return matcherIndex !== -1 && props.highlight
          ? splitAt(props.text.trim(), matcherIndex, matcherIndex + props.highlight.trim().length)
          : { start: props.text, match: '', end: '' };
      });

      /**
       * Checks if the normalized suggestion query matches with the module's query, so it has a
       * matching part.
       *
       * @returns True if there is a match between the text and the highlight strings.
       * @internal
       */
      const hasMatch = computed((): boolean => {
        return !!matchParts.value.match;
      });

      /**
       * CSS classes to add depending on the component state.
       *
       * @remarks
       * `x-highlight--has-match`: When there is a match between the text and the part to highlight.
       * `[matchClass]`: When there is a match between the text and
       * the part to highlight.
       * `[noMatchClass]`: when there is no match between the text to highlight.
       * @returns The {@link VueCSSClasses} classes.
       * @internal
       */
      const dynamicCSSClasses = computed((): VueCSSClasses => {
        const classes: VueCSSClasses = {
          'x-highlight--has-match': hasMatch.value,
          'x-highlight-text': hasMatch.value,
          [props.matchClass]: hasMatch.value
        };
        if (props.noMatchClass) {
          classes[props.noMatchClass] = !hasMatch.value;
        }
        return classes;
      });

      /**
       * Splits the label in three parts based on two indexes.
       *
       * @param label - The string that will be divided in three parts.
       * @param start - The first index that the label will be divided by.
       * @param end - The second index that the label will be divided by.
       *
       * @returns The three parts of the divided label.
       * @internal
       */
      function splitAt(label: string, start: number, end: number): HighlightMatch {
        return {
          start: label.substring(0, start),
          match: label.substring(start, end),
          end: label.substring(end)
        };
      }

      return { hasMatch, matchParts, dynamicCSSClasses };
    }
  });

  /**
   * Contains the different parts of a string match.
   */
  interface HighlightMatch {
    /**
     * When the match does not happen from the beginning of the string, the initial unmatched
     * part.
     */
    start: string;
    /**
     * The part of the text that is matching.
     */
    match: string;
    /**
     * When the match does not extend until the end, the remaining unmatched string.
     */
    end: string;
  }
</script>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

Here you have a basic example of how the highlight component is rendered.

_Type any term in the input field to try it out!_

```vue live
<template>
  <div>
    <input v-model="highlight" />
    <Highlight :highlight="highlight" text="milanesa" />
  </div>
</template>

<script>
  import { Highlight } from '@empathyco/x-components';

  export default {
    name: 'HighlightDemo',
    components: {
      Highlight
    },
    data() {
      return {
        highlight: ''
      };
    }
  };
</script>
```

### Customise the layout

This component allows to customise the whole layout. Be careful as due to Vue 2 limitations you can
only render a single root element.

```vue live
<template>
  <div>
    <input v-model="highlight" />
    <Highlight
      :highlight="highlight"
      text="Entraña"
      #default="{ hasMatch, start, match, end, text }"
    >
      <span class="custom-layout" v-if="hasMatch">
        <strong>{{ start }}</strong>
        {{ match }}
        <strong>{{ end }}</strong>
      </span>
      <span v-else>{{ text }}</span>
    </Highlight>
  </div>
</template>

<script>
  import { Highlight } from '@empathyco/x-components';

  export default {
    name: 'HighlightDemo',
    components: {
      Highlight
    },
    data() {
      return {
        highlight: 'entran'
      };
    }
  };
</script>
```
</docs>
