/**
 * Applies to an SVG the format required by the XDS.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
export function applyXDSFormat(svg: string): string {
  let processedSvg = removeDimensions(svg);
  processedSvg = addFillNoneInRoot(processedSvg);
  processedSvg = addXClass(processedSvg);
  processedSvg = replaceColorWithCurrentColor(processedSvg);

  return processedSvg.replace(/  +/g, ' ');
}

/**
 * Removes the dimensions (height and width) from the root of an SVG.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
function removeDimensions(svg: string): string {
  const matchDimensions = /(?<=<svg.*?)((width|height)="[0-9]*?")(?=.*?>)/gm;
  return svg.replace(matchDimensions, '');
}

/**
 * Adds `fill="none"` to the root of an SVG if it doesn't have it.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
function addFillNoneInRoot(svg: string): string {
  const matchRootWithoutFillNone = /svg (?:(?!.*?fill="none"))(?=.*?>)/gm;
  return svg.replace(matchRootWithoutFillNone, 'svg fill="none" ');
}

/**
 * Adds the `x-icon` and the data classes to the root of an SVG.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
function addXClass(svg: string): string {
  const matchRoot = /svg /gm;
  return svg.replace(matchRoot, 'svg :class="[\'x-icon\'].concat(data.staticClass, data.class)" ');
}

/**
 * Replaces all the colors in the SVG with `currentColor`, except white.
 *
 * @param svg - The SVG that will be processed.
 *
 * @returns The processed SVG.
 */
function replaceColorWithCurrentColor(svg: string): string {
  const matchColoredFillOrStroke = /(?<=(fill|stroke)=")(?!#fff+"|white|none).*?(?=")/gim;
  return svg.replace(matchColoredFillOrStroke, 'currentColor');
}
