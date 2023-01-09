/**
 * Loads the given CSS and clears previously added CSS.
 *
 * @param css - The CSS string to load into the DOM.
 */
export function loadCss(css: string): void {
  document.getElementById('test-style')?.remove();
  const style = document.createElement('style');
  style.id = 'test-style';
  style.textContent = css;
  document.head.appendChild(style);
}
