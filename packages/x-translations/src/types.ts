/**
 * Type to define a JSON structure.
 *
 * @public
 */
export interface JSON {
  [key: string]: JSON | string;
}

/**
 * Type to define the params received.
 **/
export type Params = { sourcePath: string; targetPath: string };
