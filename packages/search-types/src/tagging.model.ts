/**
 * The tagging model is a URL with a record of parameters. This tagging is used to track user
 * actions (query, click, show...) by making a request with these info.
 *
 * @public
 */
export interface Tagging {
  /** Tagging URL. */
  url: string;
  /** Params of the tagging URL. */
  params: Record<string, any>;
}
