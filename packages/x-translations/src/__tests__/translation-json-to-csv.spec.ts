import fs from 'fs';
import path from 'path';
import { loadFile } from '../utils';
import { getCSVTranslations } from '../json-to-csv';

describe('transform json to csv', () => {
  const sourcePath = './src/__tests__/json/en.messages.json';
  const jsonPath = './src/__tests__/json';
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

  it(
    'should transform a json with multiple devices to a csv leaving in blank the empty ' + 'values',
    () => {
      process.argv = ['param1', 'param2', sourcePath];
      const csv = getCSVTranslations();
      const expectedCsv = loadFile('./src/__tests__/csv/en.messages.csv');
      expect(csv).toEqual([expectedCsv]);
    }
  );

  it('should check that multiple files are exported in the default directory', () => {
    process.argv = ['param1', 'param2', jsonPath];

    getCSVTranslations();

    expect(fs.existsSync(resolvePath('./output/en.messages.csv'))).toBe(true);
    expect(fs.existsSync(resolvePath('./output/es.messages.csv'))).toBe(true);

    expect(fs.readFileSync(resolvePath('./output/en.messages.csv'))).toEqual(
      fs.readFileSync(resolvePath('./src/__tests__/csv/en.messages.csv'))
    );
    expect(fs.readFileSync(resolvePath('./output/es.messages.csv'))).toEqual(
      fs.readFileSync(resolvePath('./src/__tests__/csv/es.messages.csv'))
    );
  });

  it('should check that multiple files are exported in the path given', () => {
    process.argv = ['param1', 'param2', jsonPath, targetPath];

    getCSVTranslations();

    expect(fs.existsSync(resolvePath(`${targetPath}/en.messages.csv`))).toBe(true);
    expect(fs.existsSync(resolvePath(`${targetPath}/es.messages.csv`))).toBe(true);

    expect(fs.readFileSync(resolvePath(`${targetPath}/en.messages.csv`))).toEqual(
      fs.readFileSync(resolvePath('./src/__tests__/csv/en.messages.csv'))
    );
    expect(fs.readFileSync(resolvePath(`${targetPath}/es.messages.csv`))).toEqual(
      fs.readFileSync(resolvePath('./src/__tests__/csv/es.messages.csv'))
    );
  });
});

/**
 * Resolves the full path of a given relative one.
 *
 * @param source - The relative path.
 *
 * @returns The full path.
 *
 * @internal
 */
function resolvePath(source: string): string {
  return path.resolve(process.cwd(), source);
}
