<template>
  <span class="x-highlight" :class="dynamicCSSClasses">
    <span
      v-if="matchParts.start"
      class="x-highlight__text"
      data-test="highlight-start"
      v-text="matchParts.start"
    />
    <span
      v-if="hasMatch"
      class="x-highlight__text x-highlight-text-match"
      :class="matchingPartClass"
      data-test="matching-part"
      v-text="matchParts.match"
    />
    <span
      v-if="matchParts.end"
      class="x-highlight__text"
      data-test="highlight-end"
      v-text="matchParts.end"
    />
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { normalizeString } from '../utils'

/**
 * Highlights the given part of the text. The component is smart enough to do matches
 * between special characters like tilde, cedilla, eñe, capital letters...
 *
 * @public
 */
export default defineComponent({
  name: 'Highlight',
  props: {
    /** The text to highlight some part of it. */
    text: {
      type: String,
      default: '',
    },
    /** The part of the text to be highlighted. */
    highlight: {
      type: String,
      default: '',
    },
    /** CSS Class to add when the `text` string contains the `highlight` string. */
    matchClass: {
      type: String,
      default: '',
    },
    /** CSS Class to add when the given `text` doesn't contain the `highlight` string. */
    noMatchClass: {
      type: String,
      default: '',
    },
    /** CSS Class to add to the matching text. */
    matchingPartClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    /**
     * Splits the label in three parts based on two indexes.
     *
     * @param label - The string that will be divided in three parts.
     * @param start - The first index that the label will be divided by.
     * @param end - The second index that the label will be divided by.
     *
     * @returns The three parts of the divided label.
     */
    function splitAt(label: string, start: number, end: number) {
      return {
        start: label.substring(0, start),
        match: label.substring(start, end),
        end: label.substring(end),
      }
    }

    /**
     * Splits the text to highlight into 3 parts: a starting part, the matching part
     * and the ending part. If there is no match between the text and the highlight, the `start`
     * property will contain the whole text.
     *
     * @returns An object containing the different parts of the text.
     */
    const matchParts = computed(() => {
      const matcherIndex = normalizeString(props.text).indexOf(normalizeString(props.highlight))
      return matcherIndex !== -1 && props.highlight
        ? splitAt(props.text.trim(), matcherIndex, matcherIndex + props.highlight.trim().length)
        : { start: props.text, match: '', end: '' }
    })

    /**
     * Checks if the normalized suggestion query matches with the module's query, so it has a
     * matching part.
     *
     * @returns True if there is a match between the text and the highlight strings.
     */
    const hasMatch = computed(() => !!matchParts.value.match)

    /**
     * CSS classes to add depending on the component state.
     *
     * @remarks
     * `x-highlight--has-match`: When there is a match between the text and the part to highlight.
     * `[matchClass]`: When there is a match between the text and
     * the part to highlight.
     * `[noMatchClass]`: when there is no match between the text to highlight.
     * @returns The CSS classes.
     */
    const dynamicCSSClasses = computed(() => {
      const classes = {
        'x-highlight--has-match': hasMatch.value,
        'x-highlight-text': hasMatch.value,
        [props.matchClass]: hasMatch.value,
      }
      if (props.noMatchClass) {
        classes[props.noMatchClass] = !hasMatch.value
      }
      return classes
    })

    /**
     * Render function to execute the `default` slot, binding `slotsProps` and getting only the
     * first `vNode` to avoid Fragments and Text root nodes.
     *
     * @remarks `slotProps` must be values without Vue reactivity and located inside the
     * render-function to update the binding data properly.
     *
     * @returns The root `vNode` of the `default` slot.
     */
    function renderDefaultSlot() {
      const slotProps = {
        text: props.text,
        hasMatch: hasMatch.value,
        ...matchParts.value,
      }
      return slots.default?.(slotProps)[0]
    }

    /* Hack to render through a render-function, the `default` slot or, in its absence,
       the component itself. It is the alternative for the NoElement antipattern. */
    const componentProps = { hasMatch, matchParts, dynamicCSSClasses }
    return (slots.default ? renderDefaultSlot : componentProps) as typeof componentProps
  },
})
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

<script setup>
import { Highlight } from '@empathyco/x-components'
import { ref } from 'vue'
const highlight = ref('')
</script>
```

### Customise the layout

This component allows to customise the whole layout.

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

<script setup>
import { Highlight } from '@empathyco/x-components'
import { ref } from 'vue'
const highlight = ref('entran')
</script>
```
</docs>
