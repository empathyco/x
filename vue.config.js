const fs = require('fs');
const WrapperPlugin = require('wrapper-webpack-plugin');

const snippet = fs.readFileSync('./public/snippet-script.js', 'utf8');

function init() {
  if (typeof window.initX === 'function') {
    const snippetOptions = window.initX();
    window.X.init(snippetOptions);
  } else if (typeof window.initX === 'object') {
    window.X.init(window.initX);
  }
}

module.exports = {
  configureWebpack: {
    plugins: [
      new WrapperPlugin({
        test: /app\.js$/,
        header: `(function(){${ snippet }})();`,
        footer: `(${ init.toString() })()`
      })
    ]
  }
};
