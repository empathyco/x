module.exports = {
  plugins: [
    require('tailwindcss'),
    require('tailwindcss/nesting'),
    require('autoprefixer'),
    require('postcss-logical'),
    require('postcss-dir-pseudo-class')
  ]
};
