/**
 * Get one parameter value from the url.
 *
 * @param param - The parameter to get from the url.
 * @returns The parameter value from the url.
 * @public
 */
export const getURLParameter = (param: string): string | null => {
  const regex = new RegExp(`[?|&]${param}=([^&;]+?)(&|#|;|$)`);
  const paramValue = regex.exec(window.location.href);
  return paramValue ? decodeURIComponent(paramValue[1].replace(/\+/g, '%20')) : null;
};
