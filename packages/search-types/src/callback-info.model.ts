/**
 * Contains any additional information needed for the client callbacks.
 *
 * @public
 */
export interface CallbackInfo {
  /** A dictionary where the key is the callback name and the value callback itself. Any
   callback information is optional, it does not need to contain a property for each callback
   type. */
  callbackInfo?: Record<string, any>;
}
