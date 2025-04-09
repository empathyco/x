/**
 * Returns the `zoom` variant of the component `picture`.
 *
 * @returns The {@link CssStyleOptions} for the component.
 */
export function zoom() {
  return {
    zoom: {
      '.x-picture-image': {
        transition: 'transform 0.3s ease-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
      },
    },
  }
}
