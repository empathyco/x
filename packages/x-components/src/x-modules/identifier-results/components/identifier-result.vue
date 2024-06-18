<template>
  <span
    v-if="query"
    v-html="highlightedQueryHTML"
    class="x-identifier-result"
    data-test="identifier-result"
  ></span>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import { computed, defineComponent, PropType } from 'vue';
  import { identifierResultsXModule } from '../x-module';
  import { useGetter } from '../../../composables/use-getter';
  import { useState } from '../../../composables/use-state';

  /**
   * This component renders an identifier result value and highlights its matching part with the
   * query from the state. Receives as prop the {@link @empathyco/x-types#Result} data.
   *
   * @public
   */
  export default defineComponent({
    name: 'IdentifierResult',
    xModule: identifierResultsXModule.name,
    props: {
      /**
       * (Required) The {@link @empathyco/x-types#Result} information.
       *
       * @public
       */
      result: {
        type: Object as PropType<Result>,
        required: true
      }
    },
    setup: function (props) {
      /**
       * Query from the module state.
       *
       * @public
       */
      const { query } = useState('identifierResults', ['query']);

      /**
       * The RegExp with the current query from the state adding the separatorChars after each
       * matching character.
       *
       * @public
       */
      const { identifierHighlightRegexp } = useGetter('identifierResults', [
        'identifierHighlightRegexp'
      ]);

      /**
       * Highlights the matching part of the identifier result with the query from the state.
       *
       * @returns String - The identifier result s query with the matching part inside a `<span>` tag.
       * @public
       */
      const highlightedQueryHTML = computed(() => {
        const identifierValue = props.result.identifier?.value ?? '';
        if (identifierValue && identifierHighlightRegexp.value) {
          return identifierValue.replace(
            identifierHighlightRegexp.value,
            '<span class="x-identifier-result__matching-part">$1</span>'
          );
        }
        return identifierValue;
      });

      return {
        query,
        highlightedQueryHTML
      };
    }
  });
</script>

<docs lang="mdx">
## Examples

This component renders an identifier result value and highlights its matching part with the query
from the state. Receives as prop the result data

### Basic usage:

```vue
<IdentifierResult v-bind="{ result }" />
```
</docs>
