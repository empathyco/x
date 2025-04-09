/**
 * Type to define the parameters received when the script is call.
 */
export interface CommandParameters {
  sourcePath: string
  keepSVGs: boolean
}

/**
 * Type defining the info needed from an SVG file.
 */
export interface SVGInfo {
  fileName: string
  svgData: string
}
