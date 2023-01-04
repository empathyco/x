/**
 * Represents an Object with id property.
 *
 * @public
 */
export interface Identifiable<ID = string | number> {
  /** A unique ID that identifies the Object. */
  id: ID;
}
