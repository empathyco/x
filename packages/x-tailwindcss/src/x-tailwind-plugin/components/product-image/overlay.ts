/**
 * Returns the `overlay` variant of component `product-image`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function overlay() {
  return {
    overlay: {
      '&:hover': {
        mixBlendMode: 'multiply'
      },
      img: {
        '&:hover': {
          maskImage: 'linear-gradient(to top, transparent, 20%, black)'
        }
      }
    }
  };
}
