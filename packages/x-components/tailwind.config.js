const { xTailwindPlugin } = require('./src/tailwind/plugin');

module.exports = {
  content: ['./public/index.html', './src/**/*.vue'],
  prefix: 'x-',
  plugins: [xTailwindPlugin],
  // In order to avoid conflicting class names with the old design system while the new XDS is being developed
  // we are disabling all corePlugins from tailwindcss but `fontSize`, `fontWeight`, `lineHeight` and `textColor`.
  // You can check that tailwindcss is still working by checking the style of the heading `Test controls`
  // below the `Start` button on the `x-components` internal demo app.
  // See https://github.com/empathyco/x/pull/655#discussion_r948923711
  corePlugins: {
    screens: false,
    colors: false,
    columns: false,
    spacing: false,
    animation: false,
    aspectRatio: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    backgroundColor: false,
    backgroundImage: false,
    backgroundOpacity: false,
    backgroundPosition: false,
    backgroundSize: false,
    blur: false,
    brightness: false,
    borderColor: false,
    borderOpacity: false,
    borderRadius: false,
    borderSpacing: false,
    borderWidth: false,
    boxShadow: false,
    boxShadowColor: false,
    caretColor: false,
    accentColor: false,
    contrast: false,
    container: false,
    content: false,
    cursor: false,
    divideColor: false,
    divideOpacity: false,
    divideWidth: false,
    dropShadow: false,
    fill: false,
    grayscale: false,
    hueRotate: false,
    invert: false,
    flex: false,
    flexBasis: false,
    flexGrow: false,
    flexShrink: false,
    fontFamily: false,
    gap: false,
    gradientColorStops: false,
    gridAutoColumns: false,
    gridAutoRows: false,
    gridColumn: false,
    gridColumnEnd: false,
    gridColumnStart: false,
    gridRow: false,
    gridRowStart: false,
    gridRowEnd: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
    height: false,
    inset: false,
    keyframes: false,
    letterSpacing: false,
    listStyleType: false,
    margin: false,
    maxHeight: false,
    maxWidth: false,
    minHeight: false,
    minWidth: false,
    objectPosition: false,
    opacity: false,
    order: false,
    padding: false,
    placeholderColor: false,
    placeholderOpacity: false,
    outlineColor: false,
    outlineOffset: false,
    outlineWidth: false,
    ringColor: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    ringOpacity: false,
    ringWidth: false,
    rotate: false,
    saturate: false,
    scale: false,
    scrollMargin: false,
    scrollPadding: false,
    sepia: false,
    skew: false,
    space: false,
    stroke: false,
    strokeWidth: false,
    textDecorationColor: false,
    textDecorationThickness: false,
    textUnderlineOffset: false,
    textIndent: false,
    textOpacity: false,
    transformOrigin: false,
    transitionDelay: false,
    transitionDuration: false,
    transitionProperty: false,
    transitionTimingFunction: false,
    translate: false,
    width: false,
    willChange: false,
    zIndex: false
  }
};
