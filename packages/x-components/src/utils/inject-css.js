/**
 * Simple CSS injector to append styles to the head.
 * This injector can be overwritten at build time.
 *
 * @params css - CSS code.
 */
function injectCss(css) {
  if (document) {
    const el = document.createElement('style')
    el.textContent = css
    document.head.appendChild(el)
  }
}

export default injectCss
