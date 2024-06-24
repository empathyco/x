<template>
  <div>
    <h1>Static content:</h1>
    <StaggeredFadeAndSlide tag="ul">
      <li key="1">Element to animate</li>
      <li key="2">Element to animate</li>
      <li key="3">Element to animate</li>
    </StaggeredFadeAndSlide>
    <br />
    <h1>Animation as prop</h1>
    <BaseSuggestions :suggestions="suggestions" :animation="animation">
      <template #default="{ suggestion }">
        <span>{{ suggestion.query }}</span>
      </template>
    </BaseSuggestions>
    <br />

    <h1>Dinamic content:</h1>
    <button @click="insert" style="border: 1px solid black">Insert at random index</button>
    <button @click="reset" style="border: 1px solid black">Reset</button>
    <StaggeredFadeAndSlide tag="ul">
      <li v-for="item in items" :key="item" class="item">
        {{ item }}
        <button @click="remove(item)" style="border: 1px solid black">x</button>
      </li>
    </StaggeredFadeAndSlide>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getQuerySuggestionsStub } from '../../__stubs__';
  import { BaseSuggestions } from '../../components/suggestions';
  import StaggeredFadeAndSlide from '../../components/animations/staggered-fade-and-slide.vue';

  export default defineComponent({
    name: 'AnimationsTest',
    components: {
      BaseSuggestions,
      StaggeredFadeAndSlide
    },
    setup() {
      /**
       * Get the query suggestions.
       */
      const suggestions = getQuerySuggestionsStub('chip', 5);

      /**
       * The animation to use.
       */
      const animation = StaggeredFadeAndSlide;

      /**
       * Get the initial items for the list.
       *
       * @returns The initial items.
       */
      const getInitialItems = () => [1, 2, 3, 4, 5];

      /**
       * Items to be displayed in the list.
       */
      const items = ref(getInitialItems());
      /**
       * Id for the next item to be inserted.
       */
      let id = items.value.length + 1;

      /**
       * Insert a new item at a random index.
       */
      function insert() {
        const i = Math.round(Math.random() * items.value.length);
        items.value.splice(i, 0, id++);
      }

      /**
       * Reset the list of items.
       */
      function reset() {
        items.value = getInitialItems();
        id = items.value.length + 1;
      }

      /**
       * Remove an item from the list.
       *
       * @param item - The item to remove.
       */
      function remove(item: any) {
        const i = items.value.indexOf(item);
        if (i > -1) {
          items.value.splice(i, 1);
        }
      }

      /**
       * Expose the public API.
       */
      return {
        animation,
        suggestions,
        insert,
        reset,
        remove,
        items
      };
    }
  });
</script>
