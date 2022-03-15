/**
 * Transforms the given entry parameter.
 *
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
  requestParameters?: Record<string, string | boolean | number>;
  /**
   * When the mapper is used to transform a request or a response, the endpoint that
   * was or is going be used.
   */
  endpoint?: string;
  /**
   * If multiple mappers are taking charge of mapping the same property, the partial result of
   * applying them to it.
   */
  to?: unknown;
  [key: string]: unknown;
}
