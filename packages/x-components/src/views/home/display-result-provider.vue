<template>
  <NoElement>
    <slot />
  </NoElement>
</template>

<script lang="ts">
  import { defineComponent, PropType, provide } from 'vue';
  import { TaggingRequest } from '@empathyco/x-types';
  import { NoElement } from '../../components/no-element';

  export default defineComponent({
    components: {
      NoElement
    },
    props: {
      queryTagging: {
        type: Object as PropType<TaggingRequest>,
        required: false
      }
    },
    setup(props) {
      provide('resultClickExtraEvents', ['UserClickedADisplayResult']);

      provide('resultLinkMetadataPerEvent', {
        UserClickedADisplayResult: {
          queryTagging: props.queryTagging
        }
      });
    }
  });
</script>
