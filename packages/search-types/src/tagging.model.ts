/**
 * A taggable entity.
 *
 * @public
 */
export interface Taggable {
  /** Tagging object containing the different taggable events. */
  tagging: Tagging;
}

/**
 * The tagging user actions.
 *
 * @public
 */
export interface Tagging {
  /** {@link TaggingInfo | add to cart tagging}. */
  add2cart?: TaggingInfo;
  /** {@link TaggingInfo | checkout tagging}. */
  checkout?: TaggingInfo;
  /** {@link TaggingInfo | click tagging}. */
  click?: TaggingInfo;
  /** {@link TaggingInfo | query tagging}. */
  query?: TaggingInfo;
  /** {@link TaggingInfo | wishlist tagging}. */
  wishlist?: TaggingInfo;
  /** Any other {@link TaggingInfo | tagging } key-value. */
  [key: string]: TaggingInfo | undefined;
}

/**
 * The tagging info model is a URL with a record of parameters. This tagging is used to track user
 * actions (query, click, show...) by making a request with these info.
 *
 * @public
 */
export interface TaggingInfo {
  /** Tagging URL. */
  url: string;
  /** Params of the tagging URL. */
  params: Record<string, string | number | boolean>;
}
