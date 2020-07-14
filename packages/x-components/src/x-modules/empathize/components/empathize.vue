<template>
  <BaseModalContainer
    :displayOverlay="displayOverlay"
    :eventsToOpenModal="eventsToOpenEmpathize"
    :eventsToCloseModal="eventsToCloseEmpathize"
    eventToEmitOnClose="UserClosedEmpathize"
    class="x-empathize"
    data-test="empathize"
  >
    <template #default>
      <!-- @slot (Required) Empathize content -->
      <slot />
    </template>
  </BaseModalContainer>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import BaseModalContainer from '../../../components/base-modal-container.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEvent } from '../../../wiring/events.types';
  import { empathizeXModule } from '../x-module';

  /**
   * Component containing the empathize. It has a required slot to define its content and two props
   * to define when to open and close it: eventsToOpenEmpathize and eventsToCloseEmpathize.
   *
   * @public
   */
  @Component({
    components: { BaseModalContainer },
    mixins: [xComponentMixin(empathizeXModule)]
  })
  export default class Empathize extends Vue {
    /**
     * Enable or disable the overlay.
     */
    @Prop({ default: false })
    protected displayOverlay!: boolean;

    /**
     * Array of {@link XEvent | xEvents} to open the empathize.
     */
    @Prop({ default: () => ['UserOpenedEmpathize'] })
    protected eventsToOpenEmpathize!: XEvent[];

    /**
     * Array of {@link XEvent | xEvents} to close the empathize.
     */
    @Prop({ default: () => ['UserClosedEmpathize', 'UserAcceptedAQuery'] })
    protected eventsToCloseEmpathize!: XEvent[];
  }
</script>

<docs>
  #Examples

  This component will listen to the configured events in eventsToOpenEmpathize and
  eventsToCloseEmpathize props and open/close itself accordingly. By default, those props values
  are: ```eventsToOpenEmpathize=['UserOpenedEmpathize']``` and
  ```eventsToCloseEmpathize=['UserClosedEmpathize', 'UserAcceptedAQuery']```

  ## Basic examples

  The component rendering the query suggestions, popular searches and history queries with keyboard
  navigation.

  ```vue
  <Empathize>
    <template #default>
      <BaseKeyboardNavigation>
        <QuerySuggestions />
        <PopularSearches />
        <HistoryQueries />
      </BaseKeyboardNavigation>
    </template>
  </Empathize>
  ```

  Defining custom values for eventsToOpenEmpathize and eventsToCloseEmpathize props.

  ```vue
  <Empathize :animation="FadeAndSlide"
             :eventsToOpenEmpathize="['MyOpeningEvent']"
             :eventsToCloseEmpathize="['MyClosingEvent']"
  >
    <template #default>
      <BaseKeyboardNavigation>
        <QuerySuggestions />
        <PopularSearches />
        <HistoryQueries />
      </BaseKeyboardNavigation>
    </template>
  </Empathize>
  ```
</docs>
