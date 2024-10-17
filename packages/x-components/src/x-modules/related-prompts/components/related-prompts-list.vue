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
      maxNextQueriesPerPrompt: {
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
      const { query, status } = useState('nextQueries', ['query', 'status']);

      /**
       * The state related prompts.
       */
      const relatedPrompts: ComputedRef<RelatedPrompt[]> = useState('relatedPrompts', [
        'related_prompts_products'
      ]).related_prompts_products;

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
            Math.floor(index / props.maxNextQueriesPerPrompt)
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
