#!/usr/bin/env node

import path from 'path';
import { deepMerge } from '@empathyco/x-deep-merge';
import { exportToFile, getParams, getSourcePaths, loadFile } from './utils';
import { JSON } from './types';

if (require.main === module) {
  getCSVTranslations();
}

/**
 * Gets the values to be used as column names in the CSV.
 *
 * @param json - The JSON to extract the column names.
 *
 * @returns Column names.
 */
function getColumnNames(json: JSON): string[] {
  return Object.keys(json);
}

/**
 * Generates the CSV.
 *
 * @param sourcePath - The path of the file.
 *
 * @returns A string that represents the CSV.
 */
function generateCSVFile(sourcePath: string): string {
  const json = loadFile(sourcePath) as JSON;
  const csv = transformToCSV(json);
  const outputFile = path.basename(sourcePath).replace(/\.[^.]+$/, '.csv');
  exportToFile(outputFile, csv);
  return csv;
}
/**
 * Reduces the initial source into a flatten object indexed by column name.
 *
 * @param columnNames - The column names.
 * @param source - The JSON to be flatten.
 *
 * @returns A flatten JSON with the translations merged.
 */
function getTranslations(columnNames: string[], source: JSON): JSON {
  return columnNames.reduce(
    (translations, column) =>
      deepMerge(translations, getTranslation(source[column] as JSON, column)),
    {}
  );
}

/**
 * Flats an Object creating a new Object which keys are the results of concat every nested key and
 * adds a new level to each key with the column given and the translation for it.
 *
 * @param source - Translations by device to flatten.
 * @param column - The column name.
 *
 * @returns A flatten Object with the translations by column.
 *
 * @example
 *
 * The given Object:
 * ```json
 * {
 *  "searchBox": {
 *    "clear": "Clear mobile"
 *    }
 *  }
 * ```
 *  After calling the method `getTranslation(source, "base")` where `base` is the column name.
 *
 *  The resulting Object is:
 *
 * ```json
 * {
 *  "searchBox.clear": {
 *    base: "Clear mobile"
 *  }
 * }
 * ```
 */
function getTranslation(source: JSON, column: string): JSON {
  return Object.entries(source).reduce((translation: JSON, [key, value]) => {
    if (typeof value === 'object') {
      const flatObject = getTranslation(value as JSON, column);
      Object.entries(flatObject).forEach(([subKey, subValue]) => {
        translation[key + '.' + subKey] = subValue;
      });
    } else {
      if (!(key in translation)) {
        translation[key] = {};
      }
      (translation[key] as JSON)[column] = value;
    }
    return translation;
  }, {});
}

/**
 * Transforms the JSON to a CSV.
 *
 * @param sourceJson - The JSON to be transformed.
 *
 * @returns A string that represents a CSV.
 */
function transformToCSV(sourceJson: JSON): string {
  const columnNames = getColumnNames(sourceJson);
  const translations = getTranslations(columnNames, sourceJson);

  const delimiter = ';';
  let csv = ['key', ...columnNames].join(delimiter) + '\n';

  Object.entries(translations).forEach(([key, value]) => {
    const line = [key];

    columnNames.forEach(columnName => {
      line.push(`${((value as JSON)[columnName] as string) ?? ''}`);
    });

    csv += line.join(delimiter) + '\n';
  });
  return csv;
}

/**
 * Gets the CSV translations from multiple JSON or just one.
 *
 * @returns The CSV.
 */
export function getCSVTranslations(): string[] {
  const { sourcePath } = getParams();
  return getSourcePaths(sourcePath, 'json').map(generateCSVFile);
}
