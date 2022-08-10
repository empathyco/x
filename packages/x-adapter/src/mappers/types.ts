/**
 * Converts an entry parameter into an output parameter.
 *
 * @param from - The raw value that is going to be transformed.
 * @returns A new value created using the data in the `context` or in the `from` parameters.
 * @public
 */
export type Mapper<From, To> = (from: Readonly<From>, context: MapperContext) => To;

/**
 * The context is an object that can be used to share information between the invocation of
 * different mappers or the process that they are being executed on.
 *
 * @public
 */
export interface MapperContext {
  /**
   * When the mapper is used to transform a response, the request that triggered it.
   */
  requestParameters?: Record<string, unknown>;
  /**
   * When the mapper is used to transform a request or a response, the endpoint that
   * was or is going to be used.
   */
  endpoint?: string;
  /**
   * If multiple mappers are in charge of mapping the same property, the partial result of
   * applying them to it.
   */
  mappedValue?: unknown;
  [key: string]: unknown;
}
