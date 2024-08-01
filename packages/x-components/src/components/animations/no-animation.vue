<script lang="ts">
  import { defineComponent, h, Comment } from 'vue';

  /**
   * Component to be used as `default` for animation props together with dynamic components
   * `<component :is="animation">` in the template.
   */
  export default defineComponent({
    name: 'NoAnimation',
    setup(_, { slots }) {
      return () =>
        slots.default?.()[0] ?? h(Comment, 'NoAnimation component - Without default slot');
    }
  });
</script>
