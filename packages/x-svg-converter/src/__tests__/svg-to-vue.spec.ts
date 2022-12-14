import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { svgToVue } from '../svg-to-vue';
import svgStub from './svg-stub';

// Mock to prevent the prettier from running in test env.
jest.mock('child_process', () => {
  const originalModule = jest.requireActual('child_process');

  return {
    __esModule: true,
    ...originalModule,
    exec: jest.fn(() => true)
  };
});

describe('test SVG to Vue script', () => {
  const sourcePath = path.resolve(__dirname, 'svgs');
  const originalArgv = process.argv;

  beforeEach(() => {
    process.argv = ['param1', 'param2', sourcePath];
    generateTestSVGs();
  });

  afterEach(() => {
    removeVueTestFiles();
  });

  afterAll(() => {
    process.argv = originalArgv;
    generateTestSVGs();
  });

  it('should create a vue component for each svg in the source folder', () => {
    svgToVue();

    expect(fs.existsSync(`${sourcePath}/test_svg_0.vue`)).toBe(true);
    expect(fs.existsSync(`${sourcePath}/test_svg_1.vue`)).toBe(true);
  });

  it('wraps the svg in a vue component format and generates the vue files with it', () => {
    svgToVue();

    const vueComponentContent = fs.readFileSync(`${sourcePath}/test_svg_0.vue`, {
      encoding: 'utf8'
    });

    /* eslint-disable max-len */
    expect(vueComponentContent).toBe(`<template functional>
  <svg :class="['x-icon'].concat(data.staticClass, data.class)" fill="none" xmlns="http://www.w3.org/2000/svg">
<path stroke="currentColor" stroke-width=".4" d="M1.2 1.2h5.6v5.6H1.2z"/>
<path fill="currentColor" d="M2 2h4v4H2z"/>
<path d="M5 3 3.625 4.5 3 3.818" stroke="#fff" stroke-width=".4" stroke-linecap="square"/>
</svg>
</template>

<script lang="ts">
  export default {};
</script>`);
    /* eslint-enable max-len */
  });

  it('unlinks the source svg files', () => {
    jest.spyOn(fs, 'unlink');

    svgToVue();

    expect(fs.unlink).toHaveBeenCalledWith(`${sourcePath}/test_svg_0.svg`, expect.any(Function));
    expect(fs.unlink).toHaveBeenCalledWith(`${sourcePath}/test_svg_1.svg`, expect.any(Function));
  });

  it('keeps the source SVG files if keepSVGs param is present', () => {
    process.argv = ['param1', 'param2', sourcePath, '--keep-svgs'];
    svgToVue();

    expect(fs.existsSync(`${sourcePath}/test_svg_0.svg`)).toBe(true);
    expect(fs.existsSync(`${sourcePath}/test_svg_1.svg`)).toBe(true);
  });

  it('applies prettier in the source folder', () => {
    svgToVue();

    expect(exec).toHaveBeenCalledWith(`prettier --write ${sourcePath}/*.vue`, expect.any(Function));
  });

  /**
   * Generate the SVG files used in the tests.
   */
  function generateTestSVGs(): void {
    if (fs.existsSync(sourcePath)) {
      [0, 1].forEach(i => {
        if (!fs.existsSync(`${sourcePath}/test_svg_${i}.svg`)) {
          fs.writeFileSync(`${sourcePath}/test_svg_${i}.svg`, svgStub);
        }
      });
    }
  }

  /**
   * Remove the vue files product of the tests.
   */
  function removeVueTestFiles(): void {
    if (fs.existsSync(sourcePath)) {
      [0, 1].forEach(i => {
        if (fs.existsSync(`${sourcePath}/test_svg_${i}.vue`)) {
          fs.rmSync(`${sourcePath}/test_svg_${i}.vue`, { recursive: true });
        }
      });
    }
  }
});
