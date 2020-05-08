import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';

/**
 * Dictionary of the events of QuerySuggestions XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface QuerySuggestionsXEvents {
  /**
   * Query suggestions have been changed.
   * * Payload: The new {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsChanged: Suggestion[];
  /**
   * The query suggestions have been displayed.
   * * Payload: The displayed {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsDisplayed: Suggestion[];
  /**
   * Any property of the query-suggestions request has changed.
   * * Payload: The new query suggestions request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  QuerySuggestionsRequestChanged: SuggestionsRequest | null;
  /**
   * User selected a query suggestion
   * * Payload: The {@link @empathy/search-types#Suggestion | query suggestion} that the user
   * selected.
   */
  UserSelectedAQuerySuggestion: Suggestion;
}
