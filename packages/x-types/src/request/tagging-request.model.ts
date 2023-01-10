/**
 * The request for the tagging API.
 *
 * @public
 */
export interface TaggingRequest {
  /** Tagging URL. */
  url: string;
  /** Params of the tagging URL. */
  params: Record<string, string | number | boolean>;
}
