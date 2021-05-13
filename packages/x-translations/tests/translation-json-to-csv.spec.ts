import fs from 'fs';
import { getJsonFromPath, getParams, getTranslationsCSV } from '../src/utils-json-to-csv';

describe('transform json to csv', () => {
  afterEach(jest.resetModules);

  it(
    'should transform a json with multiple devices to a csv leaving in blank the empty ' + 'values',
    () => {
      process.argv = ['param1', 'param2', './tests/json/en_translations.json', ''];
      const csv = getTranslationsCSV();
      /* eslint-disable max-len */
      const expectedCSV = `key;base;tablet;desktop
searchBox.clear;"Clear mobile";"Clear tablet";"Clear desktop"
searchBox.placeholder;"Start to search mobile";"";"Start to search desktop"
popularSearches.title;"Popular searches mobile";"";""
popularSearches.header.text1;"this is text1 mobile";"";""
historyQueries.clear;"Clear history queries mobile";"";""
facets.default.title;"";"title facets tablet";"title facets desktop"
facets.default.header;"";"header facets tablet";""
facets.default.footer;"";"";"footer facets desktop"
`;
      expect(csv).toEqual(expectedCSV);
    }
  );

  it('should check the sourcePath it does not exits', () => {
    let error = '';

    try {
      process.argv = ['param1', 'param2', './test', ''];
      const { sourcePath } = getParams();
      getJsonFromPath(sourcePath);
    } catch (er) {
      error = er.message;
    }

    expect(error).toBe('getJsonFromPath, file not found ./test');
  });

  it('should check the sourcePath it is not send it as parameter', () => {
    process.argv = ['param1', 'param2'];
    const { sourcePath } = getParams();
    expect(() => {
      getJsonFromPath(sourcePath);
    }).toThrow('getJsonFromPath, file not found undefined');
  });

  it('should check that the file is exported in the default directory', () => {
    const sourcePath = './tests/json/en_translations.json';
    process.argv = ['param1', 'param2', sourcePath, ''];
    getTranslationsCSV();
    expect(fs.existsSync('./output/en_translations.csv')).toBe(true);
  });

  it('should check that the file is exported in the directory path given', () => {
    const sourcePath = './tests/json/en_translations.json';
    process.argv = ['param1', 'param2', sourcePath, './tests'];
    getTranslationsCSV();
    expect(fs.existsSync('./tests/en_translations.csv')).toBe(true);
  });
});
