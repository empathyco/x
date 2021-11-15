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
  'setScrollComponentState',
  ({ metadata, eventPayload }: WirePayload<number>) => ({
    newState: { position: eventPayload },
    id: metadata.id as string
  })
);

/**
 * Saves the scroll direction of a container to the store.
 *
 * @public
 */
export const setScrollDirectionWire = wireCommit(
  'setScrollComponentState',
  ({ metadata, eventPayload }: WirePayload<ScrollDirection>) => ({
    newState: { direction: eventPayload },
    id: metadata.id!
  })
);

/**
 * Saves a boolean indicating if the scroll has almost reached the end of a container to the store.
 *
 * @public
 */
export const setScrollHasAlmostReachedEndWire = wireCommit(
  'setScrollComponentState',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    newState: { hasAlmostReachedEnd: eventPayload },
    id: metadata.id as string
  })
);

/**
 * Saves a boolean indicating if the scroll has reached the end of a container to the store.
 *
 * @public
 */
export const setScrollHasReachedEndWire = wireCommit(
  'setScrollComponentState',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    newState: { hasReachedEnd: eventPayload },
    id: metadata.id as string
  })
);

/**
 * Saves a boolean indicating if the scroll has reached the start of a container to the store.
 *
 * @public
 */
export const setScrollHasReachedStartWire = wireCommit(
  'setScrollComponentState',
  ({ metadata, eventPayload }: WirePayload<boolean>) => ({
    newState: { hasReachedStart: eventPayload },
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
  UserAlmostReachedScrollEnd: {
    setScrollHasAlmostReachedEndWire
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
