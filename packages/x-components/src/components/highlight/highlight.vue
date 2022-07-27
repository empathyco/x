<template>
  <span
    v-html="queryHTML"
    v-bind="{ toHighlight, queryHTML }"
    :aria-label="toHighlight"
    class="x-suggestion__query"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { normalizeString } from '../../utils/normalize';
  import { sanitize } from '../../utils/sanitize';

  @Component
  export default class Highlight extends Vue {
    @Prop({ required: true })
    protected toHighlight!: string;

    @Prop({ required: true })
    protected highlight!: string;

    protected get hasMatchingQuery(): boolean {
      return !!this.toHighlight && normalizeString(this.toHighlight).includes(this.toHighlight);
    }

    protected get queryHTML(): string {
      if (this.hasMatchingQuery) {
        const matcherIndex = normalizeString(this.highlight).indexOf(this.toHighlight);

        const [beginning, matching, end] = this.splitAt(
          this.toHighlight,
          matcherIndex,
          this.toHighlight.length
        );

        const attrsMatching = 'data-test="matching-part" class="x-suggestion__matching-part"';
        return `${beginning}<span ${attrsMatching}>${matching}</span>${end}`;
      }

      return sanitize(this.toHighlight);
    }

    protected splitAt(label: string, start: number, skip: number): [string, string, string] {
      const startPart = label.substr(0, start);
      const matchingPart = label.substr(start, skip);
      const endPart = label.substr(start + skip);
      return [sanitize(startPart), sanitize(matchingPart), sanitize(endPart)];
    }
  }
</script>
