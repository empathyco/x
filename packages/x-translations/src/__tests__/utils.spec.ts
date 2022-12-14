import fs from 'fs';
import path from 'path';
import { exportToFile, getParams, loadFile } from '../utils';
import { pathFromProjectRoot } from './utils';

describe('test utils', () => {
  const jsonPath = path.resolve(__dirname, 'json');

  afterEach(() => {
    const absoluteTargetPath = pathFromProjectRoot('translations');
    if (fs.existsSync(absoluteTargetPath)) {
      fs.rmSync(absoluteTargetPath, { recursive: true });
    }
  });

  it('should check if the sourcePath exists', () => {
    process.argv = ['param1', 'param2', './test'];

    const { sourcePath } = getParams();

    expect(() => loadFile(sourcePath)).toThrow('loadFile, file not found ./test');
  });

  it('should check if the sourcePath it is not send it as parameter', () => {
    process.argv = ['param1', 'param2'];

    expect(() => getParams()).toThrow('getParams, sourcePath not found');
  });

  it('should check that the file is exported in the default directory', () => {
    process.argv = ['param1', 'param2', `${jsonPath}/en.messages.json`];

    exportToFile('en.messages.json', 'Test file');

    expect(fs.existsSync(pathFromProjectRoot('/output/en.messages.json'))).toBe(true);
  });
});
