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
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter, State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { identifierResultsXModule } from '../x-module';

  /**
   * This component renders an identifier result value and highlights its matching part with the
   * query from the state. Receives as prop the {@link @empathyco/x-types#Result | result data}.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(identifierResultsXModule)]
  })
  export default class IdentifierResult extends Vue {
    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * Query from the module state.
     *
     * @public
     */
    @State('identifierResults', 'query')
    public query!: string;

    /**
     * The RegExp with the current query from the state adding the separatorChars after each
     * matching character.
     *
     * @public
     */
    @Getter('identifierResults', 'identifierHighlightRegexp')
    public identifierHighlightRegexp!: RegExp;

    /**
     * Highlights the matching part of the identifier result with the query from the state.
     *
     * @returns String - The identifier result s query with the matching part inside a `<span>` tag.
     * @public
     */
    protected get highlightedQueryHTML(): string {
      const identifierValue = this.result.identifier?.value ?? '';
      if (identifierValue && this.identifierHighlightRegexp) {
        return identifierValue.replace(
          this.identifierHighlightRegexp,
          '<span class="x-identifier-result__matching-part">$1</span>'
        );
      }
      return identifierValue;
    }
  }
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
