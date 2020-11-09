<template>
  <component
    :is="animation || 'ul'"
    v-if="hasFacets"
    tag="ul"
    class="x-facets-list"
    data-test="facets"
  >
    <li
      v-for="(facet, facetId) in facets"
      :key="facetId"
      class="x-facets-list__item"
      data-test="facets-facet"
    >
      <!--
        @slot Customized Facet rendering. Specifying a slot with the facet's name will result in the
        facet using that slot composition to render.
            @binding {Facet} facet - Facet to render
      -->
      <slot v-if="$scopedSlots[facetId]" :name="facetId" :facet="facet"></slot>
      <!--
        @slot (required) Default Facet rendering. This slot will be used by default for rendering
        the facets without an specific slot implementation.
            @binding {Facet} facet - Facet to render
      -->
      <slot v-else :facet="facet">
        This is the {{ facet.label }} facet. Pass something into its slot to display content.
      </slot>
    </li>
  </component>
</template>

<script lang="ts">
  import {Facet} from '@empathy/search-types';
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { Dictionary } from "../../../utils/types";
  import { State } from "../../../components/decorators/store.decorators";
  import { xComponentMixin } from "../../../components/x-component.mixin";
  import { facetsXModule } from "../x-module";

  /**
   * Facets component that renders the available facets.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class Facets extends Vue {
    /**
     * The module's facets.
     *
     * @public
     */
    @State('facets', 'facets')
    public facets!: Dictionary<Facet>;

    /**
     * Animation component that will be used to animate the facets.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

    /**
     * Indicates if there are facets available to show.
     *
     * @returns True if there are facets available and false otherwise.
     *
     * @internal
     */
    protected get hasFacets(): boolean {
      return !!Object.keys(this.facets).length;
    }
  }
</script>

<style lang="scss" scoped>
  .x-facets-list {
    list-style-type: none;
  }
</style>

<docs>
  # Example

  This components renders the available facets.
  Each facet is different in its purpose so when rendering them this component allows customized
  compositions for each facets.

  ## Default usage
  The default slot of this component is mandatory. If no other slot is defined, every Facet will be
  rendered as specified in the default slot.

  ```vue
  <Facets>
    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>

      <ul v-for="filter in facet.filters" :key="filter.id">
        <li>
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
  ```

  ## Customized usage
  Customized compositions for a specific Facet can be achieved by using a slot with the same name
  as the Facet to customize. For example, the Facet with the label "color" requires a composition
  that differs from the rest of the Facets. Doing it in a slot with the name "color" will apply this
  customization just to the "color" Facet. The other facets will fallback to the composition of the
  default slot.

  ```vue
  <Facets>
    <template #color="{ facet }">
      <ul v-for="filter in facet.filters" :key="filter.id">
        <li v-if="!filter.selected">
          {{ filter.label }}
        </li>
      </ul>
    </template>

    <template #default="{ facet }">
      <h1>{{ facet.label }}</h1>

      <ul v-for="filter in facet.filters" :key="filter.id">
        <li>
          {{ filter.label }}
        </li>
      </ul>
    </template>
  </Facets>
  ```

</docs>
