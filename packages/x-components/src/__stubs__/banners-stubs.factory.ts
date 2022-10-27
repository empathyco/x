import { Banner } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#Banner | banners} stub.
 *
 * @returns Array of banners stub.
 *
 * @internal
 */
export function getBannersStub(): Banner[] {
  return [createBannerStub('1'), createBannerStub('2')];
}

/**
 * Creates a banner with a "unique" identifier.
 *
 * @param identifier - The banner identifier.
 * @param position - The banner position (= row) inside the grid.
 *
 * @returns The banner.
 *
 * @internal
 */
export function createBannerStub(identifier: string, position = 1): Banner {
  return {
    id: `xb-${identifier}`,
    title: `Banner ${identifier}`,
    url: `/banner/${identifier}`,
    image: `xb-${identifier}.jpg`,
    position,
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    modelName: 'Banner'
  };
}
