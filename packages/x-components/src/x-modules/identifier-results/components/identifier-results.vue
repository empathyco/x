<template>
  <component
    :is="animation"
    v-if="identifierResults.length"
    tag="ul"
    class="x-list x-identifier-results"
  >
    <li
      v-for="identifierResult in identifierResults"
      :key="identifierResult.id"
      class="x-identifier-results__item"
      data-test="identifier-results-item"
    >
      <!--
        @slot (Required) Identifier results item content
            @binding {Result} identifierResult - Identifier Result data
      -->
      <slot :identifierResult="identifierResult" />
    </li>
  </component>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types-old';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { identifierResultsXModule } from '../x-module';

  /**
   * Paints the list of identifier results stored in the state. Each identifier result should be
   * represented by a {@link IdentifierResult | identifier result component} besides any
   * other component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(identifierResultsXModule)]
  })
  export default class IdentifierResults extends Vue {
    /**
     * Animation component that will be used to animate the identifier results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue;

    /**
     * The module's list of identifier results.
     *
     * @public
     */
    @State('identifierResults', 'identifierResults')
    public identifierResults!: Result[];
  }
</script>

<docs>
  #Examples

  ## Adding a IdentifierResult component within a BaseResultLink

  A IdentifierResult **must** be used inside the IdentifierResults component. In the example below
  the BaseResultLink is used as a wrapper and its default slot is filled with the IdentifierResult
  component.

  ```vue
  <IdentifierResults :animation="fadeAndSlide">
    <template #default="{ identifierResult }">
      <BaseResultLink :result="identifierResult">
        <template #default="{ result }">
          <IdentifierResult :result="result"/>
        </template>
      </BaseResultLink>
    </template>
  </IdentifierResults>
  ```
</docs>
