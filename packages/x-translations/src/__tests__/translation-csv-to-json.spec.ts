import fs from 'fs';
import path from 'path';
import { getJSONTranslations } from '../csv-to-json';
import expectedJson from '../__tests__/json/en.messages.json';

/* eslint-disable @typescript-eslint/no-var-requires */
describe('transform CSV to a JSON', () => {
  const sourcePath = './src/__tests__/csv/en.messages.csv';
  const csvPath = './src/__tests__/csv';
  const targetPath = './translations';

  afterEach(() => {
    const absoluteTargetPath = path.resolve(process.cwd(), targetPath);
    const absoluteOutputPath = path.resolve(process.cwd(), './output');
    if (fs.existsSync(absoluteTargetPath)) {
      fs.rmSync(absoluteTargetPath, { recursive: true });
    }
    if (fs.existsSync(absoluteOutputPath)) {
      fs.rmSync(absoluteOutputPath, { recursive: true });
    }
  });

  it('should transform a csv with multiple devices to a JSON', () => {
    process.argv = ['param1', 'param2', sourcePath];
    const json = getJSONTranslations();
    expect(json).toEqual([expectedJson]);
  });

  it('should check that multiple files are exported in the default directory', () => {
    process.argv = ['param1', 'param2', csvPath];

    getJSONTranslations();

    expect(fs.existsSync('./output/en.messages.json')).toBe(true);
    expect(fs.existsSync('./output/es.messages.json')).toBe(true);

    expect(require('../../output/en.messages.json')).toEqual(require('./json/en.messages.json'));
    expect(require('../../output/es.messages.json')).toEqual(require('./json/es.messages.json'));
  });

  it('should check that multiple files are exported in the path given', () => {
    process.argv = ['param1', 'param2', csvPath, targetPath];

    getJSONTranslations();

    expect(fs.existsSync(`${targetPath}/en.messages.json`)).toBe(true);
    expect(fs.existsSync(`${targetPath}/es.messages.json`)).toBe(true);

    expect(require(`../../${targetPath}/en.messages.json`)).toEqual(
      require('./json/en.messages.json')
    );
    expect(require(`../../${targetPath}/es.messages.json`)).toEqual(
      require('./json/es.messages.json')
    );
  });
});
