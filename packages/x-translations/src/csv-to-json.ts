#!/usr/bin/env node
import path from 'path';
import { exportToFile, getParams, getSourcePaths, loadFile } from './utils';
import { JSON } from './types';

if (require.main === module) {
  getJSONTranslations();
}

/**
 * Generates the JSON.
 *
 * @param sourcePath - The path of the file.
 *
 * @returns A string that represents the JSON.
 */
function generateJSONFile(sourcePath: string): JSON {
  const csv = loadFile(sourcePath) as string;
  const json = transformToJson(csv);
  const outputFile = path.basename(sourcePath).replace(/\.[^.]+$/, '.json');
  exportToFile(outputFile, JSON.stringify(json, null, 2));
  return json;
}

/**
 * Transforms the contents of a CSV file into a JSON compatible object.
 *
 * @param csv - The CSV to transform.
 *
 * @returns A JSON object with the contents of the CSV file.
 */
function transformToJson(csv: string): JSON {
  const [header, ...rows] = csv.trim().split(/\r?\n|\r/);
  const [, ...columns] = header.split(';');

  return rows.reduce<JSON>(toMessagesObject(columns), {});
}

/**
 * Generates a reducer function that transforms CSV rows into a JSON object with the provided
 * device names.
 *
 * @param devices - The devices names to use in the message object.
 *
 * @returns A reducer function to generate a JSON object.
 */
function toMessagesObject(devices: string[]): (json: JSON, row: string) => JSON {
  return (json, row) => {
    const [messageKey, ...deviceMessages] = row.split(';');
    return deviceMessages.reduce(createMessage(devices, messageKey), json);
  };
}

/**
 * Generates a reducer function that sets a message from a CSV file into the target JSON object,
 * using the provided `devices` and `messageKey` parameters.
 *
 * @param devices - The devices names to use in the message object.
 * @param messageKey - The key of the message without the device part.
 *
 * @returns A reducer function to generate a JSON object.
 */
function createMessage(
  devices: string[],
  messageKey: string
): (json: JSON, message: string, index: number) => JSON {
  return (json, message, index) => {
    if (message) {
      const path = [devices[index], ...messageKey.split('.')];
      setProperty(json, path, message);
      return json;
    }
    return json;
  };
}

/**
 * Sets a property into an object using a path of properties.
 *
 * @param object - The object where the property has to be set.
 * @param path - The path of the property.
 * @param value - The value of the property.
 */
function setProperty(
  object: JSON,
  [property, ...remainingProperties]: string[],
  value: unknown
): void {
  if (remainingProperties.length === 0) {
    object[property] = value;
  } else {
    object[property] = object[property] ?? {};
    setProperty(object[property] as JSON, remainingProperties, value);
  }
}

/**
 * Gets the JSON translations from multiple CSV or just one.
 *
 * @returns The JSON.
 */
export function getJSONTranslations(): JSON[] {
  const { sourcePath } = getParams();
  return getSourcePaths(sourcePath, 'csv').map(generateJSONFile);
}
