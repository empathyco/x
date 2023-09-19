<script lang="ts">
  import { emit } from 'process';
  import Vue from 'vue';
  import { Dictionary } from '@empathyco/x-utils';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { XEventsTypes } from '../../../wiring/events.types';

  export default class ExperienceControls extends Vue {
    @XOn('ExperienceControlsEventsChanged')
    onEventsChanged(events: Dictionary<Partial<XEventsTypes>>): void {
      events.forEach(element => {
        emit(element);
      });
    }
  }
</script>
