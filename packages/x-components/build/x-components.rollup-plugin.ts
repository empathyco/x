import fs from 'fs';
import path from 'path';
import { Plugin } from 'rollup';
import { forEach } from '../src/utils';
import { ensureFilePathExists } from './build.utils';

/**
 * Type alias of a reducer function that will generate a `Record` where the key is the chunk name,
 * and the value is an array of strings containing the code.
 */
type ReducerFunctionOfEntryPoints = (
  files: Record<string, string[]>,
  line: string
) => Record<string, string[]>;

export interface GenerateEntryFilesOptions {
  /** The path where the build will go. */
  buildPath: string;
  /** The path to the directory where generated js files are stored. */
  jsOutputDirectory: string;
  /** The path to the directory where generated .d.ts files are stored. */
  typesOutputDirectory: string;
}

/**
 * Rollup plugin to generate one common entry point with shared code, and one for each x-module.
 * This is needed because x-modules have side effects on import (like registering the wiring, and
 * store modules). If these x-modules were imported from a single barrel file, then they will be
 * executed always, except if the build had tree-shaking step that removed them from the code. Tree
 * shaking is a costly step that is only run for production builds normally. So, for consistency
 * between dev and prod builds, creating an entry point per each x-module is the safest way to
 * achieve this.
 *
 * @param options - Options to configure the generation of the entry files.
 * @returns Rollup plugin for generating project entry files.
 */
export function generateEntryFiles(options: GenerateEntryFilesOptions): Plugin {
  return {
    name: 'GenerateEntryFiles',
    /**
     * Takes the generated files in the dist directory, and generates in the root directory:
     * - 1 Core entry point for shared code
     * - 1 Entry point per x-module
     * - 1 Typings file per entry point.
     */
    writeBundle() {
      generateEntryPoints(options.buildPath, options.jsOutputDirectory, 'js');
      generateEntryPoints(options.buildPath, options.typesOutputDirectory, 'd.ts');
      copyIndexSourcemap(options.buildPath, options.jsOutputDirectory);
    }
  };
}

/** Regex to split a read file per lines, supporting both Unix and Windows systems. */
const BY_LINES = /\r?\n/;
/** Name of the x-modules folder. */
const X_MODULES_DIR_NAME = 'x-modules';

/**
 * Generates an entry point for each x-component, and another one for the shared code.
 *
 * @param buildPath - The path where the build will go.
 * @param outputDirectory - The directory to load it's barrel and generate the entry points.
 * @param extension - The type of files to generate the entry points (i.e. `d.ts`, `js`).
 */
function generateEntryPoints(buildPath: string, outputDirectory: string, extension: string): void {
  const jsEntry = fs.readFileSync(path.join(outputDirectory, `index.${extension}`), 'utf8');
  const jsEntryPoints = jsEntry
    .split(BY_LINES)
    .filter(emptyLines)
    .reduce(generateEntryPointsRecord(buildPath, outputDirectory, extension), {});
  forEach(jsEntryPoints, writeEntryFile(buildPath, extension));
}

/**
 * Copies the index sourcemap. As long as the index.js file in the ./dist directory does not have
 * any other code than exports it should be fine. If not done, the consumer project won't have
 * sourcemaps.
 *
 * @param buildPath - The path where the build will go.
 * @param outputDirectory - Directory where storing the index source map.
 */
function copyIndexSourcemap(buildPath: string, outputDirectory: string): void {
  const fileName = 'index.js.map';
  fs.copyFileSync(path.join(outputDirectory, fileName), path.join(buildPath, 'core', fileName));
}

/**
 * Generates a reducer function to split the entry points into multiple chunks, the `core` for the
 * shared code and one per each x module.
 *
 * @param buildPath - The path where the build will go.
 * @param outputDirectory - The directory where the output files are stored.
 * @param extension - The type of the files for generating the entry points.
 * @returns A reducer function that will generate a `Record` where the key is the chunk name, and
 * the value is an array of strings containing the code.
 */
function generateEntryPointsRecord(
  buildPath: string,
  outputDirectory: string,
  extension: string
): ReducerFunctionOfEntryPoints {
  const relativeOutputDirectory = `../${path.relative(buildPath, outputDirectory)}/`;
  const getXModuleNameFromExport = extractXModuleFromExport(outputDirectory, extension);

  return (files: Record<string, string[]>, line: string): Record<string, string[]> => {
    const xModuleFileName = getXModuleNameFromExport(line);
    const adjustedExport = adjustExport(relativeOutputDirectory, line);
    if (xModuleFileName) {
      // If it is a file from a x-module, we adjust the export, and add it to an array with the
      // x module name
      files[xModuleFileName] = files[xModuleFileName] || [];
      files[xModuleFileName].push(adjustedExport);
    } else {
      // If it is not an export from a x-module, we keep that export on the core file, adjusting
      // its location
      files.core = files.core || [];
      files.core.push(adjustedExport);
    }
    return files;
  };
}

/**
 * Adjusts an export to a new location.
 *
 * @param location - The new base location.
 * @param line - The export line to adjust the export.
 * @returns String with the new location adjusted to the line export.
 */
function adjustExport(location: string, line: string): string {
  return line.replace('./', location);
}

/**
 * Generates a function that receives a line that is an export sentence from a DTS file, and
 * if the line is an export from an x-module, it extracts the x-module name. In other case it
 * returns `null`.
 *
 * @param outputDirectory - The export line to extract the x-module name.
 * @param extension - The extension (i.e. `js`, `d.ts`) to check if the export is from a file or a
 * barrel.
 * @returns A function to test if a line is an export from an x-module.
 */
function extractXModuleFromExport(outputDirectory: string, extension: string) {
  return (line: string): string | null => {
    const anyExportFromXModulesDirectoryRegex = new RegExp(`/${X_MODULES_DIR_NAME}/([^';/]+)`);
    const [, xModuleName] = anyExportFromXModulesDirectoryRegex.exec(line) ?? [];
    if (!xModuleName) {
      return null;
    } else {
      const xModuleFileName = addExtension(xModuleName, extension);
      const isFile = fs.existsSync(
        path.join(outputDirectory, `${X_MODULES_DIR_NAME}/${xModuleFileName}`)
      );
      return isFile ? null : xModuleName;
    }
  };
}

/**
 * Appends the extension to the file name.
 *
 * @param fileName - File name with or without extension.
 * @param extension - Extension to append to file name.
 * @returns The file name with the extension added.
 */
function addExtension(fileName: string, extension: string): string {
  return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}

/**
 * Returns whether a line is empty or not.
 *
 * @param line - The line to test if it is empty.
 * @returns True if the line is empty or false in the opposite case.
 */
function emptyLines(line: string): boolean {
  return !!line.trim();
}

/**
 * Generates a reusable function that will write a file with the extension passed.
 * The function will receive the file name, and the file contents.
 *
 * @param buildPath - The path where the build will go.
 * @param extension - The extension of the file to write.
 * @returns Function which writes a file with the extension passed as parameter.
 */
function writeEntryFile(buildPath: string, extension: string) {
  return (fileName: string, fileContents: string[]): string => {
    const filePath = path.join(buildPath, `/${fileName}/index.${extension}`);
    ensureFilePathExists(filePath);
    fs.writeFileSync(filePath, fileContents.join('\n'));
    return filePath;
  };
}
