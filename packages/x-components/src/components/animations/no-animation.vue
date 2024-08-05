<script lang="ts">
  import { defineComponent } from 'vue';

  /**
   * Component to be used as `default` for animation props together with dynamic components
   * `<component :is="animation">` in the template.
   */
  export default defineComponent({
    name: 'NoAnimation',
    setup(_, { slots }) {
      return () => slots.default?.()[0] ?? '';
    }
  });
</script>
