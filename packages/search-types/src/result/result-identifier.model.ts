/**
 * @public
 * The client result identifier (SKU, MOCACO, a simple ID...)
 */
export interface ResultIdentifier {
  value: string;
  /**
   * @deprecated HTML should be calculated on the component that represents this model
   */
  html: string;
}
