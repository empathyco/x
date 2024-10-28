<script lang="ts">
  import { computed, ComputedRef, defineComponent, h, inject, provide, Ref } from 'vue';
  import { RelatedPrompt } from '@empathyco/x-types';
  import { AnimationProp } from '../../../types/animation-prop';
  import { groupItemsBy } from '../../../utils/array';
  import ItemsList from '../../../components/items-list.vue';
  import { ListItem } from '../../../utils/types';
  import {
    HAS_MORE_ITEMS_KEY,
    LIST_ITEMS_KEY,
    QUERY_KEY
  } from '../../../components/decorators/injection.consts';
  import { relatedPromptsXModule } from '../x-module';
  import { useState } from '../../../composables/use-state';
  import { RelatedPromptsGroup } from '../types';

  /**
   * Component that inserts groups of related prompts in different positions of the injected search
   * items list, based on the provided configuration.
   *
   * @public
   */
  export default defineComponent({
    name: 'RelatedPromptsList',
    xModule: relatedPromptsXModule.name,
    props: {
      /**
       * Animation component that will be used to animate the related prompts groups.
       */
      animation: {
        type: AnimationProp,
        default: 'ul'
      },
      /**
       * The first index to insert a group of related prompts at.
       */
      offset: {
        type: Number,
        default: 24
      },
      /**
       * The items cycle size to keep inserting related prompts groups at.
       */
      frequency: {
        type: Number,
        default: 24
      },
      /**
       * The maximum amount of related prompts to add in a single group.
       */
      maxRelatedPromptsPerGroup: {
        type: Number,
        default: 4
      },
      /**
       * The maximum number of groups to insert into the injected list items list.
       */
      maxGroups: {
        type: Number,
        default: undefined
      },
      /**
       * Determines if a group is added to the injected items list in case the number
       * of items is smaller than the offset.
       */
      showOnlyAfterOffset: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { slots }) {
      const { query, status } = useState('relatedPrompts', ['query', 'status']);

      /**
       * The state related prompts.
       */
      const relatedPrompts: ComputedRef<RelatedPrompt[]> = useState('relatedPrompts', [
        'relatedPrompts'
      ]).relatedPrompts;

      /**
       * Injected query, updated when the related request(s) have succeeded.
       */
      const injectedQuery = inject<Ref<string | undefined>>(QUERY_KEY as string);

      /**
       * Indicates if there are more available results than the injected.
       */
      const hasMoreItems = inject<Ref<boolean | undefined>>(HAS_MORE_ITEMS_KEY as string);

      /**
       * The grouped related prompts based on the given config.
       *
       * @returns A list of related prompts groups.
       */
      const relatedPromptsGroups = computed<RelatedPromptsGroup[]>(() =>
        Object.values(
          groupItemsBy(relatedPrompts.value, (_, index) =>
            Math.floor(index / props.maxRelatedPromptsPerGroup)
          )
        )
          .slice(0, props.maxGroups)
          .map((relatedPrompts, index) => ({
            modelName: 'RelatedPromptsGroup' as const,
            id: `related-prompts-group-${index}`,
            relatedPrompts
          }))
      );

      /**
       * It injects {@link ListItem} provided by an ancestor as injectedListItems.
       */
      const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string);

      /**
       * Checks if the related prompts are outdated taking into account the injected query.
       *
       * @returns True if the related prompts are outdated, false if not.
       */
      const relatedPromptsAreOutdated = computed(
        () =>
          !!injectedQuery?.value &&
          (query.value !== injectedQuery.value || status.value !== 'success')
      );

      /**
       * Checks if the number of items is smaller than the offset so a group
       * should be added to the injected items list.
       *
       * @returns True if a group should be added, false if not.
       */
      const hasNotEnoughListItems = computed(
        () =>
          !props.showOnlyAfterOffset &&
          !hasMoreItems?.value &&
          injectedListItems !== undefined &&
          injectedListItems.value.length > 0 &&
          props.offset > injectedListItems.value.length
      );

      /**
       * New list of {@link ListItem}s to render.
       *
       * @returns The new list of {@link ListItem}s with the related prompts groups inserted.
       */
      const items = computed((): ListItem[] => {
        if (!injectedListItems?.value) {
          return relatedPromptsGroups.value;
        }
        if (relatedPromptsAreOutdated.value) {
          return injectedListItems.value;
        }
        if (hasNotEnoughListItems.value) {
          return injectedListItems.value.concat(relatedPromptsGroups.value[0] ?? []);
        }
        return relatedPromptsGroups?.value.reduce(
          (items, relatedPromptsGroup, index) => {
            const targetIndex = props.offset + props.frequency * index;
            if (targetIndex <= items.length) {
              items.splice(targetIndex, 0, relatedPromptsGroup);
            }
            return items;
          },
          [...injectedListItems.value]
        );
      });

      /**
       * The computed list items of the entity that uses the mixin.
       *
       * @remarks It should be overridden in the component that uses the mixin and
       * it's intended to be filled with items from the state. Vue doesn't allow
       * mixins as abstract classes.
       * @returns An empty array as fallback in case it is not overridden.
       */
      provide(LIST_ITEMS_KEY as string, items);

      return () => {
        const innerProps = { items: items.value, animation: props.animation };
        // https://vue-land.github.io/faq/forwarding-slots#passing-all-slots
        return slots.default?.(innerProps)[0] ?? h(ItemsList, innerProps, slots);
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits no events.

## See it in action

  <!-- prettier-ignore-start -->

:::warning Backend microservice required To use this component, the <b>QuerySignals</b> microservice
must be implemented. :::

  <!-- prettier-ignore-end -->

Usually, this component is going to be used together with the `ResultsList` one. Related prompts
groups will be inserted between the results, guiding users to discover new searches directly from
the results list.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList />
    </ResultsList>
  </div>
</template>

<script>
  import { RelatedPromptsList } from '@empathyco/x-components/related-prompts';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'RelatedPromptsListDemo',
    components: {
      RelatedPromptsList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Play with the index that related prompts groups are inserted at

The component allows to customise where are the related prompts groups inserted. In the following
example, the first group of related prompts will be inserted at the index `48` (`offset`), and then
a second group will be inserted at index `120` because of the `frequency` prop configured to `72`.
Finally, a third group will be inserted at index `192`. Because `maxGroups` is configured to `3`, no
more groups will be inserted. Each one of this groups will have up to `6` related prompts
(`maxRelatedPromptsPerGroup`).

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="6"
        :maxGroups="3"
      />
    </ResultsList>
  </div>
</template>

<script>
  import { RelatedPromptsList } from '@empathyco/x-components/related-prompts';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'RelatedPromptsListDemo',
    components: {
      RelatedPromptsList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Showing/hiding first related prompts group when no more items

By default, the first related prompts group will be inserted when the total number of results is
smaller than the offset, but this behavior can be deactivated by setting the `showOnlyAfterOffset`
to `true`.

```vue live
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="1"
        :showOnlyAfterOffset="true"
      />
    </ResultsList>
  </div>
</template>

<script>
  import { RelatedPromptsList } from '@empathyco/x-components/related-prompts';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'RelatedPromptsListDemo',
    components: {
      RelatedPromptsList,
      ResultsList,
      SearchInput
    }
  };
</script>
```

### Customise the layout of the component

This component will render by default the `id` of each search item, both the injected, and for the
groups of related prompts generated, but the common case is to integrate it with another layout
component, for example the `BaseGrid`. To do so, you can use the `default` slot

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <RelatedPromptsList
        :offset="48"
        :frequency="72"
        :maxRelatedPromptsPerGroup="6"
        :maxGroups="3"
        #default="{ items }"
      >
        <BaseGrid :items="items" :animation="animation">
          <template #related-prompts-group="{ item }">
            <span v-for="const prompt of items.relatedPrompts">
              RelatedPromptsGroup:
              <pre>{{ prompt }}</pre>
            </span>
          </template>
          <template #result="{ item }">
            <span>Result: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </RelatedPromptsList>
    </ResultsList>
  </div>
</template>

<script>
  import { RelatedPromptsList } from '@empathyco/x-components/related-prompts';
  import { ResultsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { BaseGrid } from '@empathyco/x-components';

  export default {
    name: 'RelatedPromptsListDemo',
    components: {
      RelatedPromptsLis,
      ResultsList,
      BaseGrid,
      SearchInput
    }
  };
</script>
```
</docs>
