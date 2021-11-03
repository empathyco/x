import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { UrlParams } from '../../types/url-params';
import { XOn } from '../decorators/bus.decorators';

@Component
/* eslint-disable @typescript-eslint/unbound-method */
export default class MainScrollMixin extends Vue {
  /**
   * If `true`, sets this scroll instance to the main of the application. Being the main
   * scroll implies that features like restoring the scroll when the query changes, or storing
   * the scroll position in the URL will be enabled for this container.
   *
   * @public
   */
  @Prop({ default: false })
  public main!: boolean;

  /**
   * Timeout in milliseconds to abort trying to restore the scroll position to the target
   * element.
   */
  @Prop({ default: 5000 })
  public restoreScrollTimeoutMs!: number;

  /**
   * The reference to the HTML node that has the scroll.
   *
   * @public
   */
  protected element: HTMLElement | null = null;

  /**
   * If true (default), sets the scroll position to top when an
   * {@link XEventsTypes.UserAcceptedAQuery} event is emitted.
   *
   * @public
   */
  @Prop({
    type: Boolean,
    default(this: { main: boolean }) {
      return this.main;
    }
  })
  protected resetOnQueryChange!: boolean;

  /**
   * The id of the timeout which cancels restoring the scroll. In case the target element is found
   * we have to abort the timeout.
   *
   * @internal
   */
  protected restoreScrollTimeoutId?: number;

  /**
   * The `[data-scroll]` value of the element that the component will try to scroll into view.
   *
   * @internal
   */
  protected scrollTo: string | null = null;

  /**
   * If this is the main scroll, the mutation observer that will try to restore the scroll when
   * the children of this component are added to the DOM.
   *
   * @returns A `MutationObserver` if the scroll should be restored, or `null` if it shouldn't.
   * @internal
   */
  protected get observer(): MutationObserver | null {
    return this.main
      ? new MutationObserver((_entries, observer) => {
          const scrollTarget = this.element!.querySelector<HTMLElement>(
            `[data-scroll="${this.scrollTo!}"]`
          );
          if (scrollTarget) {
            scrollTarget.scrollIntoView();
            clearTimeout(this.restoreScrollTimeoutId);
            observer.disconnect();
          }
        })
      : null;
  }

  mounted(): void {
    if (!this.element) {
      // TODO Replace with Empathy's logger
      // eslint-disable-next-line no-console
      console.warn(
        '[MainScrollMixin]',
        'Components using this mixin must set `this.element` to the HTML node that is scrolling.'
      );
    }
  }

  /**
   * Disconnects the previous mutation observer to avoid leaking it.
   *
   * @param _newObserver - The new mutation observer that will try to restore the scroll.
   * @param oldObserver - The old mutation observer that will try to restore the scroll.
   */
  @Watch('observer')
  protected cleanupObserver(
    _newObserver: MutationObserver | null,
    oldObserver: MutationObserver | null
  ): void {
    oldObserver?.disconnect();
  }

  /**
   * Resets the scroll position.
   *
   * @internal
   */
  @XOn([
    'SearchBoxQueryChanged',
    'SortChanged',
    'SelectedFiltersChanged',
    'SelectedRelatedTagsChanged'
  ])
  resetScroll(): void {
    if (this.resetOnQueryChange) {
      this.element?.scrollTo({ top: 0 });
    }
  }

  /**
   * Saves the `[data-scroll]` value that should try to be restored.
   *
   * @param urlParams - The URL parameters, where the `scroll` information is stored.
   * @internal
   */
  @XOn('ParamsLoadedFromUrl')
  setScrollTo({ scroll }: UrlParams): void {
    /* FIXME: If the scroll component is destroyed and remounted this logic will be executed again,
     trying to scroll */
    if (this.main && scroll) {
      this.scrollTo = scroll;
    }
  }

  /**
   * If possible, connects the mutation observer to try to restore the scroll. If it doesn't
   * succeed after {@link MainScrollMixin.restoreScrollTimeoutMs | restoreScrollTimeoutMs}, it will
   * abort the attempt.
   *
   * @internal
   */
  @Watch('scrollTo')
  protected tryRestoringScroll(): void {
    if (this.element && this.scrollTo && this.observer) {
      this.observer.observe(this.element, {
        childList: true,
        subtree: true
      });
      this.restoreScrollTimeoutId = setTimeout(
        this.observer.disconnect,
        this.restoreScrollTimeoutMs
      );
    }
  }
}
