import { RelatedTag, RelatedTagsRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of RelatedTags XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface RelatedTagsXEvents {
  /**
   * Related tags have been changed.
   * Payload: The new {@link @empathyco/x-types#RelatedTag | related tags}.
   */
  RelatedTagsChanged: RelatedTag[];
  /**
   * Any property of the related-tags request has changed.
   * Payload: The new related tags request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  RelatedTagsRequestChanged: RelatedTagsRequest | null;
  /**
   * Selected related tags have been changed.
   * Payload: The new {@link @empathyco/x-types#RelatedTag | selected related tags}.
   */
  SelectedRelatedTagsChanged: RelatedTag[];
  /**
   * User deselected a related tag
   * Payload: The {@link @empathyco/x-types#RelatedTag | related tag} that the user
   * deselected.
   */
  UserDeselectedARelatedTag: RelatedTag;
  /**
   * User picked a related tag
   * Payload: The {@link @empathyco/x-types#RelatedTag | related tag} that the user
   * picked.
   */
  UserPickedARelatedTag: RelatedTag;
  /**
   * User selected a related tag
   * Payload: The {@link @empathyco/x-types#RelatedTag | related tag} that the user
   * selected.
   */
  UserSelectedARelatedTag: RelatedTag;
}
