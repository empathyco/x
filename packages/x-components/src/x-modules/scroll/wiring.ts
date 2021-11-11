import { ScrollDirection } from '../../components/scroll/scroll.types';
import { namespacedWireCommit } from '../../wiring/namespaced-wires.factory';
import { WirePayload } from '../../wiring/wiring.types';
import { createWiring } from '../../wiring/wiring.utils';

const moduleName = 'scroll';

const wireCommit = namespacedWireCommit(moduleName);

/**
 * Saves the scroll position of a container to the store.
 *
 * @public
 */
export const setScrollPositionWire = wireCommit(
  'setScrollPosition',
  ({ metadata, eventPayload }: WirePayload<number>) => ({
    position: eventPayload,
    id: metadata.id as string
  })
);

/**
 * Saves the scroll direction of a container to the store.
 *
 * @public
 */
export const setScrollDirectionWire = wireCommit(
  'setScrollDirection',
  ({ metadata, eventPayload }: WirePayload<ScrollDirection>) => ({
    direction: eventPayload,
    id: metadata.id as string
  })
);

/**
 * Saves a boolean indicating if the scroll has reached the end of a container to the store.
 *
 * @public
 */
export const setScrollHasReachedEndWire = wireCommit(
  'setScrollHasReachedEnd',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    value: eventPayload,
    id: metadata.id as string
  })
);

/**
 * Saves a boolean indicating if the scroll has reached the start of a container to the store.
 *
 * @public
 */
export const setScrollHasReachedStartWire = wireCommit(
  'setScrollHasReachedStart',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    value: eventPayload,
    id: metadata.id as string
  })
);

/**
 * Saves the selector of the item that should be scrolled into the view.
 *
 * @public
 */
export const setPendingScrollToWire = wireCommit(
  'setPendingScrollTo',
  ({ eventPayload: { scroll } }) => scroll
);

/**
 * Resets the selector of the scroll that is pending to restore.
 *
 * @public
 */
export const clearPendingScrollToWire = wireCommit('setPendingScrollTo', '');

/**
 * Wiring configuration for the {@link ScrollXModule | scroll module}.
 *
 * @internal
 */
export const scrollWiring = createWiring({
  UserScrolled: {
    setScrollPositionWire
  },
  UserChangedScrollDirection: {
    setScrollDirectionWire
  },
  UserReachedScrollStart: {
    setScrollHasReachedStartWire
  },
  UserReachedScrollEnd: {
    setScrollHasReachedEndWire
  },
  ParamsLoadedFromUrl: {
    setPendingScrollToWire
  },
  ScrollRestoreSucceeded: {
    clearPendingScrollToWire
  },
  ScrollRestoreFailed: {
    clearPendingScrollToWire
  }
});
