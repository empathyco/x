import { RelatedTag } from '../../../../search-types';
import { Dictionary, map } from '../../utils';
import { mapWire } from '../../wiring';
import {
  namespacedWireCommit,
  namespacedWireDispatch,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { NamespacedWireCommit, NamespacedWireDispatch } from '../../wiring/namespaced-wiring.types';
import { createWiring } from '../../wiring/wiring.utils';
import { UrlParamValue } from '../url';

/**
 * `relatedTags` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'relatedTags';
/**
 * WireCommit for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireCommit: NamespacedWireCommit<typeof moduleName> = namespacedWireCommit(moduleName);
/**
 * WireDispatch for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireDispatch: NamespacedWireDispatch<typeof moduleName> = namespacedWireDispatch(moduleName);
/**
 * WireDispatchWithoutPayload for {@link RelatedTagsXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the related tags state `query`.
 *
 * @public
 */
export const setRelatedTagsQuery = wireCommit('setQuery');

/**
 * Sets the related tags state `params`.
 *
 * @public
 */
export const setRelatedTagsExtraParams = wireCommit('setParams');

/**
 * Requests and stores the related tags.
 *
 * @public
 */
export const fetchAndSaveRelatedTagsWire = wireDispatchWithoutPayload('fetchAndSaveRelatedTags');

/**
 * Cancels the {@link RelatedTagsActions.fetchAndSaveRelatedTags} request promise.
 *
 * @public
 */
export const cancelFetchAndSaveRelatedTagsWire = wireDispatchWithoutPayload(
  'cancelFetchAndSaveRelatedTags'
);

/**
 * Sets the selected related tags.
 *
 * @public
 */
export const toggleRelatedTagWire = wireDispatch('toggleRelatedTag');

/**
 * Clear the selected related tags.
 *
 * @public
 */
export const clearSelectedRelatedTags = wireCommit('setSelectedRelatedTags', []);

/**
 * Sets the selected related tags.
 *
 * @public
 */
export const setSelectedRelatedTagsWire = wireCommit('setSelectedRelatedTags');

/**
 * Clear the related tags query.
 *
 * @public
 */
export const clearRelatedTagsQuery = wireCommit('setQuery', '');

export const setRelatedTagsQueryFromUrlWire = mapWire( wireCommit('setQuery'),
  (payload: Dictionary<UrlParamValue>) => payload.query as string
);

export const setSelectedRelatedTagsFromUrlWire = mapWire( wireCommit('setSelectedRelatedTags'),
  (payload: Dictionary<UrlParamValue>) => (payload.relatedTags as string[]).reduce<RelatedTag[]>((acc, relatedTag) => {
    acc.push({
      tag: relatedTag,
      modelName: 'RelatedTag',
      selected: true,
      query: payload.query as string,
      previous: ''
    });
    return acc;
  }, [])
);

/**
 * Wiring configuration for the {@link RelatedTagsXModule | related tags module}.
 *
 * @internal
 */
export const relatedTagsWiring = createWiring({
  UserAcceptedAQuery: {
    setRelatedTagsQuery,
    clearSelectedRelatedTags
  },
  UserPickedARelatedTag: {
    toggleRelatedTagWire
  },
  RelatedTagsRequestChanged: {
    fetchAndSaveRelatedTagsWire
  },
  UserClearedQuery: {
    cancelFetchAndSaveRelatedTagsWire,
    clearRelatedTagsQuery,
    clearSelectedRelatedTags
  },
  ExtraParamsChanged: {
    setRelatedTagsExtraParams
  },
  ParamsLoadedFromUrl: {
    setRelatedTagsQueryFromUrlWire,
    setSelectedRelatedTagsFromUrlWire
  }
});
