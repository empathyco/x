import fs from 'fs';
import path from 'path';
import { exportToFile, getParams, loadFile } from '../utils';

describe('test utils', () => {
  const jsonPath = './src/__tests__/json';
  const targetPath = './translations';

  afterEach(() => {
    const absoluteTargetPath = path.resolve(process.cwd(), targetPath);
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

    expect(fs.existsSync('./output/en.messages.json')).toBe(true);
  });
});
