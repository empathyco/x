import { TaggingRequest } from '../request/tagging-request.model';

/**
 * Response to be implemented by all responses that contain a part to track the show event.
 *
 * @public
 */
export interface TrackableShowResponse {
  showTagging: TaggingRequest;
}
