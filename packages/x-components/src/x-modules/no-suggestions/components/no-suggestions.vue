<template>
  <p v-if="query && !hasSuggestionsOrLoading" class="x-no-suggestions" data-test="no-suggestions">
    {{ dividedMessage[0] }}
    <BaseEventButton v-if="dividedMessage[1]" class="x-no-suggestions__query" :events="events">
      {{ query }}
    </BaseEventButton>
    {{ dividedMessage[2] }}
  </p>
</template>

<script lang="ts">
  import { Subscription } from 'rxjs/Subscription';
  import Vue from 'vue';
  import { Component, Watch } from 'vue-property-decorator';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { State } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { NoSuggestionsConfig, XEventArrayPayload } from '../config.types';
  import { noSuggestionsXModule } from '../x-module';

  /**
   * No suggestions component renders a simple message (with a button with the query to accept it
   * optionally) to inform the user there are not suggestions available to be displayed. It is
   * showed when there is query and the suggestions of the events configured in the module are
   * empty.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(noSuggestionsXModule)]
  })
  export default class NoSuggestions extends Vue {
    @State('noSuggestions', 'query')
    public query!: string;

    @State('noSuggestions', 'config')
    public config!: NoSuggestionsConfig;

    protected suggestionsEvents: Partial<Record<XEventArrayPayload, any[] | null>> = {};
    protected eventSubscriptions: Subscription[] = [];

    created(): void {
      this.makeReactiveAndSubscribeEvents(this.config.eventsToRender);
    }

    beforeDestroy(): void {
      this.unsubscribeEvents();
    }

    /**
     * The events dictionary that is going to be emitted when the button is pressed.
     *
     * @returns The {@link XEventsTypes | XEvents} to emit.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return { UserAcceptedAQuery: this.query };
    }

    /**
     * Checks if some configured event has suggestions or loading (null value).
     *
     * @returns True if there is some event with suggestions or loading or false otherwise.
     * @internal
     */
    protected get hasSuggestionsOrLoading(): boolean {
      return Object.values(this.suggestionsEvents).some(suggestions =>
        !suggestions || suggestions.length > 0);
    }

    /**
     * Splits the no suggestions message by \{\}.
     *
     * @returns An array with the divided message.
     * @internal
     */
    protected get dividedMessage(): string[] {
      return this.$x.config.messages.noSuggestions.content.split(/[{}]/g);
    }

    /**
     * Restores the suggestions of each event to null when the query is changed. It is to avoid
     * corner cases when the query is changed and triggers a change of suggestions from empty to
     * content or vice versa.
     *
     * @internal
     */
    @Watch('query')
    protected onQueryChanged(): void {
      this.config.eventsToRender.forEach(event => this.suggestionsEvents[event] = null);
    }

    /**
     * Restores the reactivity of the object and subscriptions of each trigger event when the
     * configuration prop has been changed.
     *
     * @param newEventsToRender - New events to render to be registered.
     * @internal
     */
    @Watch('eventsToRender')
    protected onEventsToRenderConfigChanged(newEventsToRender: XEventArrayPayload[]): void {
      this.deleteSuggestionsEvents();
      this.unsubscribeEvents();

      this.makeReactiveAndSubscribeEvents(newEventsToRender);
    }

    /**
     * Makes reactive each {@link NoSuggestionsConfig.eventsToRender | eventsToRender} as property
     * in the`suggestionsEvents` object and create a subscription for each one.
     *
     * @param eventsToRender - Events {@link XEventArrayPayload} to make reactive them and create a
     * subscription.
     *
     * @internal
     */
    protected makeReactiveAndSubscribeEvents(eventsToRender: XEventArrayPayload[]): void {
      eventsToRender.forEach(event => {
        // Make each dynamic object property reactive
        this.$set(this.suggestionsEvents, event, null);
        const subscription = this.$x.on(event).subscribe((payload: any[]) =>
          this.suggestionsEvents[event] = payload
        );
        this.eventSubscriptions.push(subscription);
      });
    }

    /**
     * Unsubscribes each event subscription and restore its array.
     *
     * @internal
     */
    protected unsubscribeEvents(): void {
      this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
      this.eventSubscriptions = [];
    }

    /**
     * Restores the `suggestionsEvents` object removing their properties and its reactivity.
     *
     * @internal
     */
    protected deleteSuggestionsEvents(): void {
      Object.keys(this.suggestionsEvents).forEach(event =>
        this.$delete(this.suggestionsEvents, event));
    }
  }
</script>

<docs>
  #Examples

  ## Default Usage

  You just need to add the component without props or slots and when there are no suggestions
  for the trigger events configured in the x-module, the component will be displayed. The
  component uses the `noSuggestions.content` message and transform the `{query}` to a button to
  accept the user query.

  ```vue
  <NoSuggestions />
  ```
</docs>
