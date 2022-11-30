#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { CommandParameters, SVGInfo } from './types';
import { applyXDSFormat } from './regex-utils';

if (require.main === module) {
  svgToVue();
}

/**
 * Load SVGs from provided folder, turn them into Vue Components and apply
 * prettier to them. By default, the source SVGs are deleted unless the `keepSVGs`
 * parameter is passed.
 *
 */
export function svgToVue(): void {
  const svgList = loadSVGsFromFolder();
  svgList.forEach(writeVueFromSVG);

  runPrettier();

  if (!getParams().keepSVGs) {
    svgList.forEach(removeSourceSVG);
  }
}

/**
 * Load the SVG's info from the provided folder in the params.
 *
 * @returns A list of objects with the info of the SVGs found.
 */
function loadSVGsFromFolder(): SVGInfo[] {
  const { sourcePath } = getParams();
  if (!fs.existsSync(sourcePath)) {
    throw Error(`loadSVGsFromFolder, folder not found ${sourcePath}`);
  }

  return fs
    .readdirSync(sourcePath)
    .filter(fileName => fileName.endsWith('.svg'))
    .map(fileFullName => ({
      fileName: fileFullName.replace(/.svg$/, ''),
      svgData: fs.readFileSync(`${sourcePath}/${fileFullName}`, { encoding: 'utf8' })
    }));
}

/**
 * Creates Vue components from the SVG provided, with the same name as the original file and
 * with the format that the XDS needs.
 *
 * @param svgInfo - The object containing the info of the SVG to generate the Vue component from.
 */
function writeVueFromSVG(svgInfo: SVGInfo): void {
  const { sourcePath } = getParams();
  const processedSvg = applyXDSFormat(svgInfo.svgData);

  if (fs.existsSync(sourcePath)) {
    fs.writeFileSync(`${sourcePath}/${svgInfo.fileName}.vue`, wrapAsVueComponent(processedSvg));
  }
}

/**
 * Generates a string with the format of a Vue component with the SVG wrapped inside the template.
 *
 * @param svg - The SVG string that will be wrapped inside the component.
 *
 * @returns The Vue component string.
 */
function wrapAsVueComponent(svg: SVGInfo['svgData']): string {
  return `<template functional>
  ${svg}
</template>

<script lang="ts">
  export default {};
</script>`;
}

/**
 * Gets the parameters used to call the script.
 *
 * @returns SourcePath as string and keepSVGs as boolean.
 */
function getParams(): CommandParameters {
  const [sourcePath, keepSVGs] = process.argv.slice(2);
  if (sourcePath === undefined) {
    throw Error('getParams, sourcePath not found');
  }

  return { sourcePath, keepSVGs: keepSVGs === '--keep-svgs' ?? false };
}

/**
 * Runs the prettier command to format the .vue files inside the sourcePath.
 */
function runPrettier(): void {
  const { sourcePath } = getParams();

  exec(`prettier --write ${sourcePath}/*.vue`, error => {
    if (error) {
      throw Error(`runPrettier, ${error.message}`);
    }
  });
}

/**
 * Removes an SVG in the source folder.
 *
 * @param svgInfo - The info of the SVG that will be removed.
 */
function removeSourceSVG(svgInfo: SVGInfo): void {
  const { sourcePath } = getParams();
  fs.unlink(`${sourcePath}/${svgInfo.fileName}.svg`, error => {
    if (error) {
      throw Error(`removeSourceSVG, ${error.message}`);
    }
  });
}
