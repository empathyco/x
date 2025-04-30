/**
 * Checks if the user is on an iOS device (iPhone, iPad, or iPod).
 *
 * @returns `true` if the user is on iOS, `false` otherwise.
 */

export const isIOS = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && !/windows phone/.test(userAgent);
};

/**
 * Removes focus from the search input element if it is currently focused.
 * This function checks if the active element in the document matches the
 * selector '.x-search-input' and, if so, blurs the element to remove focus.
 */
export const removeSearchInputFocus = (): void => {
  const shadowHost = document.querySelector('.x-root-container');
  if (shadowHost?.shadowRoot) {
    (shadowHost.shadowRoot.querySelector('.x-search-input') as HTMLInputElement)?.blur();
  } else if (document.activeElement?.matches('.x-search-input')) {
    (document.activeElement as HTMLElement).blur();
  }
};
