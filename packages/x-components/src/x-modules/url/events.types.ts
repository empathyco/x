import { UrlConfig } from './config.types';
import { UrlGetters } from './store/types';
/**
 * Dictionary of the events of URL XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface UrlXEvents {
  /**
   * The configuration for handling the URL has changed.
   * * Payload: The new URL config.
   */
  UrlConfigProvided: UrlConfig;
  /**
   * Url state changed.
   * * Payload: The new URL params.
   */
  UrlStateChanged: UrlGetters['urlParams'];
  /**
   * Document has finished loading.
   * * Payload: none.
   */
  DocumentLoaded: void;
  /**
   * Document history has changed.
   * * Payload: none.
   */
  DocumentHistoryChanged: void;
  /**
   * Extra params has been loaded from the URL.
   * * Payload: The extra params array.
   */
  ExtraParamsLoadedFromUrl: string[];
  /**
   * Query has been loaded from the URL.
   * * Payload: The query string.
   */
  QueryLoadedFromUrl: string;
  /**
   * Page has been loaded from the URL.
   * * Payload: The page number.
   */
  PageLoadedFromUrl: string;
  /**
   * Filters has been loaded from the URL.
   * * Payload: The filters array.
   */
  FiltersLoadedFromUrl: string[];
  /**
   * Sort has been loaded from the URL.
   * * Payload: The sort string.
   */
  SortLoadedFromUrl: string;
  /**
   * Related tags has been loaded from the URL.
   * * Payload: The related tag array.
   */
  RelatedTagsLoadedFromUrl: string[];
}
