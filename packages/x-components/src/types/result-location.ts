/**
 * Indicates where the result where the event comes from is located.
 *
 * @public
 */
export type ResultLocation =
  | 'recommendations'
  | 'predictive_layer'
  | 'no_results'
  | 'results'
  | 'next_query'
  | 'identifier_result'
  | 'discovery_wall';
