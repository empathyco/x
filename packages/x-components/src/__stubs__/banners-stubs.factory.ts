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
 *
 * @returns The banner.
 *
 * @internal
 */
export function createBannerStub(identifier: string): Banner {
  return {
    id: `xb-${identifier}`,
    title: `Banner ${identifier}`,
    url: `http://x-components-banner-${identifier}.com`,
    image: `xb-${identifier}.jpg`,
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    modelName: 'Banner'
  };
}
