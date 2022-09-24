import fs from 'fs';
import path from 'path';
import { getCSVTranslations } from '../json-to-csv';
import { pathFromCwd, readRelativeFile, readRootFile } from './utils';

describe('transform json to csv', () => {
  const jsonDirectoryPath = path.resolve(__dirname, 'json');
  const jsonFilePath = path.resolve(__dirname, jsonDirectoryPath, 'en.messages.json');

  describe('when no output path is specified', () => {
    afterEach(() => {
      const absoluteDefaultOutputPath = pathFromCwd('output');
      if (fs.existsSync(absoluteDefaultOutputPath)) {
        fs.rmSync(absoluteDefaultOutputPath, { recursive: true });
      }
    });

    it('transforms a single JSON file to CSV from a file path', () => {
      process.argv = ['param1', 'param2', jsonFilePath];
      const csv = getCSVTranslations();
      expect(csv).toEqual([readRelativeFile(__dirname, 'csv/en.messages.csv')]);
    });

    it('transforms multiple CSV files to JSON from a directory path', () => {
      process.argv = ['param1', 'param2', jsonDirectoryPath];

      getCSVTranslations();

      expect(readRootFile('output/en.messages.csv')).toEqual(
        readRelativeFile(__dirname, 'csv/en.messages.csv')
      );
      expect(readRootFile('output/es.messages.csv')).toEqual(
        readRelativeFile(__dirname, 'csv/es.messages.csv')
      );
    });
  });

  // eslint-disable-next-line max-len
  it('transforms multiple CSV files to JSON from a directory path and leaves them in the defined directory', () => {
    const csvOutputDirectory = 'translations';
    process.argv = ['param1', 'param2', jsonDirectoryPath, csvOutputDirectory];

    getCSVTranslations();

    expect(readRootFile('translations/en.messages.csv')).toEqual(
      readRelativeFile(__dirname, 'csv/en.messages.csv')
    );
    expect(readRootFile('translations/es.messages.csv')).toEqual(
      readRelativeFile(__dirname, 'csv/es.messages.csv')
    );
    fs.rmSync(pathFromCwd(csvOutputDirectory), { recursive: true });
  });
});
