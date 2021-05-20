import { loadFile } from '../utils';
import { getCSVTranslations } from '../json-to-csv';

describe('transform json to csv', () => {
  afterEach(jest.resetModules);
  const sourcePath = './src/__tests__/json/en_translations.json';
  it(
    'should transform a json with multiple devices to a csv leaving in blank the empty ' + 'values',
    () => {
      process.argv = ['param1', 'param2', sourcePath, ''];
      const csv = getCSVTranslations();
      const expectedCsv = loadFile('./src/__tests__/csv/en_translations.csv');
      expect(csv).toEqual(expectedCsv);
    }
  );
});
