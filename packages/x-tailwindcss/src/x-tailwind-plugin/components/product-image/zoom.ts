/**
 * Returns the default styles for component `product image`.
 *
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function zoom() {
  return {
    zoom: {
      img: {
        transition: 'transform 0.3s ease-out',
        '&:hover': {
          transform: 'scale(1.1)'
        }
      }
    }
  };
}
