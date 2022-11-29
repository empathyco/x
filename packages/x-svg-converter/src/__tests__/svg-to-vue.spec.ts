import path from 'path';
import fs from 'fs';
import { svgToVue } from '../svg-to-vue';
import svgStub from './svg-stub';

describe('test SVG to Vue script', () => {
  const sourcePath = './src/__tests__/svgs';

  afterEach(() => {
    process.argv = [];
    jest.restoreAllMocks();

    const absoluteSourcePath = path.resolve(process.cwd(), sourcePath);

    if (fs.existsSync(absoluteSourcePath)) {
      [...Array(2)].forEach((_, i) => {
        if (!fs.existsSync(`${absoluteSourcePath}/test_svg_${i}.svg`)) {
          fs.writeFileSync(`${absoluteSourcePath}/test_svg_${i}.svg`, svgStub);
        }
      });
      fs.rmSync(`${absoluteSourcePath}/test_svg_0.vue`, { recursive: true });
      fs.rmSync(`${absoluteSourcePath}/test_svg_1.vue`, { recursive: true });
    }
  });

  it('should create a vue component for each svg in the source folder', () => {
    process.argv = ['param1', 'param2', sourcePath];
    svgToVue();

    expect(fs.existsSync(`${sourcePath}/test_svg_0.vue`)).toBe(true);
    expect(fs.existsSync(`${sourcePath}/test_svg_1.vue`)).toBe(true);
  });

  it('wraps the svg in a vue component format and generates the vue files with it', () => {
    process.argv = ['param1', 'param2', sourcePath];
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

    process.argv = ['param1', 'param2', sourcePath];
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
});
