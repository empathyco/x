import { getJSONTranslations } from '../csv-to-json';
import expectedJson from '../__tests__/json/en_translations.json';

describe('transform CSV to a JSON', () => {
  afterEach(jest.resetModules);
  const sourcePath = './src/__tests__/csv/en_translations.csv';
  it('should transform a csv with multiple devices to a JSON', () => {
    process.argv = ['param1', 'param2', sourcePath, ''];
    const json = getJSONTranslations();
    expect(json).toEqual(expectedJson);
  });
});
