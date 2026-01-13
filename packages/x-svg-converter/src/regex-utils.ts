/**
 * Applies to an SVG the format required by the XDS.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function applyXDSFormat(svg: string): string {
  let processedSvg = removeDimensions(svg)
  processedSvg = addFillNoneInRoot(processedSvg)
  processedSvg = addXClass(processedSvg)
  processedSvg = replaceColorWithCurrentColor(processedSvg)

  return processedSvg.replace(/ {2,}/g, ' ')
}

/**
 * Removes the dimensions (height and width) from the root of an SVG.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function removeDimensions(svg: string): string {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const matchDimensions = /(?<=<svg.*?)((width|height)="\d*")(?=.*?>)/g
  return svg.replace(matchDimensions, '')
}

/**
 * Adds `fill="none"` to the root of an SVG if it doesn't have it.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function addFillNoneInRoot(svg: string): string {
  const matchRootWithoutFillNone = /svg (?!.*?fill="none")(?=.*?>)/g
  return svg.replace(matchRootWithoutFillNone, 'svg fill="none" ')
}

/**
 * Adds the `xds:icon` and the data classes to the root of an SVG.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function addXClass(svg: string): string {
  const matchRoot = /svg /g
  return svg.replace(matchRoot, 'svg :class="[\'xds:icon\'].concat(data.staticClass, data.class)" ')
}

/**
 * Replaces all the colors in the SVG with `currentColor`, except white.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function replaceColorWithCurrentColor(svg: string): string {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const matchColoredFillOrStroke = /(?<=(fill|stroke)=")(?!#f{3,}"|white|none).*?(?=")/gi
  return svg.replace(matchColoredFillOrStroke, 'currentColor')
}
