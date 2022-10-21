import { TaggingRequest } from './request/tagging-request.model';

/**
 * A taggable entity.
 *
 * @public
 */
export interface Taggable {
  /** Tagging object containing the different taggable events. */
  tagging?: Tagging;
}

/**
 * The tagging user actions.
 *
 * @public
 */
export interface Tagging {
  /** {@link TaggingRequest | add to cart tagging}. */
  add2cart?: TaggingRequest;
  /** {@link TaggingRequest | checkout tagging}. */
  checkout?: TaggingRequest;
  /** {@link TaggingRequest | click tagging}. */
  click?: TaggingRequest;
  /** {@link TaggingRequest | query tagging}. */
  query?: TaggingRequest;
  /** {@link TaggingRequest | wishlist tagging}. */
  wishlist?: TaggingRequest;
  /** Any other {@link TaggingRequest | tagging } key-value. */
  [key: string]: TaggingRequest | undefined;
}
