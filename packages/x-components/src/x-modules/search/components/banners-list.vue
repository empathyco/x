<template>
  <NoElement>
    <!--
      @slot Customized Banners List layout.
          @binding {banners} banners - Banners to render
          @binding {animation} animation - Animation to animate the elements
    -->
    <slot v-bind="{ banners, gridItems, animation }">
      <component
        :is="animation"
        v-if="banners.length"
        tag="ul"
        class="x-list x-banners-list"
        data-test="banners-list"
      >
        <li
          v-for="banner in banners"
          :key="banner.id"
          class="x-banners-list__item"
          data-test="banners-list-item"
        >
          <!--
            @slot Customized Banners List banner.
                @binding {banner} banner - Banner data
          -->
          <slot :banner="banner" name="banner">{{ banner.title }}</slot>
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Banner } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { XInject, XProvide } from '../../../components/decorators/injection.decorators';
  import { GridItem } from '../../../utils/types';
  /**
   * It renders a list of banners from {@link SearchState.banners} by default.
   *
   * The component provides the slot layout which wraps the whole component with the promoteds
   * bound.
   *
   * It also provides the slot result to customize the item, which is within the layout slot, with
   * the promoted bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class BannersList extends Vue {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'banners')
    public banners!: Banner[];

    /**
     * Animation component that will be used to animate the promoteds.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * It injects gridItems provided by an ancestor as injectedGridItems.
     *
     * @internal
     */
    @XInject('gridItems', <GridItem[]>[])
    public injectedGridItems!: GridItem[];

    /**
     * It provides `gridItems` which is the result of concatenating the `banners` and the
     * `injectedGridItems`.
     *
     * @returns Array of `banners` and `injectedGridItems`.
     *
     * @internal
     */
    @XProvide('gridItems')
    public get gridItems(): GridItem[] {
      return [...this.banners, ...this.injectedGridItems];
    }
  }
</script>

<docs lang="mdx">
#Examples

It renders a list of results from {@link SearchState.results} by default. The component provides the
slot layout which wraps the whole component with the results bound. It also provides the slot result
to customize the item, which is within the layout slot, with the result bound.

## Basic example

You don't need to pass any props or slots. Simply add the component and when it has any results it
will show them.

```vue
<ResultsList />
```

## Configuring the animation

The component has an optional prop, `animation`, to render the component using an animation.

```vue
<ResultsList :animation="FadeAndSlide" />
```

## Overriding result content

It renders a list of results using the result slot.

```vue
<ResultsList :animation="FadeAndSlide">
  <template #result="{ result }">
      <span class="result">
        {{ result.name }}
      </span>
  </template>
</ResultsList>
```

## Overriding layout content

It renders a list of results customizing the layout slot. In the example below, instead of using the
default ResultsList content, a BaseGrid component is used to render the results.

```vue
<ResultsList :animation="FadeAndSlide">
  <template #layout="{ results, animation }">
    <BaseGrid :items="results" :animation="animation">
      <template #Result="{ item }">
        <span>Result: {{ item.name }}</span>
      </template>
      <template #default="{ item }">
        <span>Default: {{ item }}</span>
      </template>
    </BaseGrid>
  </template>
</ResultsList>
```
</docs>
