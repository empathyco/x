<script lang="ts">
  import type { TaggingRequest } from '@empathyco/x-types';
  import type { PropType } from 'vue';
  // eslint-disable-next-line no-duplicate-imports
  import { computed, defineComponent, provide } from 'vue';
  import { use$x } from '../../composables/index';
  import { DisplayWireMetadata } from '../../wiring/index';

  export default defineComponent({
    name: 'DisplayClickProvider',
    props: {
      ignoreResultClickEvent: {
        type: Boolean,
        default: false
      },
      toolingDisplayTagging: {
        type: Object as PropType<TaggingRequest>,
        required: false,
        default: undefined
      },
      toolingAdd2CartTagging: {
        type: Object as PropType<TaggingRequest>,
        required: false,
        default: undefined
      },
      queryTagging: {
        type: Object as PropType<TaggingRequest>,
        required: false,
        default: undefined
      }
    },
    setup(props, { slots }) {
      const x = use$x();

      const displayClickMetadata = computed<Partial<DisplayWireMetadata>>(() => ({
        displayOriginalQuery: x.query.search,
        queryTagging: props.queryTagging,
        toolingTagging: props.toolingDisplayTagging,
        toolingAdd2CartTagging: props.toolingAdd2CartTagging
      }));

      provide('resultAddToCartExtraEvents', ['UserClickedARelatedPromptAdd2Cart']);
      provide('resultAddToCartExtraEventsMetadata', {
        toolingAdd2CartTagging: props.toolingAdd2CartTagging
      });

      provide('resultClickExtraEvents', [
        'UserClickedARelatedPromptResult',
        'UserClickedADisplayResult'
      ]);
      provide('resultLinkMetadataPerEvent', {
        UserClickedARelatedPromptResult: displayClickMetadata.value,
        UserClickedADisplayResult: displayClickMetadata.value,
        ...(props.ignoreResultClickEvent && {
          UserClickedAResult: {
            ignoreInModules: ['tagging']
          }
        })
      });

      return () => slots.default?.()[0] ?? '';
    }
  });
</script>
