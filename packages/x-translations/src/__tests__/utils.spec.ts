import fs from 'fs';
import { getCSVTranslations } from '../json-to-csv';
import { exportToFile, getParams, loadFile } from '../utils';

describe('test utils', () => {
  const jsonPath = './src/__tests__/json/en_translations.json';
  const targetPath = './src/__tests__/translations';

  beforeEach(() => {
    if (fs.existsSync(targetPath)) {
      fs.rmdirSync(targetPath, { recursive: true });
    }
    fs.mkdirSync(targetPath);
  });
  it('should check if the sourcePath exists', () => {
    process.argv = ['param1', 'param2', './test', ''];
    const { sourcePath } = getParams();

    expect(() => loadFile(sourcePath)).toThrow('loadFile, file not found ./test');
  });

  it('should check if the sourcePath it is not send it as parameter', () => {
    process.argv = ['param1', 'param2'];
    expect(() => getParams()).toThrow('getParams, sourcePath not found');
  });

  it('should check that the file is exported in the default directory', () => {
    process.argv = ['param1', 'param2', jsonPath, ''];
    exportToFile('Test file', 'csv');
    expect(fs.existsSync('./output/en_translations.csv')).toBe(true);
  });

  it('should check that the file is exported in the directory path given', () => {
    process.argv = ['param1', 'param2', jsonPath, targetPath];

    getCSVTranslations();
    expect(fs.existsSync(`${targetPath}/en_translations.csv`)).toBe(true);
  });
});
