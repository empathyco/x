import fs from 'fs';
import path from 'path';
import { getJSONTranslations } from '../csv-to-json';
import expectedJson from '../__tests__/json/en.messages.json';
import { pathFromCwd } from './utils';

/* eslint-disable @typescript-eslint/no-var-requires */
describe('transform CSV to a JSON', () => {
  const csvDirectoryPath = path.resolve(__dirname, 'csv');
  const csvFilePath = path.resolve(__dirname, csvDirectoryPath, 'en.messages.csv');

  describe('when no output path is specified', () => {
    afterEach(() => {
      const absoluteDefaultOutputPath = pathFromCwd('output');
      if (fs.existsSync(absoluteDefaultOutputPath)) {
        fs.rmSync(absoluteDefaultOutputPath, { recursive: true });
      }
    });

    it('transforms a single CSV file to JSON from a file path', () => {
      process.argv = ['param1', 'param2', csvFilePath];
      const json = getJSONTranslations();
      expect(json).toEqual([expectedJson]);
    });

    it('transforms multiple CSV files to JSON from a directory path', () => {
      process.argv = ['param1', 'param2', csvDirectoryPath];

      getJSONTranslations();

      expect(require(pathFromCwd('output/en.messages.json'))).toEqual(
        require('./json/en.messages.json')
      );
      expect(require(pathFromCwd('output/es.messages.json'))).toEqual(
        require('./json/es.messages.json')
      );
    });
  });

  // eslint-disable-next-line max-len
  it('transforms multiple CSV files to JSON from a directory path and leaves them in the defined directory', () => {
    const jsonOutputDirectory = 'translations';
    process.argv = ['param1', 'param2', csvDirectoryPath, jsonOutputDirectory];

    getJSONTranslations();

    const absolutExpectedOutputFolder = pathFromCwd(jsonOutputDirectory);
    expect(require(path.resolve(absolutExpectedOutputFolder, `en.messages.json`))).toEqual(
      require('./json/en.messages.json')
    );
    expect(require(path.resolve(absolutExpectedOutputFolder, `es.messages.json`))).toEqual(
      require('./json/es.messages.json')
    );
    fs.rmSync(absolutExpectedOutputFolder, { recursive: true });
  });
});
