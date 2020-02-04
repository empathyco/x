/**
 * @public
 * The tagging model is a URL with a record of parameters. This tagging is used to track user actions (query, click, show...) by making
 * a request with these info.
 */
export interface Tagging {
  url: string;
  params: Record<string, any>;
}
