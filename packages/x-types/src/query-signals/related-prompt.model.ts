import { NamedModel } from '../named-model.model';
import { TaggingRequest } from '../request/index';

/**
 * Represents a related prompt.
 *
 * @public
 */
export interface RelatedPrompt extends NamedModel<'RelatedPrompt'> {
  /** The next queries related to the prompt. */
  relatedPromptNextQueries: RelatedPromptNextQuery[];
  /** The prompt. */
  suggestionText: string;
  /** The type of the prompt. */
  type: string;
  /** The tooling display tagging of the prompt. */
  toolingDisplayTagging: TaggingRequest;
}

/**
 * Represents a related prompt nextQuery.
 *
 * @public
 */
export interface RelatedPromptNextQuery {
  /** The query of the next query. */
  query: string;
  /** The tooling display tagging of the next query. */
  toolingDisplayTagging: TaggingRequest;
  /** The tooling display click tagging of the next query. */
  toolingDisplayClickTagging: TaggingRequest;
  /** The tooling display add2cart tagging of the next query. */
  toolingDisplayAdd2CartTagging: TaggingRequest;
}
