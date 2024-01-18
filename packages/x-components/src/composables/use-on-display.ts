import { Ref, watch, WatchStopHandle } from 'vue';
import { MaybeElement, useElementVisibility } from '@vueuse/core';
import { TaggingRequest } from '@empathyco/x-types';
import { WireMetadata } from '../wiring';
import { use$x } from './use-$x';

/**
 * Composable that triggers a callback whenever the provided element appears in the viewport.
 * It can trigger the first time only or every time the element appears in the viewport.
 *
 * @param options - The options to customize the behavior of the composable. The element that
 * will be watched, the callback to trigger and if the callback should be triggered only once
 * or every time the element appears in the viewport, true by default.
 *
 * @returns If the element is currently visible in the viewport or not and the watcher stop handle.
 *
 * @public
 */
export function useOnDisplay({
  element,
  callback,
  triggerOnce = true
}: UseOnDisplayOptions): UseOnDisplayReturn {
  const isElementVisible = useElementVisibility(element);

  const unwatchDisplay = watch(isElementVisible, newValue => {
    if (newValue) {
      callback();
      if (triggerOnce) {
        unwatchDisplay();
      }
    }
  });

  return {
    isElementVisible,
    unwatchDisplay
  };
}

/**
 * Composable that emits a `TrackableElementDisplayed` event whenever the provided element
 * appears in the viewport for the first time.
 *
 * @param options - The options to customize the behavior of the composable. The element that
 * will be watched and the tagging request to emit.
 *
 * @returns If the element is currently visible in the viewport or not and the watcher stop handle.
 *
 * @public
 */
export function useEmitDisplayEvent({
  element,
  taggingRequest,
  eventMetadata = {}
}: UseEmitDisplayEventOptions): UseOnDisplayReturn {
  const $x = use$x();

  const { isElementVisible, unwatchDisplay } = useOnDisplay({
    element,
    callback: () => {
      $x.emit('TrackableElementDisplayed', { tagging: { display: taggingRequest } }, eventMetadata);
    }
  });

  return {
    isElementVisible,
    unwatchDisplay
  };
}

/**
 * Options for the {@link useOnDisplay} composable.
 */
type UseOnDisplayOptions = {
  element: HTMLElement | Ref<MaybeElement>;
  callback: () => void;
  triggerOnce?: boolean;
};

/**
 * Return type of the {@link useOnDisplay} composable.
 */
type UseOnDisplayReturn = {
  isElementVisible: Ref<boolean>;
  unwatchDisplay: WatchStopHandle;
};

/**
 * Options for the {@link useEmitDisplayEvent} composable.
 */
type UseEmitDisplayEventOptions = {
  element: UseOnDisplayOptions['element'];
  taggingRequest: TaggingRequest;
  eventMetadata?: Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>;
};
