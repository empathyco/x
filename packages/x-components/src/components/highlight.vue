<template>
  <NoElement>
    <slot v-bind="{ text, hasMatch, ...matchParts }">
      <span class="x-highlight" :class="dynamicCSSClasses">
        <span v-text="matchParts.start" class="x-highlight__text" />
        <span
          v-if="hasMatch"
          v-text="matchParts.match"
          class="x-highlight__text x-highlight-match"
          data-test="matching-part"
        />
        <span v-if="hasMatch" v-text="matchParts.end" class="x-highlight__text" />
      </span>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import { normalizeString } from '../utils/normalize';
  import { VueCSSClasses } from '../utils/types';
  import { NoElement } from './no-element';
  import { dynamicPropsMixin } from './dynamic-props.mixin';

  /**
   * Highlights the given part of the text. The component is smart enough to do matches
   * between special characters like tilde, cedilla, eñe, capital letters...
   *
   * @public
   */
  @Component({
    components: { NoElement }
  })
  export default class Highlight extends Mixins(dynamicPropsMixin(['noMatchClass'])) {
    /**
     * The text to highlight some part of it.
     *
     * @public
     */
    @Prop({ default: '' })
    public text!: string;

    /**
     * The part of the text to be highlighted.
     *
     * @public
     */
    @Prop({ default: '' })
    public highlight!: string;

    /**
     * CSS Class to add when the `text` string contains the `highlight` string.
     */
    @Prop({ default: 'x-highlight-text' })
    public matchClass!: string;

    /**
     * Checks if the normalized suggestion query matches with the module's query, so it has a
     * matching part.
     *
     * @returns True if there is a match between the text and the highlight strings.
     * @internal
     */
    protected get hasMatch(): boolean {
      return !!this.matchParts.match;
    }

    /**
     * CSS classes to add depending on the component state.
     *
     * @remarks
     * `x-highlight--has-match`: When there is a match between the text and the part to highlight.
     * @returns The {@link VueCSSClasses} classes.
     * @public
     */
    protected get dynamicCSSClasses(): VueCSSClasses {
      const classes: VueCSSClasses = {
        'x-highlight--has-match': this.hasMatch,
        'x-highlight-text': this.hasMatch,
        [this.matchClass]: this.hasMatch
      };
      if (this.noMatchClass) {
        classes[this.noMatchClass] = !this.hasMatch;
      }
      return classes;
    }

    /**
     * Splits the text to highlight into 3 parts: a starting part, the matching part
     * and the ending part. If there is no match between the text and the highlight, the `start`
     * property will contain the whole text.
     *
     * @returns An object containing the different parts of the text.
     * @internal
     */
    protected get matchParts(): HighlightMatch {
      const matcherIndex = normalizeString(this.text).indexOf(normalizeString(this.highlight));
      return matcherIndex !== -1 && this.highlight
        ? this.splitAt(this.text, matcherIndex, matcherIndex + this.highlight.length)
        : { start: this.text, match: '', end: '' };
    }

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
    protected splitAt(label: string, start: number, end: number): HighlightMatch {
      return {
        start: label.substring(0, start),
        match: label.substring(start, end),
        end: label.substring(end)
      };
    }
  }

  interface HighlightMatch {
    start: string;
    match: string;
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
