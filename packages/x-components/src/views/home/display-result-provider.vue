<script lang="ts">
  import { defineComponent, PropType, provide } from 'vue';
  import { TaggingRequest } from '@empathyco/x-types';

  export default defineComponent({
    name: 'DisplayResultProvider',
    props: {
      queryTagging: Object as PropType<TaggingRequest>
    },
    setup(props, { slots }) {
      provide('resultClickExtraEvents', ['UserClickedADisplayResult']);

      provide('resultLinkMetadataPerEvent', {
        UserClickedADisplayResult: {
          queryTagging: props.queryTagging
        }
      });

      return () => slots.default?.()[0] ?? '';
    }
  });
</script>
