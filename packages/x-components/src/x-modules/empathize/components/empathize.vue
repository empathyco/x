<template>
  <component :is="animation">
    <div
      v-if="isOpen"
      @mousedown.prevent
      @focusin="open"
      @focusout="close"
      class="x-empathize"
      data-test="empathize"
    >
      <!-- @slot (Required) Modal container content -->
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { Debounce } from '../../../components/decorators/debounce.decorators';
  import { noElementComponent } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { WireMetadata, XEvent } from '../../../wiring';
  import { empathizeXModule } from '../x-module';

  /**
   * Component containing the empathize. It has a required slot to define its content and two props
   * to define when to open and close it: eventsToOpenEmpathize and eventsToCloseEmpathize.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(empathizeXModule)]
  })
  export default class Empathize extends Vue {
    /**
     * Animation component that will be used to animate the empathize.
     *
     * @public
     */
    @Prop({ default: () => noElementComponent })
    protected animation!: Vue;

    /**
     * Array of {@link XEvent | xEvents} to open the empathize.
     *
     * @public
     */
    @Prop({ default: () => ['UserFocusedSearchBox', 'UserIsTypingAQuery', 'UserClickedSearchBox'] })
    protected eventsToOpenEmpathize!: XEvent[];

    /**
     * Array of {@link XEvent | xEvents} to close the empathize.
     *
     * @public
     */
    @Prop({
      default: () => [
        'UserClosedEmpathize',
        'UserSelectedASuggestion',
        'UserPressedEnter',
        'UserBlurredSearchBox'
      ]
    })
    protected eventsToCloseEmpathize!: XEvent[];

    /**
     * The modal container is open.
     *
     * @internal
     */
    protected isOpen = false;

    /**
     * Open empathize. This method will be executed on any event in
     * {@link Empathize.eventsToOpenEmpathize} and on DOM event `focusin` on Empathize root element.
     *
     * @param payload - The payload of the {@link XEvent}, that is unused in this case.
     * @param metadata - The {@link WireMetadata} of the event, used to emit the Empathize XEvents.
     *
     * @internal
     */
    @XOn(component => (component as Empathize).eventsToOpenEmpathize)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    open(payload: unknown, metadata: WireMetadata): void {
      this.changeOpenState(true, metadata);
    }

    /**
     * Close empathize. This method will be executed on any event in
     * {@link Empathize.eventsToCloseEmpathize} and on DOM event `focusout` on Empathize root
     * element.
     *
     * @param payload - The payload of the {@link XEvent}, that is unused in this case.
     * @param metadata - The {@link WireMetadata} of the event, used to emit the Empathize XEvents.
     *
     * @internal
     */
    @XOn(component => (component as Empathize).eventsToCloseEmpathize)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
    close(payload: unknown, metadata: WireMetadata): void {
      this.changeOpenState(false, metadata);
    }

    /**
     * Changes the state of {@link Empathize.isOpen} assigning to it the value of `newOpenState`
     * parameter. Also emits the {@link XEvent | XEvents} `EmpathizeOpened` or `EmpathizeClosed` if
     * the state really changes.
     *
     * @param newOpenState - The new state to assign to {@link Empathize.isOpen}.
     * @param metadata - The {@link WireMetadata} to emit the {@link XEvent | XEvents}. If is
     * undefined, a this component is used as source of info for the metadata.
     *
     * @internal
     */
    @Debounce(0)
    changeOpenState(newOpenState: boolean, metadata: WireMetadata): void {
      if (this.isOpen !== newOpenState) {
        this.isOpen = newOpenState;
        this.$x.emit(
          this.isOpen ? 'EmpathizeOpened' : 'EmpathizeClosed',
          undefined,
          metadata ?? { moduleName: 'empathize', target: this.$el }
        );
      }
    }
  }
</script>

<docs>
#Examples

This component will listen to the configured events in eventsToOpenEmpathize and
eventsToCloseEmpathize props and open/close itself accordingly. By default, those props values are:
```eventsToOpenEmpathize=['UserFocusedSearchBox', 'UserIsTypingAQuery', 'UserClickedSearchBox']```
and ```eventsToCloseEmpathize=['UserClosedEmpathize', 'UserSelectedASuggestion', 'UserPressedEnter',
'UserBlurredSearchBox']```

## Basic examples

The component rendering the query suggestions, popular searches and history queries with keyboard
navigation.

```vue
<Empathize>
  <template #default>
    <BaseKeyboardNavigation>
      <QuerySuggestions/>
      <PopularSearches/>
      <HistoryQueries/>
    </BaseKeyboardNavigation>
  </template>
</Empathize>
```

Defining custom values for the events to open and close the Empathize. For example opening it when
the search box loses the focus and closing it when the search box receives the focus:

```vue
<Empathize :eventsToOpenEmpathize="['UserBlurredSearchBox']"
           :eventsToCloseEmpathize="['UserFocusedSearchBox']"
>
  <template #default>
    Please, type a query in the Search Box.
  </template>
</Empathize>
```

An animation can be used for the opening and closing using the `animation` prop. The animation,
must be a Component with a `Transition` with a slot inside:

```vue
<Empathize :animation="collapseFromTop">
  <template #default>
    <PopularSearches/>
  </template>
</Empathize>
```

## Events

A list of events that the component will emit:

- `EmpathizeOpened`: the event is emitted after receiving an event to change the state `isOpen` to
`true`. The event payload is undefined and can have a metadata with the module and the element that
emitted it.
- `EmpathizeClosed`: the event is emitted after receiving an event to change the state `isOpen` to
`false`. The event payload is undefined and can have a metadata with the module and the element that
emitted it.
</docs>
