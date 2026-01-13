import {
  addFillNoneInRoot,
  addXClass,
  applyXDSFormat,
  removeDimensions,
  replaceColorWithCurrentColor,
} from '../regex-utils'
import svgStub from './svg-stub'

describe('test regex utils', () => {
  it('removes dimensions from the root of an SVG', () => {
    const svgWithDimensions = `<svg width="8" height="8" fill="none">
<path />
</svg>`

    const svgWithoutDimensions = `<svg fill="none">
<path />
</svg>`

    expect(removeDimensions(svgWithDimensions)).toBe(`<svg   fill="none">
<path />
</svg>`)
    expect(removeDimensions(svgWithoutDimensions)).toBe(svgWithoutDimensions)
  })

  it('adds `fill="none"` to the SVG root if it\'s missing', () => {
    const svgWithoutFillNone = `<svg xmlns="http://www.w3.org/2000/svg">
<path />
</svg>`

    const svgWithFillNone = `<svg fill="none" xmlns="http://www.w3.org/2000/svg">
<path />
</svg>`

    expect(addFillNoneInRoot(svgWithoutFillNone))
      .toBe(`<svg fill="none" xmlns="http://www.w3.org/2000/svg">
<path />
</svg>`)

    expect(addFillNoneInRoot(svgWithFillNone)).toBe(svgWithFillNone)
  })

  it('adds the `xds:icon` and data classes to the root of an SVG', () => {
    const svg = `<svg fill="none">
<path />
</svg>`

    expect(addXClass(svg))
      .toBe(`<svg :class="['xds:icon'].concat(data.staticClass, data.class)" fill="none">
<path />
</svg>`)
  })

  it('replaces colors that are not white with `currentColor`', () => {
    const svgWithColors = `<svg fill="none">
<path fill="black" stroke="white"/>
<path fill="#fff" stroke="#000"/>
<path fill="#fabada" stroke="#ffffff"/>
</svg>`

    expect(replaceColorWithCurrentColor(svgWithColors)).toBe(`<svg fill="none">
<path fill="currentColor" stroke="white"/>
<path fill="#fff" stroke="currentColor"/>
<path fill="currentColor" stroke="#ffffff"/>
</svg>`)
  })

  it('applies the format changes needed for the XDS to an svg', () => {
    expect(applyXDSFormat(svgStub))
      .toBe(`<svg :class="['xds:icon'].concat(data.staticClass, data.class)" fill="none" xmlns="http://www.w3.org/2000/svg">
<path stroke="currentColor" stroke-width=".4" d="M1.2 1.2h5.6v5.6H1.2z"/>
<path fill="currentColor" d="M2 2h4v4H2z"/>
<path d="M5 3 3.625 4.5 3 3.818" stroke="#fff" stroke-width=".4" stroke-linecap="square"/>
</svg>`)
  })
})
