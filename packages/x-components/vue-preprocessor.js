const inner = require("@vue/vue2-jest")
const convert = require("convert-source-map")

module.exports = {
  getCacheKey: inner.getCacheKey,

  process(src, filename, config) {
    const { code, map } = inner.process(src, filename, config)
    const comment = convert.fromObject(map).toComment()
    return `${code}\n\n${comment}`
  },
}
