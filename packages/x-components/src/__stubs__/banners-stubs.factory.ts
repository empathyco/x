import { Banner } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#Banner | banners} stub.
 *
 * @returns Array of banners stub.
 *
 * @internal
 */
export function getBannersStub(): Banner[] {
  return [
    createBannerStub('1', { position: 1 }),
    createBannerStub('2', { position: 3 }),
    createBannerStub('3', { position: 3 }),
    createBannerStub('4', { url: 'http://empathy.co', position: 4 }),
    createBannerStub('5', { title: 'Banner', url: 'http://empathy.co', position: 7 }),
    createBannerStub('6', { title: 'Banner', position: 9 })
  ];
}

/**
 * Creates a banner.
 *
 * @param identifier - The banner identifier.
 * @param banner - An optional object with fields to override the banner.
 * @returns The banner.
 *
 * @internal
 */
export function createBannerStub(identifier: string, banner?: Partial<Banner>): Banner {
  return {
    id: `xb-${identifier}`,
    image: `xb-${identifier}.jpg`,
    modelName: 'Banner',
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    ...banner
  };
}
